"use client";
import Link from "next/link";
import {
  Wrench,
  Trophy,
  PhoneCall,
  Target,
  CheckCircle,
  Youtube,
} from "lucide-react";
import Image from "next/image";
import SEO from "@/src/components/SEO";
import siteConfig from "@/src/config/site";

export default function YoutubeTrust() {
  return (
    <>
      <SEO
        title="Our Trust & Community"
        description={`Discover why over ${siteConfig.stats.clients} clients trust ${siteConfig.brandName} for water purification.`}
        canonical="/youtube"
      />
      <section className="relative my-10 py-10 text-gray-800 overflow-hidden font-sans">
        <div className="max-w-6xl mx-auto relative z-10 grid md:grid-cols-2 gap-10 items-center px-6">
          {/* Trust Information */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-900 mb-4 leading-tight">
              Trusted by {siteConfig.stats.clients} Clients <br /> Since{" "}
              <span className="text-cyan-600">{siteConfig.stats.sinceYear}</span>
            </h2>
            <p className="text-gray-600 text-base mb-6 leading-relaxed">
              {siteConfig.brandName} isn’t just an online store — we’ve been transforming homes,
              offices, hospitals, schools, and commercial facilities across NCR with certified water
              purification systems for over {siteConfig.stats.experienceYears}.
            </p>

            <ul className="space-y-3.5 text-gray-700 text-base">
              <li className="flex items-center gap-2.5">
                <Wrench className="w-5 h-5 text-blue-600 shrink-0" />
                <span>Installed {siteConfig.stats.clients} custom RO systems</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Trophy className="w-5 h-5 text-yellow-500 shrink-0" />
                <span>Trusted by residential, commercial & institutional clients</span>
              </li>
              <li className="flex items-center gap-2.5">
                <PhoneCall className="w-5 h-5 text-green-600 shrink-0" />
                <span>Dedicated support across Ballabhgarh, Faridabad & NCR</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Target className="w-5 h-5 text-indigo-600 shrink-0" />
                <span>24×7 prompt maintenance with certified technicians</span>
              </li>
            </ul>
          </div>

          {/* YouTube Highlights Card */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-md hover:shadow-xl transition-all duration-300">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Left Textual Content */}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-red-600 mb-4 flex items-center gap-2">
                  <Youtube className="w-6 h-6" /> Channel Highlights
                </h3>

                <ul className="space-y-3 text-gray-700 text-sm sm:text-base">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                    <span>Over <strong>{siteConfig.stats.subscribers}</strong> Subscribers</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                    <span><strong>{siteConfig.stats.views}</strong> Views on maintenance guides</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                    <span>Real live installation tutorials & customer reviews</span>
                  </li>
                </ul>

                <Link
                  href={siteConfig.social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full shadow hover:shadow-lg transition-all duration-300"
                >
                  <Youtube className="w-5 h-5" />
                  Visit YouTube Channel
                </Link>
              </div>

              {/* Right Logo/Image */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 flex items-center justify-center p-2 rounded-2xl bg-red-50 border border-red-100">
                <Image
                  width={64}
                  height={64}
                  src="/images/youtubelogo.png"
                  alt={`${siteConfig.brandName} YouTube`}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
