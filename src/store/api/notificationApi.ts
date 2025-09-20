import { baseApi, buildQueryParams, transformPaginatedResponse } from './baseApi';
import type { FilterableQuery } from './baseApi';
import type { 
  Notification,
  PaginatedResponse
} from '@/types/api';

export interface NotificationFilters {
  type?: string[];
  isRead?: boolean;
  dateFrom?: string;
  dateTo?: string;
}

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Notification management
    getNotifications: builder.query<
      PaginatedResponse<Notification>,
      FilterableQuery<NotificationFilters>
    >({
      query: (params = {}) => {
        const { filters, ...pagination } = params;
        const queryParams = { ...pagination, ...filters };
        const queryString = buildQueryParams(queryParams);
        return `/notifications/${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: (result) =>
        result?.results
          ? [
              ...result.results.map(({ id }) => ({ type: 'Notification' as const, id })),
              { type: 'Notification', id: 'LIST' },
            ]
          : [{ type: 'Notification', id: 'LIST' }],
    }),

    getNotification: builder.query<Notification, number>({
      query: (id) => `/notifications/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Notification', id }],
    }),

    // Notification status updates
    markAsRead: builder.mutation<Notification, number>({
      query: (id) => ({
        url: `/notifications/${id}/`,
        method: 'PATCH',
        body: { is_read: true },
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Notification', id },
        { type: 'Notification', id: 'LIST' },
      ],
      // Optimistic update
      onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          notificationApi.util.updateQueryData('getNotifications', {}, (draft) => {
            const notification = draft.results?.find((n) => n.id === id);
            if (notification) {
              notification.isRead = true;
            }
          })
        );
        queryFulfilled.catch(patchResult.undo);
      },
    }),

    markAsUnread: builder.mutation<Notification, number>({
      query: (id) => ({
        url: `/notifications/${id}/`,
        method: 'PATCH',
        body: { is_read: false },
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Notification', id },
        { type: 'Notification', id: 'LIST' },
      ],
      // Optimistic update
      onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          notificationApi.util.updateQueryData('getNotifications', {}, (draft) => {
            const notification = draft.results?.find((n) => n.id === id);
            if (notification) {
              notification.isRead = false;
            }
          })
        );
        queryFulfilled.catch(patchResult.undo);
      },
    }),

    markAllAsRead: builder.mutation<{ updated: number }, void>({
      query: () => ({
        url: '/notifications/mark-all-read/',
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'Notification', id: 'LIST' }],
      // Optimistic update
      onQueryStarted(_, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          notificationApi.util.updateQueryData('getNotifications', {}, (draft) => {
            if (draft.results) {
              draft.results.forEach((notification) => {
                notification.isRead = true;
              });
            }
          })
        );
        queryFulfilled.catch(patchResult.undo);
      },
    }),

    deleteNotification: builder.mutation<void, number>({
      query: (id) => ({
        url: `/notifications/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Notification', id },
        { type: 'Notification', id: 'LIST' },
      ],
      // Optimistic update
      onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          notificationApi.util.updateQueryData('getNotifications', {}, (draft) => {
            if (draft.results) {
              const index = draft.results.findIndex((n) => n.id === id);
              if (index !== -1) {
                draft.results.splice(index, 1);
                draft.count = (draft.count || 0) - 1;
              }
            }
          })
        );
        queryFulfilled.catch(patchResult.undo);
      },
    }),

    deleteAllNotifications: builder.mutation<{ deleted: number }, void>({
      query: () => ({
        url: '/notifications/delete-all/',
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Notification', id: 'LIST' }],
    }),

    // Notification counts
    getUnreadCount: builder.query<{ count: number }, void>({
      query: () => '/notifications/unread-count/',
      providesTags: [{ type: 'Notification', id: 'COUNT' }],
    }),

    // Notification preferences
    getNotificationPreferences: builder.query<{
      emailNotifications: boolean;
      pushNotifications: boolean;
      smsNotifications: boolean;
      orderUpdates: boolean;
      paymentNotifications: boolean;
      marketingEmails: boolean;
      weeklyDigest: boolean;
      instantNotifications: boolean;
    }, void>({
      query: () => '/notifications/preferences/',
      providesTags: [{ type: 'Notification', id: 'PREFERENCES' }],
    }),

    updateNotificationPreferences: builder.mutation<void, {
      emailNotifications?: boolean;
      pushNotifications?: boolean;
      smsNotifications?: boolean;
      orderUpdates?: boolean;
      paymentNotifications?: boolean;
      marketingEmails?: boolean;
      weeklyDigest?: boolean;
      instantNotifications?: boolean;
    }>({
      query: (preferences) => ({
        url: '/notifications/preferences/',
        method: 'PATCH',
        body: preferences,
      }),
      invalidatesTags: [{ type: 'Notification', id: 'PREFERENCES' }],
    }),

    // Admin notification management
    sendNotification: builder.mutation<Notification, {
      userId: number;
      type: string;
      title: string;
      message: string;
      data?: any;
      sendEmail?: boolean;
      sendPush?: boolean;
      sendSms?: boolean;
    }>({
      query: (data) => ({
        url: '/notifications/send/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Notification', id: 'LIST' }],
    }),

    sendBulkNotification: builder.mutation<
      { sent: number; failed: number },
      {
        userIds?: number[];
        userRoles?: string[];
        type: string;
        title: string;
        message: string;
        data?: any;
        sendEmail?: boolean;
        sendPush?: boolean;
        sendSms?: boolean;
      }
    >({
      query: (data) => ({
        url: '/notifications/send-bulk/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Notification', id: 'LIST' }],
    }),

    // Notification templates (admin only)
    getNotificationTemplates: builder.query<Array<{
      id: number;
      name: string;
      type: string;
      title: string;
      message: string;
      isActive: boolean;
    }>, void>({
      query: () => '/notifications/templates/',
      providesTags: [{ type: 'Notification', id: 'TEMPLATES' }],
    }),

    createNotificationTemplate: builder.mutation<any, {
      name: string;
      type: string;
      title: string;
      message: string;
      isActive?: boolean;
    }>({
      query: (data) => ({
        url: '/notifications/templates/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Notification', id: 'TEMPLATES' }],
    }),

    updateNotificationTemplate: builder.mutation<any, {
      id: number;
      data: Partial<{
        name: string;
        type: string;
        title: string;
        message: string;
        isActive: boolean;
      }>;
    }>({
      query: ({ id, data }) => ({
        url: `/notifications/templates/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: [{ type: 'Notification', id: 'TEMPLATES' }],
    }),

    deleteNotificationTemplate: builder.mutation<void, number>({
      query: (id) => ({
        url: `/notifications/templates/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Notification', id: 'TEMPLATES' }],
    }),

    // Push notification subscription
    subscribeToPushNotifications: builder.mutation<void, {
      endpoint: string;
      keys: {
        p256dh: string;
        auth: string;
      };
    }>({
      query: (subscription) => ({
        url: '/notifications/push-subscribe/',
        method: 'POST',
        body: { subscription },
      }),
      invalidatesTags: [{ type: 'Notification', id: 'PREFERENCES' }],
    }),

    unsubscribeFromPushNotifications: builder.mutation<void, string>({
      query: (endpoint) => ({
        url: '/notifications/push-unsubscribe/',
        method: 'POST',
        body: { endpoint },
      }),
      invalidatesTags: [{ type: 'Notification', id: 'PREFERENCES' }],
    }),

    // Recent activity
    getRecentActivity: builder.query<Notification[], { limit?: number }>({
      query: ({ limit = 10 }) => `/notifications/recent/?limit=${limit}`,
      providesTags: [{ type: 'Notification', id: 'RECENT' }],
    }),

    // Scheduled notifications (admin only)
    scheduleNotification: builder.mutation<{ scheduledId: string }, {
      userId: number;
      type: string;
      title: string;
      message: string;
      scheduledFor: string;
      data?: any;
    }>({
      query: (data) => ({
        url: '/notifications/schedule/',
        method: 'POST',
        body: data,
      }),
    }),

    cancelScheduledNotification: builder.mutation<void, string>({
      query: (scheduledId) => ({
        url: `/notifications/schedule/${scheduledId}/`,
        method: 'DELETE',
      }),
    }),

    getScheduledNotifications: builder.query<Array<{
      id: string;
      userId: number;
      type: string;
      title: string;
      message: string;
      scheduledFor: string;
      status: string;
    }>, void>({
      query: () => '/notifications/scheduled/',
    }),

    // Notification testing (admin only)
    testNotificationDelivery: builder.mutation<
      { success: boolean; details: string },
      {
        userId: number;
        type: 'email' | 'push' | 'sms';
        message: string;
      }
    >({
      query: (data) => ({
        url: '/notifications/test/',
        method: 'POST',
        body: data,
      }),
    }),

    // Notification statistics (admin only)
    getNotificationStats: builder.query<{
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
    }, { period?: '7d' | '30d' | '90d' }>({
      query: ({ period = '30d' }) => `/notifications/stats/?period=${period}`,
      providesTags: ['DashboardStats'],
    }),

    // Real-time notification polling
    pollNotifications: builder.query<{
      notifications: Notification[];
      unreadCount: number;
      lastUpdated: string;
    }, { lastPoll?: string }>({
      query: ({ lastPoll }) => {
        const params = lastPoll ? `?since=${lastPoll}` : '';
        return `/notifications/poll/${params}`;
      },
      providesTags: [{ type: 'Notification', id: 'POLL' }],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetNotificationQuery,
  useMarkAsReadMutation,
  useMarkAsUnreadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  useDeleteAllNotificationsMutation,
  useGetUnreadCountQuery,
  useGetNotificationPreferencesQuery,
  useUpdateNotificationPreferencesMutation,
  useSendNotificationMutation,
  useSendBulkNotificationMutation,
  useGetNotificationTemplatesQuery,
  useCreateNotificationTemplateMutation,
  useUpdateNotificationTemplateMutation,
  useDeleteNotificationTemplateMutation,
  useSubscribeToPushNotificationsMutation,
  useUnsubscribeFromPushNotificationsMutation,
  useGetRecentActivityQuery,
  useScheduleNotificationMutation,
  useCancelScheduledNotificationMutation,
  useGetScheduledNotificationsQuery,
  useTestNotificationDeliveryMutation,
  useGetNotificationStatsQuery,
  usePollNotificationsQuery,
} = notificationApi;