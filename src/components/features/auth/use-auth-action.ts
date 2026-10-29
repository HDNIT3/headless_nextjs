'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ActionResult } from '@/service/auth.service';

interface UseAuthActionOptions {
  fallbackMessage: string;
  onError?: (message: string) => void;
}

export function useAuthAction({ fallbackMessage, onError }: UseAuthActionOptions) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const report = useCallback(
    (message: string) => {
      if (onError) onError(message);
      else setError(message);
    },
    [onError]
  );

  const submit = useCallback(
    async (action: () => Promise<ActionResult>) => {
      if (!onError) setError(null);
      setLoading(true);

      try {
        const result = await action();

        if (!result.success) {
          report(result.message || fallbackMessage);
          setLoading(false);
          return;
        }

        router.refresh();
        router.push(result.redirectTo);
      } catch (err: unknown) {
        report(err instanceof Error ? err.message : fallbackMessage);
        setLoading(false);
      }
    },
    [fallbackMessage, onError, report, router]
  );

  return { loading, setLoading, error, setError, submit };
}
