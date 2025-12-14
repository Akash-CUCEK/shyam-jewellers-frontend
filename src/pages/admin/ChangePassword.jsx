import React from "react";

export default function ChangePassword({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-semibold text-[#6e1414] mb-6 text-center">
          Change Password
        </h2>

        <form className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Current Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-[#d4af37]"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-[#d4af37]"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
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
              className="bg-[#7c1d1d] hover:bg-[#621010] text-white px-6 py-2 rounded-md"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
