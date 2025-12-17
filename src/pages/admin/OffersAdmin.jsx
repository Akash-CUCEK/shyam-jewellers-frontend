import React, { useEffect, useRef, useState } from "react";
import { API } from "../../utils/API";
import { Pencil } from "lucide-react";
import { ImageUploader } from "../../utils/ImageUploader";
import toast from "react-hot-toast";

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
      const res = await API.post(
        "/auth/api/v1/admin/getOfferPhoto",
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const response = res.data?.response;

      if (!response) {
        setImages([null, null, null, null, null]);
        return;
      }

      const { imgUrl1, imgUrl2, imgUrl3, imgUrl4, imgUrl5 } = response;
      setImages([imgUrl1, imgUrl2, imgUrl3, imgUrl4, imgUrl5]);
    } catch (err) {
      console.error("❌ Failed to fetch offer photos:", err);
      setImages([null, null, null, null, null]);
    }
  };

  const handleEditClick = (index) => {
    fileInputRefs.current[index]?.click();
  };

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setPreviewImage(previewUrl);
    setSelectedIndex(index);
    setNewFile(file);
  };

  const handleSave = async () => {
    if (!newFile || selectedIndex === null) return;

    setIsSaving(true);

    const uploadedUrls = await ImageUploader([newFile]);
    const uploadedUrl = uploadedUrls[0];

    if (!uploadedUrl) {
      toast.error("❌ Upload failed.");
      setIsSaving(false);
      return;
    }

    try {
      const res = await axios.post(
        "/auth/api/v1/admin/addOfferPhoto",
        {
          position: selectedIndex + 1,
          imgUrl: uploadedUrl,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const updatedImages = [...images];
      updatedImages[selectedIndex] = uploadedUrl;
      setImages(updatedImages);

      // ✅ Toast
      toast.success(
        res.data?.response?.response || "Photo updated successfully!"
      );
    } catch (err) {
      toast.error("❌ Backend update failed.");
    }

    setIsSaving(false);
    setPreviewImage(null);
    setSelectedIndex(null);
    setNewFile(null);
  };

  const handleCancel = () => {
    setPreviewImage(null);
    setSelectedIndex(null);
    setNewFile(null);
  };

  return (
    <div className="relative p-4">
      {/* Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full animate-fade-in">
            <h2 className="text-lg font-semibold mb-4">Preview Image</h2>
            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-64 object-cover rounded"
            />
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`px-4 py-2 rounded text-white font-medium shadow ${
                  isSaving
                    ? "bg-[#b14a4a] cursor-not-allowed"
                    : "bg-[#7c1d1d] hover:bg-[#621010] cursor-pointer"
                }`}
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
            className="relative group rounded-xl overflow-hidden shadow-md border"
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
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-white rounded-full p-1 shadow transition duration-300"
            >
              <Pencil size={20} />
            </button>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, index)}
              className="hidden"
              ref={(el) => (fileInputRefs.current[index] = el)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default OfferPhotoSection;
