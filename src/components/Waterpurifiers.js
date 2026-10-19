import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, Eye, Star, Wifi } from 'lucide-react';

const ROWaterPurifiers = () => {
  const [wishlist, setWishlist] = useState([]);

  // Water purifier categories data
  const waterPurifierCategories = [
    {
      id: 1,
      name: "KENT Grand Plus",
      category: "Wall Mounted",
      price: "₹15,999",
      originalPrice: "₹18,999",
      image: "/api/placeholder/300/250",
      rating: 4.5,
      reviews: 1250,
      features: ["RO+UV+UF", "9L Tank", "Digital Display", "Mineral RO"],
      badge: "Best Seller",
      badgeVariant: "destructive",
      discount: "15% OFF"
    },
    {
      id: 2,
      name: "KENT Ace Plus",
      category: "Under Counter",
      price: "₹12,499",
      originalPrice: "₹14,999",
      image: "/api/placeholder/300/250",
      rating: 4.3,
      reviews: 890,
      features: ["RO+UV", "7L Tank", "Smart Features", "Auto Shut-off"],
      badge: "New Launch",
      badgeVariant: "default",
      discount: "17% OFF"
    },
    {
      id: 3,
      name: "KENT Supreme Plus",
      category: "Countertop",
      price: "₹22,999",
      originalPrice: "₹26,999",
      image: "/api/placeholder/300/250",
      rating: 4.7,
      reviews: 2100,
      features: ["RO+UV+UF+UV LED", "12L Tank", "WiFi Enabled", "App Control"],
      badge: "Premium",
      badgeVariant: "secondary",
      discount: "15% OFF",
      hasWifi: true
    },
    {
      id: 4,
      name: "KENT Pearl",
      category: "Portable",
      price: "₹8,999",
      originalPrice: "₹10,999",
      image: "/api/placeholder/300/250",
      rating: 4.2,
      reviews: 650,
      features: ["RO+UV", "6L Tank", "Compact Design", "Energy Efficient"],
      badge: "Compact",
      badgeVariant: "outline",
      discount: "18% OFF"
    },
    {
      id: 5,
      name: "KENT Maxx",
      category: "Commercial",
      price: "₹35,999",
      originalPrice: "₹42,999",
      image: "/api/placeholder/300/250",
      rating: 4.6,
      reviews: 450,
      features: ["RO+UV+UF", "20L Tank", "High Flow Rate", "Industrial Grade"],
      badge: "Commercial",
      badgeVariant: "secondary",
      discount: "16% OFF"
    },
    {
      id: 6,
      name: "KENT Wonder",
      category: "Budget Friendly",
      price: "₹6,999",
      originalPrice: "₹8,999",
      image: "/api/placeholder/300/250",
      rating: 4.0,
      reviews: 320,
      features: ["RO+UF", "5L Tank", "Basic Display", "Affordable"],
      badge: "Budget",
      badgeVariant: "outline",
      discount: "22% OFF"
    }
  ];

  const handleViewRange = () => {
    console.log('View Range clicked');
  };

  const handleShopNow = () => {
    console.log('Shop Now clicked');
  };

  const handleAddToCart = (product) => {
    console.log('Add to cart:', product.name);
  };

  const toggleWishlist = (productId) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating) 
            ? 'fill-yellow-400 text-yellow-400' 
            : index < rating 
            ? 'fill-yellow-400/50 text-yellow-400' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen relative bg-base-100">
      {/* Hero Section */}
      <div className="hero min-h-screen bg-gradient-to-r from-slate-900 to-slate-700">
        <div className="hero-content flex-col lg:flex-row-reverse max-w-7xl mx-auto px-4">
          <div className="lg:w-1/2">
            <div className="relative">
              <img 
                src="/api/placeholder/500/400" 
                alt="RO Water Purifiers" 
                className="rounded-lg shadow-2xl w-full"
              />
              <div className="absolute -top-4 -right-4">
                <Badge className="bg-error text-error-content px-4 py-2 text-lg font-bold">
                  #1 Brand
                </Badge>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 text-white">
            <h1 className="text-5xl font-bold mb-6">RO Water Purifiers</h1>
            <p className="text-xl mb-8 text-slate-300 leading-relaxed">
              Trusted by Millions, India's highest selling and most awarded 
              KENT RO Water Purifiers make your water Pure. With its 
              revolutionary Mineral RO™ technology and multiple 
              purification process of RO+UV+UF+UV LED in storage tank, 
              Digital Display of Purity and Minerals feature that allows real-time 
              monitoring of purified water quality, filters life, RO flow 
              rate, etc. KENT ensures Pure & healthier drinking water.
            </p>
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                size="lg" 
                className="btn-outline border-white text-white hover:bg-white hover:text-slate-900"
                onClick={handleViewRange}
              >
                View Range
              </Button>
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90"
                onClick={handleShopNow}
              >
                Shop Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-base-content mb-4">
            Choose Your Perfect Water Purifier
          </h2>
          <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
            Discover our comprehensive range of RO water purifiers designed for every need and budget
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {waterPurifierCategories.map((purifier) => (
            <Card key={purifier.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 border-0">
              <div className="relative">
                <img
                  src={purifier.image}
                  alt={purifier.name}
                  className="w-full h-64 object-cover rounded-t-lg"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant={purifier.badgeVariant} className="font-semibold">
                    {purifier.badge}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="badge badge-error text-white font-bold">
                    {purifier.discount}
                  </div>
                </div>
                <div className="absolute bottom-4 right-4">
                  <Button
                    size="icon"
                    variant="secondary"
                    className={`rounded-full backdrop-blur-sm ${
                      wishlist.includes(purifier.id) ? 'bg-error text-error-content' : 'bg-white/80'
                    }`}
                    onClick={() => toggleWishlist(purifier.id)}
                  >
                    <Heart className={`w-4 h-4 ${wishlist.includes(purifier.id) ? 'fill-current' : ''}`} />
                  </Button>
                </div>
              </div>
              
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-bold text-base-content">
                      {purifier.name}
                    </CardTitle>
                    <Badge variant="outline" className="mt-1">
                      {purifier.category}
                    </Badge>
                  </div>
                  {purifier.hasWifi && (
                    <Wifi className="w-5 h-5 text-primary" />
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {renderStars(purifier.rating)}
                  </div>
                  <span className="text-sm text-base-content/60">
                    ({purifier.reviews} reviews)
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {purifier.features.map((feature, index) => (
                    <div key={index} className="badge badge-ghost badge-sm">
                      {feature}
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-success">
                      {purifier.price}
                    </span>
                    <span className="text-sm text-base-content/50 line-through">
                      {purifier.originalPrice}
                    </span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex gap-2 pt-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => handleAddToCart(purifier)}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-base-200 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-base-content">Why Choose KENT RO?</h2>
            <p className="text-xl text-base-content/70">Advanced technology for pure, healthy water</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { title: "Mineral RO™ Technology", desc: "Retains essential minerals" },
              { title: "Multi-Stage Purification", desc: "RO+UV+UF+UV LED process" },
              { title: "Digital Display", desc: "Real-time monitoring" },
              { title: "Trusted Brand", desc: "India's #1 water purifier" }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary text-primary-content rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">{index + 1}</span>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-base-content">{feature.title}</h3>
                <p className="text-base-content/70">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary to-secondary py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Experience Pure Water?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join millions of satisfied customers who trust KENT for their water purification needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="btn-lg">
              Get Free Installation
            </Button>
            <Button size="lg" variant="outline" className="btn-lg border-white text-white hover:bg-white hover:text-primary">
              Compare Models
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ROWaterPurifiers;