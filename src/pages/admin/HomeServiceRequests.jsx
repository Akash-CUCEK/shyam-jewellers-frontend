import React, { useState, useEffect } from "react";
import AddHomeServiceForm from "./AddHomeServiceForm";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import EditHomeServiceForm from "./EditHomeServiceForm";
import { API } from "../../utils/API";

export default function HomeServiceRequests() {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewRequest, setViewRequest] = useState(null);
  const [editRequestId, setEditRequestId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchRequests = async () => {
    try {
      const res = await API.post("/api/homeService/getAllServiceRequests");
      console.log("✅ Full Axios Response:", res);

      const data = res.data;

      if (Array.isArray(data?.response?.getAllServices)) {
        const mapped = data.response.getAllServices.map((item) => ({
          id: item.serviceId,
          name: item.name || "N/A",
          mobile: item.phoneNumber || "N/A",
          service: item.serviceType
            ? item.serviceType.replace("_", " ")
            : "N/A",
          datetime: item.createdAt
            ? new Date(item.createdAt).toLocaleString()
            : "N/A",
          status: item.status || "Unknown",
        }));
        setRequests(mapped);
      } else {
        setRequests([]);
      }
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

  const handleViewClick = async (req) => {
    try {
      const res = await API.post("/api/homeService/getHomeServiceRequestById", {
        serviceId: req.id,
      });
      const data = res.data;
      setViewRequest(data.response);
    } catch (err) {
      console.error("Failed to fetch request by ID:", err);
      Swal.fire("Error", "Failed to fetch request details.", "error");
    }
  };
  const handleDeleteClick = async (req) => {
    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: `Delete request ID: ${req.id}? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirmResult.isConfirmed) return;

    setDeletingId(req.id);

    try {
      const res = await API.delete(
        "/api/homeService/deleteHomeServiceRequest",
        {
          data: { serviceId: req.id }, // axios delete needs "data"
        }
      );

      const data = res.data;
      console.log(data);

      if (res.status === 200 && data?.response) {
        Swal.fire("Deleted!", "The request has been deleted.", "success");
        fetchRequests();
      } else {
        throw new Error(data?.message || "Failed to delete");
      }
    } catch (err) {
      console.error("Delete error:", err);
      Swal.fire("Error", "Failed to delete request.", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredRequests = requests.filter(
    (req) =>
      req.name.toLowerCase().includes(search.toLowerCase()) ||
      req.mobile.includes(search) ||
      String(req.id).toLowerCase().includes(search.toLowerCase())
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
          className="bg-[#6e1414] text-white px-4 py-2 rounded-md font-semibold shadow hover:opacity-90"
        >
          Add Request
        </button>
      </div>

      {/* Search */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, mobile or ID"
          className="w-full max-w-md p-2 border rounded-md focus:outline-[#7c1d1d]"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-left">
          <thead className="bg-[#f1f1f1] text-[#7c1d1d] font-medium">
            <tr>
              <th className="p-3">Request ID</th>
              <th className="p-3">Customer Name</th>
              <th className="p-3">Mobile No.</th>
              <th className="p-3">Service Type</th>
              <th className="p-3">Date/Time</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
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
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        req.status === "REQUESTED"
                          ? "bg-yellow-100 text-yellow-700"
                          : req.status === "COMPLETED"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="p-3 flex gap-3 text-[#7c1d1d]">
                    <FaEye
                      title="View"
                      className="text-gray-600 cursor-pointer"
                      onClick={() => handleViewClick(req)}
                    />
                    <FaEdit
                      title="Edit"
                      className="text-blue-600 cursor-pointer"
                      onClick={() => setEditRequestId(req.id)}
                    />
                    <FaTrash
                      title="Delete"
                      className={`cursor-pointer ${
                        deletingId === req.id
                          ? "text-gray-400 opacity-50 pointer-events-none"
                          : "text-red-600"
                      }`}
                      onClick={() =>
                        deletingId !== req.id && handleDeleteClick(req)
                      }
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-3 text-center" colSpan="7">
                  No matching requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center text-sm text-gray-600 mt-2 px-1">
        <span>Rows per page: 10 ⌄</span>
        <span>
          {filteredRequests.length > 0
            ? `1–${filteredRequests.length} of ${filteredRequests.length}`
            : "0 of 0"}
        </span>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <AddHomeServiceForm
          onClose={() => setShowAddForm(false)}
          onSuccess={fetchRequests}
        />
      )}

      {/* View Modal */}
      {viewRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-[90%] max-w-2xl p-6 relative animate-fadeIn">
            {/* Close Button */}
            <button
              onClick={() => setViewRequest(null)}
              className="absolute top-3 right-4 text-gray-500 hover:text-red-600 transition text-2xl font-bold"
            >
              ✕
            </button>

            {/* Heading */}
            <h2 className="text-2xl font-bold mb-5 text-center text-[#7c1d1d] border-b pb-2">
              Request Details
            </h2>

            {/* Details Table */}
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(viewRequest).map(([key, value]) => (
                <div
                  key={key}
                  className="bg-gray-50 p-3 rounded-lg shadow-sm border border-gray-200"
                >
                  <p className="text-sm text-gray-500 font-semibold capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </p>
                  <p className="text-gray-800 font-medium">
                    {String(value) || "—"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Edit Form */}
      {editRequestId && (
        <EditHomeServiceForm
          requestId={editRequestId}
          onClose={() => setEditRequestId(null)}
          onSuccess={fetchRequests}
        />
      )}
    </div>
  );
}
