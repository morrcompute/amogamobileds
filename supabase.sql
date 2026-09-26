-- Create the short_urls table
CREATE TABLE IF NOT EXISTS public.short_urls (
    id text PRIMARY KEY,
    target_url text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.short_urls ENABLE ROW LEVEL SECURITY;

-- Allow anonymous select access (anyone can resolve a redirect)
CREATE POLICY "Allow public read access" ON public.short_urls
    FOR SELECT USING (true);

-- Allow anonymous insert access (anyone can create a shortened link)
CREATE POLICY "Allow public insert access" ON public.short_urls
    FOR INSERT WITH CHECK (true);

-- Create clicks table for link tracking
CREATE TABLE IF NOT EXISTS public.clicks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    link_id text NOT NULL REFERENCES public.short_urls(id) ON DELETE CASCADE,
    clicked_at timestamp with time zone DEFAULT now() NOT NULL,
    country text,
    city text,
    region text,
    device text,
    os text,
    browser text,
    referrer text,
    referrer_raw text,
    user_agent text,
    qr boolean DEFAULT false
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.clicks ENABLE ROW LEVEL SECURITY;

-- Allow public select/read access to clicks
CREATE POLICY "Allow public select" ON public.clicks
    FOR SELECT USING (true);

-- Allow public insert access to clicks (required for serverless redirect logging)
CREATE POLICY "Allow public insert" ON public.clicks
    FOR INSERT WITH CHECK (true);

-- Create shares table to log when a link is shared
CREATE TABLE IF NOT EXISTS public.shares (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    link_id text NOT NULL REFERENCES public.short_urls(id) ON DELETE CASCADE,
    shared_at timestamp with time zone DEFAULT now() NOT NULL,
    platform text NOT NULL, -- 'whatsapp', 'linkedin', 'twitter', 'gmail', etc.
    user_agent text
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.shares ENABLE ROW LEVEL SECURITY;

-- Allow public select
CREATE POLICY "Allow public select" ON public.shares FOR SELECT USING (true);

-- Allow public insert (log shares from frontend)
CREATE POLICY "Allow public insert" ON public.shares FOR INSERT WITH CHECK (true);

-- Create profiles table linked to Supabase Auth
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid PRIMARY KEY,
    name text,
    username text,
    avatar text,
    email text,
    company text,
    mobile text,
    fcm_token text,
    status text DEFAULT 'offline',
    online boolean DEFAULT false,
    offline boolean DEFAULT true,
    last_seen timestamp with time zone,
    updated_at timestamp with time zone DEFAULT now()
);

-- Ensure display_name and avatar_url columns exist for backward & forward compatibility
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS display_name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url text;

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read profiles
CREATE POLICY "Authenticated users can read profiles" ON public.profiles
    FOR SELECT TO authenticated USING (true);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Create a robust function to handle new user insertion safely
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  user_name text;
  user_avatar text;
  user_phone text;
  old_user_id uuid;
BEGIN
  -- Extract username and avatar from all possible metadata fields
  user_name := COALESCE(
    new.raw_user_meta_data->>'display_name',
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'name',
    CASE WHEN new.email IS NOT NULL AND new.email <> '' THEN split_part(new.email, '@', 1) ELSE NULL END,
    new.phone,
    'User'
  );

  user_avatar := COALESCE(
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'picture',
    new.raw_user_meta_data->>'avatar'
  );

  user_phone := COALESCE(
    new.phone,
    new.raw_user_meta_data->>'mobile',
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'phone_number'
  );

  -- Search for existing profile with the same email or mobile
  SELECT id INTO old_user_id FROM public.profiles 
  WHERE (email IS NOT NULL AND email <> '' AND email = new.email)
     OR (mobile IS NOT NULL AND mobile <> '' AND user_phone IS NOT NULL AND user_phone <> '' AND mobile = user_phone)
  LIMIT 1;

  IF old_user_id IS NOT NULL THEN
    -- Reconcile only if the ID has changed (new UUID assigned by auth)
    IF old_user_id <> new.id THEN
      INSERT INTO public.profiles (id, name, display_name, email, avatar, avatar_url, company, mobile, status, online, offline, last_seen, updated_at)
      SELECT new.id, COALESCE(name, user_name), COALESCE(display_name, name, user_name), email, avatar, avatar_url, company, COALESCE(mobile, user_phone), status, online, offline, last_seen, updated_at
      FROM public.profiles
      WHERE id = old_user_id;

      -- Update foreign key references in other tables to point to the new UUID
      UPDATE public.conversation_members SET user_id = new.id WHERE user_id = old_user_id;
      UPDATE public.chat_messages SET owner_user_id = new.id WHERE owner_user_id = old_user_id;
      UPDATE public.chat_messages SET sender_user_id = new.id WHERE sender_user_id = old_user_id;
      UPDATE public.chat_messages SET deleted_by = new.id WHERE deleted_by = old_user_id;
      UPDATE public.chat_messages SET replyto_user_id = new.id WHERE replyto_user_id = old_user_id;
      UPDATE public.chat_messages SET forwardto_user_id = new.id WHERE forwardto_user_id = old_user_id;
      UPDATE public.contacts SET contact_user_id = new.id WHERE contact_user_id = old_user_id;
      UPDATE public.contacts SET owner_id = new.id WHERE owner_id = old_user_id;

      -- Delete the old profile record safely
      DELETE FROM public.profiles WHERE id = old_user_id;
    ELSE
      -- Profile exists with same ID, update mobile and metadata
      UPDATE public.profiles SET
        mobile = COALESCE(user_phone, public.profiles.mobile),
        name = COALESCE(public.profiles.name, user_name),
        display_name = COALESCE(public.profiles.display_name, user_name),
        avatar_url = COALESCE(public.profiles.avatar_url, user_avatar),
        updated_at = now()
      WHERE id = new.id;
    END IF;
  ELSE
    -- If no profile exists, create a new one safely
    INSERT INTO public.profiles (id, name, display_name, email, avatar, avatar_url, mobile)
    VALUES (
      new.id,
      user_name,
      user_name,
      COALESCE(new.email, new.raw_user_meta_data->>'email'),
      user_avatar,
      user_avatar,
      user_phone
    )
    ON CONFLICT (id) DO UPDATE SET
      name = COALESCE(EXCLUDED.name, public.profiles.name),
      display_name = COALESCE(EXCLUDED.display_name, public.profiles.display_name),
      email = COALESCE(EXCLUDED.email, public.profiles.email),
      avatar = COALESCE(EXCLUDED.avatar, public.profiles.avatar),
      avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
      mobile = COALESCE(EXCLUDED.mobile, public.profiles.mobile, user_phone),
      updated_at = now();
  END IF;

  RETURN new;
EXCEPTION
  WHEN OTHERS THEN
    -- Fallback: never let profile sync block account creation
    BEGIN
      INSERT INTO public.profiles (id, name, email, mobile)
      VALUES (new.id, COALESCE(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1), 'User'), new.email, user_phone)
      ON CONFLICT (id) DO UPDATE SET
        mobile = COALESCE(EXCLUDED.mobile, public.profiles.mobile);
    EXCEPTION
      WHEN OTHERS THEN
        NULL;
    END;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute the function on user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger to execute the function on user update
