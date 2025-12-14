import { useLocation } from "react-router-dom";
import Navbar from "./components/users/Navbar";
import Footer from "./components/users/Footer";
import ScrollToTop from "./components/common/ScrollToTop";
import { Toaster } from "react-hot-toast";
import PublicRoutes from "./routes/PublicRoutes";
import UserRoutes from "./routes/UserRoutes";
import AdminRoutes from "./routes/AdminRoutes";

function App() {
  const { pathname } = useLocation();

  const isAdminSection =
    pathname.startsWith("/admin") || pathname === "/adminLogin";

  const isUserRoute =
    pathname.startsWith("/cart") ||
    pathname.startsWith("/wishlist") ||
    pathname.startsWith("/order-history") ||
    pathname.startsWith("/track-order");

  const renderRoutes = () => {
    if (pathname === "/adminLogin" || pathname === "/admin/forgot-password") {
      return <PublicRoutes />;
    }
    if (pathname.startsWith("/admin")) return <AdminRoutes />;
    if (isUserRoute) return <UserRoutes />;
    return <PublicRoutes />;
  };

  return (
    <>
      {!isAdminSection && <Navbar />}
      <Toaster position="top-center" reverseOrder={false} />
      <ScrollToTop />

      {renderRoutes()}

      {!isAdminSection && <Footer />}
    </>
  );
}

export default App;
