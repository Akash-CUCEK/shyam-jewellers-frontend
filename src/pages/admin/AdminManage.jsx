import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import AddAdminModal from "./AddAdminModal";
import { API } from "../../utils/API";

const ManageAdmin = () => {
  const [adminList, setAdminList] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchAdminList();
  }, []);

  /* ✅ FETCH ADMIN LIST */
  const fetchAdminList = async () => {
    try {
      const res = await API.post("/auth/api/v1/admin/getAllAdmin");

      const list = res?.data?.response?.getAllAdminResponseDTOList || [];

      setAdminList(list);
    } catch (error) {}
  };

  /* 🗑 DELETE ADMIN */
  const handleDeleteClick = async (admin) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete ${admin.name}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await API.post("/auth/api/v1/admin/deleteAdmin", {
        email: admin.email,
      });

      Swal.fire(
        "Deleted!",
        res?.data?.response?.response || "Admin deleted successfully.",
        "success"
      );

      fetchAdminList();
    } catch (error) {
      console.error("Error deleting admin:", error);
      Swal.fire("Error", "Failed to delete admin.", "error");
    }
  };

  const handleViewClick = (admin) => {
    Swal.fire("Admin Info", `Viewing ${admin.name}`, "info");
  };

  const handleEditClick = (admin) => {
    Swal.fire("Edit", `Edit feature coming soon for ${admin.name}`, "info");
  };

  return (
    <div className="flex min-h-screen bg-[#f9f5f2] font-sans">
      <div className="flex-1 p-8">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Admin Management</h2>
          <button
            className="bg-[#7c1d1d] hover:bg-[#621010] text-white px-4 py-2 rounded-md"
            onClick={() => setShowModal(true)}
          >
            Add Admin
          </button>
        </div>

        {/* SEARCH (UI ready) */}
        <input
          type="text"
          placeholder="Search by name or email"
          className="w-full p-3 border border-gray-300 rounded-md mb-6"
        />

        {/* TABLE */}
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full text-left">
            <thead className="bg-[#f1f1f1] text-[#7c1d1d] font-medium">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {adminList.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-500">
                    No admins found
                  </td>
                </tr>
              ) : (
                adminList.map((admin, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-3">{admin.name}</td>
                    <td className="p-3">{admin.email}</td>
                    <td className="p-3">{admin.phoneNumber}</td>
                    <td className="p-3 flex gap-4 items-center">
                      <FaEye
                        className="text-gray-600 cursor-pointer"
                        title="View"
                        onClick={() => handleViewClick(admin)}
                      />
                      <FaEdit
                        className="text-blue-600 cursor-pointer"
                        title="Edit"
                        onClick={() => handleEditClick(admin)}
                      />
                      <FaTrash
                        className="text-red-600 cursor-pointer"
                        title="Delete"
                        onClick={() => handleDeleteClick(admin)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD ADMIN MODAL */}
      {showModal && (
        <AddAdminModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            fetchAdminList();
          }}
        />
      )}
    </div>
  );
};

export default ManageAdmin;
