import React, { useState, useEffect, useCallback, useRef } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../../utils/cropUtils";
import { ImageUploader } from "../../utils/ImageUploader";
import { Pencil, User } from "lucide-react";
import { toast } from "react-hot-toast";
import { API } from "../../utils/API"; // ✅ FIX

export default function EditProfileModal({ onClose }) {
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const fetchedOnce = useRef(false);

  const handleCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setImage(imageUrl);
    setShowCropper(true);
  };

  const cropImage = async () => {
    try {
      const cropped = await getCroppedImg(
        image,
        croppedAreaPixels,
        "cropped.jpeg"
      );
      setCroppedImage(cropped);
      setShowCropper(false);
    } catch {
      toast.error("Failed to crop image");
    }
  };

  // ✅ fetch profile once
  useEffect(() => {
    if (fetchedOnce.current) return;
    fetchedOnce.current = true;

    const fetchProfile = async () => {
      const email = sessionStorage.getItem("email");
      if (!email) return toast.error("No email found");

      try {
        const res = await API.post("/auth/api/v1/admin/getAdminByEmail", {
          email,
        });

        const data = res.data.response;
        setFullName(data?.name || "");
        setPhone(data?.phoneNumber || "");
        if (data?.imageUrl) setCroppedImage(data.imageUrl);
      } catch {
        toast.error("Failed to load profile");
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      let uploadedUrl = croppedImage;

      if (croppedImage && !croppedImage.startsWith("http")) {
        const blob = await fetch(croppedImage).then((r) => r.blob());
        const file = new File([blob], "profile.jpg", {
          type: "image/jpeg",
        });
        const urls = await ImageUploader([file]);
        uploadedUrl = urls[0];
      }

      const email = sessionStorage.getItem("email");

      await API.post("/auth/api/v1/admin/editAdmin", {
        name: fullName,
        email,
        phoneNumber: phone,
        imageUrl: uploadedUrl,
      });

      toast.success("Profile updated successfully");
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
        <h2 className="text-2xl font-semibold text-[#6e1414] mb-4 text-center">
          Edit Profile
        </h2>

        {/* Avatar */}
        <div className="flex justify-center mb-4">
          <div className="relative w-28 h-28 rounded-full border bg-gray-100 overflow-hidden">
            {croppedImage ? (
              <img
                src={croppedImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-full h-full p-6 text-gray-400" />
            )}
            <label className="absolute bottom-1 right-1 bg-white p-1 rounded-full cursor-pointer">
              <Pencil className="w-4 h-4 text-[#7c1d1d]" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Full Name"
            className="w-full border p-2 rounded"
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone Number"
            className="w-full border p-2 rounded"
          />

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="bg-[#7c1d1d] text-white px-6 py-2 rounded"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>

        {/* Cropper */}
        {showCropper && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
            <div className="bg-white p-4 rounded w-full max-w-lg">
              <div className="relative h-64">
                <Cropper
                  image={image}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={handleCropComplete}
                />
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <button onClick={() => setShowCropper(false)}>Cancel</button>
                <button
                  className="bg-[#7c1d1d] text-white px-4 py-1 rounded"
                  onClick={cropImage}
                >
                  Crop & Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
