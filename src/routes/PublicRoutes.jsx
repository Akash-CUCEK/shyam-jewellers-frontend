import { Routes, Route } from "react-router-dom";

// User Pages
import Home from "../pages/user/Home";
import JewelleryListing from "../pages/user/JewelleryListing";
import ProductDetail from "../pages/user/ProductDetail"; // ✅ ADD THIS
import BookAppointment from "../pages/user/BookAppointment";
import GiftCard from "../pages/user/GiftCard";
import Reviews from "../components/users/Reviews";
import HomeServiceRequestUser from "../pages/user/HomeServiceRequestUser";
import RepairOldProductRequestUser from "../pages/user/RepairOldProductRequestUser";
import GoldLoanInquiryUser from "../pages/user/GoldLoanInquiryUser";
import Contact from "../components/common/Contact";
import StoreLocation from "../components/common/StoreLocation";

// Admin
import AdminLogin from "../auth/AdminLogin";
import ForgetPassword from "../auth/ForgetPassword";

const PublicRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* 🔥 Jewellery */}
      <Route path="/jewellery/list" element={<JewelleryListing />} />

      {/* ✅ PRODUCT DETAIL PAGE */}
      <Route path="/jewellery/product/:id" element={<ProductDetail />} />

      {/* Other Pages */}
      <Route path="/location" element={<StoreLocation />} />
      <Route path="/reviews" element={<Reviews />} />
      <Route path="/bookAppointment" element={<BookAppointment />} />
      <Route path="/giftcard" element={<GiftCard />} />
      <Route path="/homeService" element={<HomeServiceRequestUser />} />
      <Route path="/repairProduct" element={<RepairOldProductRequestUser />} />
      <Route path="/goldLoanInquiry" element={<GoldLoanInquiryUser />} />
      <Route path="/contact" element={<Contact />} />

      {/* Admin */}
      <Route path="/adminLogin" element={<AdminLogin />} />
      <Route path="/admin/forgot-password" element={<ForgetPassword />} />
    </Routes>
  );
};

export default PublicRoutes;
