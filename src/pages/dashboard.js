import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import axios from "axios";
import SEO from "../components/SEO";
import { setUser } from "../redux/slices/authSlice";
import { setOrders } from "../redux/slices/orderSlice";
import toast from "react-hot-toast";
import { signOut } from "next-auth/react";
import { clearUser } from "../redux/slices/authSlice";
import ProductHistory from "./admin/products/productlist";
import AddCategoryProduct from "./admin/products/addcategoryproduct";
import CustomerManagement from "./admin/userlist";
import OrderManagement from "./admin/order/orderlist";
import OverviewContent from "./admin/overviewcontent";
import {
  BarChart3,
  ShoppingCart,
  Users,
  Plus,
  Package,
  CheckCircle,
  Eye,
  Truck,
  Clock,
  ClipboardList,
  Zap,
  Edit,
  Trash2,
  AlertTriangle,
  Menu,
  X,
  HelpCircle,
} from "lucide-react";
import MyShoppingCart from "./cart";
import AddReview from "./admin/addreview";
import MicroAdminManagement from "./admin/microadmin";
import OrderHistory from "./customer/orderhistory";
import AdminAmcEnquiry from "./admin/amcEnquiry";

const AdminDashboard = () => {
  const allOrders = useSelector((state) => state.order.orders);
  const user = useSelector((state) => state.auth.user);
  const router = useRouter();
  const dispatch = useDispatch();
  
  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [confirm, setConfirm] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(null);

  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    image: "",
    email: "",
  });
  const [loading2, setLoading2] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch orders from API
  const fetchOrders = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/customer/getorders');
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch orders');
      
      if (Array.isArray(data.orders)) {
        dispatch(setOrders(data.orders));
        setLastRefreshed(new Date());
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError(err.message || 'Failed to load orders. Please try again.');
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch orders on component mount and when user changes
  useEffect(() => {
    fetchOrders();
  }, [user]);

  // Handle manual refresh
  const handleRefresh = async () => {
    await fetchOrders();
    toast.success('Orders refreshed');
  };

  useEffect(() => {
    if (user) {
      const firstName = user.firstName || user.name?.split(" ")[0] || "";
      const lastName =
        user.lastName || user.name?.split(" ").slice(1).join(" ") || "";
      const email = user.email;
      setProfileForm({
        firstName,
        lastName,
        email,
        mobile: user.mobile || "",
        image: user.image || "",
      });
    }
  }, [user]);

  const AdminItems = [
    {
      key: "overview",
      label: "Overview",
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      key: "orders",
      label: "Orders",
      icon: <ShoppingCart className="w-5 h-5" />,
    },
    {
      key: "customers",
      label: "Customers",
      icon: <Users className="w-5 h-5" />,
    },
    {
      key: "Micro Admin",
      label: "Micro Admin",
      icon: <Users className="w-5 h-5" />,
    },
    {
      key: "Add Category/Product",
      label: "Add Category/Product",
      icon: <Plus className="w-5 h-5" />,
    },
    {
      key: "Add Review",
      label: "Add Review",
      icon: <Plus className="w-5 h-5" />,
    },
    {
      key: "Product-History",
      label: "Product-History",
      icon: <Package className="w-5 h-5" />,
    },
    {
      key: "Amc-Enquiry",
      label: "Amc-Enquiry",
      icon: <HelpCircle className="w-5 h-5" />,
    },
  ];

  const MicroAdminItems = [
    {
      key: "overview",
      label: "Overview",
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      key: "orders",
      label: "Orders",
      icon: <ShoppingCart className="w-5 h-5" />,
    },
    {
      key: "customers",
      label: "Customers",
      icon: <Users className="w-5 h-5" />,
    },
    {
      key: "Add Review",
      label: "Add Review",
      icon: <Plus className="w-5 h-5" />,
    },
    {
      key: "Product-History",
      label: "Product-History",
      icon: <Package className="w-5 h-5" />,
    },
  ];

  const CustomerItems = [
    {
      key: "overview",
      label: "Overview",
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      key: "orders",
      label: "My Orders",
      icon: <ClipboardList className="w-5 h-5" />,
    },
    {
      key: "cart",
      label: "My Cart",
      icon: <ShoppingCart className="w-5 h-5" />,
    },
  ];

  const getStatusColor = (status) => {
    const colors = {
      delivered: "bg-green-100 text-green-800 border-green-200",
      shipped: "bg-blue-100 text-blue-800 border-blue-200",
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      processing: "bg-purple-100 text-purple-800 border-purple-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getStatusIcon = (status) => {
    const icons = {
      delivered: <CheckCircle className="w-4 h-4 text-green-600" />,
      shipped: <Truck className="w-4 h-4 text-blue-600" />,
      pending: <Clock className="w-4 h-4 text-yellow-600" />,
      processing: <Zap className="w-4 h-4 text-purple-600" />,
    };
    return icons[status] || <Clock className="w-4 h-4 text-gray-600" />;
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...profileForm,
        email: user.email,
      };
      console.log("Form data before submit:", payload);

      const res = await axios.patch("/api/auth/update-profile", payload);
      toast.success(res.data.message || "Profile updated!");
      const updatedUser = {
        ...res.data.user,
        name: `${profileForm.firstName} ${profileForm.lastName}`,
      };
      dispatch(setUser(updatedUser));
      setProfileModalVisible(false);
    } catch (err) {
      toast.error(err.response || "Update failed!");
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setDeleteModalVisible(false);

    if (confirm !== "DELETE") {
      toast.error("You must type DELETE to confirm.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.delete("/api/auth/delete-account");
      toast.success(res.data.message || "Account deleted.");

      dispatch(clearUser());
      setUser(null);
      await signOut({ redirect: false });
      router.push("/authpage");
    } catch (err) {
      toast.error(err.data || "Delete failed!");
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, growth, color }) => (
    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/20 dark:border-gray-700/50">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className={`text-2xl font-bold ${color}`}>
            {value.toLocaleString()}
          </p>
          {growth && (
            <p className="text-xs text-green-600 mt-1">
              +{growth}% from last month
            </p>
          )}
        </div>
        <div className="text-3xl opacity-80">{icon}</div>
      </div>
    </div>
  );

  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [trackModalOpen, setTrackModalOpen] = useState(false);
  const [trackOrder, setTrackOrder] = useState(null);

  const Modal = ({ isOpen, onClose, title, children, modalClassName }) => {
    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "unset";
      }

      return () => (document.body.style.overflow = "unset");
    }, [isOpen]);

    if (!isOpen) return null;

    return (
      <div
        className={`fixed inset-0 flex items-center justify-center px-4 ${
          modalClassName || "z-50"
        }`}
      >
        <div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl ring-4 ring-blue-400/20 w-full max-w-lg transform transition-all overflow-hidden focus:outline-none"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="px-6 py-4 border-b dark:border-gray-700 flex items-center justify-between">
            <h3
              className="text-lg font-semibold text-gray-900 dark:text-gray-100"
              id="modal-title"
            >
              {title}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl leading-none"
            >
              ×
            </button>
          </div>

          <div className="px-6 py-4 max-h-[80vh] overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    console.log("user",user)
    // Customer-specific content
    if (user.role === "customer") {
      const myOrders = allOrders.filter((o) => o.user?._id === user.id);
      switch (selectedMenuItem) {
        case "overview":
          return (
            <div className="space-y-6 animate-fade-in">
              {/* Customer Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
                <StatCard
                  title="My Orders"
                  value={myOrders.length}
                  icon={<ShoppingCart className="w-8 h-8 text-blue-600" />}
                  color="text-blue-600"
                />

                <StatCard
                  title="Active Orders"
                  value={
                    myOrders.filter(
                      (o) =>
                        o.status !== "delivered" && o.status !== "cancelled"
                    ).length
                  }
                  icon={<Package className="w-8 h-8 text-purple-600" />}
                  color="text-purple-600"
                />
                <StatCard
                  title="Delivered"
                  value={
                    myOrders.filter((o) => o.status === "delivered").length
                  }
                  icon={<CheckCircle className="w-8 h-8 text-green-600" />}
                  color="text-green-600"
                />
              </div>

              {/* Customer Content Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                {/* Recent Orders */}
                <div className="xl:col-span-7">
                  <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/50">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        My Recent Orders
                      </h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-900/50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Order ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Products
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Amount
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {myOrders.slice(0, 3).map((order) => (
                            <tr
                              key={order._id}
                              className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="font-medium text-gray-900 dark:text-gray-100">
                                  {order._id}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">
                                <ul className="space-y-1">
                                  {order.items?.map((item, idx) => (
                                    <li
                                      key={item._id || idx}
                                      className="flex items-center gap-2"
                                    >
                                      {item.product?.images?.[0] && (
                                        <img
                                          src={item.product.images[0]}
                                          alt={item.product.name}
                                          className="w-8 h-8 object-cover rounded border"
                                        />
                                      )}
                                      {item.product?.name}
                                      <span className="text-xs text-gray-500">
                                        x{item.quantity}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="font-semibold text-gray-900 dark:text-gray-100">
                                  ₹{order.totalAmount}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                                    order.status
                                  )}`}
                                >
                                  {getStatusIcon(order.status)}{" "}
                                  <span className="ml-1">
                                    {order.status.toUpperCase()}
                                  </span>
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-100">
                                {order.createdAt
                                  ? new Date(order.createdAt).toLocaleString()
                                  : ""}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <button
                                  className="text-blue-600 border-2 rounded-2xl p-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                  onClick={() => {
                                    setSelectedOrder(order);
                                    setOrderModalOpen(true);
                                  }}
                                >
                                  View
                                </button>
                                {/* <button className="text-green-600 border-2 rounded-2xl p-2 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 ml-2" onClick={() => { setTrackOrder(order); setTrackModalOpen(true); }} title="Track Order">Track Location</button> */}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        case "orders":
          return <OrderHistory />;
        case "cart":
          return (
            <div className="-mt-24 -ml-6">
              <MyShoppingCart />
            </div>
          );

        default:
          return <OverviewContent />;
      }
    }

    if (user.role === "microadmin") {
      switch (selectedMenuItem) {
        case "overview":
          return <OverviewContent />;
        case "orders":
          return <OrderManagement />;
        case "customers":
          return <CustomerManagement />;

        case "Add Review":
          return <AddReview />;
        case "Product-History":
          return <ProductHistory />;

        default:
          return <OverviewContent />;
      }
    }

    // Admin-specific content
    if (isLoading && selectedMenuItem === 'orders') {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Loading orders...</span>
        </div>
      );
    }

    if (error && selectedMenuItem === 'orders') {
      return (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error}
                <button
                  onClick={handleRefresh}
                  className="ml-2 text-sm font-medium text-red-700 underline hover:text-red-600 focus:outline-none"
                >
                  Try again
                </button>
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (selectedMenuItem === 'orders') {
      return (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Order Management</h2>
            <div className="flex items-center">
              {lastRefreshed && (
                <span className="text-xs text-gray-500 mr-2">
                  Last updated: {new Date(lastRefreshed).toLocaleTimeString()}
                </span>
              )}
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className={`flex items-center px-3 py-1 text-sm rounded-md ${
                  isLoading
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                }`}
              >
                <svg
                  className={`w-4 h-4 mr-1 ${isLoading ? 'animate-spin' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                {isLoading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>
          <OrderManagement />
        </div>
      );
    }

    switch (selectedMenuItem) {
      case "overview":
        return <OverviewContent />;
      case "orders":
        return <OrderManagement />;
      case "customers":
        return <CustomerManagement />;
      case "Micro Admin":
        return <MicroAdminManagement />;
      case "Add Category/Product":
        return <AddCategoryProduct />;
      case "Add Review":
        return <AddReview />;
      case "Product-History":
        return <ProductHistory />;
      case "Amc-Enquiry":
        return <AdminAmcEnquiry />;

      default:
        return <OverviewContent />;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadForm = new FormData();
    uploadForm.append("image", file);

    try {
      setLoading2(true);
      const res = await axios.post("/api/upload", uploadForm);
      const imageUrl = res.data.url;
      console.log("Image uploaded successfully:", imageUrl);
      setProfileForm((prev) => ({ ...prev, image: imageUrl }));
      dispatch(
        setUser({
          ...user,
          image: imageUrl,
        })
      );

      toast.success("Image uploaded!");
    } catch (err) {
      console.error("Image upload failed:", err);
    } finally {
      setLoading2(false);
    }
  };

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-100  relative">
        <div className="loader"></div>
      </div>
    );

  return (
    <>
      <SEO
        title="Account Dashboard"
        description="Manage your Shyam RO orders, profile, and account details."
        noindex={true}
      />
      <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-50 pb-24 pt-2 relative">
      {(orderModalOpen ||
        trackModalOpen ||
        profileModalVisible ||
        deleteModalVisible) && (
        <div className="fixed inset-0 z-[100] bg-white/10 backdrop-blur-sm transition-all"></div>
      )}

      <div className="flex h-screen relative top-20 z-10">
        {/* Sidebar */}
        <div
          className={`lg:relative h-[88%] fixed inset-y-0 left-0 z-50 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-r border-gray-200 dark:border-gray-700 shadow-lg transition-all duration-300 transform ${
            collapsed ? "w-20" : "w-64"
          } ${
            sidebarOpen
              ? "translate-x-0 top-20"
              : "-translate-x-full lg:translate-x-0 lg:top-0"
          }`}
        >
          <div className="flex flex-col h-full">
            {/* User Profile Section */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <img
                  src={user?.image}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
                />
                {!collapsed && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      {user?.name || `${user.firstName} ${user?.lastName}`}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {user?.role}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation */}
            {/* Navigation */}
            <nav className="flex-1 p-4 overflow-y-auto">
              {user.role === "admin" ? (
                <ul className="space-y-2">
                  {AdminItems.map((item) => (
                    <li key={item.key}>
                      <button
                        onClick={() => {
                          setSelectedMenuItem(item.key);
                          if (window.innerWidth < 1024) setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                          selectedMenuItem === item.key
                            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:translate-x-1"
                        }`}
                      >
                        <span className="text-xl">{item.icon}</span>
                        {!collapsed && (
                          <span className="font-medium">{item.label}</span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : user.role === "microadmin" ? (
                <ul className="space-y-2">
                  {MicroAdminItems.map((item) => (
                    <li key={item.key}>
                      <button
                        onClick={() => {
                          setSelectedMenuItem(item.key);
                          if (window.innerWidth < 1024) setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                          selectedMenuItem === item.key
                            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:translate-x-1"
                        }`}
                      >
                        <span className="text-xl">{item.icon}</span>
                        {!collapsed && (
                          <span className="font-medium">{item.label}</span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="space-y-2">
                  {CustomerItems.map((item) => (
                    <li key={item.key}>
                      <button
                        onClick={() => {
                          setSelectedMenuItem(item.key);
                          if (window.innerWidth < 1024) setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                          selectedMenuItem === item.key
                            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:translate-x-1"
                        }`}
                      >
                        <span className="text-xl">{item.icon}</span>
                        {!collapsed && (
                          <span className="font-medium">{item.label}</span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </nav>

            {/* Profile Actions - Bottom of Sidebar */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
              {!collapsed ? (
                <>
                  <button
                    onClick={() => setProfileModalVisible(true)}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                  <button
                    onClick={() => setDeleteModalVisible(true)}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Account</span>
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center space-y-3">
                  <button
                    onClick={() => setProfileModalVisible(true)}
                    className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    title="Edit Profile"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteModalVisible(true)}
                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    title="Delete Account"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="h-16  bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 shadow-sm">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    setSidebarOpen(!sidebarOpen);
                  } else {
                    setCollapsed(!collapsed);
                  }
                }}
                className="p-2 rounded-lg  text-gray-700 transition-colors"
              >
                {collapsed ? (
                  <Menu className="w-5 h-5" />
                ) : (
                  <X className="w-5 h-5" />
                )}
              </button>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {user.role === "admin"
                  ? AdminItems.find((item) => item.key === selectedMenuItem)
                      ?.label
                  : CustomerItems.find((item) => item.key === selectedMenuItem)
                      ?.label}
              </h1>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-y-auto p-6">{renderContent()}</main>
        </div>
      </div>

      {/* Place global modals here, after all dashboard content and overlay */}
      <Modal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        title={
          selectedOrder
            ? `Order Details - ${selectedOrder._id}`
            : "Order Details"
        }
        modalClassName="z-[110]"
      >
        {selectedOrder && (
          <div className="space-y-4 text-gray-900">
            <div>
              <div className="mb-2">
                <span className="font-semibold">Order ID:</span>{" "}
                {selectedOrder._id}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Status:</span>{" "}
                {selectedOrder.status}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Total:</span> ₹
                {selectedOrder.totalAmount}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Date:</span>{" "}
                {selectedOrder.createdAt
                  ? new Date(selectedOrder.createdAt).toLocaleString()
                  : ""}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Shipping Address:</span>{" "}
                {selectedOrder.shippingAddress?.address},{" "}
                {selectedOrder.shippingAddress?.city},{" "}
                {selectedOrder.shippingAddress?.country} -{" "}
                {selectedOrder.shippingAddress?.postalCode}
              </div>
              <div className="mt-4">
                <span className="font-semibold">Products:</span>
                <ul className="mt-2 space-y-2">
                  {selectedOrder.items?.map((item, idx) => (
                    <li
                      key={item._id || idx}
                      className="flex items-center gap-3 border-b pb-2 last:border-b-0"
                    >
                      {item.product?.images?.[0] && (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-10 h-10 object-cover rounded border"
                        />
                      )}
                      <div>
                        <div className="font-semibold">
                          {item.product?.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          Qty: {item.quantity} | Price: ₹{item.price}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={profileModalVisible}
        onClose={() => setProfileModalVisible(false)}
        title="Edit Profile"
        modalClassName="z-[120]"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Profile Picture
            </label>
            <input
              type="file"
              name="image"
              onChange={handleFileChange}
              accept="image/*"
              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {loading2 && (
              <div className="mt-2 text-blue-600">Uploading image...</div>
            )}
            {profileForm.image && typeof profileForm.image === "string" && (
              <img
                src={profileForm.image}
                alt="Profile Preview"
                className="mt-4 w-24 h-24 rounded-full object-cover border border-gray-300 shadow-md"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={profileForm.firstName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500  text-gray-500"
              placeholder={user?.firstName || ""}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Last Name
            </label>

            <input
              type="text"
              name="lastName"
              value={profileForm.lastName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
              placeholder={user?.lastName || ""}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700   mb-1">
              Phone
            </label>
            <input
              type="tel"
              name="mobile"
              value={profileForm.mobile}
              onChange={handleChange}
              className="w-full px-3 py-2 border  border-gray-600 rounded-lg  focus:outline-none focus:ring-2 focus:ring-blue-500    text-gray-500"
              placeholder={user.phone}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setProfileModalVisible(false)}
              className="px-4 py-2 text-gray-600   hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleProfileUpdate}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        isOpen={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        title="Delete Account"
        modalClassName="z-[120]"
      >
        <div className="text-center space-y-4">
          <div className="text-6xl text-yellow-500">
            <AlertTriangle className="w-24 h-24 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Are you absolutely sure?
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            This action cannot be undone. This will permanently delete your
            account and remove all associated data from our servers.
          </p>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Type 'DELETE' to confirm:
              </label>
              <input
                type="text"
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-gray-100"
                placeholder="DELETE"
              />
            </div>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setDeleteModalVisible(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
    </>
  );
};
export default AdminDashboard;
