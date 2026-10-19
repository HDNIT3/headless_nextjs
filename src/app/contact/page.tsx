import type { Metadata } from 'next';
import Image from 'next/image';
import { ContactInfo } from '@/components/features/contact/contact-info';
import { ContactForm } from '@/components/features/contact/contact-form';

export const metadata: Metadata = {
  title: 'Liên Hệ Báo Giá | Bao Bì Đức Trọng',
  description:
    'Liên hệ ngay với Bao Bì Đức Trọng để nhận tư vấn và báo giá các giải pháp bao bì nông sản chất lượng cao, giá tốt nhất.',
};

export default function ContactPage() {
  return (
    <div className="relative min-h-[calc(100vh-80px)] w-full overflow-hidden bg-[#f7faf8]">
      {/* Background Graphic Illustration */}
      <div className="absolute inset-0 pointer-events-none select-none -z-10">
        <Image
          src="/images/contact/background.png"
          alt="Bao Bì Đức Trọng Background"
          fill
          priority
          className="object-cover object-top opacity-95"
        />
      </div>

      {/* Main Container */}
      <div className="relative max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-16 items-center">
          {/* Left Column: Brand Info, 3D Product Mockup & Trust Badges */}
          <div className="lg:col-span-6 xl:col-span-6">
            <ContactInfo />
          </div>

          {/* Right Column: Contact & Quote Form Card */}
          <div className="lg:col-span-6 xl:col-span-6">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
