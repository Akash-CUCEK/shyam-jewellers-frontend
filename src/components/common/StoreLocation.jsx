import React from "react";

export default function StoreLocation() {
  return (
    <div className="min-h-screen bg-white">
      {/* 🔶 Banner at the Top */}
      <div className="bg-[#fdf3f3] text-[#7c1d1d] text-center py-10 shadow">
        <h1 className="text-2xl font-bold">Welcome to Shyama Jewellers!</h1>
        <p className="text-sm mt-2">
          Shop from a wide range of exquisite designs for all occasions.
        </p>
      </div>

      {/* 🔽 Store Info Section */}
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold text-[#7c1d1d] mb-2">
          Visit Our Store
        </h2>
        <p className="text-sm text-gray-700 mb-4">
          📍{" "}
          <strong>
            Sitarampur, Near Kazinda Chowk,
            <br />
            Infront of Mai Asthan,
            <br />
            Muzaffarpur, Bihar – 843119
          </strong>
        </p>

        {/* ✅ Google Maps Embed */}
        <div className="w-full max-w-3xl mx-auto aspect-video">
          <iframe
            className="w-full h-full rounded shadow"
            src="https://www.google.com/maps?q=Mai+Asthan+Muzaffarpur+Bihar&output=embed"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Store Location Map"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
