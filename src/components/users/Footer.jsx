import { FaWhatsapp, FaEnvelope, FaHeadset, FaHeart } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#2c0000] text-white px-6 py-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* BRAND */}
        <div className="text-center md:text-left">
          <h2 className="text-lg font-bold">Shyama Jewellers</h2>
          <p className="mt-1 text-xs text-gray-300">© 2025 Shyama Jewellers</p>
        </div>

        {/* CONTACT */}
        <div className="text-center">
          <h3 className="text-sm font-semibold mb-2">Contact Us</h3>

          <p className="text-xs text-gray-300">📞 6206740308</p>
          <p className="text-xs text-gray-300 mt-1 break-all">
            ✉️ akashkumarcuset@gmail.com
          </p>

          <div className="flex justify-center gap-4 mt-3 text-lg">
            <a
              href="https://wa.me/916206740308"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-400 transition"
            >
              <FaWhatsapp />
            </a>

            <a
              href="mailto:akashkumarcuset@gmail.com"
              className="hover:text-yellow-300 transition"
            >
              <FaEnvelope />
            </a>

            <a href="/contact" className="hover:text-red-300 transition">
              <FaHeadset />
            </a>
          </div>
        </div>

        {/* POLICIES */}
        <div className="text-center md:text-right">
          <h3 className="text-sm font-semibold mb-2">Policies</h3>
          <ul className="space-y-1 text-xs text-gray-300">
            <li className="hover:text-white cursor-pointer">
              Terms & Conditions
            </li>
            <li className="hover:text-white cursor-pointer">Privacy Policy</li>
            <li className="hover:text-white cursor-pointer">Disclaimer</li>
          </ul>
        </div>
      </div>

      {/* CREDIT */}
      <div className="mt-6 border-t border-gray-700 pt-3 text-center text-[11px] text-gray-400">
        Crafted by{" "}
        <a
          href="https://www.linkedin.com/in/akashkumarcusat/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-red-400 hover:text-red-300 transition cursor-pointer"
        >
          <FaHeart />
          <span>Akash Kumar</span>
        </a>
      </div>
    </footer>
  );
}
