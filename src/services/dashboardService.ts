import { APIClient } from '@/lib/api';

export interface DashboardData {
  // Common fields
  user: any;
  role: string;

  // Admin specific
  totalOrders?: number;
  activeOrders?: number;
  completedOrders?: number;
  totalUsers?: number;
  totalRevenue?: number;
  recentOrders?: any[];

  // Writer specific
  assignedOrders?: number;
  inProgressOrders?: number;
  averageRating?: number;
  myOrders?: any[];

  // Student specific
  totalSpent?: number;
}

export class DashboardService {
  /**
   * Get role-based dashboard data
   */
  static async getDashboardData(): Promise<DashboardData> {
    console.log('📊 DashboardService.getDashboardData called');
    return APIClient.get<DashboardData>('/dashboard/');
  }

  /**
   * Get order statistics for current user
   */
  static async getOrderStats(): Promise<{
    totalOrders: number;
    activeOrders: number;
    completedOrders: number;
    pendingOrders: number;
  }> {
    const response = await APIClient.get<any>('/dashboard/');

    return {
      totalOrders: response.totalOrders || 0,
      activeOrders: response.activeOrders || 0,
      completedOrders: response.completedOrders || 0,
      pendingOrders: (response.totalOrders || 0) - (response.activeOrders || 0) - (response.completedOrders || 0)
    };
  }

  /**
   * Get payment statistics for current user
   */
  static async getPaymentStats(): Promise<{
    totalSpent?: number;
    totalRevenue?: number;
    pendingPayments: number;
    completedPayments: number;
  }> {
    const response = await APIClient.get<any>('/dashboard/');

    return {
      totalSpent: response.totalSpent,
      totalRevenue: response.totalRevenue,
      pendingPayments: 0, // Can be enhanced later
      completedPayments: response.completedOrders || 0
    };
  }

  /**
   * Get unread notifications count
   */
  static async getUnreadCount(): Promise<{ count: number }> {
    // This endpoint may not exist yet, return default
    return { count: 0 };
  }
}