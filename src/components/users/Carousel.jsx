import { useEffect, useRef, useState } from "react";
import { API } from "../../utils/API";

export default function Carousel() {
  const [images, setImages] = useState([]);
  const [current, setCurrent] = useState(0);

  // 🔒 Prevent double API call (React 18 strict mode)
  const fetchedRef = useRef(false);

  /* 🔹 FETCH OFFER IMAGES */
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const res = await API.post("/api/v1/public/getOfferPhoto");

      const data = res?.data?.response;

      if (!data) return;

      // 🔥 OBJECT → ARRAY conversion
      const imageArray = Object.values(data);

      setImages(imageArray);
    } catch (err) {
      console.error("Failed to load offer images", err);
    }
  };

  /* 🔹 AUTO SLIDE */
  useEffect(() => {
    if (images.length === 0) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [images]);

  const next = () => setCurrent((prev) => (prev + 1) % images.length);
  const prev = () =>
    setCurrent((prev) => (prev - 1 + images.length) % images.length);

  if (images.length === 0) return null;

  return (
    <div className="w-full flex justify-center mt-4">
      <div
        className="
          relative 
          w-[95%] 
          lg:w-[85%]
          h-[180px] 
          sm:h-[260px] 
          lg:h-[320px]
          overflow-hidden
          rounded-2xl
          shadow-xl
        "
      >
        {/* Slides */}
        {images.map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`offer-${index}`}
            className={`
              absolute inset-0
              w-full h-full
              object-cover
              transition-opacity duration-1000
              ${current === index ? "opacity-100" : "opacity-0"}
            `}
          />
        ))}

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Left Arrow */}
        <button
          onClick={prev}
          className="
            absolute left-3 top-1/2 -translate-y-1/2
            bg-black/50 text-white
            w-9 h-9 rounded-full
            flex items-center justify-center
            hover:bg-black/70
          "
        >
          ❮
        </button>

        {/* Right Arrow */}
        <button
          onClick={next}
          className="
            absolute right-3 top-1/2 -translate-y-1/2
            bg-black/50 text-white
            w-9 h-9 rounded-full
            flex items-center justify-center
            hover:bg-black/70
          "
        >
          ❯
        </button>

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-2.5 h-2.5 rounded-full ${
                current === index ? "bg-white" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
