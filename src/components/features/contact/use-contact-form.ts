'use client';

import { useState, useRef, ChangeEvent, DragEvent, FormEvent } from 'react';
import { ContactFormData, ContactFormStatus } from './types';

const INITIAL_FORM_DATA: ContactFormData = {
  companyName: '',
  customerName: '',
  phone: '',
  message: '',
};

const MAX_FILE_SIZE = 15 * 1024 * 1024;

export function useContactForm() {
  const [formData, setFormData] = useState<ContactFormData>(INITIAL_FORM_DATA);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<ContactFormStatus>({
    type: null,
    message: '',
  });

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

  const validateAndSetFile = (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      setStatus({
        type: 'error',
        message: 'Dung lượng file vượt quá giới hạn 15MB. Vui lòng chọn file nhỏ hơn.',
      });
      return;
    }
    setSelectedFile(file);
    setStatus({ type: null, message: '' });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
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

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
        setFormData(INITIAL_FORM_DATA);
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        setStatus({
          type: 'error',
          message:
            result.error || 'Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại.',
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

  return {
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
  };
}
