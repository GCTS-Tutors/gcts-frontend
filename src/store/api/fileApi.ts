import { baseApi } from './baseApi';

export interface FileAttachment {
  id: number;
  filename: string;
  originalName: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: {
    id: number;
    firstName: string;
    lastName: string;
    role: string;
  };
  order: {
    id: string;
    title: string;
  };
  fileType: 'requirement' | 'submission' | 'revision' | 'reference';
  downloadUrl: string;
  isPublic: boolean;
  uploadedAt: string;
}

export interface UploadFileRequest {
  orderId: string;
  file: File;
  fileType: 'requirement' | 'submission' | 'revision' | 'reference';
  isPublic?: boolean;
}

export interface FileFilters {
  orderId?: string;
  fileType?: string;
  uploadedBy?: number;
  mimeType?: string;
  page?: number;
  pageSize?: number;
}

export const fileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrderAttachments: builder.query<FileAttachment[], string>({
      query: (orderId) => `/orders/${orderId}/files/`,
      providesTags: (result, error, orderId) => [
        { type: 'OrderFile', id: `ORDER_${orderId}` },
      ],
    }),

    getFiles: builder.query<any, FileFilters>({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, String(value));
          }
        });
        return `/files/?${params.toString()}`;
      },
      providesTags: ['OrderFile'],
    }),

    uploadFile: builder.mutation<FileAttachment, UploadFileRequest>({
      query: ({ orderId, file, fileType, isPublic = false }) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileType', fileType);
        formData.append('isPublic', String(isPublic));
        
        return {
          url: `/orders/${orderId}/files/`,
          method: 'POST',
          body: formData,
          formData: true,
        };
      },
      invalidatesTags: (result, error, { orderId }) => [
        'OrderFile',
        { type: 'OrderFile', id: `ORDER_${orderId}` },
      ],
    }),

    downloadFile: builder.mutation<Blob, number>({
      query: (fileId) => ({
        url: `/files/${fileId}/download/`,
        method: 'GET',
        responseHandler: (response: any) => response.blob(),
      }),
    }),

    deleteFile: builder.mutation<void, number>({
      query: (fileId) => ({
        url: `/files/${fileId}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['OrderFile'],
    }),

    updateFile: builder.mutation<FileAttachment, { id: number; data: Partial<FileAttachment> }>({
      query: ({ id, data }) => ({
        url: `/files/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        'OrderFile',
        { type: 'OrderFile', id },
      ],
    }),

    getFileStats: builder.query<{
      totalFiles: number;
      totalSize: number;
      filesByType: { [key: string]: number };
      recentUploads: FileAttachment[];
    }, { orderId?: number }>({
      query: ({ orderId } = {}) => {
        const params = orderId ? `?order_id=${orderId}` : '';
        return `/files/stats/${params}`;
      },
      providesTags: ['OrderFile'],
    }),
  }),
});

export const {
  useGetOrderAttachmentsQuery,
  useGetFilesQuery,
  useUploadFileMutation,
  useDownloadFileMutation,
  useDeleteFileMutation,
  useUpdateFileMutation,
  useGetFileStatsQuery,
} = fileApi;