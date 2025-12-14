import React, { useState } from "react";
import { Eye, Edit, Trash2 } from "lucide-react";

const dummyFeedbacks = [
  {
    id: 1,
    customerId: "001",
    customerName: "Alice",
    product: "Product A",
    message: "Great product and excellent service!",
    date: "2024-04-13",
  },
  {
    id: 2,
    customerId: "002",
    customerName: "Bob",
    product: "Product B",
    message: "I encountered an issue while using the app",
    date: "2024-04-13",
  },
];

export default function Feedback() {
  const [feedbacks, setFeedbacks] = useState(dummyFeedbacks);

  return (
    <div className="p-6 text-[#7c1d1d] min-h-screen bg-[#f9f9f9]">
      <h1 className="text-2xl font-semibold mb-4">Feedback Management</h1>
      <p className="text-gray-700 mb-6">
        Here you can manage customer feedbacks and suggestions.
      </p>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow-md">
          <thead>
            <tr className="bg-[#ffecec] text-left">
              <th className="py-2 px-4">Customer ID</th>
              <th className="py-2 px-4">Customer Name</th>
              <th className="py-2 px-4">Product</th>
              <th className="py-2 px-4">Feedback Message</th>
              <th className="py-2 px-4">Created Date</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((item) => (
              <tr key={item.id} className="border-t hover:bg-[#fff7f7]">
                <td className="py-2 px-4">{item.customerId}</td>
                <td className="py-2 px-4">{item.customerName}</td>
                <td className="py-2 px-4">{item.product}</td>
                <td className="py-2 px-4">{item.message}</td>
                <td className="py-2 px-4">{item.date}</td>
                <td className="py-2 px-4 flex gap-2">
                  <button title="View">
                    <Eye size={18} />
                  </button>
                  <button title="Edit">
                    <Edit size={18} />
                  </button>
                  <button title="Delete">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
