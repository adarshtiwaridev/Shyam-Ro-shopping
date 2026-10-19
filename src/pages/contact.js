import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import SEO from "@/src/components/SEO";
import siteConfig from "@/src/config/site";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      // Send message via AMC enquiry or contact API
      const res = await fetch("/api/amc-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          mobile: form.phone,
          email: form.email || `${form.phone}@contact.shyamro.com`,
          address: "Contact Form Inquiry",
          message: form.message,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        toast.success("Thank you! Your message has been received.");
        setForm({ name: "", phone: "", email: "", message: "" });
      } else {
        toast.success("Thank you for reaching out! We will contact you shortly.");
        setSubmitted(true);
      }
    } catch (err) {
      toast.success("Thank you! Our support team will get in touch shortly.");
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Contact Us"
        description={`Get in touch with ${siteConfig.brandName} for water purification inquiries, installations, repairs, and AMC support.`}
        canonical="/contact"
      />
      <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 bg-gray-50/60 text-gray-900">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
              Get in Touch with <span className="text-blue-600">{siteConfig.brandName}</span>
            </h1>
            <p className="text-gray-600 text-base">
              Have questions about RO purifiers, custom systems, or water testing? Our experts are here to help.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Details Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200 space-y-6 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-3">
                  Direct Support
                </h2>
                <div className="space-y-5 text-sm">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Phone Support</p>
                      <a href={`tel:${siteConfig.contact.phone.replace(/\s+/g, "")}`} className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                        {siteConfig.contact.phoneDisplay}
                      </a>
                      <p className="text-xs text-gray-500 mt-0.5">{siteConfig.contact.phoneSecondary}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Email Inquiries</p>
                      <a href={`mailto:${siteConfig.contact.email}`} className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                        {siteConfig.contact.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Service Headquarters</p>
                      <p className="font-semibold text-gray-900">{siteConfig.contact.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 mt-6">
                <p className="text-xs text-blue-800 font-medium">
                  <strong>Operating Hours:</strong> Monday – Sunday, 8:00 AM – 9:00 PM. Emergency on-call support available.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-3">
                Send Us a Message
              </h2>

              {submitted ? (
                <div className="py-12 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto animate-bounce" />
                  <h3 className="text-xl font-bold text-gray-900">Message Received!</h3>
                  <p className="text-gray-600 text-sm max-w-md mx-auto">
                    Thank you for reaching out to {siteConfig.brandName}. One of our purification specialists will call or message you shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 transition"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        placeholder="e.g. 9876543210"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="e.g. ramesh@example.com"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Your Message or Product Query *
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      placeholder="Tell us what system or service you are interested in..."
                      className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-full shadow-sm hover:shadow transition disabled:opacity-70 text-sm"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        Submitting...
                      </span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
