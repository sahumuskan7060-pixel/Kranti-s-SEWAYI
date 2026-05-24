/**
 * API Configuration and Service
 * Connects frontend to Kranti Sahu's Homemade Simaiyan backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface Product {
  _id: string;
  name: 'Aata Simaiyan' | 'Maida Simaiyan';
  description: string;
  price: number;
  unit: string;
  category: string;
  features: string[];
  image?: string;
  inventory: {
    quantity: number;
    reorderLevel: number;
    lastRestocked: string;
  };
  rating: {
    average: number;
    count: number;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  product: string;
  quantity: number;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
  };
}

export interface OrderPayload {
  customer: CustomerInfo;
  items: OrderItem[];
  paymentMethod: 'GPay' | 'Razorpay' | 'UPI' | 'Bank Transfer' | 'Cash on Delivery';
  notes?: string;
  isBulkOrder?: boolean;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customer: CustomerInfo;
  items: any[];
  totals: {
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
  };
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  paymentId?: string;
  notes?: string;
  isCustomOrder: boolean;
  bulkOrder: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ContactPayload {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  type?: 'General' | 'Bulk Order' | 'Customization' | 'Feedback' | 'Support';
}

/**
 * Fetch wrapper with error handling
 */
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`API Error: ${response.status}`, data);
      return {
        success: false,
        message: data.message || 'An error occurred',
        error: data.error,
      };
    }

    return data as ApiResponse<T>;
  } catch (error) {
    console.error('Fetch Error:', error);
    return {
      success: false,
      message: 'Network error. Please check your connection.',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Products API
 */
export const productApi = {
  /**
   * Get all products
   */
  getAll: async (): Promise<ApiResponse<Product[]>> => {
    return fetchApi<Product[]>('/products');
  },

  /**
   * Get single product by ID
   */
  getById: async (id: string): Promise<ApiResponse<Product>> => {
    return fetchApi<Product>(`/products/${id}`);
  },

  /**
   * Initialize products (admin only, one-time setup)
   */
  initialize: async (): Promise<ApiResponse> => {
    return fetchApi('/products/init', { method: 'POST' });
  },
};

/**
 * Orders API
 */
export const orderApi = {
  /**
   * Create a new order
   */
  create: async (orderData: OrderPayload): Promise<ApiResponse<Order>> => {
    return fetchApi<Order>('/orders/create', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  /**
   * Get all orders with pagination
   */
  getAll: async (page = 1, limit = 10): Promise<ApiResponse<Order[]>> => {
    return fetchApi<Order[]>(`/orders?page=${page}&limit=${limit}`);
  },

  /**
   * Get single order by ID
   */
  getById: async (id: string): Promise<ApiResponse<Order>> => {
    return fetchApi<Order>(`/orders/${id}`);
  },

  /**
   * Update order status
   */
  updateStatus: async (
    id: string,
    status: string
  ): Promise<ApiResponse<Order>> => {
    return fetchApi<Order>(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
};

/**
 * Contact API
 */
export const contactApi = {
  /**
   * Submit contact form
   */
  submit: async (contactData: ContactPayload): Promise<ApiResponse> => {
    return fetchApi('/contact/submit', {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  },

  /**
   * Get all contacts (admin only)
   */
  getAll: async (): Promise<ApiResponse> => {
    return fetchApi('/contact');
  },
};

/**
 * Payment API
 */
export const paymentApi = {
  /**
   * Create payment order
   */
  createOrder: async (orderId: string, amount: number): Promise<ApiResponse> => {
    return fetchApi('/payment/create-order', {
      method: 'POST',
      body: JSON.stringify({ orderId, amount }),
    });
  },

  /**
   * Verify payment
   */
  verify: async (
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string,
    orderId: string
  ): Promise<ApiResponse<Order>> => {
    return fetchApi<Order>('/payment/verify', {
      method: 'POST',
      body: JSON.stringify({
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        orderId,
      }),
    });
  },
};

/**
 * Admin API
 */
export const adminApi = {
  /**
   * Register admin (initial setup only)
   */
  register: async (
    email: string,
    password: string,
    name: string
  ): Promise<ApiResponse> => {
    return fetchApi('/admin/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  },

  /**
   * Admin login
   */
  login: async (
    email: string,
    password: string
  ): Promise<ApiResponse<{ token: string }>> => {
    return fetchApi<{ token: string }>('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  /**
   * Get dashboard statistics
   */
  getDashboardStats: async (): Promise<ApiResponse> => {
    return fetchApi('/admin/dashboard/stats');
  },

  /**
   * Get all orders (admin view)
   */
  getAllOrders: async (): Promise<ApiResponse<Order[]>> => {
    return fetchApi<Order[]>('/admin/orders');
  },

  /**
   * Update product inventory
   */
  updateInventory: async (
    productId: string,
    quantity: number
  ): Promise<ApiResponse> => {
    return fetchApi(`/admin/products/${productId}/inventory`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  },
};

export default {
  productApi,
  orderApi,
  contactApi,
  paymentApi,
  adminApi,
};
