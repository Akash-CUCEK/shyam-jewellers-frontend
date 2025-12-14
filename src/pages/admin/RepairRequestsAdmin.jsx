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
  const [deletingId, setDeletingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchRepairRequests = async () => {
    try {
      const res = await API.post("/api/common/getAllRepairRequests", {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      const repairRequestsArray = data?.response?.getAllServices || [];

      if (Array.isArray(repairRequestsArray)) {
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
      } else {
        setRepairRequests([]);
      }
    } catch (err) {
      console.error("Fetch repair requests error:", err);
    }
  };

  const handleDeleteClick = async (id) => {
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
          const res = await API.delete("/api/common/deleteRepairRequest", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ serviceId: id }),
          });

          if (res.ok) {
            const data = await res.json();
            Swal.fire(
              "Deleted!",
              data?.response?.response || "The request has been deleted.",
              "success"
            );
            fetchRepairRequests(); // refresh list
          } else {
            Swal.fire("Error", "Failed to delete the request.", "error");
          }
        } catch (err) {
          console.error("Delete request error:", err);
          Swal.fire("Error", "Something went wrong.", "error");
        }
      }
    });
  };

  useEffect(() => {
    fetchRepairRequests();
  }, []);

  const handleViewClick = async (req) => {
    try {
      const res = await API.fetch("/api/common/getRepairRequestById", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          requestId: "test",
        },
        body: JSON.stringify({ serviceId: req.id }),
      });
      const data = await res.json();
      setViewRequest(data.response);
    } catch (err) {
      Swal.fire("Error", "Failed to fetch request details.", "error");
    }
  };

  const filtered = repairRequests.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      String(r.id).toLowerCase().includes(search.toLowerCase()) ||
      r.mobile.includes(search)
  );

  const getBadgeColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      case "Completed":
        return "bg-green-100 text-green-700";
      case "Rejected":
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
          className="bg-[#6e1414] text-white px-4 py-2 rounded-md font-semibold shadow hover:opacity-90"
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
        className="w-full max-w-md p-2 border rounded-md mb-4 focus:outline-[#7c1d1d]"
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
          <thead className="bg-[#f1f1f1] text-[#7c1d1d] font-medium">
            <tr>
              <th className="p-3">Request ID</th>
              <th className="p-3">Customer Name</th>
              <th className="p-3">Mobile No</th>
              <th className="p-3">Request Date</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {filtered.length > 0 ? (
              filtered.map((req, idx) => (
                <tr
                  key={`${req.id}-${idx}`}
                  className={idx % 2 === 0 ? "bg-white" : "bg-[#fce8e8]"}
                >
                  <td className="p-3">{req.id}</td>
                  <td className="p-3">{req.name}</td>
                  <td className="p-3">{req.mobile}</td>
                  <td className="p-3">{req.date}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getBadgeColor(
                        req.status
                      )}`}
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
                      className="text-red-600 cursor-pointer"
                      onClick={() => handleDeleteClick(req.id)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-3 text-center" colSpan="6">
                  No matching requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showAddForm && (
        <AddRepairRequestForm
          onClose={() => setShowAddForm(false)}
          onSuccess={() => {
            setShowAddForm(false);
            fetchRepairRequests();
          }}
        />
      )}

      {/* Footer */}
      <div className="flex justify-between items-center text-sm text-gray-600 mt-3 px-1">
        <span>Rows per page: 10 ⌄</span>
        <span>
          {filtered.length > 0
            ? `1–${filtered.length} of ${repairRequests.length}`
            : "0 of 0"}
        </span>
      </div>
      {editRequestId && (
        <EditRepairRequestForm
          requestId={editRequestId}
          onClose={() => setEditRequestId(null)}
          onSaved={() => {
            setEditRequestId(null);
            fetchRepairRequests(); // refresh list after edit
          }}
        />
      )}

      {/* View Modal */}
      {viewRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-2xl p-6 relative">
            <button
              onClick={() => setViewRequest(null)}
              className="absolute top-2 right-3 text-red-500 text-xl font-bold hover:text-red-700"
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4 text-[#7c1d1d]">
              Repair Request Details
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200">
                <tbody>
                  {Object.entries(viewRequest).map(([key, value]) => (
                    <tr key={key} className="border-b border-gray-200">
                      <td className="px-4 py-2 font-medium capitalize bg-gray-50 w-1/3">
                        {key}
                      </td>
                      <td className="px-4 py-2 text-gray-700">
                        {typeof value === "object"
                          ? JSON.stringify(value, null, 2)
                          : value?.toString() || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
