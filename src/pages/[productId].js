"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";
import toast from "react-hot-toast";
import SEO from "@/src/components/SEO";
import siteConfig from "@/src/config/site";

export default function ProductDetail() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { productId } = router.query;

  const productData = useSelector((state) => state.product.products);
  const selectedProduct = productData.find(
    (item) => item.slug === productId || item.skuid === productId || item._id === productId
  );

  const [mainImg, setMainImg] = useState(
    selectedProduct?.images?.[0] || "/icons/rologo.png"
  );

  useEffect(() => {
    if (selectedProduct?.images?.length > 0) {
      setMainImg(selectedProduct.images[0]);
    }
  }, [selectedProduct]);

  const [adding, setAdding] = useState(false);

  // Add to Cart handler
  const handleAddToCart = () => {
    if (!selectedProduct) return;
    if (selectedProduct.quantity === 0) {
      toast.error("Product is out of stock");
      return;
    }
    setAdding(true);
    try {
      dispatch(addToCart(selectedProduct));
      toast.success(`${selectedProduct.name} added to cart`);
    } catch (error) {
      toast.error("Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  if (!selectedProduct) {
    return (
      <div className="min-h-screen pt-28 flex flex-col items-center justify-center px-4 bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4" />
        <p className="text-gray-600 text-sm">Loading product details...</p>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={selectedProduct.name}
        description={selectedProduct.description || `Buy ${selectedProduct.name} at ${siteConfig.brandName}. Genuine quality and guaranteed warranty.`}
        canonical={`/${selectedProduct.slug || selectedProduct.skuid}`}
        ogImage={selectedProduct.images?.[0] || "/icons/rologo.png"}
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 sm:pt-28 pb-16 px-4 sm:px-6 md:px-8">
        <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8 flex flex-col md:flex-row gap-8">
          {/* Image Gallery */}
          <div className="flex flex-col items-center md:w-1/2">
            {/* Main Image Container */}
            <div className="w-full aspect-square max-w-[380px] flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-700/30 rounded-2xl border border-gray-100 dark:border-gray-700">
              <img
                src={mainImg}
                alt={selectedProduct.name}
                className="max-w-full max-h-full object-contain rounded-xl transition-all duration-300 hover:scale-105"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/icons/rologo.png";
                }}
              />
            </div>

            {/* Thumbnail Images */}
            {selectedProduct.images?.length > 1 && (
              <div className="flex gap-2.5 p-2 mt-4 justify-center flex-wrap">
                {selectedProduct.images.map((img, idx) => (
                  <button
                    key={img + idx}
                    onClick={() => setMainImg(img)}
                    className={`border-2 rounded-xl p-1 bg-white transition-all duration-200 ${
                      mainImg === img ? "border-blue-600 shadow-sm" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${selectedProduct.name} thumbnail ${idx + 1}`}
                      width={60}
                      height={60}
                      className="object-contain rounded-lg w-[50px] h-[50px] sm:w-[60px] sm:h-[60px]"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1 flex flex-col gap-4">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                {selectedProduct?.category?.name || "RO Water Purifier"}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mt-2 leading-tight">
                {selectedProduct.name}
              </h1>
              <p className="text-xs text-gray-500 mt-1">SKU: {selectedProduct?.skuid}</p>
            </div>

            {/* Ratings & Badge */}
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center text-yellow-500 font-bold">
                <span>★ 4.8</span>
              </div>
              <span className="text-gray-500 text-xs">(Verified Customer Reviews)</span>
              <span className="text-green-600 bg-green-50 text-xs font-semibold px-2 py-0.5 rounded">
                Free Installation Included
              </span>
            </div>

            {/* Pricing */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-3xl font-black text-gray-900 dark:text-white">
                ₹{selectedProduct.price?.toLocaleString()}
              </span>
              {selectedProduct.price && (
                <span className="text-base text-gray-400 line-through">
                  ₹{Math.round(selectedProduct.price * 1.3).toLocaleString()}
                </span>
              )}
              <span className="text-sm text-green-600 font-bold">30% OFF</span>
            </div>
            <p className="text-xs text-gray-500 -mt-2">Inclusive of all taxes & doorstep delivery</p>

            {/* Stock status */}
            <div className="pt-1">
              {selectedProduct.quantity === 0 ? (
                <span className="text-red-600 bg-red-50 px-3 py-1 rounded-full text-xs font-bold">
                  Out of Stock
                </span>
              ) : (
                <span className="text-green-700 bg-green-50 px-3 py-1 rounded-full text-xs font-bold">
                  In Stock ({selectedProduct.quantity} units available)
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={selectedProduct.quantity === 0 || adding}
                className={`w-full py-3 rounded-xl font-bold text-base transition-all shadow-sm ${
                  selectedProduct.quantity === 0 || adding
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer hover:shadow"
                }`}
              >
                {adding ? "Adding..." : "Add to Cart"}
              </button>

              <button
                onClick={() => router.push(`/customer/billingorder?skuid=${selectedProduct.skuid}`)}
                disabled={selectedProduct.quantity === 0}
                className={`w-full py-3 rounded-xl font-bold text-base transition-all ${
                  selectedProduct.quantity === 0
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-gray-900 hover:bg-black text-white cursor-pointer"
                }`}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="max-w-5xl mx-auto mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Product Specifications & Overview
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
            {selectedProduct.description || "High-grade water purification system built with multi-stage RO, UV, and UF filtration technology. Removes heavy metals, bacteria, and dissolved solids while retaining essential natural minerals."}
          </p>
        </div>
      </div>
    </>
  );
}
