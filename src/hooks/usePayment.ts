import { useState } from 'react';
import { paymentApi } from '@/lib/api';

export interface UsePaymentReturn {
  loading: boolean;
  error: string | null;
  createPaymentOrder: (orderId: string, amount: number) => Promise<string | null>;
  verifyPayment: (
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string,
    orderId: string
  ) => Promise<boolean>;
}

/**
 * Hook for payment processing with Razorpay/GPay
 */
export function usePayment(): UsePaymentReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPaymentOrder = async (
    orderId: string,
    amount: number
  ): Promise<string | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await paymentApi.createOrder(orderId, amount);

      if (response.success && response.data?.orderId) {
        return response.data.orderId;
      } else {
        setError(response.message || 'Failed to create payment order');
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

  const verifyPayment = async (
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string,
    orderId: string
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await paymentApi.verify(
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        orderId
      );

      if (response.success) {
        return true;
      } else {
        setError(response.message || 'Payment verification failed');
        return false;
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMsg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, createPaymentOrder, verifyPayment };
}
