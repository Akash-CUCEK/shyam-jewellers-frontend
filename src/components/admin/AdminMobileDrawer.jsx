import {
  Home,
  Boxes,
  ClipboardList,
  UserCog,
  LayoutGrid,
  Hammer,
  Users2,
  MessageCircle,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Item = ({ icon, label, path, close }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => {
        navigate(path);
        close();
      }}
      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#fce8e8]"
    >
      {icon}
      <span>{label}</span>
    </div>
  );
};

export default function AdminMobileDrawer({ open, close }) {
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={close} />

      <div className="fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-2xl p-5">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-[#7c1d1d]">Admin Menu</h2>
          <X onClick={close} />
        </div>

        <Item icon={<Home />} label="Home" path="/admin/home" close={close} />
        <Item
          icon={<Boxes />}
          label="Products"
          path="/admin/products"
          close={close}
        />
        <Item
          icon={<ClipboardList />}
          label="Orders"
          path="/admin/orders"
          close={close}
        />
        <Item
          icon={<UserCog />}
          label="Service Requests"
          path="/admin/service-request"
          close={close}
        />
        <Item
          icon={<LayoutGrid />}
          label="Categories"
          path="/admin/category"
          close={close}
        />

        <div className="border-t my-3" />

        <Item
          icon={<Hammer />}
          label="Repair Requests"
          path="/admin/repair"
          close={close}
        />
        <Item
          icon={<Users2 />}
          label="Customers"
          path="/admin/customers"
          close={close}
        />
        <Item
          icon={<MessageCircle />}
          label="Feedback"
          path="/admin/feedback"
          close={close}
        />
      </div>
    </>
  );
}
