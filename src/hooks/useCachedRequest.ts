import { useCallback, useEffect, useState } from 'react';
import { getProviderErrorMessage } from '@/services/utils';

type CachedRequestState<T> = {
  data: T | null;
  error: string;
  isLoading: boolean;
  reload: () => void;
  cancel: () => void;
};

/**
 * Reusable request state for data cards. The underlying service owns caching;
 * this hook owns loading, cancellation, and friendly error presentation.
 */
export function useCachedRequest<T>(
  load: (signal: AbortSignal) => Promise<T>,
  enabled = true,
): CachedRequestState<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(enabled);
  const [refreshIndex, setRefreshIndex] = useState(0);
  const [controller, setController] = useState<AbortController | null>(null);

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }
    const requestController = new AbortController();
    setController(requestController);
    setIsLoading(true);
    setError('');
    void load(requestController.signal)
      .then((result) => setData(result))
      .catch((requestError) => {
        if (!requestController.signal.aborted)
          setError(getProviderErrorMessage(requestError));
      })
      .finally(() => {
        if (!requestController.signal.aborted) setIsLoading(false);
      });
    return () => requestController.abort();
  }, [enabled, load, refreshIndex]);

  return {
    data,
    error,
    isLoading,
    reload: useCallback(() => setRefreshIndex((value) => value + 1), []),
    cancel: useCallback(() => controller?.abort(), [controller]),
  };
}
