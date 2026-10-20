'use client';

import { useContactForm } from './use-contact-form';
import { ContactFormHeader } from './contact-form-header';
import { ContactFormAlert } from './contact-form-alert';
import { ContactFormField } from './contact-form-field';
import { ContactFileUpload } from './contact-file-upload';
import { ContactSubmitButton } from './contact-submit-button';
import { BuildingIcon, UserIcon, PhoneIcon, MessageIcon } from './contact-icons';

export function ContactForm() {
  const {
    formData,
    selectedFile,
    isDragging,
    isSubmitting,
    status,
    fileInputRef,
    handleInputChange,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleRemoveFile,
    handleSubmit,
  } = useContactForm();

  return (
    <div className="w-full bg-white rounded-[24px] sm:rounded-[30px] border border-gray-200/90 shadow-xl shadow-black/[0.04] p-6 sm:p-8 lg:p-9">
      <ContactFormHeader />
      <ContactFormAlert status={status} />

      <form onSubmit={handleSubmit} className="space-y-4">
        <ContactFormField
          id="companyName"
          name="companyName"
          label="Tên cơ sở/ doanh nghiệp"
          icon={<BuildingIcon />}
          value={formData.companyName}
          onChange={handleInputChange}
          placeholder="Nhập tên cơ sở hoặc doanh nghiệp của bạn"
          required
        />

        <ContactFormField
          id="customerName"
          name="customerName"
          label="Tên của bạn"
          icon={<UserIcon />}
          value={formData.customerName}
          onChange={handleInputChange}
          placeholder="Nhập tên của bạn"
          required
        />

        <ContactFormField
          id="phone"
          name="phone"
          type="tel"
          label="Số điện thoại"
          icon={<PhoneIcon />}
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="Nhập số điện thoại của bạn"
          required
        />

        <ContactFormField
          id="message"
          name="message"
          type="textarea"
          label="Yêu cầu hỗ trợ"
          icon={<MessageIcon />}
          value={formData.message}
          onChange={handleInputChange}
          placeholder="Loại vật tư, số lượng cần , tần xuất đặt hàng,..."
        />

        <ContactFileUpload
          fileInputRef={fileInputRef}
          selectedFile={selectedFile}
          isDragging={isDragging}
          onFileChange={handleFileChange}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onRemoveFile={handleRemoveFile}
        />

        <ContactSubmitButton isSubmitting={isSubmitting} />
      </form>
    </div>
  );
}
