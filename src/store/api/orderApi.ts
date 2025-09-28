import { baseApi, buildQueryParams } from './baseApi';
import type { FilterableQuery } from './baseApi';
import type { 
  Order, 
  OrderFile,
  OrderComment,
  CreateOrderRequest,
  PaginatedResponse
} from '@/types/api';

export interface OrderFilters {
  status?: string[];
  subject?: string[];
  priority?: string[];
  assignedTo?: number[];
  createdAfter?: string;
  createdBefore?: string;
  dueAfter?: string;
  dueBefore?: string;
  search?: string;
  myOrders?: boolean; // For students to filter their own orders
  assignedToMe?: boolean; // For writers to filter orders assigned to them
}

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Order CRUD operations
    getOrders: builder.query<
      PaginatedResponse<Order>,
      FilterableQuery<OrderFilters>
    >({
      query: (params = {}) => {
        const { filters, ...pagination } = params;
        const queryParams = { ...pagination, ...filters };
        const queryString = buildQueryParams(queryParams);
        return `/orders/${queryString ? `?${queryString}` : ''}`;
      },
      transformResponse: (response: any): PaginatedResponse<Order> => {
        // Handle the new backend response format
        if (response.success && response.data && response.meta?.pagination) {
          return {
            count: response.meta.pagination.total_items,
            next: response.meta.pagination.next_url || null,
            previous: response.meta.pagination.previous_url || null,
            results: response.data,
          };
        }
        // Fallback for old format
        return response;
      },
      providesTags: (result) =>
        result?.results
          ? [
              ...result.results.map(({ id }) => ({ type: 'Order' as const, id })),
              { type: 'Order', id: 'LIST' },
            ]
          : [{ type: 'Order', id: 'LIST' }],
    }),

    getOrder: builder.query<Order, string>({
      query: (id) => `/orders/${id}/`,
      transformResponse: (response: any): Order => {
        // Handle the new backend response format
        if (response.success && response.data) {
          return response.data;
        }
        // Fallback for old format
        return response;
      },
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),

    createOrder: builder.mutation<Order, CreateOrderRequest>({
      query: (orderData) => ({
        url: '/orders/',
        method: 'POST',
        body: orderData,
      }),
      transformResponse: (response: any): Order => {
        // Handle the new backend response format
        if (response.success && response.data) {
          return response.data;
        }
        // Fallback for old format
        return response;
      },
      invalidatesTags: [{ type: 'Order', id: 'LIST' }, 'DashboardStats'],
    }),

    updateOrder: builder.mutation<Order, { id: string; data: Partial<Order> }>({
      query: ({ id, data }) => ({
        url: `/orders/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Order', id },
        { type: 'Order', id: 'LIST' },
        'DashboardStats',
      ],
    }),

    deleteOrder: builder.mutation<void, string>({
      query: (id) => ({
        url: `/orders/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Order', id },
        { type: 'Order', id: 'LIST' },
        'DashboardStats',
      ],
    }),

    // Order status management
    updateOrderStatus: builder.mutation<
      Order,
      { id: string; status: string; notes?: string }
    >({
      query: ({ id, status, notes }) => ({
        url: `/orders/${id}/status/`,
        method: 'PATCH',
        body: { status, notes },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Order', id },
        { type: 'Order', id: 'LIST' },
        'DashboardStats',
      ],
    }),

    assignOrder: builder.mutation<Order, { id: string; writerId: number }>({
      query: ({ id, writerId }) => ({
        url: `/orders/${id}/assign/`,
        method: 'POST',
        body: { writer_id: writerId },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Order', id },
        { type: 'Order', id: 'LIST' },
        'DashboardStats',
      ],
    }),

    unassignOrder: builder.mutation<Order, string>({
      query: (id) => ({
        url: `/orders/${id}/unassign/`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Order', id },
        { type: 'Order', id: 'LIST' },
        'DashboardStats',
      ],
    }),

    // Order files
    getOrderFiles: builder.query<OrderFile[], string>({
      query: (orderId) => `/orders/${orderId}/files/`,
      providesTags: (result, error, orderId) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'OrderFile' as const, id })),
              { type: 'OrderFile', id: orderId },
            ]
          : [{ type: 'OrderFile', id: orderId }],
    }),

    uploadOrderFile: builder.mutation<
      OrderFile,
      { orderId: string; file: File; description?: string }
    >({
      query: ({ orderId, file, description }) => {
        const formData = new FormData();
        formData.append('file', file);
        if (description) formData.append('description', description);
        
        return {
          url: `/orders/${orderId}/files/`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: (result, error, { orderId }) => [
        { type: 'OrderFile', id: orderId },
        { type: 'Order', id: orderId },
      ],
    }),

    deleteOrderFile: builder.mutation<void, { orderId: string; fileId: number }>({
      query: ({ orderId, fileId }) => ({
        url: `/orders/${orderId}/files/${fileId}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { orderId, fileId }) => [
        { type: 'OrderFile', id: fileId },
        { type: 'OrderFile', id: orderId },
        { type: 'Order', id: orderId },
      ],
    }),

    downloadOrderFile: builder.query<Blob, { orderId: string; fileId: number }>({
      query: ({ orderId, fileId }) => ({
        url: `/orders/${orderId}/files/${fileId}/download/`,
        responseType: 'blob',
      }),
    }),

    // Order comments
    getOrderComments: builder.query<OrderComment[], string>({
      query: (orderId) => `/orders/${orderId}/comments/`,
      providesTags: (result, error, orderId) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'OrderComment' as const, id })),
              { type: 'OrderComment', id: orderId },
            ]
          : [{ type: 'OrderComment', id: orderId }],
    }),

    addOrderComment: builder.mutation<
      OrderComment,
      { orderId: string; content: string; isPrivate?: boolean }
    >({
      query: ({ orderId, content, isPrivate = false }) => ({
        url: `/orders/${orderId}/comments/`,
        method: 'POST',
        body: { content, is_private: isPrivate },
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: 'OrderComment', id: orderId },
        { type: 'Order', id: orderId },
      ],
    }),

    updateOrderComment: builder.mutation<
      OrderComment,
      { orderId: string; commentId: number; content: string }
    >({
      query: ({ orderId, commentId, content }) => ({
        url: `/orders/${orderId}/comments/${commentId}/`,
        method: 'PATCH',
        body: { content },
      }),
      invalidatesTags: (result, error, { orderId, commentId }) => [
        { type: 'OrderComment', id: commentId },
        { type: 'OrderComment', id: orderId },
      ],
    }),

    deleteOrderComment: builder.mutation<
      void,
      { orderId: string; commentId: number }
    >({
      query: ({ orderId, commentId }) => ({
        url: `/orders/${orderId}/comments/${commentId}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { orderId, commentId }) => [
        { type: 'OrderComment', id: commentId },
        { type: 'OrderComment', id: orderId },
      ],
    }),

    // Order submission
    submitOrder: builder.mutation<Order, { id: string; files: File[]; notes?: string }>({
      query: ({ id, files, notes }) => {
        const formData = new FormData();
        files.forEach((file, index) => {
          formData.append(`file_${index}`, file);
        });
        if (notes) formData.append('notes', notes);
        
        return {
          url: `/orders/${id}/submit/`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: 'Order', id },
        { type: 'Order', id: 'LIST' },
        { type: 'OrderFile', id },
        'DashboardStats',
      ],
    }),

    // Order approval/rejection
    approveOrder: builder.mutation<Order, { id: string; feedback?: string }>({
      query: ({ id, feedback }) => ({
        url: `/orders/${id}/approve/`,
        method: 'POST',
        body: feedback ? { feedback } : {},
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Order', id },
        { type: 'Order', id: 'LIST' },
        'DashboardStats',
      ],
    }),

    rejectOrder: builder.mutation<Order, { id: string; reason: string }>({
      query: ({ id, reason }) => ({
        url: `/orders/${id}/reject/`,
        method: 'POST',
        body: { reason },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Order', id },
        { type: 'Order', id: 'LIST' },
        'DashboardStats',
      ],
    }),

    requestRevision: builder.mutation<Order, { id: string; feedback: string }>({
      query: ({ id, feedback }) => ({
        url: `/orders/${id}/request-revision/`,
        method: 'POST',
        body: { feedback },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Order', id },
        { type: 'Order', id: 'LIST' },
        'DashboardStats',
      ],
    }),

    // Order analytics - using dashboard endpoint
    getMyOrderStats: builder.query<{
      total: number;
      pending: number;
      inProgress: number;
      completed: number;
      cancelled: number;
      totalEarnings?: number;
      averageRating?: number;
    }, void>({
      query: () => '/dashboard/',
      providesTags: ['DashboardStats'],
      transformResponse: (response: any) => {
        // Transform dashboard response to expected format
        return {
          total: response.totalOrders || response.myOrdersCount || 0,
          pending: response.pendingOrders || 0,
          inProgress: response.activeOrders || response.inProgressOrders || 0,
          completed: response.completedOrders || 0,
          cancelled: response.cancelledOrders || 0,
          totalEarnings: response.totalEarnings || response.totalRevenue,
          averageRating: response.averageRating,
        };
      },
    }),

    getOrderAnalytics: builder.query<
      Array<{
        date: string;
        total: number;
        completed: number;
        revenue: number;
      }>,
      { period?: '7d' | '30d' | '90d' | '1y' }
    >({
      query: ({ period = '30d' }) => `/orders/analytics/?period=${period}`,
      providesTags: ['DashboardStats'],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useUpdateOrderStatusMutation,
  useAssignOrderMutation,
  useUnassignOrderMutation,
  useGetOrderFilesQuery,
  useUploadOrderFileMutation,
  useDeleteOrderFileMutation,
  useLazyDownloadOrderFileQuery,
  useGetOrderCommentsQuery,
  useAddOrderCommentMutation,
  useUpdateOrderCommentMutation,
  useDeleteOrderCommentMutation,
  useSubmitOrderMutation,
  useApproveOrderMutation,
  useRejectOrderMutation,
  useRequestRevisionMutation,
  useGetMyOrderStatsQuery,
  useGetOrderAnalyticsQuery,
} = orderApi;