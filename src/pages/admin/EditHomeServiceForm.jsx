import React, { useEffect, useState } from "react";
import { API } from "../../utils/API";

export default function EditHomeServiceForm({ serviceId, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null); // { type, message }

  const [form, setForm] = useState({
    serviceId,
    name: "",
    address: "",
    phoneNumber: "",
    serviceType: "",
    status: "",
    notes: "",
    updatedBy: sessionStorage.getItem("email"),
  });

  const serviceTypes = [
    "REPAIR",
    "NEW_PURCHASE",
    "SALE_PRODUCT",
    "LOAN",
    "OTHERS",
  ];

  const statuses = ["REQUESTED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

  /* 🔹 FETCH SERVICE DETAILS */
  useEffect(() => {
    API.post("/api/homeService/getHomeServiceRequestById", { serviceId })
      .then((res) => {
        const d = res.data.response;
        setForm((prev) => ({
          ...prev,
          name: d.name || "",
          address: d.address || "",
          phoneNumber: d.phoneNumber || "",
          serviceType: d.serviceType || "",
          status: d.status || "",
          notes: d.notes || "",
        }));
      })
      .catch(() => {
        setToast({
          type: "error",
          message: "Failed to load service details",
        });
      });
  }, [serviceId]);

  /* 🔹 SUBMIT UPDATE */
  const submit = async () => {
    if (!form.phoneNumber || !form.serviceType || !form.status) {
      setToast({
        type: "error",
        message: "Please fill all required fields",
      });
      return;
    }

    try {
      setLoading(true);
      setToast(null);

      await API.put("/api/homeService/editHomeServiceRequest", form);

      setToast({
        type: "success",
        message: "Service updated successfully",
      });

      setTimeout(() => {
        onSuccess();
        onClose();
      }, 800);
    } catch {
      setToast({
        type: "error",
        message: "Update failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-xl rounded-xl flex flex-col max-h-[85vh] shadow-lg">
        {/* 🔔 TOAST */}
        {toast && (
          <div
            className={`px-4 py-3 flex justify-between items-center ${
              toast.type === "error"
                ? "bg-[#7c1d1d] text-gray-100"
                : "bg-green-700 text-white"
            }`}
          >
            <span className="text-sm font-medium">{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="text-lg font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* HEADER */}
        <div className="p-5 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-[#7c1d1d]">
            Edit Home Service Request
          </h2>
          <button onClick={onClose} className="text-xl font-bold">
            ✕
          </button>
        </div>

        {/* 🔽 SCROLLABLE BODY */}
        <div className="p-5 overflow-y-auto">
          <div className="space-y-4">
            {/* CUSTOMER NAME */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                Customer Name
              </label>
              <input
                value={form.name}
                disabled
                className="w-full p-2 border rounded bg-gray-100"
              />
            </div>

            {/* PHONE */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                Phone Number *
              </label>
              <input
                value={form.phoneNumber}
                onChange={(e) =>
                  setForm({ ...form, phoneNumber: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>

            {/* SERVICE TYPE */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                Service Type *
              </label>
              <select
                value={form.serviceType}
                onChange={(e) =>
                  setForm({ ...form, serviceType: e.target.value })
                }
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

            {/* STATUS */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                Status *
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Status</option>
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* ADDRESS */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                Address
              </label>
              <textarea
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                rows={2}
                className="w-full p-2 border rounded"
              />
            </div>

            {/* NOTES */}
            <div>
              <label className="block text-sm font-semibold mb-1">Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={loading}
            className="bg-[#7c1d1d] text-white px-4 py-2 rounded"
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}
