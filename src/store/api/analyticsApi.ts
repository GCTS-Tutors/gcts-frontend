import { baseApi } from './baseApi';

export interface AnalyticsStats {
  overview: {
    totalOrders: number;
    totalRevenue: number;
    totalUsers: number;
    totalWriters: number;
    averageOrderValue: number;
    completionRate: number;
  };
  ordersByStatus: { [key: string]: number };
  ordersByMonth: { month: string; orders: number; revenue: number }[];
  ordersByCategory: { category: string; count: number; percentage: number }[];
  topWriters: {
    id: number;
    name: string;
    completedOrders: number;
    totalRevenue: number;
    averageRating: number;
  }[];
  topSubjects: {
    name: string;
    orderCount: number;
    revenue: number;
  }[];
  userGrowth: { month: string; newUsers: number; totalUsers: number }[];
  revenueBreakdown: {
    byPaymentMethod: { method: string; amount: number; percentage: number }[];
    byAcademicLevel: { level: string; amount: number; percentage: number }[];
  };
  performance: {
    averageCompletionTime: number;
    onTimeDeliveryRate: number;
    customerSatisfactionScore: number;
    refundRate: number;
  };
}

export interface AnalyticsFilters {
  dateFrom?: string;
  dateTo?: string;
  period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  userId?: number;
  writerId?: number;
  subject?: string;
  academicLevel?: string;
}

export const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAnalytics: builder.query<AnalyticsStats, AnalyticsFilters>({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, String(value));
          }
        });
        return `/analytics/?${params.toString()}`;
      },
      providesTags: ['DashboardStats'],
    }),

    getOrderTrends: builder.query<{
      labels: string[];
      datasets: {
        label: string;
        data: number[];
        borderColor: string;
        backgroundColor: string;
      }[];
    }, AnalyticsFilters>({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, String(value));
          }
        });
        return `/analytics/order-trends/?${params.toString()}`;
      },
      providesTags: ['DashboardStats'],
    }),

    getRevenueTrends: builder.query<{
      labels: string[];
      datasets: {
        label: string;
        data: number[];
        borderColor: string;
        backgroundColor: string;
      }[];
    }, AnalyticsFilters>({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, String(value));
          }
        });
        return `/analytics/revenue-trends/?${params.toString()}`;
      },
      providesTags: ['DashboardStats'],
    }),

    getUserMetrics: builder.query<{
      activeUsers: number;
      newSignups: number;
      userRetentionRate: number;
      averageSessionDuration: number;
      usersByRole: { role: string; count: number }[];
      userGrowthTrend: { date: string; users: number }[];
    }, AnalyticsFilters>({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, String(value));
          }
        });
        return `/analytics/user-metrics/?${params.toString()}`;
      },
      providesTags: ['DashboardStats'],
    }),

    getWriterPerformance: builder.query<{
      topPerformers: {
        id: number;
        name: string;
        completedOrders: number;
        averageRating: number;
        totalEarnings: number;
        onTimeRate: number;
      }[];
      performanceMetrics: {
        averageCompletionTime: number;
        qualityScore: number;
        clientSatisfaction: number;
      };
      activityTrend: { date: string; completedOrders: number }[];
    }, AnalyticsFilters>({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, String(value));
          }
        });
        return `/analytics/writer-performance/?${params.toString()}`;
      },
      providesTags: ['DashboardStats'],
    }),

    exportAnalytics: builder.mutation<Blob, AnalyticsFilters>({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, String(value));
          }
        });
        return {
          url: `/analytics/export/?${params.toString()}`,
          method: 'GET',
          responseHandler: (response: any) => response.blob(),
        };
      },
    }),
  }),
});

export const {
  useGetAnalyticsQuery,
  useGetOrderTrendsQuery,
  useGetRevenueTrendsQuery,
  useGetUserMetricsQuery,
  useGetWriterPerformanceQuery,
  useExportAnalyticsMutation,
} = analyticsApi;