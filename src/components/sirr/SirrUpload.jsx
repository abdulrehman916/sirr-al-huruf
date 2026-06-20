import { useState, useCallback } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const G = {
  border: 'rgba(212,175,55,0.40)',
  borderHi: 'rgba(212,175,55,0.65)',
  glow: 'rgba(212,175,55,0.22)',
  glowHi: 'rgba(212,175,55,0.55)',
  text: '#F5D060',
  dim: 'rgba(212,175,55,0.55)',
  bg: 'rgba(212,175,55,0.07)',
  bgHi: 'rgba(212,175,55,0.14)',
};

export default function SirrUpload({ onFileUploaded, onAnalysisComplete }) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleFileSelect = useCallback(async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setError('File size must be less than 25MB');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      // Upload file using Base44 SDK
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      
      setUploadProgress(100);
      setUploadedFile({ name: file.name, size: file.size, url: file_url });
      onFileUploaded({ name: file.name, size: file.size, url: file_url });
      
      // Trigger analysis
      onAnalysisComplete(file_url);
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  }, [onFileUploaded, onAnalysisComplete]);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0];
    if (file && file.type === 'application/pdf') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'application/pdf';
      input.files = [file];
      handleFileSelect({ target: input });
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
  }, []);

  return (
    <div
      className="rounded-2xl border p-8 relative overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, rgba(8,20,52,0.98) 0%, rgba(4,12,34,0.99) 100%)',
        borderColor: G.borderHi,
        boxShadow: `0 0 40px ${G.glow}, 0 4px 28px rgba(0,0,0,0.50), inset 0 1px 0 rgba(212,175,55,0.10)`,
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, rgba(212,175,55,0.35), transparent)` }}
      />

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed rounded-xl p-12 text-center transition-all"
        style={{
          borderColor: isUploading ? G.border : 'rgba(255,255,255,0.15)',
          background: isUploading ? G.bg : 'rgba(255,255,255,0.02)',
        }}
      >
        {isUploading ? (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full border-4 border-t-transparent animate-spin"
              style={{ borderColor: G.border, borderTopColor: 'transparent' }}
            />
            <p className="font-inter text-sm" style={{ color: G.text }}>
              Uploading PDF...
            </p>
            {uploadProgress > 0 && (
              <div className="w-full max-w-xs mx-auto h-2 rounded-full overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.1)' }}
              >
                <div
                  className="h-full transition-all duration-300"
                  style={{
                    width: `${uploadProgress}%`,
                    background: `linear-gradient(90deg, ${G.border}, ${G.text})`,
                  }}
                />
              </div>
            )}
          </div>
        ) : uploadedFile ? (
          <div className="space-y-3">
            <CheckCircle className="w-16 h-16 mx-auto" style={{ color: G.text }} />
            <p className="font-inter text-lg font-semibold" style={{ color: G.text }}>
              {uploadedFile.name}
            </p>
            <p className="font-inter text-xs" style={{ color: G.dim }}>
              {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="w-16 h-16 mx-auto" style={{ color: G.dim }} />
            <div>
              <p className="font-inter text-lg font-semibold" style={{ color: G.text }}>
                Upload PDF Document
              </p>
              <p className="font-inter text-xs mt-1" style={{ color: G.dim }}>
                Drag & drop or click to browse
              </p>
            </div>
            <p className="font-inter text-[10px] uppercase tracking-widest" style={{ color: G.dim }}>
              Supports Arabic, English, Malayalam • Max 25MB
            </p>
            <label className="inline-block">
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
              <span
                className="font-inter text-xs font-bold px-6 py-2.5 rounded-xl cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, ${G.text} 0%, #e0a820 50%, #c98a14 100%)`,
                  color: '#0d1b2a',
                  boxShadow: `0 0 20px ${G.glowHi}`,
                }}
              >
                Select PDF
              </span>
            </label>
          </div>
        )}
      </div>

      {error && (
        <div
          className="mt-4 flex items-center gap-2 px-4 py-3 rounded-xl"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}
        >
          <AlertCircle className="w-4 h-4" style={{ color: '#ef4444' }} />
          <span className="font-inter text-xs" style={{ color: '#fca5a5' }}>{error}</span>
        </div>
      )}
    </div>
  );
}