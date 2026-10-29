'use client';

import { useEffect, useState } from 'react';

interface ProductShareButtonProps {
  title: string;
}

export function ProductShareButton({ title }: ProductShareButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;

    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="inline-flex items-center gap-2 rounded-md border border-[#f3c3ac] bg-white px-3 py-1.5 text-[13px] font-medium text-gray-700 transition-colors hover:border-[#f15a24] hover:text-[#f15a24]"
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-[#f15a24]"
      >
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
      </svg>
      {copied ? 'Đã sao chép' : 'Chia sẻ'}
    </button>
  );
}
