import React, { useState } from "react";
import Swal from "sweetalert2";
import { API } from "../../utils/API";

export default function AddHomeServiceForm({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    email: sessionStorage.getItem("email"),
    address: "",
    phoneNumber: "",
    serviceType: "",
    notes: "",
  });

  const serviceTypes = [
    "REPAIR",
    "NEW_PURCHASE",
    "SALE_PRODUCT",
    "LOAN",
    "OTHERS",
  ];

  const submit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/api/homeService/createHomeServiceRequest", form);
      Swal.fire("Success", "Service request created", "success");
      onSuccess();
      onClose();
    } catch {
      Swal.fire("Error", "Create failed", "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50">
      <div
        className="
          bg-white w-full sm:max-w-lg
          rounded-t-2xl sm:rounded-xl
          p-5 sm:p-6
          shadow-lg
          max-h-[90vh] overflow-y-auto
          relative
        "
      >
        {/* ❌ Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-2xl text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-lg sm:text-xl font-semibold mb-5 text-[#7c1d1d] text-center sm:text-left">
          Add Home Service Request
        </h2>

        <form onSubmit={submit} className="space-y-4">
          {/* CUSTOMER NAME */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Customer Name
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full px-3 py-3 border rounded-md text-sm sm:text-base"
              placeholder="Enter customer name"
            />
          </div>

          {/* PHONE */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Phone Number
            </label>
            <input
              value={form.phoneNumber}
              onChange={(e) =>
                setForm({ ...form, phoneNumber: e.target.value })
              }
              required
              className="w-full px-3 py-3 border rounded-md text-sm sm:text-base"
              placeholder="Enter phone number"
            />
          </div>

          {/* ADDRESS */}
          <div>
            <label className="block text-sm font-semibold mb-1">Address</label>
            <input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              required
              className="w-full px-3 py-3 border rounded-md text-sm sm:text-base"
              placeholder="Enter address"
            />
          </div>

          {/* SERVICE TYPE */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Service Type
            </label>
            <select
              value={form.serviceType}
              onChange={(e) =>
                setForm({ ...form, serviceType: e.target.value })
              }
              required
              className="w-full px-3 py-3 border rounded-md text-sm sm:text-base"
            >
              <option value="">Select Service</option>
              {serviceTypes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* NOTES */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Notes (Optional)
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-3 border rounded-md text-sm sm:text-base"
              placeholder="Additional notes"
            />
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 border rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto bg-[#7c1d1d] text-white px-5 py-2 rounded-md"
            >
              Save Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
