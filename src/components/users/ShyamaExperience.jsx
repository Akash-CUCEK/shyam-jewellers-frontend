import door from "../../assets/door.jpg";
import shop from "../../assets/shop.jpg";
import appointment from "../../assets/appointment.jpg";
import repair from "../../assets/repair.jpg";
import loan from "../../assets/loan.jpg";
import expert from "../../assets/expert.jpg";
import { Link } from "react-router-dom";

const experienceItems = [
  {
    label: "Visit Our Store",
    image: shop,
    path: "/location",
  },
  {
    label: "Book an Appointment",
    image: appointment,
    path: "/bookAppointment",
  },
  { label: "Talk to an Expert", image: expert, path: "/contact" },
  { label: "Repair your Jewellary", image: repair, path: "/repairProduct" },
  { label: "Gold Loan", image: loan, path: "/goldLoanInquiry" },
  { label: "Home-Service", image: door, path: "/homeService" },
];

export default function ShyamaExperience() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-semibold text-[#7c1d1d]">
          Shyama Experience
        </h2>
        <p className="text-gray-500 text-sm">
          Find a Boutique or Book a Consultation
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {experienceItems.map((item, index) => {
          const card = (
            <div className="overflow-hidden rounded-lg shadow group cursor-pointer bg-white">
              <img
                src={item.image}
                alt={item.label}
                className="w-full h-48 object-contain p-2"
              />
              <div className="bg-white p-3 text-center text-sm font-medium">
                {item.label.toUpperCase()}
              </div>
            </div>
          );

          return item.path ? (
            <Link to={item.path} key={index}>
              {card}
            </Link>
          ) : (
            <div key={index}>{card}</div>
          );
        })}
      </div>
    </section>
  );
}
