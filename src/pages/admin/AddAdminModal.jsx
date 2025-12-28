import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { API } from "../../utils/API";

const AddAdminModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, phoneNumber, password } = formData;

    if (!name || !email || !phoneNumber || !password) {
      toast.error("All fields are required");
      return;
    }

    setIsSaving(true);

    try {
      const response = await API.post(
        "/auth/api/v1/admin/registerAdmin",
        formData
      );

      toast.success(response.data?.message || "Admin registered successfully");
      onSuccess();
      onClose();
    } catch (err) {
      const msg =
        err.response?.data?.messages?.[0]?.message ||
        err.response?.data?.message ||
        "Failed to register admin";
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50">
      <div
        className="
          bg-white w-full sm:max-w-md
          rounded-t-2xl sm:rounded-lg
          shadow-lg
          p-5 sm:p-6
          max-h-[90vh] overflow-y-auto
          relative
        "
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-2xl text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>

        <h2 className="text-lg sm:text-xl font-semibold text-[#6e1414] mb-4 text-center sm:text-left">
          Add Admin
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full border px-3 py-3 rounded-md text-sm sm:text-base"
          />

          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border px-3 py-3 rounded-md text-sm sm:text-base"
          />

          <input
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Phone Number"
            className="w-full border px-3 py-3 rounded-md text-sm sm:text-base"
          />

          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full border px-3 py-3 rounded-md text-sm sm:text-base"
          />

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-3">
            <button
              type="button"
              onClick={onClose}
              className="
                w-full sm:w-auto
                px-4 py-2.5
                bg-gray-300 text-gray-700
                rounded-md hover:bg-gray-400
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className={`
                w-full sm:w-auto
                px-6 py-2.5
                bg-[#7c1d1d] hover:bg-[#621010]
                text-white rounded-md
                transition
                ${isSaving ? "opacity-60 cursor-not-allowed" : ""}
              `}
            >
              {isSaving ? "Adding..." : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAdminModal;