CREATE OR REPLACE TRIGGER on_auth_user_updated
  AFTER UPDATE OF phone, raw_user_meta_data, email ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create conversations table
CREATE TABLE IF NOT EXISTS public.conversations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text, -- NULL for 1-to-1 chats, group name for group chats
    is_group boolean NOT NULL DEFAULT false,
    avatar_url text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create conversation_members junction table
CREATE TABLE IF NOT EXISTS public.conversation_members (
    conversation_id uuid REFERENCES public.conversations(id) ON DELETE CASCADE,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    unread_count integer DEFAULT 0 NOT NULL,
    joined_at timestamp with time zone DEFAULT now() NOT NULL,
    PRIMARY KEY (conversation_id, user_id)
);

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id uuid REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
    sender_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    message text NOT NULL,
    timestamp timestamp with time zone DEFAULT now() NOT NULL,
    is_read boolean DEFAULT false NOT NULL
);

-- Optimization Indexes
CREATE INDEX IF NOT EXISTS idx_conversation_members_profile ON public.conversation_members(profile_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id, timestamp DESC);

-- Create a security helper function to check membership without RLS recursion
CREATE OR REPLACE FUNCTION public.is_conversation_member(convo_id uuid, user_uuid uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.conversation_members
    WHERE conversation_id = convo_id AND user_id = user_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can select conversations they belong to" ON public.conversations
    FOR SELECT USING (public.is_conversation_member(id, auth.uid()));

CREATE POLICY "Users can create conversations" ON public.conversations
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Owners can manage conversations" ON public.conversations
    FOR ALL USING (auth.uid() = created_by);

CREATE POLICY "Users can see members of their conversations" ON public.conversation_members
    FOR SELECT USING (public.is_conversation_member(conversation_id, auth.uid()));

CREATE POLICY "Users can add members" ON public.conversation_members
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can leave conversations" ON public.conversation_members
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Members can view conversation messages" ON public.messages
    FOR SELECT USING (public.is_conversation_member(conversation_id, auth.uid()));

CREATE POLICY "Members can send messages" ON public.messages
    FOR INSERT WITH CHECK (
        auth.uid() = sender_id AND
        public.is_conversation_member(conversation_id, auth.uid())
    );

-- Add to Realtime Publication
alter publication supabase_realtime add table public.conversations;
alter publication supabase_realtime add table public.conversation_members;
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.profiles;

-- Create contacts table
CREATE TABLE IF NOT EXISTS public.contacts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id uuid REFERENCES public.profiles(id) ON UPDATE CASCADE ON DELETE CASCADE NOT NULL,
    contact_user_id uuid REFERENCES public.profiles(id) ON UPDATE CASCADE ON DELETE CASCADE NOT NULL,
    nickname text,
    email text,
    user_uuid uuid,
    name text,
    mobile text,
    avatar text,
    avatar_url text,
    status text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS on contacts
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Allow users to read only their own contacts
CREATE POLICY "Users can view their own contacts" ON public.contacts
    FOR SELECT TO authenticated USING (auth.uid() = owner_id);

-- Allow users to add their own contacts
CREATE POLICY "Users can add their own contacts" ON public.contacts
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);

