import door from "../../assets/door.jpg";
import shop from "../../assets/shop.jpg";
import appointment from "../../assets/appointment.jpg";
import repair from "../../assets/repair.jpg";
import loan from "../../assets/loan.jpg";
import expert from "../../assets/expert.jpg";
import { Link } from "react-router-dom";

const experienceItems = [
  { label: "Visit Our Store", image: shop, path: "/location" },
  {
    label: "Book an Appointment",
    image: appointment,
    path: "/bookAppointment",
  },
  { label: "Talk to an Expert", image: expert, path: "/contact" },
  { label: "Repair Your Jewellery", image: repair, path: "/repairProduct" },
  { label: "Gold Loan", image: loan, path: "/goldLoanInquiry" },
  { label: "Home Service", image: door, path: "/homeService" },
];

export default function ShyamaExperience() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-6">
      {/* Heading */}
      <div className="text-center mb-6">
        <h2 className="text-lg md:text-2xl font-semibold text-[#7c1d1d]">
          Shyama Experience
        </h2>
        <p className="text-xs md:text-sm text-gray-500">
          Find a Boutique or Book a Consultation
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {experienceItems.map((item, index) => {
          const Card = (
            <div
              className="
                bg-white
                border
                rounded-xl
                overflow-hidden
                transition
                hover:shadow-md
                cursor-pointer
                group
              "
            >
              {/* IMAGE */}
              <img
                src={item.image}
                alt={item.label}
                className="
                  w-full
                  h-[120px] sm:h-[140px] md:h-[150px]
                  object-contain
                  p-3
                  transition-transform duration-500
                  group-hover:scale-105
                "
              />

              {/* LABEL */}
              <div className="py-2 text-center text-xs md:text-sm font-medium text-[#333] tracking-wide">
                {item.label}
              </div>
            </div>
          );

          return item.path ? (
            <Link to={item.path} key={index}>
              {Card}
            </Link>
          ) : (
            <div key={index}>{Card}</div>
          );
        })}
      </div>
    </section>
  );
}
