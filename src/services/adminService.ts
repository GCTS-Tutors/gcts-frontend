import { APIClient } from '@/lib/api';
import { DashboardStats, OrderAnalytics } from '@/types/api';

export interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  database: {
    status: 'connected' | 'disconnected';
    responseTime: number;
  };
  redis: {
    status: 'connected' | 'disconnected';
    responseTime: number;
  };
  storage: {
    status: 'healthy' | 'warning' | 'critical';
    usedSpace: number;
    totalSpace: number;
  };
  apiResponseTime: number;
  uptime: number;
  lastChecked: string;
}

export interface SystemSettings {
  siteName: string;
  siteUrl: string;
  supportEmail: string;
  allowRegistrations: boolean;
  requireEmailVerification: boolean;
  maintenanceMode: boolean;
  maxFileSize: number;
  allowedFileTypes: string[];
  defaultCurrency: string;
  timeZone: string;
  language: string;
  features: {
    enablePayments: boolean;
    enableNotifications: boolean;
    enableFileUploads: boolean;
    enableReviews: boolean;
    enableMessaging: boolean;
  };
}

export class AdminService {
  /**
   * Get system dashboard statistics
   */
  static async getDashboardStats(): Promise<DashboardStats> {
    return APIClient.get<DashboardStats>('/admin/dashboard-stats/');
  }

  /**
   * Get order analytics
   */
  static async getOrderAnalytics(period?: '7d' | '30d' | '90d' | '1y'): Promise<OrderAnalytics[]> {
    const params = period ? `?period=${period}` : '';
    return APIClient.get<OrderAnalytics[]>(`/admin/order-analytics/${params}`);
  }

  /**
   * Get system health status
   */
  static async getSystemHealth(): Promise<SystemHealth> {
    return APIClient.get<SystemHealth>('/admin/system-health/');
  }

  /**
   * Get system settings
   */
  static async getSystemSettings(): Promise<SystemSettings> {
    return APIClient.get<SystemSettings>('/admin/settings/');
  }

  /**
   * Update system settings
   */
  static async updateSystemSettings(settings: Partial<SystemSettings>): Promise<SystemSettings> {
    return APIClient.patch<SystemSettings>('/admin/settings/', settings);
  }

