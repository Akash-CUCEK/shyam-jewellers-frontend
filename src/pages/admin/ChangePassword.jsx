import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { API } from "../../utils/API";

export default function ChangePassword({ onClose }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password, newPassword, confirmNewPassword } = formData;

    // ✅ Frontend validations
    if (!email || !password || !newPassword || !confirmNewPassword) {
      toast.error("All fields are required");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("/auth/api/v1/admin/changePassword", {
        email,
        password,
        newPassword,
      });

      // ✅ ONLY backend success message
      toast.success(
        res?.data?.response?.message || "Password changed successfully"
      );

      onClose();
    } catch (error) {
      // ✅ ONLY backend error message
      const backendMessage =
        error?.response?.data?.errors?.messages?.[0]?.message;

      toast.error(backendMessage || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-semibold text-[#6e1414] mb-6 text-center">
          Change Password
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              placeholder="Enter email"
            />
          </div>

          {/* Current Password */}
          <div>
            <label className="block text-gray-700 mb-1">Current Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              placeholder="Enter current password"
            />
          </div>

          {/* New Password */}
          <div>
            <label className="block text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              placeholder="Enter new password"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmNewPassword"
              value={formData.confirmNewPassword}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              placeholder="Confirm new password"
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-gray-600 hover:border-[#7c1d1d] hover:text-[#7c1d1d]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#7c1d1d] hover:bg-[#621010] text-white px-6 py-2 rounded-md disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
