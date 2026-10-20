import { ContactFeatureItem } from './types';

const FEATURES: ContactFeatureItem[] = [
  {
    id: 'quality',
    title: 'Đạt chất lượng',
    description: 'Sản phẩm đúng quy cách',
    icon: 'star',
  },
  {
    id: 'support',
    title: 'Hỗ trợ 24/7',
    description: 'Đồng hành lâu dài',
    icon: 'support',
  },
  {
    id: 'fast',
    title: 'Nhanh chóng',
    description: 'Linh hoạt theo đơn hàng',
    icon: 'lightning',
  },
];

function FeatureIcon({ type }: { type: ContactFeatureItem['icon'] }) {
  if (type === 'star') {
    return (
      <svg className="w-5 h-5 text-[#f15a24] fill-current" viewBox="0 0 24 24">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    );
  }

  if (type === 'support') {
    return (
      <svg
        className="w-5 h-5 text-[#f15a24]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    );
  }

  return (
    <svg className="w-5 h-5 text-[#f15a24] fill-current" viewBox="0 0 24 24">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

export function ContactFeatures() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
      {FEATURES.map((item) => (
        <div key={item.id} className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center">
            <FeatureIcon type={item.icon} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 leading-snug">
              {item.title}
            </h4>
            <p className="text-xs text-gray-500">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
