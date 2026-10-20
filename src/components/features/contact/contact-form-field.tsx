import { ChangeEvent, ReactNode } from 'react';

interface ContactFormFieldProps {
  id: string;
  name: string;
  label: string;
  icon: ReactNode;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder: string;
  required?: boolean;
  type?: 'text' | 'tel' | 'textarea';
  rows?: number;
}

export function ContactFormField({
  id,
  name,
  label,
  icon,
  value,
  onChange,
  placeholder,
  required = false,
  type = 'text',
  rows = 3,
}: ContactFormFieldProps) {
  const commonInputClasses =
    'w-full px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm text-gray-800 placeholder-gray-400 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#0c5c36] focus:ring-1 focus:ring-[#0c5c36] transition-colors';

  return (
    <div>
      <label
        htmlFor={id}
        className="flex items-center gap-2 text-xs sm:text-[13px] font-semibold text-gray-800 mb-1.5"
      >
        <span className="text-[#0c5c36]">{icon}</span>
        <span>
          {label} {required && <span className="text-red-500">*</span>}
        </span>
      </label>

      {type === 'textarea' ? (
        <textarea
          id={id}
          name={name}
          rows={rows}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`${commonInputClasses} resize-y min-h-[85px]`}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={commonInputClasses}
        />
      )}
    </div>
  );
}
