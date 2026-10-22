'use client';

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="vi">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#fafbfc',
          color: '#1e293b',
          fontFamily:
            'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          padding: '24px',
        }}
      >
        <main
          style={{
            width: '100%',
            maxWidth: '520px',
            background: '#ffffff',
            border: '1px solid #f1f5f9',
            borderRadius: '16px',
            padding: '40px 32px',
            textAlign: 'center',
            boxShadow: '0 4px 24px -8px rgba(0,0,0,0.08)',
          }}
        >
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800 }}>
            Đã xảy ra lỗi nghiêm trọng
          </h1>
          <p
            style={{
              margin: '12px 0 0',
              fontSize: '14px',
              lineHeight: 1.6,
              color: '#475569',
            }}
          >
            Ứng dụng không thể hiển thị trang này. Vui lòng thử lại.
          </p>

          {error.digest && (
            <p style={{ margin: '12px 0 0', fontSize: '12px', color: '#94a3b8' }}>
              Mã lỗi: <code>{error.digest}</code>
            </p>
          )}

          <button
            type="button"
            onClick={() => retry()}
            style={{
              marginTop: '28px',
              border: 0,
              borderRadius: '8px',
              background: '#0c5c36',
              color: '#ffffff',
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Thử lại
          </button>
        </main>
      </body>
    </html>
  );
}