-- Allow users to update their own contacts
CREATE POLICY "Users can update their own contacts" ON public.contacts
    FOR UPDATE TO authenticated USING (auth.uid() = owner_id);

-- Allow users to delete their own contacts
CREATE POLICY "Users can delete their own contacts" ON public.contacts
    FOR DELETE TO authenticated USING (auth.uid() = owner_id);

-- Create chat_group table
CREATE TABLE IF NOT EXISTS public.chat_group (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    image_url text,
    users jsonb NOT NULL DEFAULT '[]'::jsonb, -- array of user names/emails/ids
    status text NOT NULL DEFAULT 'Active',
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS on chat_group
ALTER TABLE public.chat_group ENABLE ROW LEVEL SECURITY;

-- Allow public read access to chat_group
CREATE POLICY "Allow public read access to chat_group" ON public.chat_group
    FOR SELECT USING (true);

-- Allow public insert access to chat_group
CREATE POLICY "Allow public insert access to chat_group" ON public.chat_group
    FOR INSERT WITH CHECK (true);

-- Allow public update access to chat_group
CREATE POLICY "Allow public update access to chat_group" ON public.chat_group
    FOR UPDATE USING (true);

-- Allow public delete access to chat_group
CREATE POLICY "Allow public delete access to chat_group" ON public.chat_group
    FOR DELETE USING (true);

-- Add to Realtime Publication
alter publication supabase_realtime add table public.contacts;
alter publication supabase_realtime add table public.chat_group;

-- Create the chat-files storage bucket (if not already existing)
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-files', 'chat-files', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for public access to chat-files
CREATE POLICY "Allow public read access to chat-files"
ON storage.objects FOR SELECT
USING (bucket_id = 'chat-files');

CREATE POLICY "Allow public insert access to chat-files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'chat-files');

-- Drop old tables if they exist
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.chat_messages CASCADE;
DROP TABLE IF EXISTS public.conversation_members CASCADE;
DROP TABLE IF EXISTS public.conversations CASCADE;

-- Create conversations table supporting group channels and messaging groups
CREATE TABLE public.conversations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    type text NOT NULL CHECK (type IN ('direct', 'group', 'channel_group', 'message_group')),
    name text, -- NULL for direct, name for group
    image text, -- avatar/image url
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create conversation_members table with unread_count
CREATE TABLE public.conversation_members (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id uuid REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES public.profiles(id) ON UPDATE CASCADE ON DELETE CASCADE NOT NULL,
    role text DEFAULT 'member' NOT NULL,
    unread_count integer DEFAULT 0 NOT NULL,
    joined_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT unique_conversation_member UNIQUE (conversation_id, user_id)
);

-- Create chat_messages table where every row belongs to ONE user copy
CREATE TABLE public.chat_messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id uuid REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
    owner_user_id uuid REFERENCES public.profiles(id) ON UPDATE CASCADE ON DELETE CASCADE NOT NULL,
    sender_user_id uuid REFERENCES public.profiles(id) ON UPDATE CASCADE ON DELETE SET NULL,
    message text,
    message_type text NOT NULL DEFAULT 'text',
    direction text NOT NULL CHECK (direction IN ('Sent', 'Received')),
    sent boolean DEFAULT false NOT NULL,
    received boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    
    -- Attachments
    file_url text,
    file_name text,
    file_size bigint,
    mime_type text,
    duration integer,
    thumbnail text,
    
    -- Actions
    thumb boolean DEFAULT false NOT NULL,
    favorite boolean DEFAULT false NOT NULL,
    flag boolean DEFAULT false NOT NULL,
    star boolean DEFAULT false NOT NULL,
    pin boolean DEFAULT false NOT NULL,
    archive boolean DEFAULT false NOT NULL,
    deleted boolean DEFAULT false NOT NULL,
    action_this boolean DEFAULT false NOT NULL,
    reply boolean DEFAULT false NOT NULL,
    forward boolean DEFAULT false NOT NULL,
    
    -- Delete info
    deleted_at timestamp with time zone,
    deleted_by uuid REFERENCES public.profiles(id) ON UPDATE CASCADE ON DELETE SET NULL,
    
    -- Reply Metadata
    replyemoji text,
    replyto_message_id uuid,
    replyto_user_id uuid REFERENCES public.profiles(id) ON UPDATE CASCADE ON DELETE SET NULL,
    parent_message_id uuid,
    
    -- Forward Metadata
    forwardemoji text,
    forwardto_message_id uuid,
    forwardto_user_id uuid REFERENCES public.profiles(id) ON UPDATE CASCADE ON DELETE SET NULL,
    
    -- Lineage Metadata (points to original sender's copy ID to link copies)
    sender_message_id uuid
);

-- Optimization Indexes
CREATE INDEX IF NOT EXISTS idx_conversation_members_user ON public.conversation_members(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_owner_convo ON public.chat_messages(owner_user_id, conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_sender_msg_id ON public.chat_messages(sender_message_id);

-- Helper function to check if a user is member of a conversation (Security Definer avoids recursive RLS)
CREATE OR REPLACE FUNCTION public.is_conversation_member(convo_id uuid, usr_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.conversation_members
    WHERE conversation_id = convo_id AND user_id = usr_id
  );
$$;

-- Enable Row Level Security (RLS)
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Conversations RLS Policies (Strict User Isolation)
DROP POLICY IF EXISTS "Allow public read access to conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can view conversations they are member of" ON public.conversations;
CREATE POLICY "Users can view conversations they are member of" ON public.conversations
    FOR SELECT TO authenticated
    USING (public.is_conversation_member(id, auth.uid()) OR auth.uid() = created_by);

DROP POLICY IF EXISTS "Allow public insert access to conversations" ON public.conversations;
DROP POLICY IF EXISTS "Authenticated users can create conversations" ON public.conversations;
CREATE POLICY "Authenticated users can create conversations" ON public.conversations
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "Allow public update access to conversations" ON public.conversations;
DROP POLICY IF EXISTS "Members can update conversation metadata" ON public.conversations;
CREATE POLICY "Members can update conversation metadata" ON public.conversations
    FOR UPDATE TO authenticated
    USING (public.is_conversation_member(id, auth.uid()));

DROP POLICY IF EXISTS "Allow public delete access to conversations" ON public.conversations;
DROP POLICY IF EXISTS "Creators can delete conversations" ON public.conversations;
CREATE POLICY "Creators can delete conversations" ON public.conversations
    FOR DELETE TO authenticated
    USING (auth.uid() = created_by);

-- Conversation Members RLS Policies (Strict User Isolation)
DROP POLICY IF EXISTS "Allow public read access to conversation_members" ON public.conversation_members;
DROP POLICY IF EXISTS "Users can view members of their conversations" ON public.conversation_members;
CREATE POLICY "Users can view members of their conversations" ON public.conversation_members
    FOR SELECT TO authenticated
    USING (user_id = auth.uid() OR public.is_conversation_member(conversation_id, auth.uid()));

DROP POLICY IF EXISTS "Allow public insert access to conversation_members" ON public.conversation_members;
DROP POLICY IF EXISTS "Users can join or add members to conversations" ON public.conversation_members;
CREATE POLICY "Users can join or add members to conversations" ON public.conversation_members
    FOR INSERT TO authenticated
    WITH CHECK (public.is_conversation_member(conversation_id, auth.uid()) OR user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.conversations WHERE id = conversation_id AND created_by = auth.uid()));

DROP POLICY IF EXISTS "Allow public update access to conversation_members" ON public.conversation_members;
DROP POLICY IF EXISTS "Users can update their own membership" ON public.conversation_members;
CREATE POLICY "Users can update their own membership" ON public.conversation_members
    FOR UPDATE TO authenticated
    USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Allow public delete access to conversation_members" ON public.conversation_members;
DROP POLICY IF EXISTS "Users can leave or creators can remove members" ON public.conversation_members;
CREATE POLICY "Users can leave or creators can remove members" ON public.conversation_members
    FOR DELETE TO authenticated
    USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.conversations WHERE id = conversation_id AND created_by = auth.uid()));

