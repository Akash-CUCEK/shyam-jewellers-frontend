import React, { useEffect, useRef, useState } from "react";
import { API } from "../../utils/API";
import { Pencil } from "lucide-react";
import { ImageUploader } from "../../utils/ImageUploader";
import { resizeImage } from "../../utils/resizeImage";
import toast from "react-hot-toast";

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

const OfferPhotoSection = () => {
  const [images, setImages] = useState([null, null, null, null, null]);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [newFile, setNewFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRefs = useRef([]);

  useEffect(() => {
    fetchOfferPhotos();
  }, []);

  const fetchOfferPhotos = async () => {
    try {
      const res = await API.post("/auth/api/v1/admin/getOfferPhoto");
      const response = res.data?.response;

      if (!response) return;

      const { imgUrl1, imgUrl2, imgUrl3, imgUrl4, imgUrl5 } = response;
      setImages([imgUrl1, imgUrl2, imgUrl3, imgUrl4, imgUrl5]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load offer images");
    }
  };

  const handleEditClick = (index) => {
    fileInputRefs.current[index]?.click();
  };

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreviewImage(URL.createObjectURL(file));
    setSelectedIndex(index);
    setNewFile(file);
  };

  const handleSave = async () => {
    if (!newFile || selectedIndex === null) return;

    setIsSaving(true);

    try {
      // ❌ very large image guard (UX)
      if (newFile.size > 20 * 1024 * 1024) {
        toast.error("Image too large. Choose a smaller image.");
        return;
      }

      // ✅ resize + compress
      const optimizedFile = await resizeImage(newFile, 1200, 1200, 0.7);

      if (optimizedFile.size > MAX_SIZE) {
        toast.error("Image still exceeds 10MB after compression");
        return;
      }

      // ⬆️ upload to cloudinary
      const uploadedUrls = await ImageUploader([optimizedFile]);
      const uploadedUrl = uploadedUrls[0];

      if (!uploadedUrl) {
        toast.error("Upload failed");
        return;
      }

      // 💾 save URL in backend
      const res = await API.post("/auth/api/v1/admin/addOfferPhoto", {
        position: selectedIndex + 1,
        imgUrl: uploadedUrl,
      });

      const updatedImages = [...images];
      updatedImages[selectedIndex] = uploadedUrl;
      setImages(updatedImages);

      toast.success(res.data?.response?.response || "Offer photo updated!");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setIsSaving(false);
      setPreviewImage(null);
      setSelectedIndex(null);
      setNewFile(null);
    }
  };

  const handleCancel = () => {
    setPreviewImage(null);
    setSelectedIndex(null);
    setNewFile(null);
  };

  return (
    <div className="p-4">
      {/* Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4">Preview</h2>
            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-64 object-cover rounded"
            />
            <div className="flex justify-end mt-4 gap-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-[#7c1d1d] text-white rounded"
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((url, index) => (
          <div
            key={index}
            className="relative rounded-xl overflow-hidden border shadow group"
          >
            {url ? (
              <img
                src={url}
                alt={`Offer ${index + 1}`}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}

            <button
              onClick={() => handleEditClick(index)}
              className="absolute top-2 right-2 bg-white p-1 rounded-full shadow opacity-0 group-hover:opacity-100 transition"
            >
              <Pencil size={18} />
            </button>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={(el) => (fileInputRefs.current[index] = el)}
              onChange={(e) => handleFileChange(e, index)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default OfferPhotoSection;
