import Link from 'next/link';

interface ContactDetailItem {
  label: string;
  content: React.ReactNode;
}

export function ContactDetailsList() {
  const details: ContactDetailItem[] = [
    {
      label: 'Địa Chỉ:',
      content: (
        <span className="text-gray-700">
          40 Tô Vĩnh Diện, Liên Nghĩa, Đức Trọng, Lâm Đồng
        </span>
      ),
    },
    {
      label: 'Hotline:',
      content: (
        <>
          <a
            href="tel:0986124330"
            className="text-gray-700 hover:text-[#0c5c36] transition-colors"
          >
            0986.124.330
          </a>
          {' - '}
          <a
            href="tel:0909615396"
            className="text-gray-700 hover:text-[#0c5c36] transition-colors"
          >
            0909.615.396
          </a>
        </>
      ),
    },
    {
      label: 'Email:',
      content: (
        <a
          href="mailto:ungthithuyhuong1978@gmail.com"
          className="text-gray-700 hover:text-[#0c5c36] transition-colors"
        >
          ungthithuyhuong1978@gmail.com
        </a>
      ),
    },
    {
      label: 'Website:',
      content: (
        <a
          href="https://baobihuongquang.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-700 hover:text-[#0c5c36] transition-colors"
        >
          baobihuongquang.com
        </a>
      ),
    },
  ];

  return (
    <ul className="mt-5 sm:mt-6 space-y-2.5 sm:space-y-3 text-sm sm:text-[14.5px] text-gray-800 font-medium">
      {details.map((item) => (
        <li key={item.label} className="flex items-start gap-2.5">
          <span className="text-black text-lg leading-none select-none">•</span>
          <div>
            <span className="font-bold text-gray-900">{item.label}</span>{' '}
            {item.content}
          </div>
        </li>
      ))}
    </ul>
  );
}
