import { BiChat, BiPhoneCall } from "react-icons/bi";
import { MdOutlineEmail } from "react-icons/md";

function Contact() {
  return (
    <div className="py-12 px-6 md:px-20 bg-white text-center">
      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-semibold text-[#7c1d1d] mb-6">
        Help & Contact
      </h1>

      {/* Subtitle */}
      <h2 className="text-xl font-medium text-black mb-10">Have A Question</h2>

      {/* Contact Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-[#7c1d1d]">
        {/* Chat */}
        <div className="flex flex-col items-center">
          <BiChat className="text-4xl mb-3" />
          <p className="text-lg font-medium">Chat with Us</p>
        </div>

        {/* Call */}
        <div className="flex flex-col items-center border-l border-r border-gray-300">
          <BiPhoneCall className="text-4xl mb-3" />
          <p className="text-lg font-medium">Call Us At</p>
          <p className="text-sm mt-1">6206740308</p>
        </div>

        {/* Email */}
        <div className="flex flex-col items-center">
          <MdOutlineEmail className="text-4xl mb-3" />
          <p className="text-lg font-medium">Write to Us</p>
        </div>
      </div>

      {/* Notice */}
      <p className="text-sm text-gray-600 mt-10 max-w-xl mx-auto">
        Calling service is available between 9 AM to 6 PM.
      </p>
    </div>
  );
}
export default Contact;