  /**
   * Get application logs
   */
  static async getApplicationLogs(filters?: {
    level?: 'debug' | 'info' | 'warning' | 'error' | 'critical';
    dateFrom?: string;
    dateTo?: string;
    search?: string;
    limit?: number;
  }): Promise<Array<{
    id: number;
    level: string;
    message: string;
    timestamp: string;
    module: string;
    userId?: number;
    requestId?: string;
    ipAddress?: string;
  }>> {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.level) params.append('level', filters.level);
      if (filters.dateFrom) params.append('date_from', filters.dateFrom);
      if (filters.dateTo) params.append('date_to', filters.dateTo);
      if (filters.search) params.append('search', filters.search);
      if (filters.limit) params.append('limit', filters.limit.toString());
    }
    
    const queryString = params.toString();
    return APIClient.get(`/admin/logs/${queryString ? `?${queryString}` : ''}`);
  }

  /**
   * Clear application logs
   */
  static async clearLogs(olderThan?: string): Promise<{ cleared: number }> {
    const data = olderThan ? { older_than: olderThan } : {};
    return APIClient.post<{ cleared: number }>('/admin/logs/clear/', data);
  }

  /**
   * Export data
   */
  static async exportData(type: 'users' | 'orders' | 'payments' | 'all', format: 'csv' | 'json' | 'xlsx'): Promise<Blob> {
    return APIClient.get<Blob>(`/admin/export/${type}/?format=${format}`, {
      responseType: 'blob'
    });
  }

  /**
   * Import data
   */
  static async importData(file: File, type: 'users' | 'orders'): Promise<{
    success: boolean;
    imported: number;
    errors: Array<{
      row: number;
      error: string;
    }>;
  }> {
    return APIClient.uploadFile(`/admin/import/${type}/`, file);
  }

  /**
   * Create database backup
   */
  static async createBackup(): Promise<{ backupId: string; size: number; createdAt: string }> {
    return APIClient.post('/admin/backup/create/');
  }

  /**
   * Get backup list
   */
  static async getBackups(): Promise<Array<{
    id: string;
    size: number;
    createdAt: string;
    status: 'completed' | 'in_progress' | 'failed';
  }>> {
    return APIClient.get('/admin/backups/');
  }

  /**
   * Download backup
   */
  static async downloadBackup(backupId: string): Promise<Blob> {
    return APIClient.get<Blob>(`/admin/backup/${backupId}/download/`, {
      responseType: 'blob'
    });
  }

  /**
   * Delete backup
   */
  static async deleteBackup(backupId: string): Promise<void> {
    return APIClient.delete<void>(`/admin/backup/${backupId}/`);
  }

  /**
   * Restore from backup
   */
  static async restoreBackup(backupId: string): Promise<{ jobId: string }> {
    return APIClient.post(`/admin/backup/${backupId}/restore/`);
  }

  /**
   * Get server metrics
   */
  static async getServerMetrics(): Promise<{
    cpu: {
      usage: number;
      cores: number;
    };
    memory: {
      used: number;
      total: number;
      usage: number;
    };
    disk: {
      used: number;
      total: number;
      usage: number;
    };
    network: {
      bytesIn: number;
      bytesOut: number;
    };
    activeConnections: number;
    requestsPerMinute: number;
  }> {
    return APIClient.get('/admin/metrics/server/');
  }

  /**
   * Get application metrics
   */
  static async getApplicationMetrics(): Promise<{
    activeUsers: number;
    ordersToday: number;
    revenueToday: number;
    errorRate: number;
    averageResponseTime: number;
    cacheHitRate: number;
    queueSize: number;
  }> {
    return APIClient.get('/admin/metrics/application/');
  }

  /**
   * Send system announcement
   */
  static async sendSystemAnnouncement(data: {
    title: string;
    message: string;
    type: 'info' | 'warning' | 'success' | 'error';
    targetRoles?: string[];
    expiresAt?: string;
    priority: 'low' | 'normal' | 'high' | 'urgent';
  }): Promise<{ announcementId: string }> {
    return APIClient.post('/admin/announcements/', data);
  }

  /**
   * Get system announcements
   */
  static async getSystemAnnouncements(): Promise<Array<{
    id: string;
    title: string;
    message: string;
    type: string;
    targetRoles: string[];
    createdAt: string;
    expiresAt?: string;
    priority: string;
    isActive: boolean;
  }>> {
    return APIClient.get('/admin/announcements/');
  }

  /**
   * Update system announcement
   */
  static async updateSystemAnnouncement(
    id: string,
    data: Partial<{
      title: string;
      message: string;
      type: string;
      targetRoles: string[];
      expiresAt: string;
      priority: string;
      isActive: boolean;
    }>
  ): Promise<void> {
    return APIClient.patch<void>(`/admin/announcements/${id}/`, data);
  }

  /**
   * Delete system announcement
   */
  static async deleteSystemAnnouncement(id: string): Promise<void> {
    return APIClient.delete<void>(`/admin/announcements/${id}/`);
  }

  /**
   * Flush application cache
   */
  static async flushCache(cacheType?: 'all' | 'users' | 'orders' | 'payments'): Promise<{ success: boolean }> {
    const data = cacheType ? { cache_type: cacheType } : {};
    return APIClient.post('/admin/cache/flush/', data);
  }

  /**
   * Get cache statistics
   */
  static async getCacheStats(): Promise<{
    totalKeys: number;
    memoryUsage: number;
    hitRate: number;
    missRate: number;
    cachesByType: Record<string, {
      keys: number;
      memory: number;
      hits: number;
      misses: number;
    }>;
  }> {
    return APIClient.get('/admin/cache/stats/');
  }

  /**
   * Run system maintenance tasks
   */
  static async runMaintenance(tasks: Array<
    'cleanup_logs' | 'optimize_database' | 'clear_expired_sessions' | 'update_statistics'
  >): Promise<{
    results: Record<string, {
      success: boolean;
      message: string;
      duration: number;
    }>;
  }> {
    return APIClient.post('/admin/maintenance/', { tasks });
  }

  /**
   * Get feature usage statistics
   */
  static async getFeatureUsageStats(): Promise<{
    features: Record<string, {
      totalUsage: number;
      activeUsers: number;
      usageByDay: Array<{
        date: string;
        usage: number;
      }>;
    }>;
  }> {
    return APIClient.get('/admin/feature-usage/');
  }

  /**
   * Generate system report
   */
  static async generateSystemReport(
    reportType: 'daily' | 'weekly' | 'monthly',
    format: 'pdf' | 'html' | 'json'
  ): Promise<Blob> {
    return APIClient.get<Blob>(`/admin/reports/${reportType}/?format=${format}`, {
      responseType: 'blob'
    });
  }

  /**
   * Get audit trail
   */
  static async getAuditTrail(filters?: {
    userId?: number;
    action?: string;
    dateFrom?: string;
    dateTo?: string;
    limit?: number;
  }): Promise<Array<{
    id: number;
    userId: number;
    action: string;
    resource: string;
    resourceId?: number;
    details: any;
    ipAddress: string;
    userAgent: string;
    timestamp: string;
  }>> {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.userId) params.append('user_id', filters.userId.toString());
      if (filters.action) params.append('action', filters.action);
      if (filters.dateFrom) params.append('date_from', filters.dateFrom);
      if (filters.dateTo) params.append('date_to', filters.dateTo);
      if (filters.limit) params.append('limit', filters.limit.toString());
    }
    
    const queryString = params.toString();
    return APIClient.get(`/admin/audit-trail/${queryString ? `?${queryString}` : ''}`);
  }
}