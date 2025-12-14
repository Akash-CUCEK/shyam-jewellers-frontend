import { useState, useEffect } from "react";
import { FaUser, FaGift, FaClock, FaCreditCard } from "react-icons/fa";
import { BiMessageDetail } from "react-icons/bi";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { MdTrackChanges } from "react-icons/md";
import Login from "./Login";
import { Link } from "react-router-dom";
import { logoutUser } from "./Logout";

export function UserDropdown() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, [showLoginModal]);

  return (
    <>
      <div className="relative group">
        <FaUser className="text-[#7c1d1d] text-xl cursor-pointer" />

        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border z-50 opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-300 ease-out p-2">
          {!isLoggedIn ? (
            <button
              onClick={() => setShowLoginModal(true)}
              className="flex items-center w-full gap-3 text-[#7c1d1d] rounded-lg px-4 py-3 hover:bg-[#f3eaea] transition-all duration-300"
            >
              <FaGift className="text-lg" />
              <span className="text-sm font-medium">Log in / Sign up</span>
            </button>
          ) : (
            <>
              <Link
                to="/order-history"
                className="flex items-center gap-3 text-[#7c1d1d] rounded-lg px-4 py-3 hover:bg-[#f3eaea] transition-all duration-300"
              >
                <FaClock className="text-lg" />
                <span className="text-sm font-medium">Order History</span>
              </Link>

              <Link
                to="/giftcard"
                className="flex items-center gap-3 text-[#7c1d1d] rounded-lg px-4 py-3 hover:bg-[#f3eaea] transition-all duration-300"
              >
                <FaCreditCard className="text-lg" />
                <span className="text-sm font-medium">Gift Card Balance</span>
              </Link>

              <Link
                to="/track-order"
                className="flex items-center gap-3 text-[#7c1d1d] rounded-lg px-4 py-3 hover:bg-[#f3eaea] transition-all duration-300"
              >
                <MdTrackChanges className="text-lg" />
                <span className="text-sm font-medium">Track Order</span>
              </Link>

              <button
                onClick={logoutUser}
                className="flex items-center w-full gap-3 text-[#7c1d1d] rounded-lg px-4 py-3 hover:bg-[#f3eaea] transition-all duration-300"
              >
                <RiLogoutCircleRLine className="text-lg" />
                <span className="text-sm font-medium">Log Out</span>
              </button>
            </>
          )}

          {/* ✅ Always visible */}
          <Link
            to="/contact"
            className="flex items-center gap-3 text-[#7c1d1d] rounded-lg px-4 py-3 hover:bg-[#f3eaea] transition-all duration-300"
          >
            <BiMessageDetail className="text-lg" />
            <span className="text-sm font-medium">Contact Us</span>
          </Link>
        </div>
      </div>

      {showLoginModal && <Login onClose={() => setShowLoginModal(false)} />}
    </>
  );
}
