import { ChangeEvent, DragEvent, RefObject } from 'react';

interface ContactFileUploadProps {
  fileInputRef: RefObject<HTMLInputElement | null>;
  selectedFile: File | null;
  isDragging: boolean;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: DragEvent<HTMLDivElement>) => void;
  onDrop: (e: DragEvent<HTMLDivElement>) => void;
  onRemoveFile: (e: React.MouseEvent) => void;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export function ContactFileUpload({
  fileInputRef,
  selectedFile,
  isDragging,
  onFileChange,
  onDragOver,
  onDragLeave,
  onDrop,
  onRemoveFile,
}: ContactFileUploadProps) {
  return (
    <div>
      <label className="flex items-center gap-2 text-xs sm:text-[13px] font-semibold text-gray-800 mb-1.5">
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
        onChange={onFileChange}
        className="hidden"
        id="contact-file-upload"
      />

      {!selectedFile ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`border border-dashed rounded-lg p-5 flex flex-col items-center justify-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-[#0c5c36] bg-green-50/50'
              : 'border-gray-300 hover:border-[#0c5c36] hover:bg-green-50/20 bg-white'
          }`}
        >
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
            onClick={onRemoveFile}
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
  );
}
