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
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-5 text-[#7c1d1d]">
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
              className="w-full p-2 border rounded"
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
              className="w-full p-2 border rounded"
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
              className="w-full p-2 border rounded"
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
              className="w-full p-2 border rounded"
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
              className="w-full p-2 border rounded"
              rows={3}
              placeholder="Additional notes"
            />
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#7c1d1d] text-white px-4 py-2 rounded"
            >
              Save Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
