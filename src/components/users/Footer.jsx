export default function Footer() {
  return (
    <footer className="bg-[#2c0000] text-white py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Company Branding */}
        <div className="md:col-span-1">
          <h2 className="text-2xl font-bold">Shyama Jewellers</h2>
          <p className="mt-2 text-sm text-gray-300">
            © 2025 Shyama Jewellers. All Rights Reserved.
          </p>
        </div>

        {/* Useful Links */}
        <div>
          <h3 className="font-semibold text-lg mb-2">Useful Links</h3>
          <ul className="space-y-1 text-sm text-gray-300">
            <li>
              <a href="#">Delivery Information</a>
            </li>
            <li>
              <a href="#">Shipping</a>
            </li>
            <li>
              <a href="#">Payment Options</a>
            </li>
            <li>
              <a href="#">Track Your Order</a>
            </li>
            <li>
              <a href="#">Returns</a>
            </li>
            <li>
              <a href="#">Find a Store</a>
            </li>
          </ul>
        </div>

        {/* Info */}
        <div>
          <h3 className="font-semibold text-lg mb-2">Information</h3>
          <ul className="space-y-1 text-sm text-gray-300">
            <li>
              <a href="#">Blog</a>
            </li>
            <li>
              <a href="#">Offers & Contests</a>
            </li>
            <li>
              <a href="#">Help & FAQs</a>
            </li>
            <li>
              <a href="#">About Shyama</a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold text-lg mb-2">Contact Us</h3>
          <p className="text-sm text-gray-300">Call: 1800-266-0123</p>
          <p className="text-sm text-gray-300 mt-1">Chat: +91 8147349242</p>

          <div className="flex space-x-4 mt-4 text-white">
            <a href="#">
              <i className="fab fa-whatsapp" />
            </a>
            <a href="#">
              <i className="fas fa-envelope" />
            </a>
            <a href="#">
              <i className="fas fa-headset" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-10 border-t border-gray-700 pt-4 text-center text-sm text-gray-400">
        <a href="#" className="mr-4">
          Terms & Conditions
        </a>
        <a href="#" className="mr-4">
          Privacy Policy
        </a>
        <a href="#">Disclaimer</a>
      </div>
    </footer>
  );
}
