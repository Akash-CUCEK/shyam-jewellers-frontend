import {
  FaSearch,
  FaHeart,
  FaShoppingBag,
  FaRing,
  FaGift,
  FaCamera,
  FaMicrophone,
} from "react-icons/fa";
import { PiDiamondBold, PiCrown } from "react-icons/pi";
import { GiNecklaceDisplay, GiLargeDress } from "react-icons/gi";
import { MdCategory } from "react-icons/md";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { TbJewishStar } from "react-icons/tb";
import { UserDropdown } from "../../pages/user/UserDropdown";
import { Link, useNavigate } from "react-router-dom";
import AllJewellry from "../../pages/user/AllJewellry";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Navbar() {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showJewellery, setShowJewellery] = useState(false);

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 md:px-10 py-4 border-b">
    
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/logo.jpg"
            alt="Shyam Jewellers"
            className="w-10 h-10 md:w-12 md:h-12 object-contain"
          />
          <span className="text-xl md:text-3xl font-bold text-[#7c1d1d]">
            Shyam Jewellers
          </span>
        </Link>

        <div className="hidden md:flex items-center w-full max-w-2xl mx-6 border border-[#7c1d1d] rounded-full px-4 py-2">
          <FaSearch className="text-[#7c1d1d] mr-2" />
          <input
            type="text"
            placeholder="Search jewellery..."
            className="flex-grow outline-none text-sm"
          />
          <FaCamera className="text-[#7c1d1d] mx-4 cursor-pointer" />
          <FaMicrophone className="text-[#7c1d1d] cursor-pointer" />
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-4 text-[#7c1d1d] text-xl md:text-2xl">
          <div className="hidden md:flex gap-6">
            <HoverIcon
              href="/reviews"
              icon={<PiCrown />}
              label="Reviews & Comments"
            />
            <HoverIcon
              href="/location"
              icon={<TbJewishStar />}
              label="Store Location"
            />

            {isLoggedIn && (
              <>
                <HoverIcon
                  href="/wishlist"
                  icon={<FaHeart />}
                  label="Wishlist"
                />
                <Link to="/cart" className="relative">
                  <FaShoppingBag />
                  <span className="absolute -top-2 -right-2 bg-red-700 text-white text-xs rounded-full px-1">
                    0
                  </span>
                </Link>
              </>
            )}
          </div>

          <UserDropdown />
          <button
            className="md:hidden text-2xl"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <HiOutlineMenuAlt2 />
          </button>
        </div>
      </div>

      <div className="md:hidden px-4 py-3 border-b">
        <div className="flex items-center border border-[#7c1d1d] rounded-full px-3 py-2">
          <FaSearch className="text-[#7c1d1d] mr-2" />
          <input
            type="text"
            placeholder="Search jewellery..."
            className="flex-grow outline-none text-sm"
          />
        </div>
      </div>

      <nav
        className={`${
          mobileMenuOpen ? "block" : "hidden"
        } md:flex justify-between px-4 md:px-10 py-4 border-b text-sm`}
      >
        <div
          className="relative"
          onMouseEnter={() => setShowJewellery(true)}
          onMouseLeave={() => setShowJewellery(false)}
        >
          <div
            onClick={() => setShowJewellery((prev) => !prev)}
            className="cursor-pointer"
          >
            <NavItem icon={<GiNecklaceDisplay />} label="All Jewellery" />
          </div>

          {showJewellery && (
            <div
              className="absolute top-full z-50 w-screen -left-4 md:-left-10 bg-white shadow-lg border-t overflow-x-hidden overflow-y-auto max-h-[75vh]"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              <AllJewellry />
            </div>
          )}
        </div>

        <NavItem icon={<PiDiamondBold />} label="Gold" />
        <NavItem icon={<MdCategory />} label="Silver" />
        <NavItem icon={<GiLargeDress />} label="Earrings" />
        <NavItem icon={<FaRing />} label="Rings" />
        <NavItem icon={<MdCategory />} label="Daily Wear" />
        <NavItem icon={<MdCategory />} label="Collections" />
        <NavItem icon={<MdCategory />} label="Wedding" />
        <NavItem icon={<FaGift />} label="Gifting" />
        <NavItem icon={<HiOutlineMenuAlt2 />} label="More" />
      </nav>
    </header>
  );
}


function NavItem({ icon, label }) {
  return (
    <div className="flex md:flex-col items-center gap-2 md:gap-0 text-gray-700 hover:text-[#7c1d1d] transition cursor-pointer px-4 py-2">
      <div className="text-xl md:text-2xl">{icon}</div>
      <div className="text-sm font-medium">{label}</div>
    </div>
  );
}

function HoverIcon({ href, icon, label }) {
  return (
    <div className="relative group cursor-pointer">
      <Link to={href}>{icon}</Link>
      <div className="absolute top-8 -left-6 bg-white border text-xs text-[#7c1d1d] rounded shadow-lg p-2 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 whitespace-nowrap">
        {label}
      </div>
    </div>
  );
}