-- Chat Messages RLS Policies (Strict User Copy Isolation)
DROP POLICY IF EXISTS "Users can view their own copies of messages" ON public.chat_messages;
CREATE POLICY "Users can view their own copies of messages" ON public.chat_messages
    FOR SELECT USING (auth.uid() = owner_user_id);

DROP POLICY IF EXISTS "Users can insert message copies for conversation members" ON public.chat_messages;
CREATE POLICY "Users can insert message copies for conversation members" ON public.chat_messages
    FOR INSERT WITH CHECK (
        auth.uid() = sender_user_id AND
        public.is_conversation_member(conversation_id, auth.uid()) AND
        public.is_conversation_member(conversation_id, owner_user_id)
    );

DROP POLICY IF EXISTS "Users can update their own copies of messages" ON public.chat_messages;
CREATE POLICY "Users can update their own copies of messages" ON public.chat_messages
    FOR UPDATE USING (auth.uid() = owner_user_id) WITH CHECK (auth.uid() = owner_user_id);

DROP POLICY IF EXISTS "Senders can update message copies for deletion" ON public.chat_messages;
CREATE POLICY "Senders can update message copies for deletion" ON public.chat_messages
    FOR UPDATE USING (auth.uid() = sender_user_id);

DROP POLICY IF EXISTS "Users can delete their own copies of messages" ON public.chat_messages;
CREATE POLICY "Users can delete their own copies of messages" ON public.chat_messages
    FOR DELETE USING (auth.uid() = owner_user_id);

