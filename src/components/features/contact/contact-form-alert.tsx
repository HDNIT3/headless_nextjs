import { ContactFormStatus } from './types';

interface ContactFormAlertProps {
  status: ContactFormStatus;
}

export function ContactFormAlert({ status }: ContactFormAlertProps) {
  if (!status.type) {
    return null;
  }

  const isSuccess = status.type === 'success';

  return (
    <div
      className={`mb-5 p-4 rounded-xl text-sm flex items-start gap-3 transition-all ${
        isSuccess
          ? 'bg-green-50 text-green-800 border border-green-200'
          : 'bg-red-50 text-red-800 border border-red-200'
      }`}
    >
      {isSuccess ? (
        <svg
          className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg
          className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      )}
      <div className="flex-1">
        <p className="font-medium leading-relaxed">{status.message}</p>
        {status.unconfigured && (
          <p className="mt-1 text-xs text-red-700/80">
            Gợi ý: Mở file <code className="font-mono bg-red-100 px-1 py-0.5 rounded">.env.local</code> hoặc <code className="font-mono bg-red-100 px-1 py-0.5 rounded">src/lib/utils/email.ts</code> để điền Mật khẩu ứng dụng Gmail (App Password).
          </p>
        )}
      </div>
    </div>
  );
}
