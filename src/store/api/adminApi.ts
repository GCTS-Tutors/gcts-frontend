import { baseApi, buildQueryParams } from './baseApi';
import type { DashboardStats, OrderAnalytics } from '@/types/api';
import type { SystemHealth, SystemSettings } from '@/services/adminService';

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Dashboard and analytics
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => '/admin/dashboard-stats/',
      providesTags: ['DashboardStats'],
    }),

    getAdminOrderAnalytics: builder.query<
      OrderAnalytics[],
      { period?: '7d' | '30d' | '90d' | '1y' }
    >({
      query: ({ period = '30d' }) => `/admin/order-analytics/?period=${period}`,
      providesTags: ['DashboardStats'],
    }),

    // System management
    getSystemHealth: builder.query<SystemHealth, void>({
      query: () => '/admin/system-health/',
      providesTags: ['SystemHealth'],
    }),

    getSystemSettings: builder.query<SystemSettings, void>({
      query: () => '/admin/settings/',
      providesTags: ['SystemHealth'],
    }),

    updateSystemSettings: builder.mutation<SystemSettings, Partial<SystemSettings>>({
      query: (settings) => ({
        url: '/admin/settings/',
        method: 'PATCH',
        body: settings,
      }),
      invalidatesTags: ['SystemHealth'],
    }),

    // Application logs
    getApplicationLogs: builder.query<Array<{
      id: number;
      level: string;
      message: string;
      timestamp: string;
      module: string;
      userId?: number;
      requestId?: string;
      ipAddress?: string;
    }>, {
      level?: 'debug' | 'info' | 'warning' | 'error' | 'critical';
      dateFrom?: string;
      dateTo?: string;
      search?: string;
      limit?: number;
    }>({
      query: (filters) => {
        const queryString = buildQueryParams(filters || {});
        return `/admin/logs/${queryString ? `?${queryString}` : ''}`;
      },
    }),

    clearLogs: builder.mutation<{ cleared: number }, { olderThan?: string }>({
      query: ({ olderThan }) => ({
        url: '/admin/logs/clear/',
        method: 'POST',
        body: olderThan ? { older_than: olderThan } : {},
      }),
    }),

    // Data import/export
    exportData: builder.mutation<Blob, {
      type: 'users' | 'orders' | 'payments' | 'all';
      format: 'csv' | 'json' | 'xlsx';
    }>({
      query: ({ type, format }) => ({
        url: `/admin/export/${type}/?format=${format}`,
        method: 'GET',
        responseType: 'blob',
      }),
    }),

    importData: builder.mutation<{
      success: boolean;
      imported: number;
      errors: Array<{
        row: number;
        error: string;
      }>;
    }, {
      file: File;
      type: 'users' | 'orders';
    }>({
      query: ({ file, type }) => {
        const formData = new FormData();
        formData.append('file', file);
        
        return {
          url: `/admin/import/${type}/`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['User', 'Order', 'DashboardStats'],
    }),

    // Backup management
    createBackup: builder.mutation<{
      backupId: string;
      size: number;
      createdAt: string;
    }, void>({
      query: () => ({
        url: '/admin/backup/create/',
        method: 'POST',
      }),
    }),

    getBackups: builder.query<Array<{
      id: string;
      size: number;
      createdAt: string;
      status: 'completed' | 'in_progress' | 'failed';
    }>, void>({
      query: () => '/admin/backups/',
    }),

    downloadBackup: builder.query<Blob, string>({
      query: (backupId) => ({
        url: `/admin/backup/${backupId}/download/`,
        responseType: 'blob',
      }),
    }),

    deleteBackup: builder.mutation<void, string>({
      query: (backupId) => ({
        url: `/admin/backup/${backupId}/`,
        method: 'DELETE',
      }),
    }),

    restoreBackup: builder.mutation<{ jobId: string }, string>({
      query: (backupId) => ({
        url: `/admin/backup/${backupId}/restore/`,
        method: 'POST',
      }),
      invalidatesTags: ['User', 'Order', 'Payment', 'DashboardStats'],
    }),

    // Server and application metrics
    getServerMetrics: builder.query<{
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
    }, void>({
      query: () => '/admin/metrics/server/',
    }),

    getApplicationMetrics: builder.query<{
      activeUsers: number;
      ordersToday: number;
      revenueToday: number;
      errorRate: number;
      averageResponseTime: number;
      cacheHitRate: number;
      queueSize: number;
    }, void>({
      query: () => '/admin/metrics/application/',
      providesTags: ['DashboardStats'],
    }),

    // System announcements
    getSystemAnnouncements: builder.query<Array<{
      id: string;
      title: string;
      message: string;
      type: string;
      targetRoles: string[];
      createdAt: string;
      expiresAt?: string;
      priority: string;
      isActive: boolean;
    }>, void>({
      query: () => '/admin/announcements/',
    }),

    sendSystemAnnouncement: builder.mutation<{ announcementId: string }, {
      title: string;
      message: string;
      type: 'info' | 'warning' | 'success' | 'error';
      targetRoles?: string[];
      expiresAt?: string;
      priority: 'low' | 'normal' | 'high' | 'urgent';
    }>({
      query: (data) => ({
        url: '/admin/announcements/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Notification'],
    }),

    updateSystemAnnouncement: builder.mutation<void, {
      id: string;
      data: Partial<{
        title: string;
        message: string;
        type: string;
        targetRoles: string[];
        expiresAt: string;
        priority: string;
        isActive: boolean;
      }>;
    }>({
      query: ({ id, data }) => ({
        url: `/admin/announcements/${id}/`,
        method: 'PATCH',
        body: data,
      }),
    }),

    deleteSystemAnnouncement: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/announcements/${id}/`,
        method: 'DELETE',
      }),
    }),

    // Cache management
    flushCache: builder.mutation<{ success: boolean }, {
      cacheType?: 'all' | 'users' | 'orders' | 'payments';
    }>({
      query: ({ cacheType }) => ({
        url: '/admin/cache/flush/',
        method: 'POST',
        body: cacheType ? { cache_type: cacheType } : {},
      }),
      invalidatesTags: ['User', 'Order', 'Payment', 'Notification'],
    }),

    getCacheStats: builder.query<{
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
    }, void>({
      query: () => '/admin/cache/stats/',
    }),

    // System maintenance
    runMaintenance: builder.mutation<{
      results: Record<string, {
        success: boolean;
        message: string;
        duration: number;
      }>;
    }, Array<'cleanup_logs' | 'optimize_database' | 'clear_expired_sessions' | 'update_statistics'>>({
      query: (tasks) => ({
        url: '/admin/maintenance/',
        method: 'POST',
        body: { tasks },
      }),
      invalidatesTags: ['DashboardStats'],
    }),

    // Feature usage statistics
    getFeatureUsageStats: builder.query<{
      features: Record<string, {
        totalUsage: number;
        activeUsers: number;
        usageByDay: Array<{
          date: string;
          usage: number;
        }>;
      }>;
    }, void>({
      query: () => '/admin/feature-usage/',
      providesTags: ['DashboardStats'],
    }),

    // Report generation
    generateSystemReport: builder.mutation<Blob, {
      reportType: 'daily' | 'weekly' | 'monthly';
      format: 'pdf' | 'html' | 'json';
    }>({
      query: ({ reportType, format }) => ({
        url: `/admin/reports/${reportType}/?format=${format}`,
        method: 'GET',
        responseType: 'blob',
      }),
    }),

    // Audit trail
    getAuditTrail: builder.query<Array<{
      id: number;
      userId: number;
      action: string;
      resource: string;
      resourceId?: number;
      details: any;
      ipAddress: string;
      userAgent: string;
      timestamp: string;
    }>, {
      userId?: number;
      action?: string;
      dateFrom?: string;
      dateTo?: string;
      limit?: number;
    }>({
      query: (filters) => {
        const queryString = buildQueryParams(filters || {});
        return `/admin/audit-trail/${queryString ? `?${queryString}` : ''}`;
      },
    }),

    // Security monitoring
    getSecurityEvents: builder.query<Array<{
      id: number;
      type: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
      description: string;
      userId?: number;
      ipAddress: string;
      timestamp: string;
      resolved: boolean;
    }>, {
      type?: string;
      severity?: string;
      resolved?: boolean;
      dateFrom?: string;
      dateTo?: string;
    }>({
      query: (filters) => {
        const queryString = buildQueryParams(filters || {});
        return `/admin/security-events/${queryString ? `?${queryString}` : ''}`;
      },
    }),

    resolveSecurityEvent: builder.mutation<void, { id: number; resolution: string }>({
      query: ({ id, resolution }) => ({
        url: `/admin/security-events/${id}/resolve/`,
        method: 'POST',
        body: { resolution },
      }),
    }),

    // API rate limiting
    getApiUsageStats: builder.query<{
      totalRequests: number;
      requestsPerMinute: number;
      topEndpoints: Array<{
        endpoint: string;
        requests: number;
        averageResponseTime: number;
      }>;
      errorRate: number;
      rateLimitedRequests: number;
    }, { period?: '1h' | '24h' | '7d' }>({
      query: ({ period = '24h' }) => `/admin/api-usage/?period=${period}`,
    }),

    updateRateLimits: builder.mutation<void, {
      endpoint?: string;
      requestsPerMinute: number;
      burstLimit?: number;
    }>({
      query: (data) => ({
        url: '/admin/rate-limits/',
        method: 'POST',
        body: data,
      }),
    }),

    // Database management
    getDatabaseStats: builder.query<{
      totalSize: number;
      tableStats: Array<{
        name: string;
        rows: number;
        size: number;
      }>;
      slowQueries: Array<{
        query: string;
        averageTime: number;
        count: number;
      }>;
      connections: {
        active: number;
        idle: number;
        total: number;
      };
    }, void>({
      query: () => '/admin/database/stats/',
    }),

    optimizeDatabase: builder.mutation<{
      success: boolean;
      message: string;
      duration: number;
    }, void>({
      query: () => ({
        url: '/admin/database/optimize/',
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetAdminOrderAnalyticsQuery,
  useGetSystemHealthQuery,
  useGetSystemSettingsQuery,
  useUpdateSystemSettingsMutation,
  useGetApplicationLogsQuery,
  useClearLogsMutation,
  useExportDataMutation,
  useImportDataMutation,
  useCreateBackupMutation,
  useGetBackupsQuery,
  useLazyDownloadBackupQuery,
  useDeleteBackupMutation,
  useRestoreBackupMutation,
  useGetServerMetricsQuery,
  useGetApplicationMetricsQuery,
  useGetSystemAnnouncementsQuery,
  useSendSystemAnnouncementMutation,
  useUpdateSystemAnnouncementMutation,
  useDeleteSystemAnnouncementMutation,
  useFlushCacheMutation,
  useGetCacheStatsQuery,
  useRunMaintenanceMutation,
  useGetFeatureUsageStatsQuery,
  useGenerateSystemReportMutation,
  useGetAuditTrailQuery,
  useGetSecurityEventsQuery,
  useResolveSecurityEventMutation,
  useGetApiUsageStatsQuery,
  useUpdateRateLimitsMutation,
  useGetDatabaseStatsQuery,
  useOptimizeDatabaseMutation,
} = adminApi;