-- Ensure Realtime is enabled
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'conversations'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'conversation_members'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.conversation_members;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'chat_messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
  END IF;
END $$;

-- Trigger to increment unread_count for recipients when a message copy is received
CREATE OR REPLACE FUNCTION public.increment_member_unread_count()
RETURNS trigger AS $$
BEGIN
  IF NEW.direction = 'Received' THEN
    UPDATE public.conversation_members
    SET unread_count = unread_count + 1
    WHERE conversation_id = NEW.conversation_id
    AND user_id = NEW.owner_user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER on_chat_message_inserted_unread
  AFTER INSERT ON public.chat_messages
  FOR EACH ROW EXECUTE FUNCTION public.increment_member_unread_count();


-- Secure RPC to retrieve file metadata for document sharing.
-- Uses SECURITY DEFINER + SET search_path to bypass RLS safely.
-- Membership check is decoupled from the message query to avoid ambiguous column references.
-- All output columns are aliased with out_ prefix to avoid conflicts with RETURNS TABLE variable names.
DROP FUNCTION IF EXISTS public.get_shared_file_metadata(uuid, uuid);

CREATE OR REPLACE FUNCTION public.get_shared_file_metadata(
    p_file_id  uuid,
    p_user_id  uuid
)
RETURNS TABLE (
    out_conversation_id   uuid,
    out_file_url          text,
    out_file_name         text,
    out_file_size         bigint,
    out_mime_type         text,
    out_sender_user_id    uuid,
    out_created_at        timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_conversation_id uuid;
BEGIN
    -- Step A: Find which conversation the file belongs to (any copy, bypassing RLS)
    SELECT m.conversation_id
    INTO   v_conversation_id
    FROM   public.chat_messages m
    WHERE  (m.id = p_file_id OR m.sender_message_id = p_file_id)
    LIMIT  1;

    -- Step B: File doesn't exist at all
    IF v_conversation_id IS NULL THEN
        RETURN;
    END IF;

    -- Step C: Requesting user must be a member of that conversation
    IF NOT EXISTS (
        SELECT 1
        FROM   public.conversation_members cm
        WHERE  cm.conversation_id = v_conversation_id
          AND  cm.user_id         = p_user_id
    ) THEN
        RETURN;
    END IF;

    -- Step D: Authorized — return metadata from any copy of the message
    RETURN QUERY
    SELECT
        m.conversation_id   AS out_conversation_id,
        m.file_url          AS out_file_url,
        m.file_name         AS out_file_name,
        m.file_size         AS out_file_size,
        m.mime_type         AS out_mime_type,
        m.sender_user_id    AS out_sender_user_id,
        m.created_at        AS out_created_at
    FROM   public.chat_messages m
    WHERE  (m.id = p_file_id OR m.sender_message_id = p_file_id)
    LIMIT  1;
END;
$$;

-- Grant execute to authenticated users (RPC called with user session)
GRANT EXECUTE ON FUNCTION public.get_shared_file_metadata(uuid, uuid) TO authenticated;

-- Create public.notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.profiles(id) ON UPDATE CASCADE ON DELETE CASCADE NOT NULL,
    sender_id uuid REFERENCES public.profiles(id) ON UPDATE CASCADE ON DELETE SET NULL,
    message_id uuid REFERENCES public.chat_messages(id) ON DELETE CASCADE,
    message_text text NOT NULL,
    read boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable Row-Level Security
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Users can view their own notifications" ON public.notifications
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
    FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications" ON public.notifications
    FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Create trigger to automatically insert a notification on new received messages
CREATE OR REPLACE FUNCTION public.create_message_notification()
RETURNS trigger AS $$
DECLARE
  v_sender_name text;
BEGIN
  IF NEW.direction = 'Received' AND NEW.message_type != 'system' THEN
    SELECT COALESCE(name, email) INTO v_sender_name FROM public.profiles WHERE id = NEW.sender_user_id;
    
    INSERT INTO public.notifications (user_id, sender_id, message_id, message_text, read, created_at)
    VALUES (
      NEW.owner_user_id,
      NEW.sender_user_id,
      NEW.id,
      COALESCE(v_sender_name, 'Someone') || ' send you a msg click to see',
      false,
      NEW.created_at
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_chat_message_inserted_notification
  AFTER INSERT ON public.chat_messages
  FOR EACH ROW EXECUTE FUNCTION public.create_message_notification();

-- Add notifications to Supabase Realtime publication if not already present
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'notifications'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
  END IF;
END $$;


-- 1. Ensure chat-files storage bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-files', 'chat-files', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Ensure public read access policy for chat-files
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Allow public read access to chat-files'
  ) THEN
    CREATE POLICY "Allow public read access to chat-files"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'chat-files');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Allow public insert access to chat-files'
  ) THEN
    CREATE POLICY "Allow public insert access to chat-files"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'chat-files');
  END IF;
