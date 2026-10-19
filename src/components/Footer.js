"use client";
import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, MapPin, Phone, Mail, Youtube } from "lucide-react";
import siteConfig from "@/src/config/site";

const faqs = [
  {
    question: "What is the warranty period for Shyam RO systems?",
    answer: "All our RO systems come with a standard 1-year comprehensive warranty. Extended warranty and AMC are available on request.",
  },
  {
    question: "Is installation free?",
    answer: "Yes, FREE assembling and installation are provided across our service areas.",
  },
  {
    question: "Do you offer service support after purchase?",
    answer: "Yes, we provide ongoing AMC (Annual Maintenance Contracts) and doorstep on-call service support.",
  },
  {
    question: "Which RO system is best for borewell water?",
    answer: "We recommend multi-stage RO + UV + UF systems with TDS controllers specifically designed for high-TDS borewell water.",
  },
  {
    question: "How often should I replace the filters?",
    answer: "Pre-filters should be serviced every 3–6 months and the RO membrane annually, depending on your water quality and usage.",
  },
];

export default function Footer() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 px-4 sm:px-6 pt-16 pb-10 relative w-full border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto flex flex-col gap-12 w-full">
        {/* FAQs */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white border-b-2 border-blue-500 pb-2 inline-block">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                onClick={() => toggleFAQ(i)}
                className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-600"
              >
                <div className="flex justify-between items-center gap-4">
                  <h3 className="font-semibold text-base text-gray-800 dark:text-gray-100">{faq.question}</h3>
                  {activeIndex === i ? (
                    <ChevronUp className="text-blue-500 w-5 h-5 shrink-0" />
                  ) : (
                    <ChevronDown className="text-gray-400 w-5 h-5 shrink-0" />
                  )}
                </div>
                <div
                  className={`text-sm text-gray-600 dark:text-gray-300 transition-all duration-300 ease-in-out overflow-hidden ${
                    activeIndex === i ? "max-h-40 opacity-100 mt-3 pt-2 border-t border-gray-100 dark:border-gray-700" : "max-h-0 opacity-0"
                  }`}
                >
                  {faq.answer}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full pt-6">
          {/* Brand & About */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">
              {siteConfig.brandName}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {siteConfig.description}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-base font-semibold text-gray-900 dark:text-white border-b border-blue-500 pb-2 inline-block">
              Quick Links
            </h4>
            <ul className="text-sm space-y-2 text-gray-600 dark:text-gray-400">
              <li>
                <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-blue-600 transition-colors">Shop Products</Link>
              </li>
              <li>
                <Link href="/custom-room" className="hover:text-blue-600 transition-colors">Custom RO Builder</Link>
              </li>
              <li>
                <Link href="/amc-enquiry" className="hover:text-blue-600 transition-colors">AMC & Service Enquiry</Link>
              </li>
              <li>
                <Link href="/certificates" className="hover:text-blue-600 transition-colors">Certifications</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-600 transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-600 transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-3 text-sm">
            <h4 className="text-base font-semibold text-gray-900 dark:text-white border-b border-blue-500 pb-2 inline-block">
              Contact Information
            </h4>
            <p className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
              <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <span><strong>Address:</strong> {siteConfig.contact.address}</span>
            </p>
            <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Phone className="w-4 h-4 text-blue-500 shrink-0" />
              <span><strong>Phone:</strong> {siteConfig.contact.phoneDisplay}, {siteConfig.contact.phoneSecondary}</span>
            </p>
            <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Mail className="w-4 h-4 text-blue-500 shrink-0" />
              <span><strong>Email:</strong> {siteConfig.contact.email}</span>
            </p>
            <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Youtube className="w-4 h-4 text-red-500 shrink-0" />
              <span><strong>YouTube:</strong>{" "}
                <a
                  href={siteConfig.social.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {siteConfig.social.youtubeName}
                </a>
              </span>
            </p>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} {siteConfig.brandName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
