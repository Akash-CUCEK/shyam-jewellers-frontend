import React, { useEffect, useState } from "react";
import { FaEye, FaEdit, FaTrash, FaFilePdf } from "react-icons/fa";
import Swal from "sweetalert2";
import { API } from "../../utils/API";
import { downloadHomeServicePdf } from "../../utils/homeServiceInvoicePdf";
import AddHomeServiceForm from "./AddHomeServiceForm";
import EditHomeServiceForm from "./EditHomeServiceForm";

export default function HomeServiceRequests() {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState(null);
  const [viewData, setViewData] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const role = sessionStorage.getItem("role");

  /* 🔹 FETCH ONLY ONCE */
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await API.post("/api/homeService/getAllServiceRequests");
      const list = res?.data?.response?.getAllServices || [];

      setRequests(list);
    } catch {
      Swal.fire("Error", "Failed to fetch service requests", "error");
    }
  };

  /* 🔍 SEARCH */
  const filtered = requests.filter(
    (r) =>
      r.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.phoneNumber?.includes(search) ||
      String(r.serviceId).includes(search)
  );

  /* ❌ DELETE (SUPER ADMIN ONLY) */
  const deleteRequest = async (id) => {
    const ok = await Swal.fire({
      title: "Delete request?",
      text: `Service ID: ${id}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#7c1d1d",
    });

    if (!ok.isConfirmed) return;

    try {
      setDeletingId(id);
      await API.delete("/api/homeService/deleteHomeServiceRequest", {
        data: { serviceId: id },
      });
      Swal.fire("Deleted", "Request removed", "success");
      fetchRequests();
    } catch {
      Swal.fire("Error", "Delete failed", "error");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6 bg-[#f9f9f9] min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-semibold text-[#7c1d1d]">
          Home Service Requests
        </h1>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-[#7c1d1d] text-white px-4 py-2 rounded"
        >
          Add Request
        </button>
      </div>

      {/* SEARCH */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name, phone, id"
        className="w-full max-w-md p-2 border rounded mb-4"
      />

      {/* TABLE */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#f1f1f1] text-[#7c1d1d]">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Service</th>
              <th className="p-3">Date & Time</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-10 text-gray-500">
                  No Home Service Requests Found
                </td>
              </tr>
            ) : (
              filtered.map((r, i) => (
                <tr key={r.serviceId} className={i % 2 ? "bg-[#f9eaea]" : ""}>
                  <td className="p-3">{r.serviceId}</td>
                  <td className="p-3">{r.name}</td>
                  <td className="p-3">{r.phoneNumber}</td>
                  <td className="p-3">{r.serviceType}</td>
                  <td className="p-3">
                    {new Date(r.createdAt).toLocaleString()}
                  </td>
                  <td className="p-3">{r.status}</td>

                  <td className="p-3 flex gap-3 text-lg">
                    <FaEye onClick={() => setViewData(r)} />
                    <FaEdit onClick={() => setEditId(r.serviceId)} />
                    <FaFilePdf onClick={() => downloadHomeServicePdf(r)} />

                    {role === "SUPER_ADMIN" && (
                      <FaTrash
                        className={
                          deletingId === r.serviceId
                            ? "text-gray-400"
                            : "text-red-600"
                        }
                        onClick={() => deleteRequest(r.serviceId)}
                      />
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 👁 VIEW MODAL */}
      {viewData && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded max-w-lg w-full relative">
            <button
              className="absolute top-2 right-3 text-xl"
              onClick={() => setViewData(null)}
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold mb-4 text-[#7c1d1d]">
              Service Details
            </h2>

            <div className="space-y-2 text-sm">
              <p>
                <b>ID:</b> {viewData.serviceId}
              </p>
              <p>
                <b>Name:</b> {viewData.name}
              </p>
              <p>
                <b>Phone:</b> {viewData.phoneNumber}
              </p>
              <p>
                <b>Service:</b> {viewData.serviceType}
              </p>
              <p>
                <b>Status:</b> {viewData.status}
              </p>
              <p>
                <b>Address:</b> {viewData.address}
              </p>
              <p>
                <b>Notes:</b> {viewData.notes}
              </p>
              <p>
                <b>Created At:</b>{" "}
                {new Date(viewData.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {showAdd && (
        <AddHomeServiceForm
          onClose={() => setShowAdd(false)}
          onSuccess={fetchRequests}
        />
      )}

      {editId && (
        <EditHomeServiceForm
          serviceId={editId}
          onClose={() => setEditId(null)}
          onSuccess={fetchRequests}
        />
      )}
    </div>
  );
}
