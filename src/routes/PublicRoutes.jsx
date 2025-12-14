import { Routes, Route } from "react-router-dom";

// User Pages
import Home from "../pages/user/Home";
import BookAppointment from "../pages/user/BookAppointment";
import GiftCard from "../pages/user/GiftCard";
import Reviews from "../components/users/Reviews";
import HomeServiceRequestUser from "../pages/user/HomeServiceRequestUser";
import RepairOldProductRequestUser from "../pages/user/RepairOldProductRequestUser";
import GoldLoanInquiryUser from "../pages/user/GoldLoanInquiryUser";

// Admin-related (but public)
import AdminLogin from "../auth/AdminLogin";
import Contact from "../components/common/Contact"; // ✅ Ensure this is correct path
import StoreLocation from "../components/common/StoreLocation";
import ForgetPassword from "../auth/ForgetPassword";

const PublicRoutes = () => {
  return (
    <Routes>
      {/* User Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/location" element={<StoreLocation />} />
      <Route path="/reviews" element={<Reviews />} />
      <Route path="/bookAppointment" element={<BookAppointment />} />
      <Route path="/giftcard" element={<GiftCard />} />
      <Route path="/homeService" element={<HomeServiceRequestUser />} />
      <Route path="/repairProduct" element={<RepairOldProductRequestUser />} />
      <Route path="/goldLoanInquiry" element={<GoldLoanInquiryUser />} />

      {/* ✅ Public Contact Page */}
      <Route path="/contact" element={<Contact />} />

      {/* Public Admin Routes */}
      <Route path="/adminLogin" element={<AdminLogin />} />
      <Route path="/admin/forgot-password" element={<ForgetPassword />} />
    </Routes>
  );
};

export default PublicRoutes;
