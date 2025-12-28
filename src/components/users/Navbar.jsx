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
import AllJewellery from "../../pages/user/AllJewellry";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Navbar() {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showJewellery, setShowJewellery] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.innerWidth >= 768 && window.scrollY > 80);
    };
    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const go = (url) => {
    setShowJewellery(false);
    setMobileMenuOpen(false);
    navigate(url);
  };

  return (
    <header className="bg-white shadow sticky top-0 z-50 w-full">
      {/* ================= TOP BAR ================= */}
      <div className="flex items-center justify-between px-4 md:px-10 py-2 border-b">
        {/* LEFT */}
        <div className="flex items-center gap-2">
          {/* MOBILE HAMBURGER */}
          <button
            className="md:hidden text-2xl text-[#7c1d1d]"
            onClick={() => setMobileMenuOpen((p) => !p)}
          >
            <HiOutlineMenuAlt2 />
          </button>

          {/* DESKTOP LOGO */}
          <Link to="/" className="hidden md:flex items-center gap-2">
            <img src="/logo.jpg" className="w-9 h-9 object-contain" />
            <span className="text-lg md:text-2xl font-bold text-[#7c1d1d]">
              Shyam Jewellers
            </span>
          </Link>
        </div>

        {/* MOBILE CENTER TITLE */}
        <span className="md:hidden text-base font-bold text-[#7c1d1d]">
          Shyam Jewellers
        </span>

        {/* DESKTOP SEARCH (SAME LINE – UNCHANGED) */}
        <div className="hidden md:flex items-center w-full max-w-2xl mx-6 border border-[#7c1d1d] rounded-full px-4 py-1.5">
          <FaSearch className="text-[#7c1d1d] mr-2" />
          <input
            className="flex-grow outline-none text-sm"
            placeholder="Search jewellery..."
          />
          <FaCamera className="mx-3 text-[#7c1d1d]" />
          <FaMicrophone className="text-[#7c1d1d]" />
        </div>

        {/* RIGHT ICONS */}
        <div className="flex items-center gap-4 text-[#7c1d1d] text-xl">
          {/* DESKTOP ICONS */}
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
                <Link to="/cart">
                  <FaShoppingBag />
                </Link>
              </>
            )}
          </div>

          {/* MOBILE ICONS */}
          {isLoggedIn && (
            <>
              <Link to="/wishlist" className="md:hidden">
                <FaHeart />
              </Link>
              <Link to="/cart" className="md:hidden">
                <FaShoppingBag />
              </Link>
            </>
          )}

          <UserDropdown />
        </div>
      </div>

      {/* ================= MOBILE SEARCH ================= */}
      <div className="md:hidden px-4 py-2 border-b">
        <div className="flex items-center border border-[#7c1d1d] rounded-full px-3 py-1.5">
          <FaSearch className="text-[#7c1d1d] mr-2" />
          <input
            className="flex-grow outline-none text-sm"
            placeholder="Search jewellery..."
          />
        </div>
      </div>

      {/* ================= NAVBAR ================= */}
      <nav
        className={`${
          mobileMenuOpen ? "block" : "hidden"
        } md:flex w-full justify-between px-4 md:px-10 py-2 border-b`}
      >
        {/* ALL JEWELLERY */}
        <div
          className="relative"
          onMouseEnter={() => setShowJewellery(true)}
          onMouseLeave={() => setShowJewellery(false)}
        >
          <NavItem
            icon={<GiNecklaceDisplay />}
            label="All Jewellery"
            hideIcon={scrolled}
            onClick={() => setShowJewellery((p) => !p)}
          />

          {showJewellery && (
            <div className="absolute top-full left-0 w-screen bg-white shadow-xl border-t">
              <AllJewellery onNavigate={() => setShowJewellery(false)} />
            </div>
          )}
        </div>

        <NavItem
          icon={<PiDiamondBold />}
          label="Gold"
          hideIcon={scrolled}
          onClick={() => go("/jewellery/list?material=GOLD")}
        />
        <NavItem
          icon={<MdCategory />}
          label="Silver"
          hideIcon={scrolled}
          onClick={() => go("/jewellery/list?material=SILVER")}
        />
        <NavItem
          icon={<GiLargeDress />}
          label="Earrings"
          hideIcon={scrolled}
          onClick={() => go("/jewellery/list?category=EARRINGS")}
        />
        <NavItem
          icon={<FaRing />}
          label="Rings"
          hideIcon={scrolled}
          onClick={() => go("/jewellery/list?category=RINGS")}
        />
        <NavItem
          icon={<MdCategory />}
          label="Daily Wear"
          hideIcon={scrolled}
          onClick={() => go("/jewellery/list?maxPrice=20000")}
        />
        <NavItem
          icon={<MdCategory />}
          label="Wedding"
          hideIcon={scrolled}
          onClick={() => go("/jewellery/list?minPrice=50000")}
        />
        <NavItem
          icon={<FaGift />}
          label="Gifting"
          hideIcon={scrolled}
          onClick={() => go("/jewellery/list")}
        />
      </nav>
    </header>
  );
}

/* ================= NAV ITEM ================= */
function NavItem({ icon, label, hideIcon, onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer flex md:flex-col items-center gap-1 px-4 py-2 text-gray-700 hover:text-[#7c1d1d]"
    >
      <div className={`${hideIcon ? "hidden md:block" : "block"} text-lg`}>
        {icon}
      </div>
      <div className="text-xs md:text-sm font-medium whitespace-nowrap">
        {label}
      </div>
    </div>
  );
}

/* ================= HOVER ICON ================= */
function HoverIcon({ href, icon, label }) {
  return (
    <div className="relative group">
      <Link to={href}>{icon}</Link>
      <div className="absolute top-8 -left-6 bg-white border text-xs text-[#7c1d1d] rounded shadow-lg p-2 opacity-0 group-hover:opacity-100">
        {label}
      </div>
    </div>
  );
}
