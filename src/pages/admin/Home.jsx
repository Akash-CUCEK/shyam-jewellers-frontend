import React, { useEffect } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Package,
  Layers3,
  AlertTriangle,
  ShoppingCart,
  Wrench,
  Repeat,
  Gift,
  Coins,
} from "lucide-react";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend
);

const lightGrey = "#f1f1f1";

/* 🔹 Dashboard Card */
const DashboardCard = ({ icon, title, value }) => (
  <div className="bg-[#7c1d1d] rounded-lg p-4 shadow hover:shadow-[#7c1d1d] transition">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon}
        <p className="text-md font-medium text-[#f1f1f1]">{title}</p>
      </div>
      <p className="text-[#f1f1f1] text-xl font-bold">{value}</p>
    </div>
  </div>
);

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();

  /* ✅ SUCCESS TOAST – show only once */
  useEffect(() => {
    if (location.state?.toastMessage) {
      const shown = sessionStorage.getItem("toastShown");
      if (!shown) {
        toast.success(location.state.toastMessage);
        sessionStorage.setItem("toastShown", "true");
        navigate(location.pathname, { replace: true, state: {} });
      }
    }
  }, [location, navigate]);

  /* 📊 Charts Data */
  const barData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Orders",
        backgroundColor: "#A9A9A9",
        hoverBackgroundColor: "#7c1d1d",
        data: [15, 30, 25, 35, 28, 22, 55],
      },
    ],
  };

  const pieData = {
    labels: ["Gold", "Silver", "Diamond"],
    datasets: [
      {
        data: [40, 30, 30],
        backgroundColor: [lightGrey, "#C0C0C0", "#DAA520"],
      },
    ],
  };

  return (
    <div className="text-[#f1f1f1] font-sans">
      {/* 🔝 TOP CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <DashboardCard
          icon={<Layers3 color={lightGrey} />}
          title="Total Product Categories"
          value="8"
        />
        <DashboardCard
          icon={<Package color={lightGrey} />}
          title="Available Stock Items"
          value="534"
        />
        <DashboardCard
          icon={<AlertTriangle color={lightGrey} />}
          title="LowStock Alerts"
          value="3"
        />
        <DashboardCard
          icon={<ShoppingCart color={lightGrey} />}
          title="New Orders Today"
          value="14"
        />
      </div>

      {/* 📈 CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold text-[#7c1d1d] mb-2">
            Requested Orders Per Month
          </h2>
          <div className="h-60">
            <Bar data={barData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold text-[#7c1d1d] mb-2">
            Product Category
          </h2>
          <div className="h-60">
            <Doughnut data={pieData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      {/* 🔧 REQUEST SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <DashboardCard
          icon={<Wrench color={lightGrey} />}
          title="Home Service Requests"
          value="42"
        />
        <DashboardCard
          icon={<Repeat color={lightGrey} />}
          title="Repair Old Product"
          value="18"
        />
        <DashboardCard
          icon={<Gift color={lightGrey} />}
          title="New Appointment Requests"
          value="27"
        />
        <DashboardCard
          icon={<Coins color={lightGrey} />}
          title="Gold Loan Requests"
          value="9"
        />
      </div>
    </div>
  );
}
