import { Routes, Route } from "react-router-dom";

import AdminDashboard from "../pages/admin/AdminDashboard";
import Home from "../pages/admin/Home";
import ProductManagement from "../pages/admin/ProductManagement";
import OrderManagement from "../pages/admin/OrderManagement";
import CustomerManagement from "../pages/admin/CustomerManagement";
import Feedback from "../pages/admin/Feedback";
import AdminManage from "../pages/admin/AdminManage";
import EditProfile from "../pages/admin/EditProfile";
import ChangePassword from "../pages/admin/ChangePassword";
import CategoryManagement from "../pages/admin/CategoryManagement";
import HomeServiceRequests from "../pages/admin/HomeServiceRequests";
import RepairRequestsAdmin from "../pages/admin/RepairRequestsAdmin";
import OffersAdmin from "../pages/admin/OffersAdmin";

import ProtectedAdminRoute from "./ProtectedAdminRoute";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/admin/*" element={<ProtectedAdminRoute />}>
        <Route element={<AdminDashboard />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="customers" element={<CustomerManagement />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="manage-admin" element={<AdminManage />} />
          <Route path="edit-profile" element={<EditProfile />} />
          <Route path="changePassword" element={<ChangePassword />} />
          <Route path="category" element={<CategoryManagement />} />
          <Route path="service-request" element={<HomeServiceRequests />} />
          <Route path="repair-request" element={<RepairRequestsAdmin />} />
          <Route path="offers" element={<OffersAdmin />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
