import React, { useState, useEffect } from 'react';
import { Youtube, Droplets, Shield, Zap, Award, Users, Phone, Mail } from 'lucide-react';
import SEO from '@/src/components/SEO';
import siteConfig from '@/src/config/site';

const AboutPage = () => {
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const services = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Expert Installation",
      description: "Professional RO system installation with precision plumbing, TDS calibration, and pressure testing."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Maintenance & Repair",
      description: "Fast doorstep maintenance, certified filter replacement, and complete system troubleshooting."
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Water Testing & Consultation",
      description: "Comprehensive TDS and contaminant analysis with customized purification recommendations."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "24/7 Customer Care",
      description: "Dedicated on-call technical support and annual maintenance contracts (AMC) from certified specialists."
    }
  ];

  return (
    <>
      <SEO
        title="About Us"
        description={`Learn more about ${siteConfig.brandName}, India's trusted water purification specialists since ${siteConfig.stats.sinceYear}.`}
        canonical="/about"
      />
      <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
        {/* Hero Section */}
        <section className="relative min-h-[85vh] flex items-center justify-center px-4 pt-20">
          <div
            className="absolute inset-0 bg-cover bg-center brightness-50"
            style={{
              backgroundImage: "url('/images/about1.png')",
            }}
          />
          <div className="relative z-10 text-center max-w-4xl mx-auto py-12">
            <Droplets className="w-16 h-16 mx-auto mb-4 text-blue-400 animate-pulse" />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 text-white tracking-tight">
              {siteConfig.brandName}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 font-medium mb-8">
              Your Trusted Water Purification & RO Specialists
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 mb-10 max-w-3xl mx-auto">
              <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-white/40 shadow-lg">
                <div className="text-3xl font-extrabold text-blue-600">25,000+</div>
                <div className="text-sm font-semibold text-gray-700 mt-1">Installations</div>
              </div>
              <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-white/40 shadow-lg">
                <div className="text-3xl font-extrabold text-blue-600">{siteConfig.stats.experienceYears}</div>
                <div className="text-sm font-semibold text-gray-700 mt-1">Years Experience</div>
              </div>
              <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-white/40 shadow-lg">
                <div className="text-3xl font-extrabold text-blue-600">10,000+</div>
                <div className="text-sm font-semibold text-gray-700 mt-1">Happy Families</div>
              </div>
            </div>

            <a
              href="#about"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-3.5 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Discover Our Story
            </a>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <div
              id="about-content"
              data-animate
              className={`transition-all duration-1000 ${
                isVisible['about-content'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-10 text-gray-900">
                About <span className="text-blue-600">{siteConfig.brandName}</span>
              </h2>
              <div className="bg-blue-50/70 rounded-3xl p-8 sm:p-12 border border-blue-100 space-y-6">
                <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                  Welcome to <strong>{siteConfig.brandName}</strong>, your premier destination for high-performance
                  water purification solutions. With over two decades of industry leadership across Delhi-NCR and beyond,
                  we specialize in custom reverse osmosis technology, filtration components, and reliable annual maintenance.
                </p>
                <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                  Our certified technicians ensure that every purification system is customized for the local water source
                  — whether borewell, municipal, or tanker supply — providing your family with crystal-clear, mineral-balanced,
                  and healthy drinking water.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* YouTube Section */}
        <section className="py-16 px-4 bg-gray-50/60">
          <div className="max-w-4xl mx-auto text-center">
            <div
              id="youtube-section"
              data-animate
              className={`bg-white rounded-3xl p-8 sm:p-12 border border-gray-200 shadow-sm transition-all duration-1000 ${
                isVisible['youtube-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <Youtube className="w-16 h-16 mx-auto mb-4 text-red-600" />
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900">
                Watch & Learn with Our Experts
              </h2>
              <p className="text-base text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
                Join our community of water purification enthusiasts. Get practical maintenance tips,
                product breakdowns, and installation guides from certified technicians.
              </p>
              <a
                href={siteConfig.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-red-600 hover:bg-red-700 text-white px-8 py-3.5 rounded-full font-semibold shadow-md hover:shadow-lg transition-all"
              >
                <Youtube className="w-5 h-5" />
                Visit Our YouTube Channel
              </a>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-12 text-gray-900">
              Our Core <span className="text-blue-600">Services</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service, index) => (
                <div
                  key={service.title}
                  id={`service-${index}`}
                  data-animate
                  className={`bg-white rounded-2xl p-6 border border-gray-200 hover:border-blue-400 transition-all duration-300 hover:shadow-lg text-center flex flex-col items-center ${
                    isVisible[`service-${index}`] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${index * 80}ms` }}
                >
                  <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 mb-4 flex items-center justify-center">
                    {service.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 px-4 bg-blue-50/50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">
              Get in Touch with Our Team
            </h2>
            <p className="text-gray-600 mb-10 max-w-xl mx-auto">
              Ready to upgrade your drinking water? Speak with our purification specialists today.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col items-center">
                <Phone className="w-8 h-8 text-blue-600 mb-3" />
                <h3 className="font-bold text-gray-900 mb-1">Call Us</h3>
                <p className="text-gray-700 font-medium">{siteConfig.contact.phoneDisplay}</p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col items-center">
                <Mail className="w-8 h-8 text-blue-600 mb-3" />
                <h3 className="font-bold text-gray-900 mb-1">Email Us</h3>
                <p className="text-gray-700 font-medium">{siteConfig.contact.email}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutPage;
