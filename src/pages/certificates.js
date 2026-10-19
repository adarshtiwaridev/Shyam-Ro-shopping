import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Award, Calendar, ExternalLink, Download, Star, CheckCircle, Shield, Zap } from "lucide-react";
import SEO from "@/src/components/SEO";
import siteConfig from "@/src/config/site";

export default function Certifications() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Sample certification data
  const certifications = [
    {
      id: 1,
      title: "ISO 9001:2015 Quality Management",
      issuer: "International Organization for Standardization",
      date: "2023",
      category: "quality",
      description: "Certified for quality management systems ensuring consistent product quality and customer satisfaction.",
      image: "/certifications/avatar.png",
      validity: "Valid until 2026",
      level: "Advanced",
      tags: ["Quality Management", "ISO", "International"]
    },
    {
      id: 2,
      title: "Water Quality Certification",
      issuer: "Bureau of Indian Standards",
      date: "2023",
      category: "water",
      description: "Certified for meeting Indian standards for drinking water quality and purification systems.",
      image: "/certifications/avatar.png",
      validity: "Valid until 2025",
      level: "Professional",
      tags: ["Water Quality", "BIS", "Drinking Water"]
    },
    {
      id: 3,
      title: "Environmental Management System",
      issuer: "ISO 14001:2015",
      date: "2022",
      category: "environmental",
      description: "Certified for environmental management systems demonstrating commitment to environmental responsibility.",
      image: "/certifications/avatar.png",
      validity: "Valid until 2025",
      level: "Advanced",
      tags: ["Environmental", "ISO", "Sustainability"]
    },
    {
      id: 4,
      title: "RO System Installation Certification",
      issuer: "Water Quality Association",
      date: "2023",
      category: "technical",
      description: "Certified installer for reverse osmosis water purification systems with advanced technical expertise.",
      image: "/certifications/avatar.png",
      validity: "Valid until 2026",
      level: "Expert",
      tags: ["RO Systems", "Installation", "Technical"]
    },
    {
      id: 5,
      title: "Customer Service Excellence",
      issuer: "Customer Service Institute",
      date: "2023",
      category: "service",
      description: "Recognized for exceptional customer service and support in the water purification industry.",
      image: "/certifications/avatar.png",
      validity: "Valid until 2024",
      level: "Professional",
      tags: ["Customer Service", "Excellence", "Support"]
    },
    {
      id: 6,
      title: "Safety Management System",
      issuer: "OHSAS 18001:2007",
      date: "2022",
      category: "safety",
      description: "Certified for occupational health and safety management ensuring workplace safety standards.",
      image: "/certifications/avatar.png",
      validity: "Valid until 2025",
      level: "Advanced",
      tags: ["Safety", "OHSAS", "Workplace"]
    }
  ];

  const categories = [
    { id: "all", name: "All Certifications", count: certifications.length },
    { id: "quality", name: "Quality Management", count: certifications.filter(c => c.category === "quality").length },
    { id: "water", name: "Water Quality", count: certifications.filter(c => c.category === "water").length },
    { id: "environmental", name: "Environmental", count: certifications.filter(c => c.category === "environmental").length },
    { id: "technical", name: "Technical", count: certifications.filter(c => c.category === "technical").length },
    { id: "service", name: "Service", count: certifications.filter(c => c.category === "service").length },
    { id: "safety", name: "Safety", count: certifications.filter(c => c.category === "safety").length }
  ];

  const filteredCertifications = selectedCategory === "all" 
    ? certifications 
    : certifications.filter(cert => cert.category === selectedCategory);

  const getLevelColor = (level) => {
    switch (level) {
      case "Expert": return "bg-purple-100 text-purple-800 border-purple-200";
      case "Advanced": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Professional": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <>
      <SEO
        title="Quality & Safety Certifications"
        description={`Explore national and international certifications (ISO, BIS) verifying ${siteConfig.brandName}'s product quality and technical excellence.`}
        canonical="/certificates"
      />
      <div className="min-h-screen pt-20 bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Hero Section with Background Image */}
      <section className="relative w-full min-h-[60vh] overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center brightness-75"
          style={{
            backgroundImage: "url('/images/waterfamily.png')",
          }}
        ></div>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-cyan-900/60"></div>
        
        {/* Content */}
        <div className="relative z-10 flex items-center justify-center min-h-[60vh] px-4">
          <div className="text-center text-white max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-white/20  rounded-full px-6 py-2 mb-6">
              <Award className="w-5 h-5" />
              <span className="text-sm font-medium">Certified Excellence</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
              Our <span className="text-cyan-300">Certifications</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Discover our comprehensive range of certifications that demonstrate our commitment to quality, 
              safety, and excellence in water purification technology.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
                <div className="text-2xl font-bold">{certifications.length}</div>
                <div className="text-sm text-blue-100">Total Certifications</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
                <div className="text-2xl font-bold">100%</div>
                <div className="text-sm text-blue-100">Valid & Current</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-sm text-blue-100">Support Available</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Our Certifications Matter
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our certifications are not just badges on the wall. They represent our unwavering commitment 
              to delivering the highest quality water purification solutions with the utmost safety and reliability.
            </p>
          </div>
 
        </div>
      </section>

      {/* Certifications Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="rounded-full"
              >
                {category.name}
                <Badge variant="secondary" className="ml-2">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>

          {/* Certifications Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCertifications.map((cert) => (
              <Card key={cert.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <Award className="w-8 h-8 text-white" />
                    </div>
                    <Badge className={getLevelColor(cert.level)}>
                      {cert.level}
                    </Badge>
                  </div>
                  
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {cert.title}
                  </CardTitle>
                  
                  <CardDescription className="text-gray-600">
                    {cert.issuer}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    {cert.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{cert.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Shield className="w-4 h-4" />
                      <span>{cert.validity}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {cert.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs text-black">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <Separator />
                  
                  <div className="flex gap-2">
                    <Button size="sm"   className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button size="sm" >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      
    </div>
    </>
  );
} 
