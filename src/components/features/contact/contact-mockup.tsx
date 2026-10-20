import Image from 'next/image';

export function ContactMockup() {
  return (
    <div className="relative my-6 sm:my-8 flex justify-center items-center">
      <div className="relative w-full max-w-[460px] aspect-square transition-transform hover:scale-[1.02] duration-300">
        <Image
          src="/images/contact/contact_image.png"
          alt="Bao Bì Đức Trọng - Giải pháp bao bì toàn diện cho nông sản"
          fill
          sizes="(max-width: 768px) 100vw, 460px"
          className="object-contain drop-shadow-md"
          priority
        />
      </div>
    </div>
  );
}
