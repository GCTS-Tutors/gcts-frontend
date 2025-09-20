import { baseApi } from './baseApi';
import type { 
  User, 
  AuthTokens, 
  LoginRequest, 
  RegisterRequest,
  PasswordResetRequest,
  PasswordResetConfirm
} from '@/types/api';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Authentication endpoints
    login: builder.mutation<
      { user: User; access: string; refresh: string },
      LoginRequest
    >({
      query: (credentials) => ({
        url: '/auth/login/',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),

    register: builder.mutation<
      { user: User; access: string; refresh: string },
      RegisterRequest
    >({
      query: (userData) => ({
        url: '/auth/register/',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),

    logout: builder.mutation<void, string>({
      query: (refreshToken) => ({
        url: '/auth/logout/',
        method: 'POST',
        body: { refresh: refreshToken },
      }),
      invalidatesTags: ['User'],
    }),

    refreshToken: builder.mutation<AuthTokens, string>({
      query: (refreshToken) => ({
        url: '/auth/token/refresh/',
        method: 'POST',
        body: { refresh: refreshToken },
      }),
    }),

    getCurrentUser: builder.query<User, void>({
      query: () => '/auth/user/',
      providesTags: ['User'],
    }),

    updateProfile: builder.mutation<User, Partial<User>>({
      query: (userData) => ({
        url: '/auth/profile/',
        method: 'PATCH',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),

    changePassword: builder.mutation<{ message: string }, {
      oldPassword: string;
      newPassword: string;
      confirmPassword: string;
    }>({
      query: (data) => ({
        url: '/auth/change-password/',
        method: 'POST',
        body: data,
      }),
    }),

    resetPassword: builder.mutation<{ message: string }, PasswordResetRequest>({
      query: (data) => ({
        url: '/auth/password-reset/',
        method: 'POST',
        body: data,
      }),
    }),

    confirmPasswordReset: builder.mutation<{ message: string }, PasswordResetConfirm>({
      query: (data) => ({
        url: '/auth/password-reset-confirm/',
        method: 'POST',
        body: data,
      }),
    }),

    verifyEmail: builder.mutation<{ message: string }, { token: string }>({
      query: (data) => ({
        url: '/auth/verify-email/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    resendVerificationEmail: builder.mutation<{ message: string }, { email: string }>({
      query: (data) => ({
        url: '/auth/resend-verification/',
        method: 'POST',
        body: data,
      }),
    }),

    uploadAvatar: builder.mutation<User, FormData>({
      query: (formData) => ({
        url: '/auth/upload-avatar/',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['User'],
    }),

    deleteAccount: builder.mutation<{ message: string }, { password: string }>({
      query: (data) => ({
        url: '/auth/delete-account/',
        method: 'DELETE',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useGetCurrentUserQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useResetPasswordMutation,
  useConfirmPasswordResetMutation,
  useVerifyEmailMutation,
  useResendVerificationEmailMutation,
  useUploadAvatarMutation,
  useDeleteAccountMutation,
} = authApi;