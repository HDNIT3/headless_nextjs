'use client';

import { useState, useRef, DragEvent, ChangeEvent, FormEvent } from 'react';

export function ContactForm() {
  const [formData, setFormData] = useState({
    companyName: '',
    customerName: '',
    phone: '',
    message: '',
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
    unconfigured?: boolean;
  }>({ type: null, message: '' });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (status.type) {
      setStatus({ type: null, message: '' });
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    const MAX_SIZE = 15 * 1024 * 1024; // 15MB
    if (file.size > MAX_SIZE) {
      setStatus({
        type: 'error',
        message: 'Dung lượng file vượt quá giới hạn 15MB. Vui lòng chọn file nhỏ hơn.',
      });
      return;
    }
    setSelectedFile(file);
    setStatus({ type: null, message: '' });
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.companyName.trim()) {
      setStatus({
        type: 'error',
        message: 'Vui lòng nhập tên cơ sở hoặc doanh nghiệp của bạn.',
      });
      return;
    }

    if (!formData.customerName.trim()) {
      setStatus({
        type: 'error',
        message: 'Vui lòng nhập tên của bạn.',
      });
      return;
    }

    if (!formData.phone.trim()) {
      setStatus({
        type: 'error',
        message: 'Vui lòng nhập số điện thoại để chúng tôi liên hệ.',
      });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: null, message: '' });

    try {
      const data = new FormData();
      data.append('companyName', formData.companyName.trim());
      data.append('customerName', formData.customerName.trim());
      data.append('phone', formData.phone.trim());
      data.append('message', formData.message.trim());
      if (selectedFile) {
        data.append('file', selectedFile);
      }

      const res = await fetch('/api/contact', {
        method: 'POST',
        body: data,
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setStatus({
          type: 'success',
          message:
            result.message ||
            'Gửi yêu cầu báo giá thành công! Chúng tôi sẽ liên hệ lại với bạn trong thời gian sớm nhất.',
        });
        // Reset form
        setFormData({
          companyName: '',
          customerName: '',
          phone: '',
          message: '',
        });
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        setStatus({
          type: 'error',
          message:
            result.error ||
            'Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại.',
          unconfigured: result.configured === false,
        });
      }
    } catch {
      setStatus({
        type: 'error',
        message:
          'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-[24px] sm:rounded-[30px] border border-gray-200/90 shadow-xl shadow-black/[0.04] p-6 sm:p-8 lg:p-9">
      {/* Header Form */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight leading-snug">
          CẦN HỖ TRỢ BÁO GIÁ CHO DOANH NGHIỆP CỦA BẠN?
        </h2>
        <p className="mt-2 text-xs sm:text-[13.5px] text-gray-500 leading-relaxed font-normal">
          Gửi thông tin nhu cầu (loại vật tư, số lượng, tần suất đặt hàng. Chúng
          tôi sẽ liên hệ báo giá trong thời gian sớm nhất.
        </p>
      </div>

      {/* Thông báo trạng thái */}
      {status.type && (
        <div
          className={`mb-5 p-4 rounded-xl text-sm flex items-start gap-3 transition-all ${
            status.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {status.type === 'success' ? (
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
      )}

      {/* Form Submission */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Field 1: Tên cơ sở/ doanh nghiệp */}
        <div>
          <label
            htmlFor="companyName"
            className="flex items-center gap-2 text-xs sm:text-[13px] font-semibold text-gray-800 mb-1.5"
          >
            {/* Store / Building icon */}
            <svg
              className="w-4 h-4 text-[#0c5c36]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M3 9h18" />
              <path d="M9 21V9" />
            </svg>
            <span>
              Tên cơ sở/ doanh nghiệp <span className="text-red-500">*</span>
            </span>
          </label>
          <input
            id="companyName"
            name="companyName"
            type="text"
            required
            value={formData.companyName}
            onChange={handleInputChange}
            placeholder="Nhập tên cơ sở hoặc doanh nghiệp của bạn"
            className="w-full px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm text-gray-800 placeholder-gray-400 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#0c5c36] focus:ring-1 focus:ring-[#0c5c36] transition-colors"
          />
        </div>

        {/* Field 2: Tên của bạn */}
        <div>
          <label
            htmlFor="customerName"
            className="flex items-center gap-2 text-xs sm:text-[13px] font-semibold text-gray-800 mb-1.5"
          >
            {/* User icon */}
            <svg
              className="w-4 h-4 text-[#0c5c36]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>
              Tên của bạn <span className="text-red-500">*</span>
            </span>
          </label>
          <input
            id="customerName"
            name="customerName"
            type="text"
            required
            value={formData.customerName}
            onChange={handleInputChange}
            placeholder="Nhập tên của bạn"
            className="w-full px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm text-gray-800 placeholder-gray-400 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#0c5c36] focus:ring-1 focus:ring-[#0c5c36] transition-colors"
          />
        </div>

        {/* Field 3: Số điện thoại */}
        <div>
          <label
            htmlFor="phone"
            className="flex items-center gap-2 text-xs sm:text-[13px] font-semibold text-gray-800 mb-1.5"
          >
            {/* Phone icon */}
            <svg
              className="w-4 h-4 text-[#0c5c36]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span>
              Số điện thoại <span className="text-red-500">*</span>
            </span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Nhập số điện thoại của bạn"
            className="w-full px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm text-gray-800 placeholder-gray-400 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#0c5c36] focus:ring-1 focus:ring-[#0c5c36] transition-colors"
          />
        </div>

        {/* Field 4: Yêu cầu hỗ trợ */}
        <div>
          <label
            htmlFor="message"
            className="flex items-center gap-2 text-xs sm:text-[13px] font-semibold text-gray-800 mb-1.5"
          >
            {/* Chat bubble icon */}
            <svg
              className="w-4 h-4 text-[#0c5c36]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span>Yêu cầu hỗ trợ</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={3}
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Loại vật tư, số lượng cần , tần xuất đặt hàng,..."
            className="w-full px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm text-gray-800 placeholder-gray-400 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#0c5c36] focus:ring-1 focus:ring-[#0c5c36] transition-colors resize-y min-h-[85px]"
          />
        </div>

        {/* Field 5: Đính kèm file (nếu có) */}
        <div>
          <label className="flex items-center gap-2 text-xs sm:text-[13px] font-semibold text-gray-800 mb-1.5">
            {/* Attachment icon */}
            <svg
              className="w-4 h-4 text-[#0c5c36]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <line x1="9" y1="15" x2="15" y2="15" />
            </svg>
            <span>Đính kèm file (nếu có)</span>
          </label>

          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            className="hidden"
            id="contact-file-upload"
          />

          {!selectedFile ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border border-dashed rounded-lg p-5 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                isDragging
                  ? 'border-[#0c5c36] bg-green-50/50'
                  : 'border-gray-300 hover:border-[#0c5c36] hover:bg-green-50/20 bg-white'
              }`}
            >
              {/* Upload arrow icon */}
              <svg
                className="w-6 h-6 text-[#0c5c36] mb-1.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <p className="text-xs sm:text-[13px] text-gray-500 font-medium text-center">
                Upload tài liệu bạn muốn lên tại đây
              </p>
              <p className="text-[11px] text-gray-400 mt-1">
                (Hình ảnh, PDF, Word, Excel tối đa 15MB)
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 border border-[#0c5c36]/40 bg-green-50/30 rounded-lg">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <svg
                  className="w-5 h-5 text-[#0c5c36] flex-shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                <div className="truncate text-xs sm:text-sm">
                  <span className="font-medium text-gray-800">
                    {selectedFile.name}
                  </span>
                  <span className="text-gray-500 text-xs ml-2">
                    ({formatFileSize(selectedFile.size)})
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={removeFile}
                className="text-gray-400 hover:text-red-500 p-1 rounded-md transition-colors"
                title="Xóa tệp"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Submit button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#f15a24] hover:bg-[#e04c06] active:scale-[0.99] text-white font-bold py-3 sm:py-3.5 px-6 rounded-lg transition-all flex items-center justify-center gap-2 text-sm sm:text-base shadow-sm disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Đang gửi yêu cầu...</span>
              </>
            ) : (
              <>
                <span>Gửi yêu cầu</span>
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
