import { baseApi } from './baseApi';

export interface Review {
  id: number;
  rating: number;
  comment: string;
  student: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  writer: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    rating?: number;
    totalReviews?: number;
  };
  order: {
    id: number;
    title: string;
    status: string;
  };
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewRequest {
  rating: number;
  comment: string;
  orderId: number;
  isPublic?: boolean;
}

export interface UpdateReviewRequest {
  rating?: number;
  comment?: string;
  isPublic?: boolean;
}

export interface ReviewFilters {
  rating?: number;
  writerId?: number;
  studentId?: number;
  isPublic?: boolean;
  page?: number;
  pageSize?: number;
}

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReviews: builder.query<any, ReviewFilters>({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, String(value));
          }
        });
        return `/reviews/?${params.toString()}`;
      },
      providesTags: ['Review'],
    }),
    
    getOrderReview: builder.query<Review, number>({
      query: (orderId) => `/orders/${orderId}/review/`,
      providesTags: (result, error, orderId) => [
        { type: 'Review', id: `ORDER_${orderId}` },
      ],
    }),
    
    getWriterReviews: builder.query<any, { writerId: number; page?: number; pageSize?: number }>({
      query: ({ writerId, page = 1, pageSize = 10 }) => 
        `/writers/${writerId}/reviews/?page=${page}&page_size=${pageSize}`,
      providesTags: (result, error, { writerId }) => [
        { type: 'Review', id: `WRITER_${writerId}` },
      ],
    }),
    
    getWriterRatingStats: builder.query<{
      averageRating: number;
      totalReviews: number;
      ratingBreakdown: { [key: number]: number };
    }, number>({
      query: (writerId) => `/writers/${writerId}/rating-stats/`,
      providesTags: (result, error, writerId) => [
        { type: 'Review', id: `WRITER_STATS_${writerId}` },
      ],
    }),
    
    createReview: builder.mutation<Review, CreateReviewRequest>({
      query: (data) => ({
        url: `/orders/${data.orderId}/review/`,
        method: 'POST',
        body: {
          rating: data.rating,
          comment: data.comment,
          isPublic: data.isPublic ?? true,
        },
      }),
      invalidatesTags: (result, error, { orderId }) => [
        'Review',
        { type: 'Review', id: `ORDER_${orderId}` },
        { type: 'Review', id: `WRITER_${result?.writer.id}` },
        { type: 'Review', id: `WRITER_STATS_${result?.writer.id}` },
      ],
    }),
    
    updateReview: builder.mutation<Review, { id: number; data: UpdateReviewRequest }>({
      query: ({ id, data }) => ({
        url: `/reviews/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        'Review',
        { type: 'Review', id },
        { type: 'Review', id: `ORDER_${result?.order.id}` },
        { type: 'Review', id: `WRITER_${result?.writer.id}` },
        { type: 'Review', id: `WRITER_STATS_${result?.writer.id}` },
      ],
    }),
    
    deleteReview: builder.mutation<void, number>({
      query: (id) => ({
        url: `/reviews/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Review'],
    }),
  }),
});

export const {
  useGetReviewsQuery,
  useGetOrderReviewQuery,
  useGetWriterReviewsQuery,
  useGetWriterRatingStatsQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} = reviewApi;