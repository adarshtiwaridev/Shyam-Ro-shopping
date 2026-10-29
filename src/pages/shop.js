"use client";
import Image from "next/image";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { IndianRupee } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { Search, Filter, Star, ShoppingCart, Menu, X } from "lucide-react";
import { addToCart } from "../redux/slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import Link from "next/link";
import SEO from "@/src/components/SEO";
import siteConfig from "@/src/config/site";

const PRODUCTS_PER_PAGE = 6;

// Modular filtering utilities
const FilterUtils = {
  // Search filter - checks if product matches search query
  matchesSearch: (product, searchQuery) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      product?.name?.toLowerCase()?.includes(query) ||
      product?.sqNumber?.toLowerCase()?.includes(query) ||
      product?.skuid?.toLowerCase()?.includes(query)
    );
  },

  // Category filter - checks if product matches selected category
  matchesCategory: (product, selectedCategory, categorySlug) => {
    // If "All" is selected and no specific slug, show all products
    if (
      selectedCategory === "All" &&
      (!categorySlug || categorySlug === "all")
    ) {
      return true;
    }

    // If we have a category slug, filter by slug
    if (categorySlug && categorySlug !== "all") {
      return product?.category?.slug === categorySlug;
    }

    // Otherwise filter by category name
    return product?.category?.name === selectedCategory;
  },

  // Price filter - checks if product is within price range
  matchesPrice: (product, priceRange) => {
    return product?.price >= priceRange[0] && product?.price <= priceRange[1];
  },

  // Main filter function that combines all filters
  filterProducts: (products, filters) => {
    const { search, selectedCategory, priceRange, categorySlug } = filters;

    return products.filter((product) => {
      return (
        FilterUtils.matchesSearch(product, search) &&
        FilterUtils.matchesCategory(product, selectedCategory, categorySlug) &&
        FilterUtils.matchesPrice(product, priceRange)
      );
    });
  },

  // Sorting function
  sortProducts: (products, sortOption) => {
    const sortedProducts = [...products];

    switch (sortOption) {
      case "lowToHigh":
        return sortedProducts.sort((a, b) => a.price - b.price);
      case "highToLow":
        return sortedProducts.sort((a, b) => b.price - a.price);
      case "relevance":
      default:
        return sortedProducts; // Keep original order
    }
  },

  // Pagination function
  paginateProducts: (
    products,
    currentPage,
    productsPerPage = PRODUCTS_PER_PAGE
  ) => {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    return products.slice(startIndex, endIndex);
  },

  // Get total pages
  getTotalPages: (totalProducts, productsPerPage = PRODUCTS_PER_PAGE) => {
    return Math.ceil(totalProducts / productsPerPage);
  },
};

