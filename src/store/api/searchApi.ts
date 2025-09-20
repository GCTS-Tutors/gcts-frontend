import { baseApi, buildQueryParams } from './baseApi';
import type { 
  PaginatedResponse,
  Order,
  User,
  Payment,
  Review,
  Message
} from '@/types/api';

export interface GlobalSearchFilters {
  query: string;
  types?: ('order' | 'user' | 'payment' | 'review' | 'message')[];
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  userId?: number;
  limit?: number;
}

export interface SearchResult {
  id: number;
  type: 'order' | 'user' | 'payment' | 'review' | 'message';
  title: string;
  subtitle?: string;
  description?: string;
  url: string;
  metadata?: Record<string, any>;
  createdAt: string;
  status?: string;
  score?: number; // Search relevance score
  highlightedFields?: Record<string, string>; // Fields with search term highlighted
}

export interface SearchSuggestion {
  text: string;
  type: 'recent' | 'popular' | 'suggestion';
  count?: number;
}

export interface SearchStats {
  totalResults: number;
  resultsByType: Record<string, number>;
  searchTime: number;
  suggestions: SearchSuggestion[];
}

export const searchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Global search across all data types
    globalSearch: builder.query<{
      results: SearchResult[];
      stats: SearchStats;
    }, GlobalSearchFilters>({
      query: (filters) => {
        const queryString = buildQueryParams(filters);
        return `/search/global/?${queryString}`;
      },
      providesTags: ['SearchResults'],
    }),

    // Quick search for autocomplete/suggestions
    quickSearch: builder.query<SearchResult[], { 
      query: string; 
      limit?: number;
      types?: string[];
    }>({
      query: ({ query, limit = 10, types }) => {
        const params = { q: query, limit, types: types?.join(',') };
        const queryString = buildQueryParams(params);
        return `/search/quick/?${queryString}`;
      },
      providesTags: ['SearchResults'],
    }),

    // Search suggestions based on user input
    getSearchSuggestions: builder.query<SearchSuggestion[], {
      query: string;
      limit?: number;
    }>({
      query: ({ query, limit = 5 }) => {
        const queryString = buildQueryParams({ q: query, limit });
        return `/search/suggestions/?${queryString}`;
      },
      providesTags: ['SearchSuggestions'],
    }),

    // Recent searches for the current user
    getRecentSearches: builder.query<string[], { limit?: number }>({
      query: ({ limit = 10 }) => `/search/recent/?limit=${limit}`,
      providesTags: ['RecentSearches'],
    }),

    // Popular searches across the platform
    getPopularSearches: builder.query<{ term: string; count: number }[], { 
      limit?: number;
      period?: 'day' | 'week' | 'month';
    }>({
      query: ({ limit = 10, period = 'week' }) => {
        const queryString = buildQueryParams({ limit, period });
        return `/search/popular/?${queryString}`;
      },
      providesTags: ['PopularSearches'],
    }),

    // Save a search for later
    saveSearch: builder.mutation<{ id: number }, {
      query: string;
      filters?: Record<string, any>;
      name: string;
      isPublic?: boolean;
    }>({
      query: (data) => ({
        url: '/search/saved/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['SavedSearches'],
    }),

    // Get saved searches
    getSavedSearches: builder.query<Array<{
      id: number;
      name: string;
      query: string;
      filters: Record<string, any>;
      isPublic: boolean;
      createdAt: string;
      useCount: number;
    }>, void>({
      query: () => '/search/saved/',
      providesTags: ['SavedSearches'],
    }),

    // Delete a saved search
    deleteSavedSearch: builder.mutation<void, number>({
      query: (id) => ({
        url: `/search/saved/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SavedSearches'],
    }),

    // Advanced order search
    searchOrders: builder.query<PaginatedResponse<Order>, {
      query?: string;
      status?: string[];
      academicLevel?: string[];
      paperType?: string[];
      dateFrom?: string;
      dateTo?: string;
      minAmount?: number;
      maxAmount?: number;
      page?: number;
      pageSize?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    }>({
      query: (params) => {
        const queryString = buildQueryParams(params);
        return `/search/orders/?${queryString}`;
      },
      providesTags: (result) =>
        result?.results
          ? [
              ...result.results.map(({ id }) => ({ type: 'Order' as const, id })),
              { type: 'Order', id: 'LIST' },
            ]
          : [{ type: 'Order', id: 'LIST' }],
    }),

    // Advanced user search (admin only)
    searchUsers: builder.query<PaginatedResponse<User>, {
      query?: string;
      role?: string[];
      status?: string[];
      registrationDateFrom?: string;
      registrationDateTo?: string;
      lastLoginFrom?: string;
      lastLoginTo?: string;
      isVerified?: boolean;
      page?: number;
      pageSize?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    }>({
      query: (params) => {
        const queryString = buildQueryParams(params);
        return `/search/users/?${queryString}`;
      },
      providesTags: (result) =>
        result?.results
          ? [
              ...result.results.map(({ id }) => ({ type: 'User' as const, id })),
              { type: 'User', id: 'LIST' },
            ]
          : [{ type: 'User', id: 'LIST' }],
    }),

    // Advanced payment search
    searchPayments: builder.query<PaginatedResponse<Payment>, {
      query?: string;
      status?: string[];
      method?: string[];
      dateFrom?: string;
      dateTo?: string;
      minAmount?: number;
      maxAmount?: number;
      orderId?: number;
      userId?: number;
      page?: number;
      pageSize?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    }>({
      query: (params) => {
        const queryString = buildQueryParams(params);
        return `/search/payments/?${queryString}`;
      },
      providesTags: (result) =>
        result?.results
          ? [
              ...result.results.map(({ id }) => ({ type: 'Payment' as const, id })),
              { type: 'Payment', id: 'LIST' },
            ]
          : [{ type: 'Payment', id: 'LIST' }],
    }),

    // Search within order messages/comments
    searchOrderMessages: builder.query<PaginatedResponse<Message>, {
      orderId?: number;
      query?: string;
      dateFrom?: string;
      dateTo?: string;
      senderRole?: string[];
      page?: number;
      pageSize?: number;
    }>({
      query: (params) => {
        const queryString = buildQueryParams(params);
        return `/search/messages/?${queryString}`;
      },
      providesTags: (result) =>
        result?.results
          ? [
              ...result.results.map(({ id }) => ({ type: 'Message' as const, id })),
              { type: 'Message', id: 'LIST' },
            ]
          : [{ type: 'Message', id: 'LIST' }],
    }),

    // Search reviews
    searchReviews: builder.query<PaginatedResponse<Review>, {
      query?: string;
      rating?: number[];
      dateFrom?: string;
      dateTo?: string;
      orderId?: number;
      writerId?: number;
      page?: number;
      pageSize?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    }>({
      query: (params) => {
        const queryString = buildQueryParams(params);
        return `/search/reviews/?${queryString}`;
      },
      providesTags: (result) =>
        result?.results
          ? [
              ...result.results.map(({ id }) => ({ type: 'Review' as const, id })),
              { type: 'Review', id: 'LIST' },
            ]
          : [{ type: 'Review', id: 'LIST' }],
    }),

    // Export search results
    exportSearchResults: builder.mutation<Blob, {
      searchType: 'orders' | 'users' | 'payments' | 'reviews' | 'messages';
      filters: Record<string, any>;
      format: 'csv' | 'xlsx' | 'pdf';
      includeFields?: string[];
    }>({
      query: (data) => ({
        url: '/search/export/',
        method: 'POST',
        body: data,
        responseHandler: async (response) => response.blob(),
      }),
    }),

    // Search analytics (admin only)
    getSearchAnalytics: builder.query<{
      topSearchTerms: Array<{ term: string; count: number; successRate: number }>;
      searchVolume: Array<{ date: string; searches: number; uniqueUsers: number }>;
      noResultsQueries: Array<{ term: string; count: number; lastSearched: string }>;
      averageResultsPerQuery: number;
      averageSearchTime: number;
      searchSuccessRate: number;
    }, {
      dateFrom?: string;
      dateTo?: string;
      period?: 'day' | 'week' | 'month';
    }>({
      query: (params) => {
        const queryString = buildQueryParams(params);
        return `/search/analytics/?${queryString}`;
      },
      providesTags: ['SearchAnalytics'],
    }),

    // Record search interaction (click, view, etc.)
    recordSearchInteraction: builder.mutation<void, {
      query: string;
      resultId: number;
      resultType: string;
      action: 'click' | 'view' | 'bookmark' | 'share';
      position?: number;
    }>({
      query: (data) => ({
        url: '/search/interactions/',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useGlobalSearchQuery,
  useQuickSearchQuery,
  useGetSearchSuggestionsQuery,
  useGetRecentSearchesQuery,
  useGetPopularSearchesQuery,
  useSaveSearchMutation,
  useGetSavedSearchesQuery,
  useDeleteSavedSearchMutation,
  useSearchOrdersQuery,
  useSearchUsersQuery,
  useSearchPaymentsQuery,
  useSearchOrderMessagesQuery,
  useSearchReviewsQuery,
  useExportSearchResultsMutation,
  useGetSearchAnalyticsQuery,
  useRecordSearchInteractionMutation,
} = searchApi;