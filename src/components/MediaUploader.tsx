import React, { useState, useRef } from 'react';
import { Upload, Trash2, Copy, Check, Link, Image as ImageIcon, Video as VideoIcon, FileUp, Sparkles, X } from 'lucide-react';

interface MediaUploaderProps {
  type: 'image' | 'video';
  label: string;
  value: string;
  onChange: (newValue: string) => void;
  onDelete?: () => void;
  placeholder?: string;
  className?: string;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  type,
  label,
  value,
  onChange,
  onDelete,
  placeholder = type === 'image' ? 'ضع رابط الصورة أو ارفع ملفاً...' : 'ضع رابط الفيديو أو ارفع ملفاً...',
  className = ''
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptTypes = type === 'image' ? 'image/*' : 'video/*';

  const showNotification = (msg: string) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleFileSelect = (file: File) => {
    if (!file) return;

    // Check mime type
    if (type === 'image' && !file.type.startsWith('image/')) {
      showNotification('يرجى اختيار ملف صورة صالح (PNG, JPG, WEBP, GIF)');
      return;
    }
    if (type === 'video' && !file.type.startsWith('video/')) {
      showNotification('يرجى اختيار ملف فيديو صالح (MP4, WEBM, MOV)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onChange(result);
        showNotification(type === 'image' ? 'تم رفع الصورة بنجاح 📸' : 'تم رفع الفيديو بنجاح 🎥');
      }
    };
    reader.onerror = () => {
      showNotification('حدث خطأ أثناء قراءة الملف من الجهاز');
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    } else {
      const pastedText = e.dataTransfer.getData('text');
      if (pastedText) {
        onChange(pastedText);
        showNotification('تم استخدام الرابط المسحوب بنجاح');
      }
    }
  };

  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    showNotification('تم نسخ رابط/بيانات الميديا إلى الحافظة 📋');
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        onChange(text);
        showNotification('تم لصق الرابط من الحافظة بنجاح 📋');
      }
    } catch {
      showNotification('لم نتمكن من الوصول للحافظة تلقائياً، يمكنك اللصق بالضغط Ctrl+V');
    }
  };

  const handleClear = () => {
    onChange('');
    if (onDelete) onDelete();
    showNotification(type === 'image' ? 'تم حذف الصورة 🗑️' : 'تم حذف الفيديو 🗑️');
  };

  return (
    <div className={`space-y-2 text-right ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-gray-300 font-extrabold text-xs flex items-center gap-1.5">
          {type === 'image' ? (
            <ImageIcon className="w-4 h-4 text-amber-400" />
          ) : (
            <VideoIcon className="w-4 h-4 text-red-400" />
          )}
          <span>{label}</span>
        </label>

        {value && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleCopy}
              className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 text-[10px] font-bold flex items-center gap-1 transition-colors"
              title="نسخ رابط أو بيانات الميديا"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'تم النسخ' : 'نسخ الرابط'}</span>
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="px-2 py-1 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-400 text-[10px] font-bold flex items-center gap-1 transition-colors border border-red-900/50"
              title={type === 'image' ? 'حذف الصورة' : 'حذف الفيديو'}
            >
              <Trash2 className="w-3 h-3" />
              <span>حذف</span>
            </button>
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptTypes}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
          }
        }}
        className="hidden"
      />

      {/* Drag and Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-4 transition-all text-center flex flex-col items-center justify-center gap-3 cursor-pointer ${
          isDragging
            ? 'border-[#e63946] bg-[#e63946]/10 scale-[1.01]'
            : value
            ? 'border-white/20 bg-black/40 hover:border-amber-500/50'
            : 'border-white/15 bg-[#181822] hover:border-amber-400/60'
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        {value ? (
          <div className="w-full space-y-2 relative group" onClick={(e) => e.stopPropagation()}>
            <div className="relative rounded-xl overflow-hidden bg-black max-h-48 flex items-center justify-center border border-white/10">
              {type === 'image' ? (
                <img
                  src={value}
                  alt="معاينة الميديا"
                  className="max-h-48 w-full object-contain"
                  onError={() => showNotification('تعذر تحميل الصورة من الرابط المكتوب')}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <video
                  src={value}
                  controls
                  className="max-h-48 w-full object-contain"
                  onError={() => showNotification('تعذر تشغيل الفيديو من الرابط المكتوب')}
                />
              )}

              {/* Overlay edit controls */}
              <div className="absolute inset-0 bg-black/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 p-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 text-black font-extrabold text-xs shadow-lg hover:scale-105 transition-transform flex items-center gap-1"
                >
                  <FileUp className="w-3.5 h-3.5" />
                  <span>تغيير الملف من الجهاز</span>
                </button>

                <button
                  type="button"
                  onClick={handleClear}
                  className="px-3 py-1.5 rounded-xl bg-red-600 text-white font-extrabold text-xs shadow-lg hover:scale-105 transition-transform flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>حذف</span>
                </button>
              </div>
            </div>

            <p className="text-[10px] text-gray-400 font-mono text-center truncate px-2">
              {value.startsWith('data:') ? '📂 ملف محلي مرفوع من الجهاز' : `🔗 ${value}`}
            </p>
          </div>
        ) : (
          <div className="space-y-2 py-2">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              {type === 'image' ? <Upload className="w-6 h-6 animate-bounce" /> : <FileUp className="w-6 h-6 animate-bounce" />}
            </div>

            <div>
              <p className="text-xs font-black text-white">
                اسقط ملف {type === 'image' ? 'الصورة' : 'الفيديو'} هنا (Drag & Drop)
              </p>
              <p className="text-[11px] text-amber-300/80 font-bold mt-0.5">
                أو اضغط للرفع المباشر من جهازك (PC / Mobile) 📁
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Manual URL / Clipboard Input Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Link className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-2.5" />
          <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full pr-8 pl-3 py-1.5 bg-[#1a1a24] border border-white/10 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-amber-400"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute left-2 top-2 text-gray-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={handlePasteFromClipboard}
          className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold text-amber-300 border border-white/10 shrink-0 transition-colors"
          title="لصق الرابط من حافظة الجهاز"
        >
          لصق 📋
        </button>
      </div>

      {statusMsg && (
        <div className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 p-2 rounded-xl border border-emerald-800/50 flex items-center gap-1.5 animate-fadeIn">
          <Sparkles className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}
    </div>
  );
};