export default function ShopPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  // Get category slug from URL parameters
  const categorySlug = router.query?.slug;

  // State management
  const [sortOption, setSortOption] = useState("relevance");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [currentPage, setCurrentPage] = useState(1);
  const [addedToCart, setAddedToCart] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tempPriceRange, setTempPriceRange] = useState([0, 20000]);

  // Redux selectors
  const dummyProducts = useSelector((state) => state.product.products);
  const categories = useSelector((state) => state.category.categories);
  const cartItems = useSelector((state) => state.cart.cartItems);

  // Sync temp price range with actual price range
  useEffect(() => {
    setTempPriceRange(priceRange);
  }, [priceRange]);

  // Handle category selection based on URL slug parameter
  useEffect(() => {
    if (categorySlug && categories.length > 0) {
      if (categorySlug === "all") {
        setSelectedCategory("All");
      } else {
        const categoryFromSlug = categories.find(
          (category) => category.slug === categorySlug
        );
        if (categoryFromSlug) {
          setSelectedCategory(categoryFromSlug.name);
        }
      }
    } else if (!categorySlug) {
      setSelectedCategory("All");
    }
  }, [categorySlug, categories]);

  // Update URL when category changes (for better UX)
  const updateCategorySlug = useCallback(
    (categoryName) => {
      if (categoryName === "All") {
        router.push("/shop?slug=all", undefined, { shallow: true });
      } else {
        const category = categories.find((cat) => cat.name === categoryName);
        if (category) {
          router.push(`/shop?slug=${category.slug}`, undefined, {
            shallow: true,
          });
        }
      }
    },
    [categories, router]
  );

  // Memoized filtered and sorted products for performance
  const processedProducts = useMemo(() => {
    const filters = {
      search,
      selectedCategory,
      priceRange,
      categorySlug,
    };

    // Apply filters
    const filtered = FilterUtils.filterProducts(dummyProducts, filters).filter(
      (product) => product.category !== null
    );

    // Apply sorting
    const sorted = FilterUtils.sortProducts(filtered, sortOption).filter(
      (product) => product.category !== null
    );

    return sorted;
  }, [
    dummyProducts,
    search,
    selectedCategory,
    priceRange,
    categorySlug,
    sortOption,
  ]);

  // Memoized pagination data
  const paginationData = useMemo(() => {
    const totalPages = FilterUtils.getTotalPages(processedProducts.length);
    const paginatedProducts = FilterUtils.paginateProducts(
      processedProducts,
      currentPage
    );

    return {
      totalPages,
      paginatedProducts,
    };
  }, [processedProducts, currentPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory, priceRange, sortOption]);

  // Destructure pagination data
  const { totalPages, paginatedProducts } = paginationData;
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of shop page after pagination
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const carthandler = async (id) => {
    try {
      const product = dummyProducts.find((product) => product._id === id);
      if (!product) {
        toast.error("Product not found");
        return;
      }
      if (product.quantity === 0) {
        toast.error("Product is out of stock");
        return;
      }
      if (addedToCart.includes(id)) {
        toast.error("Product already in cart");
        return;
      }
      dispatch(addToCart(product));
      const updatedCart = [...cartItems, { ...product, quantity: 1 }];
      localStorage.setItem("cartItems", JSON.stringify(updatedCart));
      toast.success(`${product.name} added to cart`);
      setAddedToCart((prev) => [...prev, id]);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add product to cart");
    }
  };

  return (
    <>
      <SEO
        title="Shop RO Water Purifiers & Filters"
        description={`Explore premium water purifiers, replacement filters, custom setups, and accessories from ${siteConfig.brandName}.`}
        canonical="/shop"
      />
      <div className="bg-white min-h-screen">
        {/* Mobile Filter Button */}
        <div className="md:hidden flex items-center px-4 pt-5">
          <button
            onClick={() => setSidebarOpen(true)}
            className="mt-14 p-2 text-gray-800 hover:text-blue-600 rounded-lg border border-gray-200"
            aria-label="Open filter sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Heading */}
        <div className="relative pt-24 sm:pt-28 text-center px-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
            Explore All <span className="text-blue-600">Products</span>
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto">
            Discover our collection of high-performance water purification systems and spare components
          </p>
        </div>

      <div className="flex flex-col md:flex-row gap-8 px-4 py-10 z-30 relative">
        {/* Sidebar */}
        <aside
          className={`
            fixed top-0 md:-mt-28 left-0 h-full w-5/5 max-w-xs bg-white text-black z-50 shadow-lg transform transition-transform duration-300
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            md:static md:translate-x-0 md:w-1/4 md:max-w-none md:h-auto md:shadow-none md:bg-white md:text-black
          `}
        >
          {/* Close button for mobile */}
          <div className="flex md:hidden justify-between mt-16 items-center p-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-black">Filters</h3>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg"
            >
              <X className="w-6 h-6 text-black" />
            </button>
          </div>
          <div className="p-6 space-y-6 ">
            {/* Search */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <Search className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Search Products</h3>
              </div>
              <div className="relative">
                <Input
                  placeholder="Name or SKUID"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className=" border-slate-600   placeholder:text-gray-600   pl-4 pr-4 py-3 rounded-xl"
                />
                <Search
                  onClick={() => setSidebarOpen(false)}
                  className="absolute right-3 top-2 w-5 h-5 text-black"
                />
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent my-6"></div>

            {/* Category */}
            <div className="space-y-3">
              <div className="flex items-center gap-2   mb-3">
                <Filter className="w-5 h-5" />
                <h3 className="text-lg font-semibold ">Filter by Category</h3>
              </div>
              <Select
                value={selectedCategory}
                onValueChange={(value) => {
                  setSelectedCategory(value);
                  updateCategorySlug(value);
                  setSidebarOpen(false);
                }}
              >
                <SelectTrigger className=" w-full rounded-xl h-12">
                  <SelectValue
                    placeholder="Choose Category"
                    className="text-black"
                  />
                </SelectTrigger>
                <SelectContent className="    text-black border-slate-600 rounded-xl">
                  <SelectItem value="All">
                    <p className="capitalize">All Categories</p>
                  </SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category.name}>
                      <p className="capitalize">{category.name}</p>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent my-6"></div>

            {/* Price Slider */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <IndianRupee className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Price Range</h3>
              </div>

              {/* Temporary slider state */}
              <Slider
                value={tempPriceRange}
                onValueChange={(value) => setTempPriceRange(value)}
                min={0}
                max={20000}
                step={500}
                className="mb-4"
              />

              {/* Min and Max Labels */}
              <div className="flex justify-between text-sm">
                <span className="  px-3 py-1 rounded-lg">
                  ₹{tempPriceRange[0].toLocaleString()}
                </span>
                <span className="  px-3 py-1 rounded-lg">
                  ₹{tempPriceRange[1].toLocaleString()}
                </span>
              </div>

              {/* Apply Button */}
              <button
                onClick={() => {
                  setPriceRange(tempPriceRange);
                  setSidebarOpen(false);
                }}
                className="mt-2    text-black border-2 font-semibold px-4 cursor-pointer py-2 rounded-lg w-full"
              >
                Apply Price Filter
              </button>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent my-6"></div>

            {/* Sorting Options */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-lg font-semibold">Sort By</h3>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="sort"
                    value="relevance"
                    checked={sortOption === "relevance"}
                    onChange={() => setSortOption("relevance")}
                    className="accent-blue-600"
                  />
                  Relevance
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="sort"
                    value="lowToHigh"
                    checked={sortOption === "lowToHigh"}
                    onChange={() => setSortOption("lowToHigh")}
                    className="accent-blue-600"
                  />
                  Price: Low to High
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="sort"
                    value="highToLow"
                    checked={sortOption === "highToLow"}
                    onChange={() => setSortOption("highToLow")}
                    className="accent-blue-600"
                  />
                  Price: High to Low
                </label>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Product Grid */}
        <div className="w-full md:w-3/4 md:ml-0">
          <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-8 mb-12">
            {paginatedProducts.map((product) => (
              <Card
                key={product._id}
                className=" bg-white border border-gray-200 pb-4 pt-0 rounded-2xl overflow-hidden  mx-5"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={product.images?.[0]}
                    alt={product.name}
                    className="w-full h-48 object-cover transition-transform duration-300 "
                  />
                  <div className="absolute capitalize top-4 right-4 bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full  ">
                    {product?.category?.name.toUpperCase()}
                  </div>
                </div>

                <CardContent className="space-y-1">
                  <div className="space-y-2">
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
                    <h3 className="text-lg capitalize font-bold text-gray-800">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {product?.skuid.toUpperCase()}
                    </p>
                    <p className="text-sm text-gray-500 line-clamp-2 truncate">
                      {product?.description} 
                    </p>
                  </div>

                  {/* Store Icons */}
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
                        disabled={
                          addedToCart.includes(product._id) ||
                          product?.quantity === 0
                        }
                        className={` border-2 cursor-pointer  h-[50px] w-[50px] rounded-lg ${
                          addedToCart.includes(product._id)
                            ? "  bg-green-400  cursor-not-allowed"
                            : "text-blue-600  hover:text-blue-700"
                        } font-semibold py-2 rounded-lg flex items-center justify-center gap-2`}
                      />
                      {/* Amazon */}
                      {product.amazonLink ? (
                        <a
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
                        </a>
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
                </CardContent>
              </Card>
            ))}

            {paginatedProducts.length === 0 && (
              <div className="col-span-full text-center py-20">
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-12 backdrop-blur-sm">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-bold text-slate-300 mb-2">
                    No Products Found
                  </h3>
                  <p className="text-slate-400">
                    No products match your current filters. Try adjusting your
                    search criteria.
                  </p>
                </div>
              </div>
            )}
          </main>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-2">
                <Pagination>
                  <PaginationContent className="gap-2">
                    {/* Previous Arrow */}
                    <PaginationItem>
                      <PaginationLink
                        onClick={() =>
                          currentPage > 1 && handlePageChange(currentPage - 1)
                        }
                        className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                          currentPage === 1
                            ? "text-slate-500 cursor-not-allowed"
                            : "text-slate-300 hover:bg-slate-700 hover:text-blue-400"
                        }`}
                      >
                        ←
                      </PaginationLink>
                    </PaginationItem>

                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }, (_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          isActive={currentPage === i + 1}
                          onClick={() => handlePageChange(i + 1)}
                          className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                            currentPage === i + 1
                              ? "  text-white shadow-lg"
                              : "text-slate-300 hover:bg-slate-700 hover:text-blue-400"
                          }`}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    {/* Next Arrow */}
                    <PaginationItem>
                      <PaginationLink
                        onClick={() =>
                          currentPage < totalPages &&
                          handlePageChange(currentPage + 1)
                        }
                        className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                          currentPage === totalPages
                            ? "text-slate-500 cursor-not-allowed"
                            : "text-slate-300 hover:bg-slate-700  "
                        }`}
                      >
                        →
                      </PaginationLink>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
