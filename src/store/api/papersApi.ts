import { baseApi, buildQueryParams } from './baseApi';

export interface AdminPaper {
  id: string;
  title: string;
  slug: string;
  subject: string;
  type: string;
  level: string;
  pages: number;
  excerpt: string;
  content: string;
  author?: string;
  keywords?: string[];
  is_published: boolean;
  featured: boolean;
  download_count: number;
  meta_description?: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePaperData {
  title: string;
  subject: string;
  type: string;
  level: string;
  pages: number;
  excerpt: string;
  content: string;
  author?: string;
  keywords?: string[];
  is_published?: boolean;
  featured?: boolean;
  meta_description?: string;
}

export interface UpdatePaperData extends Partial<CreatePaperData> {
  id: string;
}

export interface BulkActionData {
  ids: string[];
  action: 'delete' | 'publish' | 'unpublish' | 'feature' | 'unfeature';
}

export interface PapersListResponse {
  count: number;
  next?: string;
  previous?: string;
  results: AdminPaper[];
}

export interface PapersQueryParams {
  page?: number;
  page_size?: number;
  search?: string;
  is_published?: boolean;
  featured?: boolean;
  subject?: string;
  type?: string;
  level?: string;
  ordering?: string;
}

export const papersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all papers with admin details
    getAdminPapers: builder.query<PapersListResponse, PapersQueryParams>({
      query: (params = {}) => {
        const queryString = buildQueryParams(params);
        return `admin/papers/${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({ type: 'AdminPaper' as const, id })),
              { type: 'AdminPaper', id: 'LIST' },
            ]
          : [{ type: 'AdminPaper', id: 'LIST' }],
    }),

    // Get single paper for editing
    getAdminPaper: builder.query<AdminPaper, string>({
      query: (id) => `admin/papers/${id}/`,
      providesTags: (result, error, id) => [{ type: 'AdminPaper', id }],
    }),

    // Create new paper
    createPaper: builder.mutation<AdminPaper, CreatePaperData>({
      query: (data) => ({
        url: 'admin/papers/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'AdminPaper', id: 'LIST' }],
    }),

    // Update existing paper
    updatePaper: builder.mutation<AdminPaper, UpdatePaperData>({
      query: ({ id, ...data }) => ({
        url: `admin/papers/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'AdminPaper', id },
        { type: 'AdminPaper', id: 'LIST' },
      ],
    }),

    // Delete paper
    deletePaper: builder.mutation<void, string>({
      query: (id) => ({
        url: `admin/papers/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'AdminPaper', id },
        { type: 'AdminPaper', id: 'LIST' },
      ],
    }),

    // Duplicate paper
    duplicatePaper: builder.mutation<AdminPaper, string>({
      query: (id) => ({
        url: `admin/papers/${id}/duplicate/`,
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'AdminPaper', id: 'LIST' }],
    }),

    // Bulk actions
    bulkActionPapers: builder.mutation<{ message: string; count: number }, BulkActionData>({
      query: (data) => ({
        url: 'admin/papers/bulk_action/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'AdminPaper', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetAdminPapersQuery,
  useGetAdminPaperQuery,
  useCreatePaperMutation,
  useUpdatePaperMutation,
  useDeletePaperMutation,
  useDuplicatePaperMutation,
  useBulkActionPapersMutation,
} = papersApi;