import { baseApi } from './baseApi';

export interface Subject {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const subjectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all subjects (use new dropdown options system)
    getSubjects: builder.query<Subject[], void>({
      query: () => '/dropdown-options/subjects/',
      providesTags: ['Subject'],
    }),

    // Get subject by ID (admin endpoint)
    getSubject: builder.query<Subject, number>({
      query: (id) => `/admin/subject-options/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Subject', id }],
    }),

    // Create subject (admin only - use new dropdown system)
    createSubject: builder.mutation<Subject, Partial<Subject>>({
      query: (subject) => ({
        url: '/admin/subject-options/',
        method: 'POST',
        body: subject,
      }),
      invalidatesTags: ['Subject'],
    }),

    // Update subject (admin only - use new dropdown system)
    updateSubject: builder.mutation<Subject, { id: number; data: Partial<Subject> }>({
      query: ({ id, data }) => ({
        url: `/admin/subject-options/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Subject', id },
        'Subject',
      ],
    }),

    // Delete subject (admin only - use new dropdown system)
    deleteSubject: builder.mutation<void, number>({
      query: (id) => ({
        url: `/admin/subject-options/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Subject', id },
        'Subject',
      ],
    }),
  }),
});

export const {
  useGetSubjectsQuery,
  useGetSubjectQuery,
  useCreateSubjectMutation,
  useUpdateSubjectMutation,
  useDeleteSubjectMutation,
} = subjectApi;