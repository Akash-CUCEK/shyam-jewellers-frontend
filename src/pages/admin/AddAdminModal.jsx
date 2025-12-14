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
      const response = await API.post("/auth/api/v1/admin/registerAdmin", {
        name,
        email,
        phoneNumber,
        password,
      });

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
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-2xl text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold text-[#6e1414] mb-4">Add Admin</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full border px-3 py-2 rounded"
          />
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            type="email"
            className="w-full border px-3 py-2 rounded"
          />
          <input
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Phone Number"
            className="w-full border px-3 py-2 rounded"
          />
          <input
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            type="password"
            className="w-full border px-3 py-2 rounded"
          />
          <div className="flex justify-end space-x-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
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
              {isSaving ? "Adding..." : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAdminModal;
