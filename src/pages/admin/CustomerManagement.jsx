import React from "react";
import { FaFilter, FaChartBar, FaUser } from "react-icons/fa";

const customers = [
  {
    name: "Ali Hasan",
    email: "ali@hasan.com",
    phone: "000-12345",
    username: "AlaHasaan",
    status: "Active",
    color: "bg-green-100 text-green-700",
  },
  {
    name: "Sunita Singh",
    email: "sunita@mail.com",
    phone: "123-45678",
    username: "sunita-singh",
    status: "Inactive",
    color: "bg-red-100 text-red-700",
  },
  {
    name: "Raj Patel",
    email: "raj@patel.com",
    phone: "456-78900",
    username: "RajPatel",
    status: "Active",
    color: "bg-green-100 text-green-700",
  },
  {
    name: "Zoya Khan",
    email: "zoya@khan.com",
    phone: "123-45678",
    username: "ZoyaK",
    status: "Inactive",
    color: "bg-red-100 text-red-700",
  },
];

export default function CustomerManagement() {
  return (
    <div className="p-6 text-[#7c1d1d] min-h-screen bg-[#f9f9f9]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Customer Management</h1>
        <button className="bg-[#6e1414] text-white px-4 py-2 rounded shadow font-medium hover:opacity-90">
          Add Customer
        </button>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name or email"
          className="border px-4 py-2 rounded w-full max-w-md focus:outline-[#7c1d1d]"
        />
        <FaFilter className="text-xl cursor-pointer hover:text-[#a31616]" />
        <FaChartBar className="text-xl cursor-pointer hover:text-[#a31616]" />
        <FaUser className="text-xl cursor-pointer hover:text-[#a31616]" />
      </div>

      <div className="border rounded-lg overflow-hidden bg-white shadow">
        <table className="w-full text-left">
          <thead className="bg-[#f1f1f1] text-[#7c1d1d] font-medium">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Username</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {customers.map((cust, idx) => (
              <tr
                key={idx}
                className={idx % 2 === 0 ? "bg-white" : "bg-[#fce8e8]"}
              >
                <td className="p-3 flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${cust.color}`}
                  >
                    {cust.name[0]}
                  </div>
                  {cust.name}
                </td>
                <td className="p-3">{cust.email}</td>
                <td className="p-3">{cust.phone}</td>
                <td className="p-3">{cust.username}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${cust.color}`}
                  >
                    {cust.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between items-center text-sm text-gray-600 px-4 py-3 bg-[#f1f1f1]">
          <div>
            Rows per page:
            <select className="border rounded px-2 py-1 ml-2 focus:outline-none">
              <option value="4" defaultValue>
                4
              </option>
              <option value="8">8</option>
            </select>
          </div>
          <div className="flex items-center gap-4">
            <span>1–4 of 4</span>
            <button className="hover:text-[#7c1d1d]">&lt;</button>
            <button className="hover:text-[#7c1d1d]">&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
}
