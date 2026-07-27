import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Camera, Image as ImageIcon, RefreshCw, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import PageHeader from "../../components/dashboard/PageHeader";
import SectionCard from "../../components/dashboard/SectionCard";
import PhotoUploader from "../../components/field-force/PhotoUploader";
import EmptyDashboard from "../../components/dashboard/EmptyDashboard";
import ErrorState from "../../components/dashboard/ErrorState";
import { TableSkeleton } from "../../components/dashboard/LoadingSkeleton";

export default function PhotoUploadPage() {
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Simulate loading existing photos (backend may not have a generic photo endpoint)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleUpload = async (file) => {
    try {
      setUploading(true);
      // Backend does not have a generic photo upload endpoint
      // Photos are attached to visits via fieldForceApi.uploadVisitPhoto(visitId, { photoUrl })
      toast.success("Photo ready for upload. Attach it to a visit via Visit Details.");
      const previewUrl = URL.createObjectURL(file);
      setUploadedPhotos((prev) => [...prev, { url: previewUrl, name: file.name, date: new Date().toISOString() }]);
    } catch (err) {
      toast.error("Failed to process photo");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (index) => {
    setUploadedPhotos((prev) => prev.filter((_, i) => i !== index));
    toast.success("Photo removed");
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-slate-200 rounded animate-pulse" />
        <TableSkeleton rows={3} cols={3} />
      </div>
    );
  }

  if (error) {
    return <ErrorState message="Failed to load photos" onRetry={() => setLoading(false)} />;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader title="Photo Upload" subtitle="Capture and manage field visit photos">
        <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full">
          {uploadedPhotos.length} photo(s)
        </span>
      </PageHeader>

      {/* Upload Section */}
      <SectionCard title="Upload Photos" icon={Camera} iconColor="text-blue-600" subtitle="JPEG, PNG - Max 5 photos">
        <PhotoUploader
          onUpload={handleUpload}
          onRemove={handleRemove}
          uploading={uploading}
          existingPhotos={uploadedPhotos.map((p) => p.url)}
          label="Capture or Choose Photo"
        />
      </SectionCard>

      {/* Uploaded Photos */}
      <SectionCard title="Uploaded Photos" icon={ImageIcon} iconColor="text-emerald-600">
        {uploadedPhotos.length === 0 ? (
          <EmptyDashboard
            title="No Photos"
            description="Photos you upload will appear here. Attach them to visits for geo-tagged verification."
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {uploadedPhotos.map((photo, index) => (
              <div key={index} className="relative group">
                <img
                  src={photo.url}
                  alt={photo.name}
                  className="h-40 w-full object-cover rounded-xl border border-slate-200"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition rounded-xl flex items-center justify-center gap-3">
                  <button
                    onClick={() => handleRemove(index)}
                    className="h-10 w-10 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-xs text-white bg-black/60 px-2 py-1 rounded-lg truncate">
                    {photo.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {/* Instructions */}
      <SectionCard title="How to Use" icon={Camera} iconColor="text-slate-600">
        <div className="space-y-3 text-sm text-slate-600">
          <p>1. Capture or choose a photo using the uploader above</p>
          <p>2. Go to <strong>Customer Visits</strong> and open a visit</p>
          <p>3. Attach the photo to the visit for geo-tagged verification</p>
          <p>4. Photos will be stored with location data for compliance</p>
        </div>
      </SectionCard>
    </motion.div>
  );
}

