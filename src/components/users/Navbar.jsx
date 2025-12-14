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
import { Link } from "react-router-dom";
import AllJewellry from "../../pages/user/AllJewellry";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Navbar() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      {/* Top Row */}
      <div className="flex items-center justify-between px-10 py-5 border-b">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <a href="/" className="flex items-center">
            <img
              src="/logo.jpg"
              alt="Shyama Jewellers Logo"
              className="w-12 h-12 object-contain"
            />
            <span className="ml-2 text-3xl font-bold text-[#7c1d1d] whitespace-nowrap">
              Shyam Jewellers
            </span>
          </a>
        </div>

        {/* Search Bar */}
        <div className="flex items-center w-full max-w-2xl mx-6 border border-[#7c1d1d] rounded-full px-4 py-2">
          <FaSearch className="text-[#7c1d1d] mr-2" />
          <input
            type="text"
            placeholder="Search for Gold Jewellery, Silver Jewellery and more…"
            className="flex-grow outline-none text-sm"
          />
          <FaCamera className="text-[#7c1d1d] mx-4 cursor-pointer" />
          <FaMicrophone className="text-[#7c1d1d] cursor-pointer" />
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-6 text-[#7c1d1d] text-2xl">
          {/* Crown (Reviews) */}
          <HoverIcon
            href="/reviews"
            icon={<PiCrown />}
            label="Reviews & Comments"
          />

          {/* Star (Location) */}
          <HoverIcon
            href="/location"
            icon={<TbJewishStar />}
            label="Store Location"
          />

          {isLoggedIn && (
            <>
              <HoverIcon href="/wishlist" icon={<FaHeart />} label="Wishlist" />

              {/* Cart */}
              <div className="relative group cursor-pointer">
                <Link to="/cart">
                  <FaShoppingBag />
                  <span className="absolute -top-2 -right-2 bg-red-700 text-white text-xs rounded-full px-1">
                    0
                  </span>
                </Link>
                <div className="absolute right-0 mt-2 w-28 bg-white text-[#7c1d1d] text-xs border border-[#7c1d1d] rounded shadow-lg opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-300 p-1 text-center">
                  Cart 0 Items
                </div>
              </div>
            </>
          )}

          {/* User */}
          <UserDropdown />
        </div>
      </div>

      {/* Bottom Category Nav */}
      <nav className="flex flex-wrap justify-between px-10 py-4 border-b text-sm w-full">
        <div className="relative group">
          <NavItem icon={<GiNecklaceDisplay />} label="All Jewellery" />
          <div className="absolute left-0 top-full z-50 w-screen bg-white shadow-lg border-t opacity-0 group-hover:opacity-100 group-hover:visible transition-all duration-300 invisible">
            <AllJewellry />
          </div>
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
    <div className="flex flex-col items-center text-gray-700 hover:text-[#7c1d1d] transition cursor-pointer px-4 py-2">
      <div className="text-2xl">{icon}</div>
      <div className="text-sm mt-1 font-medium">{label}</div>
    </div>
  );
}

function HoverIcon({ href, icon, label }) {
  return (
    <div className="relative group cursor-pointer">
      <a href={href}>{icon}</a>
      <div className="absolute top-8 -left-6 bg-white border text-xs text-[#7c1d1d] rounded shadow-lg p-2 opacity-0 group-hover:opacity-100 group-hover:visible transition-all duration-300 invisible text-center whitespace-nowrap min-w-[100px]">
        {label}
      </div>
    </div>
  );
}
