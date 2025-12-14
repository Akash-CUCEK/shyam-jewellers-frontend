import { useState } from "react";
import Login from "./Login";
import { Link } from "react-router-dom";

function Cart() {
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <div className="text-center py-20">
      <img
        src="/images/empty-cart.png"
        alt="Empty Cart"
        className="w-40 mx-auto mb-6"
      />
      <h2 className="text-2xl font-bold text-[#7c1d1d]">YOUR CART IS EMPTY</h2>
      <div className="mt-6 flex justify-center gap-4">
        <Link
          to="/"
          className="border border-[#7c1d1d] text-[#7c1d1d] px-4 py-2 rounded hover:bg-[#7c1d1d] hover:text-white transition"
        >
          Continue Shopping
        </Link>

        {/* Login Button to open Modal */}
        <button
          onClick={() => setShowLoginModal(true)}
          className="bg-[#7c1d1d] text-white px-4 py-2 rounded hover:opacity-90 transition"
        >
          Login To View Your Cart
        </button>
      </div>

      {/* Show Modal when clicked */}
      {showLoginModal && <Login onClose={() => setShowLoginModal(false)} />}
    </div>
  );
}

export default Cart;
