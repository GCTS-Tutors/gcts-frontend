import { APIClient } from '@/lib/api';
import { 
  User, 
  UserProfile,
  PaginatedResponse,
  PaginationParams,
  UserRole
} from '@/types/api';

export interface UserFilters {
  role?: UserRole[];
  isActive?: boolean;
  search?: string;
  dateJoinedFrom?: string;
  dateJoinedTo?: string;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  studentCount: number;
  writerCount: number;
  adminCount: number;
  newUsersThisMonth: number;
}

export class UserService {
  /**
   * Get paginated list of users (admin only)
   */
  static async getUsers(
    filters?: UserFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<User>> {
    const params = new URLSearchParams();
    
    // Add filters
    if (filters) {
      if (filters.role?.length) {
        filters.role.forEach(role => params.append('role', role));
      }
      if (filters.isActive !== undefined) {
        params.append('is_active', filters.isActive.toString());
      }
      if (filters.search) params.append('search', filters.search);
      if (filters.dateJoinedFrom) params.append('date_joined_from', filters.dateJoinedFrom);
      if (filters.dateJoinedTo) params.append('date_joined_to', filters.dateJoinedTo);
    }
    
    // Add pagination
    if (pagination) {
      if (pagination.page) params.append('page', pagination.page.toString());
      if (pagination.pageSize) params.append('page_size', pagination.pageSize.toString());
      if (pagination.ordering) params.append('ordering', pagination.ordering);
    }
    
    const queryString = params.toString();
    return APIClient.get<PaginatedResponse<User>>(
      `/users/${queryString ? `?${queryString}` : ''}`
    );
  }

  /**
   * Get user by ID
   */
  static async getUser(id: number): Promise<User> {
    return APIClient.get<User>(`/users/${id}/`);
  }

  /**
   * Update user (admin only)
   */
  static async updateUser(id: number, data: Partial<User>): Promise<User> {
    return APIClient.patch<User>(`/users/${id}/`, data);
  }

  /**
   * Delete user (admin only)
   */
  static async deleteUser(id: number): Promise<void> {
    return APIClient.delete<void>(`/users/${id}/`);
  }

  /**
   * Activate/deactivate user (admin only)
   */
  static async toggleUserStatus(id: number, isActive: boolean): Promise<User> {
    return APIClient.patch<User>(`/users/${id}/`, { is_active: isActive });
  }

  /**
   * Get user profile
   */
  static async getUserProfile(userId: number): Promise<UserProfile> {
    return APIClient.get<UserProfile>(`/users/${userId}/profile/`);
  }

  /**
   * Update user profile
   */
  static async updateUserProfile(userId: number, data: Partial<UserProfile>): Promise<UserProfile> {
    return APIClient.patch<UserProfile>(`/users/${userId}/profile/`, data);
  }

  /**
   * Get writers list (for order assignment)
   */
  static async getWriters(filters?: {
    specializations?: string[];
    rating?: number;
    availability?: boolean;
  }): Promise<User[]> {
    const params = new URLSearchParams();
    params.append('role', 'writer');
    
    if (filters) {
      if (filters.specializations?.length) {
        filters.specializations.forEach(spec => params.append('specialization', spec));
      }
      if (filters.rating) params.append('min_rating', filters.rating.toString());
      if (filters.availability) params.append('available', 'true');
    }
    
    const queryString = params.toString();
    return APIClient.get<User[]>(`/users/?${queryString}`);
  }

  /**
   * Get writer statistics
   */
  static async getWriterStats(writerId: number): Promise<{
    totalOrders: number;
    completedOrders: number;
    averageRating: number;
    totalEarnings: number;
    successRate: number;
    onTimeDeliveryRate: number;
  }> {
    return APIClient.get(`/users/${writerId}/writer-stats/`);
  }

  /**
   * Get student statistics
   */
  static async getStudentStats(studentId: number): Promise<{
    totalOrders: number;
    completedOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    favoriteSubjects: string[];
  }> {
    return APIClient.get(`/users/${studentId}/student-stats/`);
  }

  /**
   * Get user statistics overview (admin only)
   */
  static async getUserStats(): Promise<UserStats> {
    return APIClient.get<UserStats>('/users/stats/');
  }

  /**
   * Send message to user (admin only)
   */
  static async sendMessageToUser(
    userId: number, 
    subject: string, 
    message: string
  ): Promise<void> {
    return APIClient.post<void>(`/users/${userId}/message/`, {
      subject,
      message
    });
  }

  /**
   * Reset user password (admin only)
   */
  static async resetUserPassword(userId: number): Promise<{ temporaryPassword: string }> {
    return APIClient.post<{ temporaryPassword: string }>(`/users/${userId}/reset-password/`);
  }

  /**
   * Get user activity log (admin only)
   */
  static async getUserActivity(
    userId: number, 
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<{
    id: number;
    action: string;
    description: string;
    timestamp: string;
    ipAddress?: string;
  }>> {
    const params = new URLSearchParams();
    
    if (pagination) {
      if (pagination.page) params.append('page', pagination.page.toString());
      if (pagination.pageSize) params.append('page_size', pagination.pageSize.toString());
    }
    
    const queryString = params.toString();
    return APIClient.get(`/users/${userId}/activity/${queryString ? `?${queryString}` : ''}`);
  }

  /**
   * Promote user to writer (admin only)
   */
  static async promoteToWriter(userId: number, specializations: string[]): Promise<User> {
    return APIClient.post<User>(`/users/${userId}/promote-writer/`, {
      specializations
    });
  }

  /**
   * Demote writer to student (admin only)
   */
  static async demoteWriter(userId: number): Promise<User> {
    return APIClient.post<User>(`/users/${userId}/demote-writer/`);
  }

  /**
   * Get user notifications settings
   */
  static async getNotificationSettings(userId: number): Promise<{
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    orderUpdates: boolean;
    marketingEmails: boolean;
  }> {
    return APIClient.get(`/users/${userId}/notification-settings/`);
  }

  /**
   * Update user notification settings
   */
  static async updateNotificationSettings(
    userId: number, 
    settings: {
      emailNotifications?: boolean;
      smsNotifications?: boolean;
      pushNotifications?: boolean;
      orderUpdates?: boolean;
      marketingEmails?: boolean;
    }
  ): Promise<void> {
    return APIClient.patch<void>(`/users/${userId}/notification-settings/`, settings);
  }

  /**
   * Upload user avatar
   */
  static async uploadAvatar(userId: number, file: File): Promise<{ avatar: string }> {
    return APIClient.uploadFile<{ avatar: string }>(`/users/${userId}/avatar/`, file);
  }

  /**
   * Delete user avatar
   */
  static async deleteAvatar(userId: number): Promise<void> {
    return APIClient.delete<void>(`/users/${userId}/avatar/`);
  }
}