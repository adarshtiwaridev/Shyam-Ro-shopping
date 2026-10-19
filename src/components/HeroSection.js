import { CarouselSize } from "./ProductCard";
import YoutubeTrust from "../pages/youtube";
import DressStyleCarousel from "./categoryproduct";
import TestimonialSection from "./Testimonial";
import { useEffect, useState } from "react";
import {
  Truck,
  CalendarDays,
  Clock,
  Settings,
  ShoppingCart,
  ShoppingBag,
  Search,
} from "lucide-react";
import { useRouter } from "next/router";
import siteConfig from "../config/site";

export default function HeroSection() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    "/images/crausel1.png",
    "/images/crausel2.png",
    "/images/crausel3.png",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="relative w-full min-h-screen overflow-hidden text-gray-800 bg-white">
      {/* Hero Carousel Section */}
      <section className="relative w-full mt-16 sm:mt-20 min-h-[90vh] overflow-hidden">
        {/* Carousel Background Images */}
        <div className="absolute inset-0 h-[80vh] mt-1 mr-4 ml-4 sm:mr-5 sm:ml-5 rounded-2xl overflow-hidden shadow-inner">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out rounded-2xl ${
                index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
              style={{
                backgroundImage: `url(${slide})`,
              }}
            />
          ))}
          {/* Subtle gradient overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent z-10" />
        </div>

        {/* Content Box */}
        <div className="relative z-20 w-full min-h-[80vh] flex items-center justify-start px-4 sm:px-8 py-12 sm:py-20">
          <div className="mx-auto sm:ml-16 md:ml-20 w-full max-w-xl">
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 sm:p-10 text-left space-y-6 shadow-xl border border-white/40">
              {/* Tagline */}
              <div className="inline-block bg-blue-100 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-700 rounded-full px-4 sm:px-6 py-1.5 sm:py-2">
                <p className="text-blue-700 dark:text-blue-300 font-semibold text-xs sm:text-sm tracking-wide text-center sm:text-left">
                  India's Trusted Custom {siteConfig.brandName} – Since {siteConfig.stats.sinceYear}
                </p>
              </div>

              {/* Heading */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight text-gray-900 dark:text-white">
                PURE <span className="text-blue-600">WATER</span>
                <br />
                FOR <span className="text-cyan-600">HEALTHY</span> LIFE
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Experience the purest water with our advanced RO purification technology.
                Custom-built systems designed for your family's health, safety, and longevity.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3.5 pt-2">
                <button
                  onClick={() => router.push("/custom-room")}
                  className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-full flex items-center gap-2 shadow-md hover:shadow-lg transition-all text-sm sm:text-base font-semibold"
                >
                  <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                  Customize Your RO
                </button>
                <button
                  onClick={() => router.push("/shop")}
                  className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 cursor-pointer px-5 py-2.5 sm:px-6 sm:py-3 rounded-full flex items-center gap-2 transition-all text-sm sm:text-base font-semibold"
                >
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                  Explore Products
                </button>
              </div>

              {/* Mobile Stats inside card */}
              <div className="grid grid-cols-3 gap-2 pt-6 border-t border-gray-200 dark:border-gray-700 sm:hidden">
                {[
                  { count: "680+", label: "Awards" },
                  { count: "25K+", label: "Clients" },
                  { count: "100%", label: "Tested Pure" },
                ].map(({ count, label }) => (
                  <div key={label} className="text-center">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{count}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Stats floating bar */}
        <div className="absolute bottom-16 right-8 z-20 hidden sm:block w-[45%] max-w-lg">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl py-5 px-6 flex flex-row justify-around items-center gap-4 shadow-xl border border-white/50">
            {[
              { count: "680+", label: "Award Winning" },
              { count: "25K+", label: "Happy Clients" },
              { count: "100%", label: "Satisfaction" },
            ].map(({ count, label }) => (
              <div key={label} className="text-center">
                <h3 className="text-2xl font-bold text-gray-900">{count}</h3>
                <p className="text-xs font-medium text-gray-600">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Second Section - Delivery & Service */}
      <section className="relative w-full py-16 sm:py-24 px-4 sm:px-8 text-gray-800 bg-gray-50/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-16">
          {/* Image */}
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md aspect-4/3 rounded-2xl overflow-hidden shadow-xl border border-gray-200 bg-blue-50">
              <img
                src="/images/craus.png"
                alt={`${siteConfig.brandName} Fast Delivery and Service`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/crauselphoto.png";
                }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="w-full md:w-1/2 space-y-6 text-center md:text-left">
            <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Doorstep Service & Supply
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight">
              EXPERT DELIVERY & <span className="text-blue-600">INSTALLATION</span>
            </h2>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
              From fresh purification units to high-grade replacement filters and annual maintenance,
              our certified technicians deliver prompt, professional support right to your door.
            </p>

            <div className="space-y-3.5 pt-2">
              {[
                { icon: Truck, label: "FREE ASSEMBLY & INSTALLATION" },
                { icon: CalendarDays, label: "7 DAYS A WEEK ACTIVE SUPPORT" },
                { icon: Clock, label: "SAME DAY DISPATCH & REPAIRS" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3 justify-center md:justify-start">
                  <div className="bg-blue-100 p-2 rounded-full text-blue-600 shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-sm sm:text-base text-gray-800">{label}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 pt-4 justify-center md:justify-start">
              <button
                onClick={() => router.push("/shop")}
                className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-6 py-3 rounded-full flex items-center justify-center gap-2 shadow-md transition-all text-sm sm:text-base font-semibold"
              >
                <ShoppingBag className="w-5 h-5" />
                Order Now
              </button>
              <button
                onClick={() => router.push("/about")}
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 cursor-pointer px-6 py-3 rounded-full flex items-center justify-center gap-2 transition-all text-sm sm:text-base font-semibold"
              >
                <Search className="w-5 h-5" />
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Product Highlight Carousel */}
      <CarouselSize />

      {/* Category Grid / Carousel */}
      <DressStyleCarousel />

      {/* Trust & Channel Highlights */}
      <YoutubeTrust />

      {/* Customer Testimonials */}
      <TestimonialSection />
    </div>
  );
}
