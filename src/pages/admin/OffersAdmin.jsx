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
      const res = await API.post("/api/v1/public/getOfferPhoto");
      const response = res.data?.response;
      if (!response) return;

      const { imgUrl1, imgUrl2, imgUrl3, imgUrl4, imgUrl5 } = response;
      setImages([imgUrl1, imgUrl2, imgUrl3, imgUrl4, imgUrl5]);
    } catch (err) {
      console.error(err);
      toast.error("Unable to load offer banners");
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
      if (newFile.size > 20 * 1024 * 1024) {
        toast.error(
          "Selected image is too large. Please choose a smaller file."
        );
        return;
      }

      const optimizedFile = await resizeImage(newFile, 1200, 1200, 0.7);

      if (optimizedFile.size > MAX_SIZE) {
        toast.error("Image exceeds size limit after optimization");
        return;
      }

      const uploadedUrls = await ImageUploader([optimizedFile]);
      const uploadedUrl = uploadedUrls[0];
      if (!uploadedUrl) {
        toast.error("Image upload failed. Please try again.");
        return;
      }

      const res = await API.post("/auth/api/v1/admin/addOfferPhoto", {
        position: selectedIndex + 1,
        imgUrl: uploadedUrl,
      });

      const updatedImages = [...images];
      updatedImages[selectedIndex] = uploadedUrl;
      setImages(updatedImages);

      toast.success(
        res.data?.response?.response || "Offer banner updated successfully"
      );
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while saving the banner");
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
    <div className="p-3 sm:p-4">
      {/* PAGE HEADER */}
      <div className="mb-4">
        <h1 className="text-lg sm:text-xl font-semibold text-[#7c1d1d]">
          Offer Banner Management
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Manage promotional banners displayed on the homepage carousel
        </p>
      </div>

      {/* PREVIEW MODAL */}
      {previewImage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 px-3">
          <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-md">
            <h2 className="text-base sm:text-lg font-semibold mb-1">
              Banner Preview
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mb-3">
              This banner will be shown on the homepage offer carousel.
            </p>

            <img
              src={previewImage}
              alt="Homepage Offer Banner Preview"
              className="w-full h-48 sm:h-64 object-cover rounded"
            />

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
              <button
                onClick={handleCancel}
                className="w-full sm:w-auto px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel Changes
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full sm:w-auto px-4 py-2 bg-[#7c1d1d] text-white rounded"
              >
                {isSaving ? "Saving Banner..." : "Save Banner"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IMAGE GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        {images.map((url, index) => (
          <div
            key={index}
            className="relative rounded-xl overflow-hidden border shadow group"
          >
            {url ? (
              <img
                src={url}
                alt={`Homepage Offer Banner ${index + 1}`}
                className="w-full h-36 sm:h-44 md:h-48 object-cover"
              />
            ) : (
              <div className="w-full h-36 sm:h-44 md:h-48 bg-gray-200 flex items-center justify-center text-gray-500 text-xs sm:text-sm">
                Banner Slot Empty
              </div>
            )}

            <button
              title="Edit Banner Image"
              onClick={() => handleEditClick(index)}
              className="
                absolute top-2 right-2
                bg-white p-1.5 rounded-full shadow
                opacity-100 sm:opacity-0 sm:group-hover:opacity-100
                transition
              "
            >
              <Pencil size={16} />
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
