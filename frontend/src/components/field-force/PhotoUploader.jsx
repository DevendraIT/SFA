import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Camera, Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";

export default function PhotoUploader({
  onUpload,
  uploading = false,
  existingPhotos = [],
  onRemove,
  maxPhotos = 5,
  label = "Upload Photo",
}) {
  const fileInputRef = useRef(null);
  const [previews, setPreviews] = useState(existingPhotos || []);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    const updatedPreviews = [...previews, ...newPreviews].slice(0, maxPhotos);
    setPreviews(updatedPreviews);

    if (onUpload) {
      for (const file of files) {
        await onUpload(file);
      }
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemove = (index) => {
    const updated = previews.filter((_, i) => i !== index);
    setPreviews(updated);
    if (onRemove) onRemove(index);
  };

  return (
    <div className="space-y-4">
      {/* Upload button */}
      <div className="flex items-center justify-center">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading || previews.length >= maxPhotos}
        />
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || previews.length >= maxPhotos}
          className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-dashed border-slate-300 text-sm font-medium text-slate-600 hover:border-blue-400 hover:text-blue-600 transition disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Camera size={20} />
          )}
          {uploading ? "Uploading..." : label}
        </motion.button>
      </div>

      {/* Photo Grid */}
      {previews.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <img
                src={preview}
                alt={`Photo ${index + 1}`}
                className="h-24 w-full object-cover rounded-xl border border-slate-200"
              />
              <button
                onClick={() => handleRemove(index)}
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-sm"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {previews.length === 0 && !uploading && (
        <div className="flex flex-col items-center justify-center py-8 text-slate-400">
          <ImageIcon size={32} className="mb-2" />
          <p className="text-sm">No photos uploaded yet</p>
        </div>
      )}

      <p className="text-xs text-slate-400 text-center">
        {previews.length}/{maxPhotos} photos · JPEG, PNG
      </p>
    </div>
  );
}

