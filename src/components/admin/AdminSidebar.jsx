import {
  Home,
  Boxes,
  ClipboardList,
  UserCog,
  LayoutGrid,
  MessageCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Item = ({ icon, label, path }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(path)}
      className="group relative my-5 cursor-pointer hover:scale-110 transition"
    >
      {icon}
      <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100">
        {label}
      </div>
    </div>
  );
};

export default function AdminSidebar() {
  return (
    <aside className="hidden md:flex w-20 bg-white shadow-xl flex-col items-center py-8 border-r">
      <Item icon={<Home />} label="Home" path="/admin/home" />
      <Item icon={<Boxes />} label="Products" path="/admin/products" />
      <Item icon={<ClipboardList />} label="Orders" path="/admin/orders" />
      <Item
        icon={<UserCog />}
        label="Service Requests"
        path="/admin/service-request"
      />
      <Item icon={<LayoutGrid />} label="Categories" path="/admin/category" />
      <Item icon={<MessageCircle />} label="More" path="/admin/more" />
    </aside>
  );
}
