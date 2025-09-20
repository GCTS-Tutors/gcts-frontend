import { APIClient } from '@/lib/api';
import { 
  Notification,
  PaginatedResponse,
  PaginationParams
} from '@/types/api';

export interface NotificationFilters {
  type?: string[];
  isRead?: boolean;
  dateFrom?: string;
  dateTo?: string;
}

export class NotificationService {
  /**
   * Get paginated list of notifications for current user
   */
  static async getNotifications(
    filters?: NotificationFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Notification>> {
    const params = new URLSearchParams();
    
    // Add filters
    if (filters) {
      if (filters.type?.length) {
        filters.type.forEach(type => params.append('type', type));
      }
      if (filters.isRead !== undefined) {
        params.append('is_read', filters.isRead.toString());
      }
      if (filters.dateFrom) params.append('date_from', filters.dateFrom);
      if (filters.dateTo) params.append('date_to', filters.dateTo);
    }
    
    // Add pagination
    if (pagination) {
      if (pagination.page) params.append('page', pagination.page.toString());
      if (pagination.pageSize) params.append('page_size', pagination.pageSize.toString());
      if (pagination.ordering) params.append('ordering', pagination.ordering);
    }
    
    const queryString = params.toString();
    return APIClient.get<PaginatedResponse<Notification>>(
      `/notifications/${queryString ? `?${queryString}` : ''}`
    );
  }

  /**
   * Get single notification by ID
   */
  static async getNotification(id: number): Promise<Notification> {
    return APIClient.get<Notification>(`/notifications/${id}/`);
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(id: number): Promise<Notification> {
    return APIClient.patch<Notification>(`/notifications/${id}/`, {
      is_read: true
    });
  }

  /**
   * Mark notification as unread
   */
  static async markAsUnread(id: number): Promise<Notification> {
    return APIClient.patch<Notification>(`/notifications/${id}/`, {
      is_read: false
    });
  }

  /**
   * Mark all notifications as read
   */
  static async markAllAsRead(): Promise<{ updated: number }> {
    return APIClient.post<{ updated: number }>('/notifications/mark-all-read/');
  }

  /**
   * Delete notification
   */
  static async deleteNotification(id: number): Promise<void> {
    return APIClient.delete<void>(`/notifications/${id}/`);
  }

  /**
   * Delete all notifications
   */
  static async deleteAllNotifications(): Promise<{ deleted: number }> {
    return APIClient.delete<{ deleted: number }>('/notifications/delete-all/');
  }

  /**
   * Get unread notifications count
   */
  static async getUnreadCount(): Promise<{ count: number }> {
    return APIClient.get<{ count: number }>('/notifications/unread-count/');
  }

  /**
   * Get notification preferences
   */
  static async getNotificationPreferences(): Promise<{
    emailNotifications: boolean;
    pushNotifications: boolean;
    smsNotifications: boolean;
    orderUpdates: boolean;
    paymentNotifications: boolean;
    marketingEmails: boolean;
    weeklyDigest: boolean;
    instantNotifications: boolean;
  }> {
    return APIClient.get('/notifications/preferences/');
  }

  /**
   * Update notification preferences
   */
  static async updateNotificationPreferences(preferences: {
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    smsNotifications?: boolean;
    orderUpdates?: boolean;
    paymentNotifications?: boolean;
    marketingEmails?: boolean;
    weeklyDigest?: boolean;
    instantNotifications?: boolean;
  }): Promise<void> {
    return APIClient.patch<void>('/notifications/preferences/', preferences);
  }

  /**
   * Send notification to user (admin only)
   */
  static async sendNotification(data: {
    userId: number;
    type: string;
    title: string;
    message: string;
    data?: any;
    sendEmail?: boolean;
    sendPush?: boolean;
    sendSms?: boolean;
  }): Promise<Notification> {
    return APIClient.post<Notification>('/notifications/send/', data);
  }

  /**
   * Send bulk notification (admin only)
   */
  static async sendBulkNotification(data: {
    userIds?: number[];
    userRoles?: string[];
    type: string;
    title: string;
    message: string;
    data?: any;
    sendEmail?: boolean;
    sendPush?: boolean;
    sendSms?: boolean;
  }): Promise<{ sent: number; failed: number }> {
    return APIClient.post<{ sent: number; failed: number }>('/notifications/send-bulk/', data);
  }

  /**
   * Get notification templates (admin only)
   */
  static async getNotificationTemplates(): Promise<Array<{
    id: number;
    name: string;
    type: string;
    title: string;
    message: string;
    isActive: boolean;
  }>> {
    return APIClient.get('/notifications/templates/');
  }

  /**
   * Create notification template (admin only)
   */
  static async createNotificationTemplate(data: {
    name: string;
    type: string;
    title: string;
    message: string;
    isActive?: boolean;
  }): Promise<any> {
    return APIClient.post('/notifications/templates/', data);
  }

  /**
   * Update notification template (admin only)
   */
  static async updateNotificationTemplate(
    id: number,
    data: Partial<{
      name: string;
      type: string;
      title: string;
      message: string;
      isActive: boolean;
    }>
  ): Promise<any> {
    return APIClient.patch(`/notifications/templates/${id}/`, data);
  }

  /**
   * Delete notification template (admin only)
   */
  static async deleteNotificationTemplate(id: number): Promise<void> {
    return APIClient.delete<void>(`/notifications/templates/${id}/`);
  }

  /**
   * Subscribe to push notifications
   */
  static async subscribeToPushNotifications(subscription: {
    endpoint: string;
    keys: {
      p256dh: string;
      auth: string;
    };
  }): Promise<void> {
    return APIClient.post<void>('/notifications/push-subscribe/', {
      subscription
    });
  }

  /**
   * Unsubscribe from push notifications
   */
  static async unsubscribeFromPushNotifications(endpoint: string): Promise<void> {
    return APIClient.post<void>('/notifications/push-unsubscribe/', {
      endpoint
    });
  }

  /**
   * Test notification delivery (admin only)
   */
  static async testNotificationDelivery(data: {
    userId: number;
    type: 'email' | 'push' | 'sms';
    message: string;
  }): Promise<{ success: boolean; details: string }> {
    return APIClient.post('/notifications/test/', data);
  }

  /**
   * Get notification delivery statistics (admin only)
   */
  static async getNotificationStats(period?: '7d' | '30d' | '90d'): Promise<{
    totalSent: number;
    emailsSent: number;
    pushNotificationsSent: number;
    smsSent: number;
    deliveryRate: number;
    openRate: number;
    clickRate: number;
    statsByType: Record<string, {
      sent: number;
      delivered: number;
      opened: number;
      clicked: number;
    }>;
  }> {
    const params = period ? `?period=${period}` : '';
    return APIClient.get(`/notifications/stats/${params}`);
  }

  /**
   * Get recent activity notifications
   */
  static async getRecentActivity(limit: number = 10): Promise<Notification[]> {
    return APIClient.get<Notification[]>(`/notifications/recent/?limit=${limit}`);
  }

  /**
   * Schedule notification (admin only)
   */
  static async scheduleNotification(data: {
    userId: number;
    type: string;
    title: string;
    message: string;
    scheduledFor: string; // ISO datetime string
    data?: any;
  }): Promise<{ scheduledId: string }> {
    return APIClient.post('/notifications/schedule/', data);
  }

  /**
   * Cancel scheduled notification (admin only)
   */
  static async cancelScheduledNotification(scheduledId: string): Promise<void> {
    return APIClient.delete<void>(`/notifications/schedule/${scheduledId}/`);
  }
}