import { APIClient } from '@/lib/api';
import { 
  Order, 
  CreateOrderRequest, 
  OrderComment, 
  OrderFile, 
  OrderReview,
  OrderFilters,
  PaginatedResponse,
  PaginationParams,
  Subject
} from '@/types/api';

export class OrderService {
  /**
   * Get paginated list of orders with optional filters
   */
  static async getOrders(
    filters?: OrderFilters, 
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Order>> {
    const params = new URLSearchParams();
    
    // Add filters
    if (filters) {
      if (filters.status?.length) {
        filters.status.forEach(status => params.append('status', status));
      }
      if (filters.subject?.length) {
        filters.subject.forEach(id => params.append('subject', id.toString()));
      }
      if (filters.orderType?.length) {
        filters.orderType.forEach(type => params.append('order_type', type));
      }
      if (filters.academicLevel?.length) {
        filters.academicLevel.forEach(level => params.append('academic_level', level));
      }
      if (filters.dateFrom) params.append('date_from', filters.dateFrom);
      if (filters.dateTo) params.append('date_to', filters.dateTo);
      if (filters.search) params.append('search', filters.search);
      if (filters.assignedToMe) params.append('assigned_to_me', 'true');
      if (filters.myOrders) params.append('my_orders', 'true');
    }
    
    // Add pagination
    if (pagination) {
      if (pagination.page) params.append('page', pagination.page.toString());
      if (pagination.pageSize) params.append('page_size', pagination.pageSize.toString());
      if (pagination.ordering) params.append('ordering', pagination.ordering);
    }
    
    const queryString = params.toString();
    return APIClient.get<PaginatedResponse<Order>>(
      `/orders/${queryString ? `?${queryString}` : ''}`
    );
  }

  /**
   * Get single order by ID
   */
  static async getOrder(id: number): Promise<Order> {
    return APIClient.get<Order>(`/orders/${id}/`);
  }

  /**
   * Create new order
   */
  static async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    const formData = new FormData();
    
    // Add order data
    Object.entries(orderData).forEach(([key, value]) => {
      if (key === 'files' && value) {
        // Handle file uploads
        (value as File[]).forEach((file, index) => {
          formData.append(`files[${index}]`, file);
        });
      } else if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    return APIClient.post<Order>('/orders/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }

  /**
   * Update order
   */
  static async updateOrder(id: number, data: Partial<Order>): Promise<Order> {
    return APIClient.patch<Order>(`/orders/${id}/`, data);
  }

  /**
   * Delete order
   */
  static async deleteOrder(id: number): Promise<void> {
    return APIClient.delete<void>(`/orders/${id}/`);
  }

  /**
   * Assign order to writer (admin only)
   */
  static async assignOrder(orderId: number, writerId: number): Promise<Order> {
    return APIClient.post<Order>(`/orders/${orderId}/assign/`, {
      writer_id: writerId
    });
  }

  /**
   * Update order status
   */
  static async updateOrderStatus(
    orderId: number, 
    status: string, 
    message?: string
  ): Promise<Order> {
    return APIClient.post<Order>(`/orders/${orderId}/status/`, {
      status,
      message
    });
  }

  /**
   * Submit order work (writer)
   */
  static async submitWork(
    orderId: number, 
    files: File[], 
    message?: string
  ): Promise<Order> {
    const formData = new FormData();
    
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });
    
    if (message) {
      formData.append('message', message);
    }

    return APIClient.post<Order>(`/orders/${orderId}/submit/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }

  /**
   * Request revision (student)
   */
  static async requestRevision(
    orderId: number, 
    message: string, 
    files?: File[]
  ): Promise<Order> {
    const formData = new FormData();
    formData.append('message', message);
    
    if (files) {
      files.forEach((file, index) => {
        formData.append(`files[${index}]`, file);
      });
    }

    return APIClient.post<Order>(`/orders/${orderId}/revision/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }

  /**
   * Accept completed order (student)
   */
  static async acceptOrder(orderId: number): Promise<Order> {
    return APIClient.post<Order>(`/orders/${orderId}/accept/`);
  }

  /**
   * Cancel order
   */
  static async cancelOrder(orderId: number, reason?: string): Promise<Order> {
    return APIClient.post<Order>(`/orders/${orderId}/cancel/`, {
      reason
    });
  }

  /**
   * Get order comments
   */
  static async getOrderComments(orderId: number): Promise<OrderComment[]> {
    return APIClient.get<OrderComment[]>(`/orders/${orderId}/comments/`);
  }

  /**
   * Add comment to order
   */
  static async addComment(
    orderId: number, 
    message: string, 
    files?: File[]
  ): Promise<OrderComment> {
    const formData = new FormData();
    formData.append('message', message);
    
    if (files) {
      files.forEach((file, index) => {
        formData.append(`files[${index}]`, file);
      });
    }

    return APIClient.post<OrderComment>(`/orders/${orderId}/comments/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }

  /**
   * Get order files
   */
  static async getOrderFiles(orderId: number): Promise<OrderFile[]> {
    return APIClient.get<OrderFile[]>(`/orders/${orderId}/files/`);
  }

  /**
   * Upload file to order
   */
  static async uploadFile(
    orderId: number, 
    file: File, 
    fileType: 'requirement' | 'submission' | 'revision' = 'requirement'
  ): Promise<OrderFile> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('file_type', fileType);

    return APIClient.post<OrderFile>(`/orders/${orderId}/files/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }

  /**
   * Delete order file
   */
  static async deleteFile(orderId: number, fileId: number): Promise<void> {
    return APIClient.delete<void>(`/orders/${orderId}/files/${fileId}/`);
  }

  /**
   * Download order file
   */
  static async downloadFile(orderId: number, fileId: number): Promise<Blob> {
    return APIClient.get<Blob>(`/orders/${orderId}/files/${fileId}/download/`, {
      responseType: 'blob'
    });
  }

  /**
   * Get order review
   */
  static async getOrderReview(orderId: number): Promise<OrderReview> {
    return APIClient.get<OrderReview>(`/orders/${orderId}/review/`);
  }

  /**
   * Submit order review (student)
   */
  static async submitReview(
    orderId: number, 
    rating: number, 
    comment?: string
  ): Promise<OrderReview> {
    return APIClient.post<OrderReview>(`/orders/${orderId}/review/`, {
      rating,
      comment
    });
  }

  /**
   * Get available subjects
   */
  static async getSubjects(): Promise<Subject[]> {
    return APIClient.get<Subject[]>('/dropdown-options/subjects/');
  }

  /**
   * Get order pricing
   */
  static async getOrderPricing(data: {
    pages: number;
    academicLevel: string;
    deadline: string;
    orderType: string;
  }): Promise<{ price: number; pricePerPage: number }> {
    return APIClient.post<{ price: number; pricePerPage: number }>('/orders/pricing/', data);
  }

  /**
   * Get order statistics for dashboard
   */
  static async getOrderStats(): Promise<{
    total: number;
    pending: number;
    in_progress: number;
    completed: number;
    cancelled: number;
  }> {
    const response = await APIClient.get<any>('/dashboard/');
    // Transform dashboard response to expected format
    return {
      total: response.totalOrders || response.myOrdersCount || 0,
      pending: response.pendingOrders || 0,
      in_progress: response.activeOrders || response.inProgressOrders || 0,
      completed: response.completedOrders || 0,
      cancelled: response.cancelledOrders || 0,
    };
  }
}