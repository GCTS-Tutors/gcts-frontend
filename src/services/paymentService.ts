import { APIClient } from '@/lib/api';
import { 
  Payment, 
  PaymentRequest,
  PaginatedResponse,
  PaginationParams
} from '@/types/api';

export interface PaymentFilters {
  status?: string[];
  method?: string[];
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
  userId?: number;
  orderId?: number;
}

export interface PaymentStats {
  totalRevenue: number;
  monthlyRevenue: number;
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  averageTransactionValue: number;
  revenueByMonth: Array<{
    month: string;
    revenue: number;
    transactions: number;
  }>;
}

export class PaymentService {
  /**
   * Get paginated list of payments
   */
  static async getPayments(
    filters?: PaymentFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Payment>> {
    const params = new URLSearchParams();
    
    // Add filters
    if (filters) {
      if (filters.status?.length) {
        filters.status.forEach(status => params.append('status', status));
      }
      if (filters.method?.length) {
        filters.method.forEach(method => params.append('method', method));
      }
      if (filters.dateFrom) params.append('date_from', filters.dateFrom);
      if (filters.dateTo) params.append('date_to', filters.dateTo);
      if (filters.minAmount) params.append('min_amount', filters.minAmount.toString());
      if (filters.maxAmount) params.append('max_amount', filters.maxAmount.toString());
      if (filters.userId) params.append('user_id', filters.userId.toString());
      if (filters.orderId) params.append('order_id', filters.orderId.toString());
    }
    
    // Add pagination
    if (pagination) {
      if (pagination.page) params.append('page', pagination.page.toString());
      if (pagination.pageSize) params.append('page_size', pagination.pageSize.toString());
      if (pagination.ordering) params.append('ordering', pagination.ordering);
    }
    
    const queryString = params.toString();
    return APIClient.get<PaginatedResponse<Payment>>(
      `/payments/${queryString ? `?${queryString}` : ''}`
    );
  }

  /**
   * Get single payment by ID
   */
  static async getPayment(id: number): Promise<Payment> {
    return APIClient.get<Payment>(`/payments/${id}/`);
  }

  /**
   * Process payment for order
   */
  static async processPayment(paymentData: PaymentRequest): Promise<Payment> {
    return APIClient.post<Payment>('/payments/', paymentData);
  }

  /**
   * Get payment methods for user
   */
  static async getPaymentMethods(): Promise<Array<{
    id: string;
    type: string;
    last4?: string;
    expiryMonth?: number;
    expiryYear?: number;
    brand?: string;
    isDefault: boolean;
  }>> {
    return APIClient.get('/payments/methods/');
  }

  /**
   * Add new payment method
   */
  static async addPaymentMethod(data: {
    token: string;
    type: 'card' | 'paypal';
    setAsDefault?: boolean;
  }): Promise<void> {
    return APIClient.post<void>('/payments/methods/', data);
  }

  /**
   * Delete payment method
   */
  static async deletePaymentMethod(methodId: string): Promise<void> {
    return APIClient.delete<void>(`/payments/methods/${methodId}/`);
  }

  /**
   * Set default payment method
   */
  static async setDefaultPaymentMethod(methodId: string): Promise<void> {
    return APIClient.patch<void>(`/payments/methods/${methodId}/`, {
      is_default: true
    });
  }

  /**
   * Refund payment (admin only)
   */
  static async refundPayment(
    paymentId: number, 
    amount?: number, 
    reason?: string
  ): Promise<Payment> {
    return APIClient.post<Payment>(`/payments/${paymentId}/refund/`, {
      amount,
      reason
    });
  }

  /**
   * Get payment receipt
   */
  static async getPaymentReceipt(paymentId: number): Promise<Blob> {
    return APIClient.get<Blob>(`/payments/${paymentId}/receipt/`, {
      responseType: 'blob'
    });
  }

  /**
   * Get payment statistics (admin only)
   */
  static async getPaymentStats(period?: '7d' | '30d' | '90d' | '1y'): Promise<PaymentStats> {
    const params = period ? `?period=${period}` : '';
    return APIClient.get<PaymentStats>(`/payments/stats/${params}`);
  }

  /**
   * Get user payment history
   */
  static async getUserPaymentHistory(
    userId?: number,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Payment>> {
    const params = new URLSearchParams();
    
    if (userId) params.append('user_id', userId.toString());
    
    if (pagination) {
      if (pagination.page) params.append('page', pagination.page.toString());
      if (pagination.pageSize) params.append('page_size', pagination.pageSize.toString());
      if (pagination.ordering) params.append('ordering', pagination.ordering);
    }
    
    const queryString = params.toString();
    return APIClient.get<PaginatedResponse<Payment>>(
      `/payments/history/${queryString ? `?${queryString}` : ''}`
    );
  }

  /**
   * Verify payment status
   */
  static async verifyPayment(paymentId: number): Promise<{
    verified: boolean;
    status: string;
    transactionId?: string;
  }> {
    return APIClient.post(`/payments/${paymentId}/verify/`);
  }

  /**
   * Calculate fees for payment
   */
  static async calculateFees(amount: number, method: string): Promise<{
    amount: number;
    fees: number;
    total: number;
    breakdown: Array<{
      type: string;
      amount: number;
      description: string;
    }>;
  }> {
    return APIClient.post('/payments/calculate-fees/', { amount, method });
  }

  /**
   * Get supported currencies
   */
  static async getSupportedCurrencies(): Promise<Array<{
    code: string;
    name: string;
    symbol: string;
    isDefault: boolean;
  }>> {
    return APIClient.get('/payments/currencies/');
  }

  /**
   * Get exchange rates
   */
  static async getExchangeRates(baseCurrency: string = 'USD'): Promise<{
    base: string;
    rates: Record<string, number>;
    timestamp: string;
  }> {
    return APIClient.get(`/payments/exchange-rates/?base=${baseCurrency}`);
  }

  /**
   * Setup payment intent (for complex payments)
   */
  static async setupPaymentIntent(data: {
    orderId: number;
    amount: number;
    currency?: string;
    paymentMethod?: string;
  }): Promise<{
    clientSecret: string;
    paymentIntentId: string;
  }> {
    return APIClient.post('/payments/setup-intent/', data);
  }

  /**
   * Confirm payment intent
   */
  static async confirmPaymentIntent(
    paymentIntentId: string,
    paymentMethodId?: string
  ): Promise<Payment> {
    return APIClient.post(`/payments/confirm-intent/${paymentIntentId}/`, {
      payment_method_id: paymentMethodId
    });
  }

  /**
   * Get writer earnings
   */
  static async getWriterEarnings(
    writerId?: number,
    period?: '7d' | '30d' | '90d' | '1y'
  ): Promise<{
    totalEarnings: number;
    pendingEarnings: number;
    paidEarnings: number;
    earningsByMonth: Array<{
      month: string;
      earnings: number;
      orders: number;
    }>;
  }> {
    const params = new URLSearchParams();
    if (writerId) params.append('writer_id', writerId.toString());
    if (period) params.append('period', period);
    
    const queryString = params.toString();
    return APIClient.get(`/payments/writer-earnings/${queryString ? `?${queryString}` : ''}`);
  }

  /**
   * Request payout (writer)
   */
  static async requestPayout(amount: number): Promise<{
    payoutId: string;
    status: string;
    estimatedArrival: string;
  }> {
    return APIClient.post('/payments/request-payout/', { amount });
  }
}