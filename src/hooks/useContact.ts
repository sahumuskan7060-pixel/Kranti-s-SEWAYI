import { useState } from 'react';
import { contactApi, type ContactPayload } from '@/lib/api';

export interface UseContactReturn {
  loading: boolean;
  error: string | null;
  success: boolean;
  submitContact: (contactData: ContactPayload) => Promise<boolean>;
}

/**
 * Hook to submit contact form
 */
export function useContact(): UseContactReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submitContact = async (contactData: ContactPayload): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const response = await contactApi.submit(contactData);

      if (response.success) {
        setSuccess(true);
        return true;
      } else {
        const errorMsg = response.message || 'Failed to submit contact form';
        setError(errorMsg);
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

  return { loading, error, success, submitContact };
}
