import { useState } from 'react';
import { orderApi, type OrderPayload, type Order, type ApiResponse } from '@/lib/api';

export interface UseOrderReturn {
  loading: boolean;
  error: string | null;
  success: boolean;
  order: Order | null;
  createOrder: (orderData: OrderPayload) => Promise<Order | null>;
}

/**
 * Hook to create and manage orders
 */
export function useOrder(): UseOrderReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);

  const createOrder = async (orderData: OrderPayload): Promise<Order | null> => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const response = await orderApi.create(orderData);

      if (response.success && response.data) {
        setOrder(response.data);
        setSuccess(true);
        return response.data;
      } else {
        const errorMsg = response.message || 'Failed to create order';
        setError(errorMsg);
        return null;
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, success, order, createOrder };
}
