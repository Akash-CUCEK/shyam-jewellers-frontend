import React, { useState, useEffect } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import EditRepairRequestForm from "./EditRepairRequestForm";
import AddRepairRequestForm from "./AddRepairRequestForm";
import { API } from "../../utils/API";

export default function RepairRequestsAdmin() {
  const [repairRequests, setRepairRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [viewRequest, setViewRequest] = useState(null);
  const [editRequestId, setEditRequestId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // 🔹 Fetch all repair requests
  const fetchRepairRequests = async () => {
    try {
      const res = await API.post("/api/common/getAllRepairRequests");
      const data = res.data;

      const repairRequestsArray = data?.response?.getAllServices || [];

      const mapped = repairRequestsArray.map((item) => ({
        id: item.serviceId,
        name: item.name || "N/A",
        mobile: item.mobileNumber || "N/A",
        date: item.createdAt
          ? new Date(item.createdAt).toLocaleDateString()
          : "N/A",
        status: item.status || "Unknown",
      }));

      setRepairRequests(mapped);
    } catch (err) {
      console.error("Fetch repair requests error:", err);
      Swal.fire("Error", "Failed to fetch repair requests", "error");
    }
  };

  useEffect(() => {
    fetchRepairRequests();
  }, []);

  // 🔹 View single request
  const handleViewClick = async (req) => {
    try {
      const res = await API.post("/api/common/getRepairRequestById", {
        serviceId: req.id,
      });

      setViewRequest(res.data.response);
    } catch (err) {
      Swal.fire("Error", "Failed to fetch request details.", "error");
    }
  };

  // 🔹 Delete request
  const handleDeleteClick = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This request will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await API.delete("/api/common/deleteRepairRequest", {
            data: { serviceId: id },
          });

          Swal.fire("Deleted!", "Request deleted successfully.", "success");
          fetchRepairRequests();
        } catch (err) {
          Swal.fire("Error", "Failed to delete request.", "error");
        }
      }
    });
  };

  // 🔹 Search filter
  const filtered = repairRequests.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      String(r.id).includes(search) ||
      r.mobile.includes(search)
  );

  const getBadgeColor = (status) => {
    switch (status) {
      case "REQUESTED":
        return "bg-yellow-100 text-yellow-700";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-700";
      case "COMPLETED":
        return "bg-green-100 text-green-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      default:
        return "";
    }
  };

  return (
    <div className="p-6 min-h-screen bg-[#f9f9f9]">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-[#7c1d1d]">
          Repair Requests
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

      {showAddForm && (
        <AddRepairRequestForm
          onClose={() => setShowAddForm(false)}
          onSaved={() => {
            setShowAddForm(false);
            fetchRepairRequests();
          }}
        />
      )}

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-left">
          <thead className="bg-[#f1f1f1] text-[#7c1d1d]">
            <tr>
              <th className="p-3">Request ID</th>
              <th className="p-3">Customer Name</th>
              <th className="p-3">Mobile</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((req, idx) => (
                <tr
                  key={req.id}
                  className={idx % 2 === 0 ? "bg-white" : "bg-[#fce8e8]"}
                >
                  <td className="p-3">{req.id}</td>
                  <td className="p-3">{req.name}</td>
                  <td className="p-3">{req.mobile}</td>
                  <td className="p-3">{req.date}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${getBadgeColor(
                        req.status
                      )}`}
                    >
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
                      className="cursor-pointer text-red-600"
                      onClick={() => handleDeleteClick(req.id)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-4 text-center">
                  No requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editRequestId && (
        <EditRepairRequestForm
          requestId={editRequestId}
          onClose={() => setEditRequestId(null)}
          onSaved={() => {
            setEditRequestId(null);
            fetchRepairRequests();
          }}
        />
      )}

      {/* View Modal */}
      {viewRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-[90%] relative">
            <button
              onClick={() => setViewRequest(null)}
              className="absolute top-2 right-3 text-xl text-red-600"
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4 text-[#7c1d1d]">
              Repair Request Details
            </h2>

            <table className="w-full border">
              <tbody>
                {Object.entries(viewRequest).map(([key, value]) => (
                  <tr key={key}>
                    <td className="border px-3 py-2 font-medium bg-gray-50">
                      {key}
                    </td>
                    <td className="border px-3 py-2">
                      {typeof value === "object"
                        ? JSON.stringify(value)
                        : value?.toString() || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
