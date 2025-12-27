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
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Navbar() {
  const { isLoggedIn } = useContext(AuthContext);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showJewellery, setShowJewellery] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* 🔹 SCROLL ONLY FOR DESKTOP */
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth >= 768) {
        setScrolled(window.scrollY > 80);
      } else {
        setScrolled(false); // 👈 MOBILE RESET
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      {/* 🔹 TOP HEADER */}
      <div className="flex items-center justify-between px-4 md:px-10 py-2 border-b">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/logo.jpg"
            alt="Shyam Jewellers"
            className="w-9 h-9 md:w-10 md:h-10 object-contain"
          />
          <span className="text-lg md:text-2xl font-bold text-[#7c1d1d]">
            Shyam Jewellers
          </span>
        </Link>

        {/* SEARCH DESKTOP */}
        <div className="hidden md:flex items-center w-full max-w-2xl mx-6 border border-[#7c1d1d] rounded-full px-4 py-1.5">
          <FaSearch className="text-[#7c1d1d] mr-2" />
          <input
            type="text"
            placeholder="Search jewellery..."
            className="flex-grow outline-none text-sm"
          />
          <FaCamera className="text-[#7c1d1d] mx-3 cursor-pointer" />
          <FaMicrophone className="text-[#7c1d1d] cursor-pointer" />
        </div>

        {/* RIGHT ICONS */}
        <div className="flex items-center gap-4 text-[#7c1d1d] text-xl">
          <div className="hidden md:flex gap-5">
            <HoverIcon href="/reviews" icon={<PiCrown />} label="Reviews" />
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

      {/* SEARCH MOBILE */}
      <div className="md:hidden px-4 py-2 border-b">
        <div className="flex items-center border border-[#7c1d1d] rounded-full px-3 py-1.5">
          <FaSearch className="text-[#7c1d1d] mr-2" />
          <input
            type="text"
            placeholder="Search jewellery..."
            className="flex-grow outline-none text-sm"
          />
        </div>
      </div>

      {/* 🔹 NAVBAR */}
      <nav
        className={`${
          mobileMenuOpen ? "block" : "hidden"
        } md:flex justify-between px-4 md:px-10 py-2 border-b`}
      >
        <div
          className="relative"
          onMouseEnter={() => setShowJewellery(true)}
          onMouseLeave={() => setShowJewellery(false)}
        >
          <NavItem
            icon={<GiNecklaceDisplay />}
            label="All Jewellery"
            hideIcon={scrolled}
          />

          {showJewellery && (
            <div className="absolute top-full z-50 w-screen -left-4 md:-left-10 bg-white shadow-lg border-t max-h-[70vh] overflow-y-auto">
              <AllJewellry />
            </div>
          )}
        </div>

        <NavItem icon={<PiDiamondBold />} label="Gold" hideIcon={scrolled} />
        <NavItem icon={<MdCategory />} label="Silver" hideIcon={scrolled} />
        <NavItem icon={<GiLargeDress />} label="Earrings" hideIcon={scrolled} />
        <NavItem icon={<FaRing />} label="Rings" hideIcon={scrolled} />
        <NavItem icon={<MdCategory />} label="Daily Wear" hideIcon={scrolled} />
        <NavItem
          icon={<MdCategory />}
          label="Collections"
          hideIcon={scrolled}
        />
        <NavItem icon={<MdCategory />} label="Wedding" hideIcon={scrolled} />
        <NavItem icon={<FaGift />} label="Gifting" hideIcon={scrolled} />
        <NavItem
          icon={<HiOutlineMenuAlt2 />}
          label="More"
          hideIcon={scrolled}
        />
      </nav>
    </header>
  );
}

/* 🔹 NAV ITEM */
function NavItem({ icon, label, hideIcon }) {
  return (
    <div className="flex md:flex-col items-center gap-1 text-gray-700 hover:text-[#7c1d1d] cursor-pointer px-3 py-1">
      {/* 👇 ICON MOBILE PE HAMESHA DIKHEGA */}
      <div className={`${hideIcon ? "hidden md:block" : "block"} text-lg`}>
        {icon}
      </div>
      <div className="text-xs md:text-sm font-medium">{label}</div>
    </div>
  );
}

/* 🔹 HOVER ICON */
function HoverIcon({ href, icon, label }) {
  return (
    <div className="relative group cursor-pointer">
      <Link to={href}>{icon}</Link>
      <div className="absolute top-8 -left-6 bg-white border text-xs text-[#7c1d1d] rounded shadow-lg p-2 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition">
        {label}
      </div>
    </div>
  );
}
