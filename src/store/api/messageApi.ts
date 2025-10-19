import { baseApi } from './baseApi';

export interface Message {
  id: number;
  content: string;
  sender: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  order: {
    id: string;
    title: string;
  };
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMessageRequest {
  content: string;
  orderId: string;
}

export const messageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrderMessages: builder.query<Message[], string>({
      query: (orderId) => `/orders/${orderId}/messages/`,
      providesTags: (result, error, orderId) => [
        { type: 'Message', id: 'ORDER_MESSAGES' },
        { type: 'Message', id: orderId },
      ],
    }),
    createMessage: builder.mutation<Message, CreateMessageRequest>({
      query: (data) => ({
        url: `/orders/${data.orderId}/messages/`,
        method: 'POST',
        body: { content: data.content },
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: 'Message', id: 'ORDER_MESSAGES' },
        { type: 'Message', id: orderId },
      ],
    }),
    markMessageAsRead: builder.mutation<Message, number>({
      query: (messageId) => ({
        url: `/messages/${messageId}/read/`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Message'],
    }),
    deleteMessage: builder.mutation<void, number>({
      query: (messageId) => ({
        url: `/messages/${messageId}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Message'],
    }),
  }),
});

export const {
  useGetOrderMessagesQuery,
  useCreateMessageMutation,
  useMarkMessageAsReadMutation,
  useDeleteMessageMutation,
} = messageApi;