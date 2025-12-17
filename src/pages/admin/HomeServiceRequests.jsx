import React, { useState, useEffect } from "react";
import AddHomeServiceForm from "./AddHomeServiceForm";
import EditHomeServiceForm from "./EditHomeServiceForm";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { API } from "../../utils/API";

export default function HomeServiceRequests() {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewRequest, setViewRequest] = useState(null);
  const [editRequestId, setEditRequestId] = useState(null);
  const [loadingDeleteId, setLoadingDeleteId] = useState(null);

  // 🔹 Fetch all requests
  const fetchRequests = async () => {
    try {
      const res = await API.post("/api/homeService/getAllServiceRequests");
      const services = res.data?.response?.getAllServices || [];

      const mapped = services.map((item) => ({
        id: item.serviceId,
        name: item.name || "N/A",
        mobile: item.phoneNumber || "N/A",
        service: item.serviceType ? item.serviceType.replace("_", " ") : "N/A",
        datetime: item.createdAt
          ? new Date(item.createdAt).toLocaleString()
          : "N/A",
        status: item.status || "Unknown",
      }));

      setRequests(mapped);
    } catch (err) {
      console.error("Fetch error:", err);
      Swal.fire("Error", "Failed to fetch requests", "error");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // 🔹 View request
  const handleViewClick = async (req) => {
    try {
      const res = await API.post("/api/homeService/getHomeServiceRequestById", {
        serviceId: req.id,
      });
      setViewRequest(res.data.response);
    } catch {
      Swal.fire("Error", "Failed to fetch request details", "error");
    }
  };

  // 🔹 Delete request
  const handleDeleteClick = async (req) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: `Delete request ID: ${req.id}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      setLoadingDeleteId(req.id);

      await API.delete("/api/homeService/deleteHomeServiceRequest", {
        data: { serviceId: req.id },
      });

      Swal.fire("Deleted!", "Request deleted successfully.", "success");
      fetchRequests();
    } catch {
      Swal.fire("Error", "Failed to delete request.", "error");
    } finally {
      setLoadingDeleteId(null);
    }
  };

  // 🔹 Search filter
  const filteredRequests = requests.filter(
    (req) =>
      req.name.toLowerCase().includes(search.toLowerCase()) ||
      req.mobile.includes(search) ||
      String(req.id).includes(search)
  );

  return (
    <div className="p-6 bg-[#f9f9f9] min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-[#7c1d1d]">
          Home Service Requests
        </h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-[#6e1414] text-white px-4 py-2 rounded-md font-semibold shadow"
        >
          Add Request
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name, mobile or ID"
        className="w-full max-w-md p-2 border rounded-md mb-4"
      />

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-left">
          <thead className="bg-[#f1f1f1] text-[#7c1d1d]">
            <tr>
              <th className="p-3">Request ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Mobile</th>
              <th className="p-3">Service</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.length > 0 ? (
              filteredRequests.map((req, idx) => (
                <tr
                  key={req.id}
                  className={idx % 2 === 0 ? "bg-white" : "bg-[#f9eaea]"}
                >
                  <td className="p-3">{req.id}</td>
                  <td className="p-3">{req.name}</td>
                  <td className="p-3">{req.mobile}</td>
                  <td className="p-3">{req.service}</td>
                  <td className="p-3">{req.datetime}</td>
                  <td className="p-3">
                    <span className="px-3 py-1 rounded-full text-sm bg-gray-100">
                      {req.status}
                    </span>
                  </td>
                  <td className="p-3 flex gap-3">
                    <FaEye
                      className="cursor-pointer text-gray-600"
                      onClick={() => handleViewClick(req)}
                    />
                    <FaEdit
                      className="cursor-pointer text-blue-600"
                      onClick={() => setEditRequestId(req.id)}
                    />
                    <FaTrash
                      className={`cursor-pointer ${
                        loadingDeleteId === req.id
                          ? "text-gray-400 pointer-events-none"
                          : "text-red-600"
                      }`}
                      onClick={() => handleDeleteClick(req)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-4 text-center">
                  No requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add */}
      {showAddForm && (
        <AddHomeServiceForm
          onClose={() => setShowAddForm(false)}
          onSuccess={fetchRequests}
        />
      )}

      {/* Edit */}
      {editRequestId && (
        <EditHomeServiceForm
          requestId={editRequestId}
          onClose={() => setEditRequestId(null)}
          onSuccess={fetchRequests}
        />
      )}

      {/* View */}
      {viewRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-[90%] relative">
            <button
              onClick={() => setViewRequest(null)}
              className="absolute top-2 right-3 text-xl text-red-600"
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4 text-[#7c1d1d]">
              Request Details
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {Object.entries(viewRequest).map(([k, v]) => (
                <div key={k} className="bg-gray-50 p-3 rounded border">
                  <p className="text-sm text-gray-500 capitalize">{k}</p>
                  <p className="font-medium">{String(v)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