END $$;

-- 1. Ensure chat-files storage bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-files', 'chat-files', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Ensure public read access policy for chat-files
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Allow public read access to chat-files'
  ) THEN
    CREATE POLICY "Allow public read access to chat-files"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'chat-files');
  END IF;
END $$;

-- 3. Ensure public insert access policy for chat-files
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Allow public insert access to chat-files'
  ) THEN
    CREATE POLICY "Allow public insert access to chat-files"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'chat-files');
  END IF;
END $$;


-- ================================================================================
-- ENTERPRISE DOCUMENT SCANNER MIGRATION SCRIPT
-- ================================================================================
-- File: scanner_migration.sql
-- Description: Ensures Supabase Storage bucket, RLS policies, and database indexes
--              fully support the Enterprise Document Scanner feature.
-- 
-- Compatibility: 100% compatible with existing supbase_schema.sql
-- Bucket Used: `chat-files` (folder `scanned/`)
-- Table Used: `chat_messages` (message_type = 'document')
-- ================================================================================

-- 1. Ensure `chat-files` storage bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-files', 'chat-files', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Ensure public read access policy for `chat-files` bucket
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' AND policyname = 'Allow public read access to chat-files'
  ) THEN
    CREATE POLICY "Allow public read access to chat-files"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'chat-files');
  END IF;
END $$;

-- 3. Ensure public insert access policy for `chat-files` bucket (required for uploading scanned document PDFs)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' AND policyname = 'Allow public insert access to chat-files'
  ) THEN
    CREATE POLICY "Allow public insert access to chat-files"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'chat-files');
  END IF;
END $$;

-- 4. Optimization Index for Scanned Document Queries on `chat_messages`
CREATE INDEX IF NOT EXISTS idx_chat_messages_document_scanned 
ON public.chat_messages (owner_user_id, message_type, created_at DESC)
WHERE message_type = 'document';

-- ================================================================================
-- APP_NOTIFICATION DATABASE & USER ISOLATION SCHEMA
-- ================================================================================

