import { getLocalDatabase } from './sqlite-db';
import type { AppNotificationRecord } from './types';

export class LocalNotificationService {
  /**
   * Create or save an app notification into local SQLite.
   */
  static async createNotification(
    data: Partial<AppNotificationRecord>
  ): Promise<AppNotificationRecord> {
    const db = await getLocalDatabase();
    const nowIso = new Date().toISOString();
    const currentMonth = new Date().toLocaleString('en-US', { month: 'long' });
    const notifUuid =
      data.app_notification_uuid ||
      `notif-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    const record: AppNotificationRecord = {
      app_notification_uuid: notifUuid,
      status: data.status ?? 'sent',
      user_email_account_id: data.user_email_account_id ?? null,
      subject: data.subject ?? '(No Subject)',
      sender_email: data.sender_email ?? data.from_email ?? data.from_user_email ?? null,
      sender_name: data.sender_name ?? data.from_user_name ?? data.full_name ?? null,
      full_name: data.full_name ?? data.sender_name ?? data.from_fullname ?? null,
      sender_mobile: data.sender_mobile ?? data.from_mobile ?? data.from_user_mobile ?? null,
      recipient_mobiles: data.recipient_mobiles ?? data.to_mobile ?? data.to_user_mobile ?? null,
      cc_emails: data.cc_emails ?? null,
      bcc_emails: data.bcc_emails ?? null,
      body: data.body ?? '',
      is_read: data.is_read !== undefined ? (data.is_read ? 1 : 0) : 1,
      is_starred: data.is_starred !== undefined ? (data.is_starred ? 1 : 0) : 0,
      is_important: data.is_important !== undefined ? (data.is_important ? 1 : 0) : 0,
      is_draft: data.is_draft !== undefined ? (data.is_draft ? 1 : 0) : 0,
      is_deleted: 0,
      has_attachments: data.has_attachments !== undefined ? (data.has_attachments ? 1 : 0) : 0,
      created_user: data.created_user ?? data.user_name ?? data.sender_name ?? null,
      created_user_id: data.created_user_id ?? data.user_uuid ?? null,
      received_datetime: data.received_datetime ?? nowIso,
      created_datetime: data.created_datetime ?? nowIso,
      updated_datetime: data.updated_datetime ?? nowIso,
      ccusers_json:
        typeof data.ccusers_json === 'object'
          ? JSON.stringify(data.ccusers_json)
          : (data.ccusers_json ?? '[]'),
      bccusers_json:
        typeof data.bccusers_json === 'object'
          ? JSON.stringify(data.bccusers_json)
          : (data.bccusers_json ?? '[]'),
      from_email: data.from_email ?? data.sender_email ?? null,
      to_email: data.to_email ?? data.to_user_email ?? null,
      from_user_name: data.from_user_name ?? data.sender_name ?? null,
      to_user_name: data.to_user_name ?? data.to_fullname ?? null,
      from_mobile: data.from_mobile ?? data.sender_mobile ?? null,
      to_mobile: data.to_mobile ?? data.recipient_mobiles ?? null,
      from_user_uuid: data.from_user_uuid ?? data.user_uuid ?? null,
      to_user_uuid: data.to_user_uuid ?? null,
      from_fullname: data.from_fullname ?? data.full_name ?? data.sender_name ?? null,
      to_fullname: data.to_fullname ?? data.to_user_name ?? null,
      email_files_json:
        typeof data.email_files_json === 'object'
          ? JSON.stringify(data.email_files_json)
          : typeof data.attachments === 'string'
            ? data.attachments
            : typeof data.attachments === 'object'
              ? JSON.stringify(data.attachments)
              : (data.email_files_json ?? '[]'),
      is_archive: data.is_archive !== undefined ? (data.is_archive ? 1 : 0) : 0,
      is_like: data.is_like !== undefined ? (data.is_like ? 1 : 0) : 0,
      is_dislike: data.is_dislike !== undefined ? (data.is_dislike ? 1 : 0) : 0,
      is_flag: data.is_flag !== undefined ? (data.is_flag ? 1 : 0) : 0,
      is_favourite: data.is_favourite !== undefined ? (data.is_favourite ? 1 : 0) : 0,
      user_uuid: data.user_uuid ?? null,
      created_user_uuid: data.created_user_uuid ?? data.user_uuid ?? null,
      updated_user_uuid: data.updated_user_uuid ?? data.user_uuid ?? null,
      user_name: data.user_name ?? data.sender_name ?? null,
      user_email: data.user_email ?? data.sender_email ?? null,
      user_mobile: data.user_mobile ?? data.sender_mobile ?? null,
      from_user_email: data.from_user_email ?? data.from_email ?? data.sender_email ?? null,
      from_user_mobile: data.from_user_mobile ?? data.from_mobile ?? data.sender_mobile ?? null,
      to_user_email: data.to_user_email ?? data.to_email ?? null,
      to_user_mobile: data.to_user_mobile ?? data.to_mobile ?? data.recipient_mobiles ?? null,
      month_name: data.month_name ?? currentMonth,
      folder_name: data.folder_name ?? (data.is_draft ? 'Drafts' : 'Sent'),
      is_sync: 0,
      ...data,
    };

    await db.runAsync(
      `
      INSERT INTO app_notification (
        app_notification_uuid, status, user_email_account_id, subject, sender_email,
        sender_name, full_name, sender_mobile, recipient_mobiles, cc_emails,
        bcc_emails, body, is_read, is_starred, is_important,
        is_draft, is_deleted, has_attachments, created_user, created_user_id,
        received_datetime, created_datetime, updated_datetime, ccusers_json, bccusers_json,
        from_email, to_email, from_user_name, to_user_name, from_mobile,
        to_mobile, from_user_uuid, to_user_uuid, from_fullname, to_fullname,
        email_files_json, is_archive, is_like, is_dislike, is_flag,
        is_favourite, user_uuid, created_user_uuid, updated_user_uuid, user_name,
        user_email, user_mobile, from_user_email, from_user_mobile, to_user_email,
        to_user_mobile, month_name, folder_name, is_sync
      ) VALUES (
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?
      )
      ON CONFLICT(app_notification_uuid) DO UPDATE SET
        subject = excluded.subject,
        body = excluded.body,
        is_read = excluded.is_read,
        is_starred = excluded.is_starred,
        is_important = excluded.is_important,
        is_draft = excluded.is_draft,
        is_deleted = excluded.is_deleted,
        status = excluded.status,
        updated_datetime = excluded.updated_datetime
      `,
      [
        record.app_notification_uuid,
        record.status,
        record.user_email_account_id,
        record.subject,
        record.sender_email,
        record.sender_name,
        record.full_name,
        record.sender_mobile,
        record.recipient_mobiles,
        record.cc_emails,
        record.bcc_emails,
        record.body,
        record.is_read ? 1 : 0,
        record.is_starred ? 1 : 0,
        record.is_important ? 1 : 0,
        record.is_draft ? 1 : 0,
        record.is_deleted ? 1 : 0,
        record.has_attachments ? 1 : 0,
        record.created_user,
        record.created_user_id,
        record.received_datetime,
        record.created_datetime,
        record.updated_datetime,
        typeof record.ccusers_json === 'object' ? JSON.stringify(record.ccusers_json) : record.ccusers_json,
        typeof record.bccusers_json === 'object' ? JSON.stringify(record.bccusers_json) : record.bccusers_json,
        record.from_email,
        record.to_email,
        record.from_user_name,
        record.to_user_name,
        record.from_mobile,
        record.to_mobile,
        record.from_user_uuid,
        record.to_user_uuid,
        record.from_fullname,
        record.to_fullname,
        typeof record.email_files_json === 'object' ? JSON.stringify(record.email_files_json) : record.email_files_json,
        record.is_archive ? 1 : 0,
        record.is_like ? 1 : 0,
        record.is_dislike ? 1 : 0,
        record.is_flag ? 1 : 0,
        record.is_favourite ? 1 : 0,
        record.user_uuid,
        record.created_user_uuid,
        record.updated_user_uuid,
        record.user_name,
        record.user_email,
        record.user_mobile,
        record.from_user_email,
        record.from_user_mobile,
        record.to_user_email,
        record.to_user_mobile,
        record.month_name,
        record.folder_name,
        0,
      ]
    );

    const savedRecord = await db.getFirstAsync<AppNotificationRecord>(
      `SELECT * FROM app_notification WHERE app_notification_uuid = ? LIMIT 1`,
      [notifUuid]
    );

    return savedRecord || record;
  }

  /**
   * Save or update an existing notification
   */
  static async saveNotification(notification: AppNotificationRecord): Promise<void> {
    await this.createNotification(notification);
  }

  /**
   * Get all notifications (with optional folder/status filter)
   */
  static async getNotifications(options?: {
    userUuid?: string;
    folderName?: string;
    isRead?: boolean;
    limit?: number;
  }): Promise<AppNotificationRecord[]> {
    const db = await getLocalDatabase();
    let query = `SELECT * FROM app_notification WHERE is_deleted = 0`;
    const params: any[] = [];

    if (options?.userUuid) {
      query += ` AND (user_uuid = ? OR created_user_id = ?)`;
      params.push(options.userUuid, options.userUuid);
    }

    if (options?.folderName) {
      query += ` AND LOWER(folder_name) = LOWER(?)`;
      params.push(options.folderName);
    }

    if (options?.isRead !== undefined) {
      query += ` AND is_read = ?`;
      params.push(options.isRead ? 1 : 0);
    }

    query += ` ORDER BY created_datetime DESC`;

    if (options?.limit) {
      query += ` LIMIT ${Number(options.limit)}`;
    }

    return await db.getAllAsync(query, params);
  }

  /**
   * Get notification by UUID or ID
   */
  static async getNotificationById(idOrUuid: string | number): Promise<AppNotificationRecord | null> {
    const db = await getLocalDatabase();
    return await db.getFirstAsync(
      `SELECT * FROM app_notification WHERE app_notification_uuid = ? OR app_notification_id = ? LIMIT 1`,
      [idOrUuid, idOrUuid]
    );
  }

  /**
   * Mark notification as read / unread
   */
  static async markAsRead(appNotificationUuid: string, isRead = true): Promise<void> {
    const db = await getLocalDatabase();
    await db.runAsync(
      `UPDATE app_notification SET is_read = ?, updated_datetime = datetime('now') WHERE app_notification_uuid = ?`,
      [isRead ? 1 : 0, appNotificationUuid]
    );
  }

  /**
   * Toggle star / flag status
   */
  static async toggleStar(appNotificationUuid: string, isStarred: boolean): Promise<void> {
    const db = await getLocalDatabase();
    await db.runAsync(
      `UPDATE app_notification SET is_starred = ?, updated_datetime = datetime('now') WHERE app_notification_uuid = ?`,
      [isStarred ? 1 : 0, appNotificationUuid]
    );
  }

  /**
   * Soft delete notification
   */
  static async deleteNotification(appNotificationUuid: string): Promise<void> {
    const db = await getLocalDatabase();
    await db.runAsync(
      `UPDATE app_notification SET is_deleted = 1, updated_datetime = datetime('now') WHERE app_notification_uuid = ?`,
      [appNotificationUuid]
    );
  }
}
