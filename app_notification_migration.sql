-- ================================================================================
-- APP_NOTIFICATION DATABASE & USER ISOLATION SCHEMA MIGRATION
-- ================================================================================
-- Migration: app_notification_migration.sql
-- Description: Run this SQL directly in your Supabase Dashboard SQL Editor
--              (https://supabase.com/dashboard/project/_/sql)
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

-- RLS Policies
DROP POLICY IF EXISTS "Users can view their notifications" ON public.app_notification;
CREATE POLICY "Users can view their notifications"
  ON public.app_notification FOR SELECT TO authenticated
  USING (
    auth.uid() = user_uuid OR
    auth.uid() = created_user_uuid OR
    auth.uid()::text = created_user_id OR
    auth.uid()::text = user_email_account_id OR
    auth.jwt() ->> 'email' = user_email
  );

DROP POLICY IF EXISTS "Users can insert notifications" ON public.app_notification;
CREATE POLICY "Users can insert notifications"
  ON public.app_notification FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_uuid OR
    auth.uid() = created_user_uuid OR
    created_user_uuid IS NULL OR
    user_uuid IS NULL
  );

DROP POLICY IF EXISTS "Users can update their notifications" ON public.app_notification;
CREATE POLICY "Users can update their notifications"
  ON public.app_notification FOR UPDATE TO authenticated
  USING (
    auth.uid() = user_uuid OR
    auth.uid() = created_user_uuid OR
    auth.uid()::text = created_user_id OR
    auth.jwt() ->> 'email' = user_email
  )
  WITH CHECK (
    auth.uid() = user_uuid OR
    auth.uid() = created_user_uuid OR
    auth.uid()::text = created_user_id OR
    auth.jwt() ->> 'email' = user_email
  );

DROP POLICY IF EXISTS "Users can delete their notifications" ON public.app_notification;
CREATE POLICY "Users can delete their notifications"
  ON public.app_notification FOR DELETE TO authenticated
  USING (
    auth.uid() = user_uuid OR
    auth.uid() = created_user_uuid OR
    auth.uid()::text = created_user_id OR
    auth.jwt() ->> 'email' = user_email
  );

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
