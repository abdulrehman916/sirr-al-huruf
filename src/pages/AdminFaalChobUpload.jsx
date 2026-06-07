import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Upload, CheckCircle, AlertCircle, Loader2, FileText } from "lucide-react";
import PageLayout from "../components/PageLayout";
import ErrorBoundary from "../components/ErrorBoundary";

const G = {
  borderHi: "rgba(212,175,55,0.65)",
  glow: "rgba(212,175,55,0.22)",
  glowHi: "rgba(212,175,55,0.55)",
  text: "#F5D060",
  dim: "rgba(212,175,55,0.55)",
};

export default function AdminFaalChobUpload() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState(null);

  const processMutation = useMutation({
    mutationFn: async (fileUrls) => {
      const res = await base44.functions.invoke('extractFaalChobText', { screenshotUrls: fileUrls });
      return res.data;
    },
  });

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    
    setUploading(true);
    try {
      const fileUrls = [];
      for (const file of files) {
        const res = await base44.integrations.Core.UploadFile({ file });
        fileUrls.push(res.file_url);
      }

      const result = await processMutation.mutateAsync(fileUrls);
      setResults(result);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <PageLayout>
      <ErrorBoundary>
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Header */}
            <div className="text-center py-8">
              <h1 className="font-amiri text-4xl font-bold mb-2" style={{ color: G.text }}>
                فال چوب — Admin Upload
              </h1>
              <p className="font-inter text-sm text-white/60">
                Upload Faal Chob card screenshots to extract and update translations
              </p>
            </div>

            {/* Upload Section */}
            <div className="rounded-2xl border p-6" style={{ 
              background: "rgba(8,16,38,0.95)", 
              borderColor: "rgba(212,175,55,0.22)" 
            }}>
              <div className="flex items-center gap-3 mb-4">
                <Upload className="w-5 h-5" style={{ color: G.text }} />
                <h2 className="font-inter font-bold text-lg text-white/90">Upload Screenshots</h2>
              </div>

              <div className="space-y-4">
                <label className="block">
                  <span className="font-inter text-xs text-white/70 mb-2 block">
                    Select card screenshots (PNG, JPG)
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="block w-full text-sm text-white/70
                      file:mr-4 file:py-2.5 file:px-4
                      file:rounded-xl file:border-0
                      file:text-xs file:font-bold
                      file:bg-slate-800 file:text-white
                      hover:file:bg-slate-700
                      transition-colors"
                    style={{ 
                      background: "rgba(4,12,34,0.97)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: "0.75rem"
                    }}
                  />
                </label>

                {files.length > 0 && (
                  <div className="flex items-center justify-between p-3 rounded-xl" style={{ 
                    background: "rgba(212,175,55,0.06)",
                    border: "1px solid rgba(212,175,55,0.15)"
                  }}>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" style={{ color: G.text }} />
                      <span className="font-inter text-xs text-white/80">
                        {files.length} file{files.length !== 1 ? 's' : ''} selected
                      </span>
                    </div>
                    <motion.button
                      onClick={handleUpload}
                      disabled={uploading || processMutation.isPending}
                      whileHover={{ scale: uploading ? 1 : 1.02 }}
                      whileTap={{ scale: uploading ? 1 : 0.98 }}
                      className="px-5 py-2.5 rounded-xl font-inter font-bold text-xs text-[#0d1b2a]"
                      style={{
                        background: uploading 
                          ? "rgba(255,255,255,0.2)" 
                          : "linear-gradient(135deg,#f6d860 0%,#e0a820 50%,#c98a14 100%)",
                        boxShadow: uploading ? "none" : `0 0 24px ${G.glowHi}`,
                        cursor: uploading ? "not-allowed" : "pointer"
                      }}
                    >
                      {uploading || processMutation.isPending ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Processing...
                        </span>
                      ) : (
                        "Upload & Process"
                      )}
                    </motion.button>
                  </div>
                )}
              </div>
            </div>

            {/* Results */}
            {results && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="rounded-2xl border p-6" style={{ 
                  background: "rgba(8,16,38,0.95)", 
                  borderColor: "rgba(212,175,55,0.22)" 
                }}>
                  <h2 className="font-inter font-bold text-lg text-white/90 mb-4">Processing Results</h2>
                  
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="rounded-xl p-3 text-center" style={{ 
                      background: "rgba(212,175,55,0.08)",
                      border: "1px solid rgba(212,175,55,0.20)"
                    }}>
                      <div className="font-inter text-2xl font-bold" style={{ color: G.text }}>
                        {results.results?.filter(r => r.success).length || 0}
                      </div>
                      <div className="font-inter text-[9px] uppercase tracking-widest text-white/60 mt-1">
                        Successful
                      </div>
                    </div>
                    <div className="rounded-xl p-3 text-center" style={{ 
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.12)"
                    }}>
                      <div className="font-inter text-2xl font-bold text-white/80">
                        {results.results?.filter(r => r.skipped).length || 0}
                      </div>
                      <div className="font-inter text-[9px] uppercase tracking-widest text-white/60 mt-1">
                        Skipped
                      </div>
                    </div>
                    <div className="rounded-xl p-3 text-center" style={{ 
                      background: "rgba(239,68,68,0.12)",
                      border: "1px solid rgba(239,68,68,0.25)"
                    }}>
                      <div className="font-inter text-2xl font-bold" style={{ color: "#ef4444" }}>
                        {results.results?.filter(r => !r.success).length || 0}
                      </div>
                      <div className="font-inter text-[9px] uppercase tracking-widest text-white/60 mt-1">
                        Failed
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {results.results?.map((result, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 rounded-xl" style={{ 
                        background: result.success 
                          ? "rgba(34,197,94,0.08)" 
                          : "rgba(239,68,68,0.08)",
                        border: `1px solid ${result.success ? 'rgba(34,197,94,0.20)' : 'rgba(239,68,68,0.20)'}`
                      }}>
                        {result.success ? (
                          <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#22c55e" }} />
                        ) : (
                          <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#ef4444" }} />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-inter text-xs font-medium text-white/90 truncate">
                            {result.combination || result.url?.split('/').pop() || 'Unknown'}
                          </div>
                          <div className="font-inter text-[10px] text-white/60 truncate">
                            {result.message || result.error || `Grid Pos: ${result.gridPos || 'N/A'}`}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </ErrorBoundary>
    </PageLayout>
  );
}