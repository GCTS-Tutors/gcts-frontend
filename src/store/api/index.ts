// Export all API slices and their hooks
export * from './baseApi';
export * from './authApi';
export * from './orderApi';
export * from './userApi';
export * from './paymentApi';
export * from './fileApi';
export * from './analyticsApi';
export * from './notificationApi';
export * from './adminApi';
export * from './papersApi';
export * from './searchApi';

// Export commonly used types
export type {
  PaginationParams,
  FilterableQuery,
} from './baseApi';

export type {
  OrderFilters,
} from './orderApi';

export type {
  UserFilters,
  UserStats,
} from './userApi';

export type {
  PaymentFilters,
} from './paymentApi';

export type {
  NotificationFilters,
} from './notificationApi';