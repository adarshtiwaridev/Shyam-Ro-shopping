// app/(auth)/auth/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { signIn } from "next-auth/react";
import { setUser } from "../redux/slices/authSlice";
import { Chrome, Eye, EyeOff, Lock, Mail, User } from "lucide-react";

import toast from "react-hot-toast";

// ShadCN UI
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import SEO from "@/src/components/SEO";
import siteConfig from "@/src/config/site";

export default function AuthPage() {
  const user = useSelector((state) => state.auth.user);
  const [activeTab, setActiveTab] = useState("login");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrors({});
    const mobileRegex = /^[0-9]{10}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    const newErrors = {};
    if (!mobileRegex.test(formData.mobile)) newErrors.mobile = "Mobile number must be exactly 10 digits";
    if (!passwordRegex.test(formData.password)) newErrors.password = "Password must include uppercase, lowercase, number & symbol";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Signup failed");
        return;
      }

      toast.success("OTP sent. Please verify.");
      localStorage.setItem("pendingSignup", JSON.stringify(formData));
      router.push(`/OtpPage?email=${formData.email}`);
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.message || "Login failed");
        return;
      }

      dispatch(setUser(data.user));
      toast.success("Login successful!");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Sign In & Register"
        description={`Sign in or create an account on ${siteConfig.brandName}.`}
        noindex={true}
      />
      <div className="min-h-screen bg-gray-600 py-20 relative flex items-center justify-center p-4 font-inter">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative z-10 w-full max-w-xl"
        >
          <Card className="backdrop-blur-xl bg-gray-700 border-white/20 shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-200 font-poppins">
                {siteConfig.brandName}
              </CardTitle>
              <CardDescription className="text-white/70">Sign in or create an account for pure water solutions</CardDescription>
            </CardHeader>

          <CardContent className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 bg-white/10">
                <TabsTrigger value="login" className="data-[state=active]:bg-white/20 text-white cursor-pointer">Login</TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-white/20 text-white cursor-pointer">Sign Up</TabsTrigger>
              </TabsList>

              <motion.div className="mt-6">
                <Button
                  onClick={handleGoogleSignIn}
                  variant="outline"
                  className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 cursor-pointer"
                >
                  <Chrome className="w-5 h-5 mr-2 " /> Continue with Google
                </Button>
              </motion.div>

              <div className="relative my-3">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full bg-white/20" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-transparent px-2 text-white/60">or</span>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <TabsContent value="login">
                  <motion.form onSubmit={handleLogin} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                    <div>
                      <Label htmlFor="email" className="text-white pb-1">Email</Label>
                      <Input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      />
                    </div>
                    <div className="relative">
                      <Label htmlFor="password" className="text-white pb-1">Password</Label>
                      <Input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/60 pr-10"
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-2 top-7 text-white/60"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                     <Link href='/forgotpassword'>
              <label htmlFor="password" className="block mt-1 pb-3  text-xs sm:text-sm hover:underline cursor-pointer font-medium text-gray-200">
                Forgot Password
              </label>
            </Link>
                    <Button disabled={loading} type="submit" className="w-full cursor-pointer bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                      {loading ? "Logging in..." : "Login"}
                    </Button>
                  </motion.form>
                </TabsContent>

                <TabsContent value="signup">
                  <motion.form onSubmit={handleSignup} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <Input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleInputChange}    className="bg-white/10 border-white/20 text-white placeholder:text-white/60" required />
                      <Input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleInputChange}    className="bg-white/10 border-white/20 text-white placeholder:text-white/60" required />
                    </div>
                    <Input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleInputChange}    className="bg-white/10 border-white/20 text-white placeholder:text-white/60" required />
                    <Input name="mobile" type="tel" placeholder="Mobile" value={formData.mobile} onChange={handleInputChange}   className="bg-white/10 border-white/20 text-white placeholder:text-white/60" required />
                    {errors.mobile && <p className="text-sm text-red-400">{errors.mobile}</p>}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="relative">
                        <Input type={showPassword ? "text" : "password"} name="password" placeholder="Password" value={formData.password} onChange={handleInputChange}  className="bg-white/10 border-white/20 text-white placeholder:text-white/60" required />
                        <button type="button" onClick={togglePasswordVisibility} className="absolute right-2 top-2 text-white ">
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      <div className="relative">
                        <Input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleInputChange}  className="bg-white/10 border-white/20 text-white placeholder:text-white/60" required />
                        <button type="button" onClick={toggleConfirmPasswordVisibility} className="absolute right-2 top-2 text-white">
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    {errors.password && <p className="text-sm text-red-400">{errors.password}</p>}
                    {errors.confirmPassword && <p className="text-sm text-red-400">{errors.confirmPassword}</p>}
                    <Button disabled={loading} type="submit" className="w-full cursor-pointer bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                      {loading ? "Creating Account..." : "Create Account"}
                    </Button>
                  </motion.form>
                </TabsContent>
              </AnimatePresence>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
    </>
  );
}
AuthPage.requireAuth = false;
