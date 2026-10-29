'use client';

import { useEffect } from 'react';

export function ViewTransitionHandler() {
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const isTransitionAbort =
        (reason instanceof DOMException && reason.name === 'InvalidStateError') ||
        (typeof reason?.message === 'string' &&
          (reason.message.includes('Transition was aborted') ||
            reason.message.includes('Document hidden')));

      if (isTransitionAbort) {
        event.preventDefault();
      }
    };

    const handleError = (event: ErrorEvent) => {
      const isTransitionAbort =
        event.error?.name === 'InvalidStateError' ||
        (typeof event.message === 'string' &&
          (event.message.includes('Transition was aborted') ||
            event.message.includes('Document hidden')));

      if (isTransitionAbort) {
        event.preventDefault();
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, []);

  return null;
}
