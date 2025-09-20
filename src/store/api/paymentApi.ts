import { baseApi } from './baseApi';

export interface Payment {
  id: number;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'cancelled';
  paymentMethod: 'card' | 'paypal' | 'bank_transfer' | 'wallet';
  transactionId?: string;
  order: {
    id: number;
    title: string;
    student: {
      id: number;
      firstName: string;
      lastName: string;
      email: string;
    };
  };
  paymentIntentId?: string;
  refundId?: string;
  failureReason?: string;
  paidAt?: string;
  refundedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: string;
}

export interface CreatePaymentRequest {
  orderId: number;
  paymentMethod: 'card' | 'paypal' | 'bank_transfer';
  amount: number;
  currency?: string;
}

export interface ProcessPaymentRequest {
  paymentIntentId: string;
  paymentMethodId?: string;
}

export interface RefundPaymentRequest {
  amount?: number;
  reason?: string;
}

export interface PaymentFilters {
  status?: string;
  paymentMethod?: string;
  orderId?: number;
  studentId?: number;
  dateFrom?: string;
  dateTo?: string;
  ordering?: string;
  page?: number;
  pageSize?: number;
}

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPayments: builder.query<any, PaymentFilters>({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, String(value));
          }
        });
        return `/payments/?${params.toString()}`;
      },
      providesTags: ['Payment'],
    }),

    getPayment: builder.query<Payment, number>({
      query: (id) => `/payments/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Payment', id }],
    }),

    getOrderPayments: builder.query<Payment[], number>({
      query: (orderId) => `/orders/${orderId}/payments/`,
      providesTags: (result, error, orderId) => [
        { type: 'Payment', id: `ORDER_${orderId}` },
      ],
    }),

    getUserPayments: builder.query<any, { userId?: number; page?: number; pageSize?: number }>({
      query: ({ userId, page = 1, pageSize = 10 }) => {
        const params = new URLSearchParams({ page: String(page), page_size: String(pageSize) });
        if (userId) params.append('user_id', String(userId));
        return `/payments/my-payments/?${params.toString()}`;
      },
      providesTags: ['Payment'],
    }),

    getPaymentStats: builder.query<{
      totalRevenue: number;
      totalPayments: number;
      successfulPayments: number;
      failedPayments: number;
      refundedAmount: number;
      revenueThisMonth: number;
      monthlyStats: { month: string; revenue: number; count: number }[];
    }, { period?: string }>({
      query: ({ period = '12m' } = {}) => `/payments/stats/?period=${period}`,
      providesTags: ['Payment'],
    }),

    createPaymentIntent: builder.mutation<PaymentIntent, CreatePaymentRequest>({
      query: (data) => ({
        url: '/payments/create-intent/',
        method: 'POST',
        body: data,
      }),
    }),

    confirmPayment: builder.mutation<Payment, ProcessPaymentRequest>({
      query: (data) => ({
        url: '/payments/confirm/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Payment', 'Order'],
    }),

    cancelPayment: builder.mutation<Payment, number>({
      query: (paymentId) => ({
        url: `/payments/${paymentId}/cancel/`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, paymentId) => [
        'Payment',
        { type: 'Payment', id: paymentId },
      ],
    }),

    refundPayment: builder.mutation<Payment, { id: number; data: RefundPaymentRequest }>({
      query: ({ id, data }) => ({
        url: `/payments/${id}/refund/`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        'Payment',
        { type: 'Payment', id },
      ],
    }),

    retryPayment: builder.mutation<PaymentIntent, number>({
      query: (paymentId) => ({
        url: `/payments/${paymentId}/retry/`,
        method: 'POST',
      }),
    }),

    downloadPaymentReceipt: builder.mutation<Blob, number>({
      query: (paymentId) => ({
        url: `/payments/${paymentId}/receipt/`,
        method: 'GET',
        responseHandler: (response: any) => response.blob(),
      }),
    }),

    getMyEarnings: builder.query<{
      totalEarnings: number;
      pendingEarnings: number;
      earningsThisMonth: number;
      availableBalance: number;
      monthlyEarnings: { month: string; amount: number }[];
      recentPayments: Payment[];
    }, { period?: string }>({
      query: ({ period = '12m' } = {}) => `/payments/my-earnings/?period=${period}`,
      providesTags: ['Payment'],
    }),
  }),
});

export const {
  useGetPaymentsQuery,
  useGetPaymentQuery,
  useGetOrderPaymentsQuery,
  useGetUserPaymentsQuery,
  useGetPaymentStatsQuery,
  useCreatePaymentIntentMutation,
  useConfirmPaymentMutation,
  useCancelPaymentMutation,
  useRefundPaymentMutation,
  useRetryPaymentMutation,
  useDownloadPaymentReceiptMutation,
  useGetMyEarningsQuery,
} = paymentApi;