CREATE TABLE IF NOT EXISTS public.app_notification (
  app_notification_id bigserial PRIMARY KEY,
  app_notification_uuid uuid DEFAULT gen_random_uuid() UNIQUE NOT NULL,
  status text DEFAULT 'active',
  description text,
  icon text,
  user_email_account_id text,
  email_folder_id bigint,
  subject text DEFAULT '(No Subject)',
  sender_email text,
  sender_name text,
  full_name text,
  sender_mobile text,
  recipient_mobiles text,
  cc_emails text,
  bcc_emails text,
  body text,
  is_read boolean DEFAULT false,
  is_starred boolean DEFAULT false,
  is_important boolean DEFAULT false,
  is_draft boolean DEFAULT false,
  is_deleted boolean DEFAULT false,
  has_attachments boolean DEFAULT false,
  ref_email_id bigint,
  ref_email text,
  for_email_id text,
  for_email text,
  ref_sequence_no text,
  for_sequence_no text,
  ref_subject text,
  for_subject text,
  from_business_number text,
  from_business_name text,
  to_business_number text,
  to_business_name text,
  for_business_number text,
  for_business_name text,
  redirection_icon text,
  redirection_url text,
  ref_field_1 text,
  ref_field_2 text,
  user_note text,
  replied_to_email_id text,
  related_to_email_id text,
  forwarded_from_email_id text,
  seen_by_users text,
  reactions text,
  sender_display_name text,
  attachment_url text,
  attachment_name text,
  email_opened text,
  email_open_datetime timestamp with time zone,
  email_open_geo text,
  custom_one text,
  custom_two text,
  custom_three text,
  meta_fields text,
  remarks text,
  store_meta text,
  workflow_meta text,
  share_url text,
  share_status text,
  business_name text,
  business_number text,
  ref_business text,
  ref_business_number text,
  ref_user text,
  ref_appname text,
  ref_datetime timestamp with time zone,
  social_login_used text,
  created_user text,
  created_user_id text,
  received_datetime timestamp with time zone DEFAULT now(),
  created_datetime timestamp with time zone DEFAULT now(),
  updated_datetime timestamp with time zone DEFAULT now(),
  app_name text,
  is_sync boolean DEFAULT false,
  ccusers_json jsonb DEFAULT '[]'::jsonb,
  bccusers_json jsonb DEFAULT '[]'::jsonb,
  from_email text,
  to_email text,
  from_user_name text,
  to_user_name text,
  from_mobile text,
  to_mobile text,
  from_user_uuid uuid,
  to_user_uuid uuid,
  from_fullname text,
  to_fullname text,
  body_rich_text_json jsonb DEFAULT '{}'::jsonb,
  email_files_json jsonb DEFAULT '[]'::jsonb,
  email_content_json jsonb DEFAULT '{}'::jsonb,
  is_archive boolean DEFAULT false,
  progress_status text,
  email_use_timeline jsonb DEFAULT '[]'::jsonb,
  message_group text,
  message_type text DEFAULT 'notification',
  message_category text,
  email_sequence_json jsonb DEFAULT '[]'::jsonb,
  is_like boolean DEFAULT false,
  is_dislike boolean DEFAULT false,
  is_flag boolean DEFAULT false,
  is_favourite boolean DEFAULT false,
  email_uuid uuid,
  user_uuid uuid,
  created_user_uuid uuid,
  updated_user_uuid uuid,
  user_name text,
  user_email text,
  user_mobile text,
  from_user_email text,
  from_user_mobile text,
  to_user_email text,
  to_user_mobile text,
  business_uuid uuid,
  created_business_uuid uuid,
  updated_business_uuid uuid,
  for_business_uuid uuid,
  ref_business_uuid uuid,
  ref_business_name text,
  from_business_uuid uuid,
  from_business_email text,
  from_business_mobile text,
  to_business_uuid uuid,
  to_business_email text,
  to_business_mobile text,
  email_group text,
  user_id bigint,
  email_connection_json jsonb DEFAULT '{}'::jsonb,
  email_status_logs_json jsonb DEFAULT '[]'::jsonb,
  recipient_emails jsonb DEFAULT '[]'::jsonb,
  status_json jsonb DEFAULT '{}'::jsonb,
  progress_json jsonb DEFAULT '{}'::jsonb,
  progress_status_json jsonb DEFAULT '{}'::jsonb,
  ref_email_uuid uuid,
  for_email_uuid uuid,
  email_thread_json jsonb DEFAULT '[]'::jsonb,
  is_actionitem boolean DEFAULT false,
  is_pin boolean DEFAULT false,
  email_status text,
  is_template boolean DEFAULT false,
  template_name text,
  folder_name text DEFAULT 'INBOX',
  is_open boolean DEFAULT false,
  sent_server_email_uuid uuid,
  inbox_server_email_uuid uuid,
  sent_imap_id bigint,
  inbox_imap_id bigint,
  sub_folder_name text,
  month_id bigint,
  month_uuid uuid,
  month_name character varying,
  financial_year_uuid uuid,
  financial_id bigint,
  financial_year character varying,
  period_uuid uuid,
  period_id bigint,
  period_name character varying
);

-- Enable RLS
ALTER TABLE public.app_notification ENABLE ROW LEVEL SECURITY;

-- Enable RLS and grant full access to public / authenticated / anon
ALTER TABLE public.app_notification ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their notifications" ON public.app_notification;
DROP POLICY IF EXISTS "Users can insert notifications" ON public.app_notification;
DROP POLICY IF EXISTS "Users can update their notifications" ON public.app_notification;
DROP POLICY IF EXISTS "Users can delete their notifications" ON public.app_notification;
DROP POLICY IF EXISTS "Allow all for notifications" ON public.app_notification;

