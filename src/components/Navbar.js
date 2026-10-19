import React, { useState } from "react";
import { Menu, X, ShoppingCart } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { signOut } from "next-auth/react";
import { clearUser } from "../redux/slices/authSlice";
import Image from "next/image";
import Link from "next/link";
import siteConfig from "../config/site";

export default function PremiumNavigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const user = useSelector((state) => state.auth.user);

  const totalItems = cartItems?.length || 0;

  const handleLogout = async () => {
    try {
      await axios.get("/api/auth/logout");
      await signOut({ redirect: false });
      dispatch(clearUser());
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Custom RO", href: "/custom-room" },
    { name: "Certifications", href: "/certificates" },
    { name: "AMC Enquiry", href: "/amc-enquiry" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/95 border-b border-gray-100 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 py-3.5">
          {/* Logo & Brand Name */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 rounded-full overflow-hidden bg-blue-50 border border-blue-200 flex items-center justify-center shadow-xs">
              <Image
                src="/icons/rologo.png"
                alt={`${siteConfig.brandName} Logo`}
                width={36}
                height={36}
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg sm:text-xl text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors">
                {siteConfig.brandName}
              </span>
              <span className="text-[10px] uppercase font-semibold text-blue-600 tracking-wider -mt-1">
                Pure Water Solution
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = router.pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? "text-blue-600 bg-blue-50/80 font-semibold"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right Header Actions (Cart & Auth) */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Cart Icon */}
            <Link
              href="/cart"
              className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors rounded-full hover:bg-gray-50"
              aria-label={`Shopping cart with ${totalItems} items`}
            >
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[11px] font-bold rounded-full min-w-5 h-5 flex items-center justify-center px-1 shadow-sm">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Desktop Auth */}
            <div className="hidden sm:flex items-center">
              {user ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="flex items-center gap-2.5 cursor-pointer rounded-full p-1 pl-2 border border-gray-200 hover:border-blue-300 transition-all focus:outline-none">
                      <p className="text-xs font-medium text-gray-800 max-w-[120px] truncate">
                        {user?.name || user?.firstName || "My Account"}
                      </p>
                      <img
                        src={user?.image || "/images/avatar.png"}
                        alt={user?.name || "User Avatar"}
                        className="w-7 h-7 rounded-full object-cover border border-blue-400"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/images/avatar.png";
                        }}
                      />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-48 p-2 bg-white rounded-xl shadow-lg border border-gray-100">
                    <div className="px-3 py-2 border-b border-gray-100 mb-1">
                      <p className="text-xs text-gray-500">Signed in as</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {user?.email}
                      </p>
                    </div>
                    <Link
                      href="/dashboard"
                      className="block px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/customer/orderhistory"
                      className="block px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                    >
                      Order History
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    >
                      Log out
                    </button>
                  </PopoverContent>
                </Popover>
              ) : (
                <Link
                  href="/authpage"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-full shadow-sm transition-all hover:shadow"
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* Hamburger Button for Mobile */}
            <button
              className="lg:hidden p-2 text-gray-700 hover:text-blue-600 focus:outline-none"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle navigation menu"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMenuOpen(false)}
          />

          {/* Drawer Sheet */}
          <div className="fixed top-0 right-0 h-full w-[80vw] max-w-xs bg-white p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Header inside drawer */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Image
                    src="/icons/rologo.png"
                    alt={siteConfig.brandName}
                    width={28}
                    height={28}
                    className="rounded-full"
                  />
                  <span className="font-bold text-gray-900">{siteConfig.brandName}</span>
                </div>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-1 text-gray-500 hover:text-gray-900"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Links */}
              <div className="flex flex-col gap-1 py-4">
                {navLinks.map((link) => {
                  const isActive = router.pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                        isActive
                          ? "text-blue-600 bg-blue-50 font-semibold"
                          : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Mobile Auth Bottom Section */}
            <div className="pt-4 border-t border-gray-100">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 px-2 py-1">
                    <img
                      src={user?.image || "/images/avatar.png"}
                      alt={user?.name || "User Avatar"}
                      className="w-8 h-8 rounded-full border border-blue-400 object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/images/avatar.png";
                      }}
                    />
                    <div className="truncate">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {user?.name || user?.firstName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="block w-full text-center py-2 text-sm bg-blue-50 text-blue-600 font-medium rounded-lg"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="block w-full text-center py-2 text-sm text-red-600 hover:bg-red-50 font-medium rounded-lg"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/authpage"
                  onClick={() => setMenuOpen(false)}
                  className="block w-full text-center py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-sm"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}