// src/routes/UserRoutes.jsx
import { Routes, Route } from "react-router-dom";
import Cart from "../pages/user/Cart";
import Wishlist from "../pages/user/Wishlist";
import OrderHistory from "../pages/user/OrderHistory";
import TrackOrder from "../pages/user/TrackOrder";
import ProtectedUserRoute from "./ProtectedUserRoute";

const UserRoutes = () => {
  return (
    <Routes>
      <Route
        path="/cart"
        element={
          <ProtectedUserRoute>
            <Cart />
          </ProtectedUserRoute>
        }
      />
      <Route
        path="/wishlist"
        element={
          <ProtectedUserRoute>
            <Wishlist />
          </ProtectedUserRoute>
        }
      />
      <Route
        path="/order-history"
        element={
          <ProtectedUserRoute>
            <OrderHistory />
          </ProtectedUserRoute>
        }
      />
      <Route
        path="/track-order"
        element={
          <ProtectedUserRoute>
            <TrackOrder />
          </ProtectedUserRoute>
        }
      />
    </Routes>
  );
};

export default UserRoutes;
