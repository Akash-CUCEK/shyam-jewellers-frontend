import React, { useState } from "react";
import {
  Home,
  Boxes,
  ClipboardList,
  UserCog,
  MessageCircle,
  Hammer,
  Users2,
  LayoutGrid,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// 🔹 Sidebar Single Item
const SidebarItem = ({ icon, label, path }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(path)}
      className="relative group flex justify-center my-5 cursor-pointer transition-transform hover:scale-110"
    >
      <div className="text-[#0D1B2A]">{icon}</div>
      <div className="absolute left-14 top-1/2 -translate-y-1/2 whitespace-nowrap bg-[#0D1B2A] text-white text-xs rounded px-3 py-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition duration-200 shadow-xl z-50">
        {label}
      </div>
    </div>
  );
};

// 🔹 Sidebar Dropdown – With hover delay and better dropdown alignment
const SidebarDropdown = ({ onOpenModal }) => {
  const [isOpen, setIsOpen] = useState(false);
  let timeout;

  const handleEnter = () => {
    clearTimeout(timeout);
    setIsOpen(true);
  };

  const handleLeave = () => {
    timeout = setTimeout(() => setIsOpen(false), 200); // slight delay for smooth UX
  };

  return (
    <div
      className="relative group flex justify-center my-5"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* Icon */}
      <div className="text-[#0D1B2A] hover:scale-110 transition cursor-pointer">
        <MessageCircle size={22} />
      </div>

      {/* Tooltip */}
      <div className="absolute left-14 top-1/2 -translate-y-1/2 whitespace-nowrap bg-[#0D1B2A] text-white text-xs rounded px-3 py-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition duration-200 shadow-xl z-50">
        More Options
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-1/2 left-16 -translate-y-1/2 w-60 bg-white border rounded-lg shadow-2xl z-50 py-2">
          <DropdownItem
            icon={<Hammer size={16} />}
            label="Repair Request"
            onClick={() => onOpenModal("repair-request")}
          />
          <DropdownItem
            icon={<Users2 size={16} />}
            label="Customer Management"
            onClick={() => onOpenModal("customers")}
          />
          <DropdownItem
            icon={<MessageCircle size={16} />}
            label="Feedback"
            onClick={() => onOpenModal("feedback")}
          />
        </div>
      )}
    </div>
  );
};

// 🔹 Dropdown Item component
const DropdownItem = ({ icon, label, onClick }) => (
  <div
    onClick={onClick}
    className="flex items-center gap-2 px-4 py-2 text-sm text-[#0D1B2A] hover:bg-[#fce8e8] hover:text-[#7c1d1d] cursor-pointer transition"
  >
    {icon} <span>{label}</span>
  </div>
);

// 🔹 Main Sidebar
export default function AdminSidebar({ onOpenModal }) {
  return (
    <aside className="w-20 bg-white shadow-xl flex flex-col justify-between rounded-r-3xl py-8 border-r border-gray-200">
      <div className="flex flex-col items-center">
        <SidebarItem
          icon={<Home size={22} />}
          label="Home"
          path="/admin/home"
        />
        <SidebarItem
          icon={<Boxes size={22} />}
          label="Product Management"
          path="/admin/products"
        />
        <SidebarItem
          icon={<ClipboardList size={22} />}
          label="Order Management"
          path="/admin/orders"
        />
        <SidebarItem
          icon={<UserCog size={22} />}
          label="Home Service Request"
          path="/admin/service-request"
        />
        <SidebarItem
          icon={<LayoutGrid size={22} />}
          label="Category Management"
          path="/admin/category"
        />
        <SidebarDropdown onOpenModal={onOpenModal} />
      </div>
    </aside>
  );
}
