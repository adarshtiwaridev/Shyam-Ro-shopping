import React, { useState } from 'react';
import SEO from '@/src/components/SEO';
import siteConfig from '@/src/config/site';

export default function AmcEnquiry() {
  const [form, setForm] = useState({ name: '', email: '', address: '', message: '', mobile: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    if (!form.name || !form.email || !form.address || !form.mobile) {
      setError('Please fill all required fields.');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/amc-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Enquiry sent successfully!');
        setForm({ name: '', email: '', address: '', message: '', mobile: '' });
      } else {
        setError(data.error || 'Failed to send enquiry.');
      }
    } catch (err) {
      setError('Failed to send enquiry.');
    }
    setLoading(false);
  };

  return (
    <>
      <SEO
        title="AMC & RO Service Enquiry"
        description={`Book maintenance, filter replacements, or water purifier servicing with ${siteConfig.brandName}.`}
        canonical="/amc-enquiry"
      />
      <div className="relative min-h-screen flex items-center justify-center py-20 px-2 overflow-hidden">
      {/* High-Quality Blurred Background Image with Overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 w-full h-full z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(30, 41, 59, 0.45), rgba(30, 41, 59, 0.45)), url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(10px) brightness(0.95)',
          opacity: 0.9,
          transition: 'filter 0.3s',
        }}
      />
      {/* Responsive Form Content */}
      <form onSubmit={handleSubmit} className="relative z-10 w-full max-w-lg bg-white/90  text-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 backdrop-blur-md border border-blue-100 dark:border-gray-700">
        <h2 className="text-2xl font-extrabold text-blue-700 dark:text-cyan-300 mb-2 text-center drop-shadow">AMC Enquiry Form</h2>
        {success && <div className="bg-green-100 text-green-800 px-4 py-2 rounded text-center font-semibold">{success}</div>}
        {error && <div className="bg-red-100 text-red-800 px-4 py-2 rounded text-center font-semibold">{error}</div>}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-200 font-medium mb-1">Name<span className="text-red-500">*</span></label>
            <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full border-2 border-gray-400 rounded px-3 py-2 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-400" required />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-200 font-medium mb-1">Email<span className="text-red-500">*</span></label>
            <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full border-2 border-gray-400 rounded px-3 py-2 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-400" required />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-200 font-medium mb-1">Address<span className="text-red-500">*</span></label>
            <input type="text" name="address" value={form.address} onChange={handleChange} className="w-full border-2 border-gray-400 rounded px-3 py-2 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-400" required />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-200 font-medium mb-1">Mobile<span className="text-red-500">*</span></label>
            <input type="tel" name="mobile" value={form.mobile} onChange={handleChange} className="w-full border-2 border-gray-400 rounded px-3 py-2 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-400" required />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-200 font-medium mb-1">Message (optional)</label>
            <textarea name="message" value={form.message} onChange={handleChange} className="w-full border-2 border-gray-400 rounded px-3 py-2 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-400" rows={3} />
          </div>
        </div>
        <button type="submit" disabled={loading} className="w-full cursor-pointer bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-2 px-4 rounded-xl transition disabled:opacity-60 shadow-lg">
          {loading ? 'Sending...' : 'Send Enquiry'}
        </button>
      </form>
    </div>
    </>
  );
} 