CREATE POLICY "Allow all for notifications"
  ON public.app_notification
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Indexes for high performance
CREATE INDEX IF NOT EXISTS idx_app_notification_uuid ON public.app_notification (app_notification_uuid);
CREATE INDEX IF NOT EXISTS idx_app_notification_user_uuid ON public.app_notification (user_uuid);
CREATE INDEX IF NOT EXISTS idx_app_notification_created_user_uuid ON public.app_notification (created_user_uuid);
CREATE INDEX IF NOT EXISTS idx_app_notification_user_email ON public.app_notification (user_email);
CREATE INDEX IF NOT EXISTS idx_app_notification_folder ON public.app_notification (folder_name);
CREATE INDEX IF NOT EXISTS idx_app_notification_is_read ON public.app_notification (is_read);
CREATE INDEX IF NOT EXISTS idx_app_notification_created_datetime ON public.app_notification (created_datetime DESC);

-- Add to Realtime Publication
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'app_notification'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.app_notification;
  END IF;
END $$;

-- ================================================================================
-- USER PUSH TOKENS (FOR REAL-TIME EXPO MOBILE PUSH NOTIFICATIONS)
-- ================================================================================

CREATE TABLE IF NOT EXISTS public.user_push_tokens (
  id bigserial PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email text NOT NULL,
  expo_push_token text NOT NULL UNIQUE,
  device_type text,
  device_name text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS and grant access to user_push_tokens
ALTER TABLE public.user_push_tokens ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all for user_push_tokens" ON public.user_push_tokens;
CREATE POLICY "Allow all for user_push_tokens"
  ON public.user_push_tokens
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Indexes for lightning-fast token lookups on send
CREATE INDEX IF NOT EXISTS idx_user_push_tokens_email ON public.user_push_tokens (user_email);
CREATE INDEX IF NOT EXISTS idx_user_push_tokens_user_id ON public.user_push_tokens (user_id);
CREATE INDEX IF NOT EXISTS idx_user_push_tokens_active ON public.user_push_tokens (is_active);

-- ================================================================================
-- END OF MIGRATION
-- ================================================================================
-- ================================================================================
-- PDF PROCESSING PIPELINE MIGRATION SCRIPT
-- ================================================================================
-- File: supabase_migration.sql
-- Description: Adds columns and indexes to the public.chat_messages table
--              to support the asynchronous PDF processing pipeline.
--
-- Instructions: Run this script inside your Supabase Dashboard SQL Editor
--               (https://supabase.com/dashboard/project/_/sql).
-- ================================================================================

-- 1. Add file_content_text column (if it doesn't exist)
ALTER TABLE public.chat_messages 
ADD COLUMN IF NOT EXISTS file_content_text TEXT;

-- 2. Add file_content_json column (if it doesn't exist)
ALTER TABLE public.chat_messages 
ADD COLUMN IF NOT EXISTS file_content_json JSONB;

-- 3. Add processing_status column (if it doesn't exist)
ALTER TABLE public.chat_messages 
ADD COLUMN IF NOT EXISTS processing_status TEXT DEFAULT NULL;

-- 4. Create an index to quickly filter and query messages by processing status
CREATE INDEX IF NOT EXISTS idx_chat_messages_processing_status 
ON public.chat_messages (processing_status) 
WHERE processing_status IS NOT NULL;

-- ================================================================================
-- VOUCHERS DATABASE & USER ISOLATION SCHEMA
-- ================================================================================

-- 1. Create public.vouchers table
CREATE TABLE IF NOT EXISTS public.vouchers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  voucher_no text NOT NULL,
  file_name text NOT NULL,
  original_file_url text,
  edited_file_url text,
  edited_json jsonb,
  vendor_name text,
  customer_name text,
  invoice_date text,
  total numeric,
  currency text DEFAULT 'USD',
  status text DEFAULT 'Active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.vouchers ENABLE ROW LEVEL SECURITY;

-- 3. Strict User Isolation RLS Policies
DROP POLICY IF EXISTS "Users can view their own vouchers" ON public.vouchers;
CREATE POLICY "Users can view their own vouchers"
  ON public.vouchers FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own vouchers" ON public.vouchers;
CREATE POLICY "Users can insert their own vouchers"
  ON public.vouchers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own vouchers" ON public.vouchers;
CREATE POLICY "Users can update their own vouchers"
  ON public.vouchers FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own vouchers" ON public.vouchers;
CREATE POLICY "Users can delete their own vouchers"
  ON public.vouchers FOR DELETE
  USING (auth.uid() = user_id);

-- 4. Performance Index
CREATE INDEX IF NOT EXISTS idx_vouchers_user_id ON public.vouchers(user_id);
CREATE INDEX IF NOT EXISTS idx_vouchers_created_at ON public.vouchers(created_at DESC);

-- ================================================================================
-- END OF MIGRATION
-- ================================================================================