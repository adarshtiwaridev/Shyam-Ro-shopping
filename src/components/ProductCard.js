// Updated Carousel with eCommerce-style CTA section
"use client";
import Image from "next/image";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { IndianRupee, ShoppingCart } from "lucide-react";
import { addToCart } from "../redux/slices/cartSlice";
import { useState } from "react";
import { useRouter } from "next/router";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { useSelector } from "react-redux";
import Link from "next/link";
export function CarouselSize() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [addedToCart, setAddedToCart] = useState([]);
  const products = useSelector((state) => state.product.products);
  const cartItems = useSelector((state) => state.cart.cartItems);
  console.log("products", products);

  const homeCategoryProducts = products.filter(
    (product) =>
      product.productType === "homeproduct" ||
      product.productType === "customplushome"
  );
  console.log("homeCategoryProducts", homeCategoryProducts);

  const carthandler = async (id) => {
    const product = products.find((product) => product._id === id);
    if (!product) return;
    dispatch(addToCart(product));
    // Store updated cart in localStorage
    const updatedCart = [...cartItems, { ...product, quantity: 1 }];
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    toast.success(`${product.name} is added`);
    setAddedToCart((prev) => [...prev, id]);
  };

  if (homeCategoryProducts.length === 0 || !homeCategoryProducts) {
    return (
      <>
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-10">
          <div
            className={`text-center mb-16 transition-all duration-1000 `}
          >
            <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight mb-4">
              Explore Our Products
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto rounded-full"></div>
          </div>

          <div className="flex items-center justify-center my-7">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </>
    );
  }


  return (
    <section className="relative font-sans overflow-hidden lg:-mt-68 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold  mb-4 tracking-tight">
            Explore Our Products
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our premium water purification solutions designed for
            modern homes
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
            skipSnaps: false,
            dragFree: true,
          }}
          className="w-full relative"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {homeCategoryProducts.map((product) => (
              <CarouselItem
                key={product._id}
                className="pl-2 md:pl-4 basis-[85%] xs:basis-[80%] sm:basis-[60%] md:basis-[45%] lg:basis-[33.333%] xl:basis-[25%]"
              >
                <div className="h-full">
                  <div className="bg-white rounded-2xl   transition-all duration-300 h-full flex flex-col justify-between border border-gray-200 overflow-hidden ">
                    {/* Image Container */}
                    <div className="relative w-full  overflow-hidden">
                      {product.bestSeller && (
                        <span className="absolute top-2 left-2 bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded z-20 shadow-md">
                          Best Seller
                        </span>
                      )}

                      <img
                        src={product.images?.[0]}
                        alt={product.name}
                        fill
                        className="w-full h-48 object-cover transition-transform duration-300 "
                        priority={product.id <= 4}
                      />
                      <div className="absolute top-4 right-4 bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full  ">
                        {product?.category?.name.toUpperCase()}
                      </div>
                    </div>

                    {/* Content */}
                    <div className=" p-4 flex-1 flex flex-col">
                      <div className="flex justify-between">
                        <div className="flex right-3 text-blue-600 rounded-full text-sm font-semibold z-20">
                          <IndianRupee className="w-5 h-5 mt-1" />{" "}
                          <p className="text-xl">{product.price}</p>
                        </div>
                        <div className="text-sm text-gray-500">
                          {product?.quantity === 0 ? (
                            <span className="text-red-500 border-2 border-red-500 px-2 py-1 rounded-full  font-medium">
                              Out of Stock
                            </span>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>

                      <div className="flex-1">
                        <h3 className="text-lg capitalize sm:text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-700 transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Quantity: {product?.quantity}
                        </p>

                        <p className="text-sm text-gray-500">
                          {product?.skuid.toUpperCase()}
                        </p>
                        <p className="text-sm capitalize sm:text-base text-gray-600 line-clamp-2 mb-4">
                          {product.description}
                        </p>
                      </div>

                      {/* Action Section */}
                      <div className="space-y-4 mt-auto">
                        <button
                          onClick={() => router.push(`/${product.slug}`)}
                          className="w-full cursor-pointer bg-black text-white text-center py-2 rounded-xl font-bold text-lg"
                        >
                          View
                        </button>

                        <div className="flex items-center justify-center gap-4">
                          <ShoppingCart
                            onClick={() => carthandler(product._id)}
                            disabled={addedToCart?.includes(product._id)}
                            className={` border-2 cursor-pointer  h-[50px] w-[50px] rounded-lg ${
                              addedToCart.includes(product._id)
                                ? "  bg-green-400  cursor-not-allowed"
                                : "text-blue-600  hover:text-blue-700"
                            } font-semibold py-2 rounded-lg flex items-center justify-center gap-2`}
                          />
                          {/* Amazon */}
                          {product.amazonLink ? (
                            <Link
                              href={product.amazonLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-yellow-600 underline font-medium"
                            >
                              <Image
                                src="https://www.kent.co.in/images/icons/amazon-simple.svg"
                                className="cursor-pointer border-2 p-2  rounded-lg"
                                alt="Amazon"
                                width={50}
                                height={50}
                              />
                            </Link>
                          ) : (
                            ""
                          )}

                          {/* Flipkart */}
                          {product?.flipkartLink ? (
                            <Link
                              href={product?.flipkartLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline font-medium"
                            >
                              <Image
                                src="https://www.kent.co.in/images/icons/flipkart-simple.svg"
                                className="cursor-pointer border-2 p-2  rounded-lg"
                                alt="Flipkart"
                                width={50}
                                height={50}
                              />
                            </Link>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="hidden sm:block">
            <CarouselPrevious className="absolute -left-20 top-1/2 -translate-y-1/2 bg-white border-2 border-blue-100 hover:border-blue-300 text-blue-600 hover:text-blue-700 w-12 h-12 rounded-full shadow-md hover:shadow-xl transition-all duration-200" />
            <CarouselNext className="absolute -right-20 top-1/2 -translate-y-1/2 bg-white border-2 border-blue-100 hover:border-blue-300 text-blue-600 hover:text-blue-700 w-12 h-12 rounded-full shadow-md hover:shadow-xl transition-all duration-200" />
          </div>

          <div className="flex justify-center mt-6 sm:hidden">
            <div className="flex space-x-2">
              {products.map((_, index) => (
                <div
                  key={index}
                  className="w-2 h-2 rounded-full bg-blue-200 transition-all duration-200"
                />
              ))}
            </div>
          </div>
        </Carousel>
      </div>
    </section>
  );
}
