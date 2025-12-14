import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../../utils/cropUtils";
import { ImageUploader } from "../../utils/ImageUploader";
import { Pencil, User } from "lucide-react";
import { toast } from "react-hot-toast";

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
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      setShowCropper(true);
    }
  };

  const cropImage = async () => {
    const cropped = await getCroppedImg(
      image,
      croppedAreaPixels,
      "cropped.jpeg"
    );
    setCroppedImage(cropped);
    setShowCropper(false);
  };

  // ✅ Only run once
  useEffect(() => {
    if (fetchedOnce.current) return;
    fetchedOnce.current = true;

    const fetchProfile = async () => {
      const email = sessionStorage.getItem("email");
      if (!email) return toast.error("No email found in session");

      try {
        const res = await API.post("/auth/api/v1/admin/getAdminByEmail", {
          email,
        });
        const data = res.data.response;

        setFullName(data.name || "");
        setPhone(data.phoneNumber || "");
        if (data.imageUrl) setCroppedImage(data.imageUrl);
      } catch (error) {
        toast.error("Failed to load profile data");
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      let uploadedUrls = [];

      if (croppedImage && !croppedImage.startsWith("http")) {
        const response = await fetch(croppedImage);
        const blob = await response.blob();
        const file = new File([blob], "profile.jpg", { type: "image/jpeg" });
        uploadedUrls = await ImageUploader([file]);
      }

      const email = sessionStorage.getItem("email");
      const payload = {
        name: fullName,
        email,
        phoneNumber: phone,
        imageUrl: uploadedUrls[0] || croppedImage || null,
      };

      const res = await API.post("/auth/api/v1/admin/editAdmin", payload);

      toast.success(res.data.message || "Profile updated successfully");
      onClose();
    } catch (err) {
      const errorMsg =
        err.response?.data?.messages?.[0]?.message ||
        err.response?.data?.message ||
        "Failed to edit profile";
      toast.error(errorMsg);
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

        <div className="flex justify-center mb-4">
          <div className="relative w-28 h-28 rounded-full border border-gray-300 bg-gray-100 flex items-center justify-center overflow-hidden">
            {croppedImage ? (
              <img
                src={croppedImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="text-gray-400 w-12 h-12" />
            )}
            <label className="absolute bottom-1 right-1 bg-white border border-gray-300 p-1 rounded-full shadow cursor-pointer hover:bg-gray-100 transition">
              <Pencil className="text-[#7c1d1d] w-4 h-4" />
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
          <div>
            <label className="block text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-[#d4af37]"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Phone Number</label>
            <input
              type="text"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-[#d4af37]"
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:border-[#7c1d1d] hover:text-[#7c1d1d] hover:bg-[#fde8e8] transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className={`${
                isSaving ? "opacity-60 cursor-not-allowed" : ""
              } bg-[#7c1d1d] hover:bg-[#621010] text-white px-6 py-2 rounded-md transition-opacity duration-200`}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>

        {showCropper && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
            <div className="bg-white p-4 rounded-md shadow-lg w-11/12 max-w-lg">
              <div className="relative w-full h-64">
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
                <button
                  className="px-4 py-1 border rounded hover:bg-gray-200"
                  onClick={() => setShowCropper(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-1 bg-[#7c1d1d] text-white rounded"
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
