import { BiChat, BiPhoneCall } from "react-icons/bi";
import { MdOutlineEmail } from "react-icons/md";

export default function Contact() {
  return (
    <div className="py-6 px-4 md:px-20 bg-white text-center">
      {/* Title */}
      <h1 className="text-xl md:text-3xl font-semibold text-[#7c1d1d] mb-2">
        Help & Contact
      </h1>

      {/* Subtitle */}
      <h2 className="text-sm md:text-lg font-medium text-black mb-6">
        Have a Question?
      </h2>

      {/* Contact Options */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto text-[#7c1d1d]">
        {/* CHAT - WHATSAPP */}
        <a
          href="https://wa.me/916206740308"
          target="_blank"
          rel="noopener noreferrer"
          className="
            flex flex-col items-center
            border rounded-xl
            py-4
            transition
            hover:shadow-md
            hover:bg-[#f8f3f3]
          "
        >
          <BiChat className="text-3xl mb-2" />
          <p className="text-sm font-medium">Chat with Us</p>
        </a>

        {/* CALL */}
        <a
          href="tel:+916206740308"
          className="
            flex flex-col items-center
            border rounded-xl
            py-4
            transition
            hover:shadow-md
            hover:bg-[#f8f3f3]
          "
        >
          <BiPhoneCall className="text-3xl mb-2" />
          <p className="text-sm font-medium">Call Us</p>
          <p className="text-xs mt-1">6206740308</p>
        </a>

        {/* EMAIL */}
        <a
          href="mailto:akashkumarcucek@gmail.com"
          className="
            flex flex-col items-center
            border rounded-xl
            py-4
            transition
            hover:shadow-md
            hover:bg-[#f8f3f3]
          "
        >
          <MdOutlineEmail className="text-3xl mb-2" />
          <p className="text-sm font-medium">Write to Us</p>
          <p className="text-xs mt-1 break-all">akashkumarcucek@gmail.com</p>
        </a>
      </div>

      {/* Notice */}
      <p className="text-xs text-gray-600 mt-6 max-w-xl mx-auto">
        Calling service is available between <b>9 AM to 6 PM</b>.
      </p>
    </div>
  );
}
