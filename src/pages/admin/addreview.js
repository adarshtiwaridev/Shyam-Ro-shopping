import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
const AddReview = () => {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const user = useSelector((state) => state.auth.user);

  // Testimonials state
  const [testimonials, setTestimonials] = useState([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null); // id of deleting testimonial
  const [testimonialError, setTestimonialError] = useState('');

  // Fetch testimonials
  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoadingTestimonials(true);
    setTestimonialError('');
    try {
      const res = await fetch('/api/reviews');
      const data = await res.json();
      if (data.success) {
        setTestimonials(data.reviews);
      } else {
        setTestimonialError(data.message || 'Failed to load testimonials');
      }
    } catch (err) {
      setTestimonialError('Failed to load testimonials');
    }
    setLoadingTestimonials(false);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    setError('');
    setSuccess('');
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setImageUrl(data.url);
        setSuccess('Image uploaded!');
      } else {
        setError(data.message || 'Image upload failed');
      }
    } catch (err) {
      setError('Image upload failed');
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    if (!imageUrl || !name || !position || !description) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageUrl, name, position, description }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Review added successfully!');
        setName('');
        setPosition('');
        setDescription('');
        setImageUrl('');
        setImage(null);
        fetchTestimonials(); // Refresh testimonials
      } else {
        setError(data.message || 'Failed to add review');
      }
    } catch (err) {
      setError('Failed to add review');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return;
    setDeleteLoading(id);
    setTestimonialError('');
    try {
      const res = await fetch(`/api/reviews?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setTestimonials((prev) => prev.filter((t) => t._id !== id));
      } else {
        setTestimonialError(data.message || 'Failed to delete testimonial');
      }
    } catch (err) {
      setTestimonialError('Failed to delete testimonial');
    }
    setDeleteLoading(null);
  };

  return (
 
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Left: Add Review Form */}
        <div className="w-full md:w-1/2 bg-white/90  rounded-2xl p-8 md:p-10 flex flex-col items-center border border-gray-200 dark:bg-gray-800/90 dark:border-gray-700">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">Add a New Review</h2>
          <p className="text-gray-500 dark:text-gray-300 mb-6 text-center text-sm">Share what your customers are saying. All fields are required.</p>
          <form onSubmit={handleSubmit} className="w-full space-y-5">
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-200 mb-1">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                disabled={loading}
              />
              {imageUrl && (
                <img src={imageUrl} alt="Preview" className="mt-3 w-20 h-20 object-cover rounded-full border-2 border-blue-500 shadow" />
              )}
            </div>
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-200 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                disabled={loading}
                required
                placeholder="Customer Name"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-200 mb-1">User Position</label>
              <input
                type="text"
                value={position}
                onChange={e => setPosition(e.target.value)}
                className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                disabled={loading}
                required
                placeholder="e.g. Designer, Manager"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-200 mb-1">Description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                rows={3}
                disabled={loading}
                required
                placeholder="What did the customer say?"
              />
            </div>
            {error && <div className="text-red-600 text-sm text-center font-medium">{error}</div>}
            {success && <div className="text-green-600 text-sm text-center font-medium">{success}</div>}
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow transition disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Review'}
              </button>
            </div>
          </form>
        </div>
        {/* Right: Testimonials List */}
        <div className="w-full md:w-1/2 bg-white/90  rounded-2xl p-8 flex flex-col border border-gray-200 dark:bg-gray-800/90 dark:border-gray-700 max-h-[700px] overflow-y-auto">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">All Testimonials</h3>
          {loadingTestimonials ? (
            <div className="text-gray-500 text-center py-8">Loading testimonials...</div>
          ) : testimonialError ? (
            <div className="text-red-600 text-center py-8">{testimonialError}</div>
          ) : testimonials.length === 0 ? (
            <div className="text-gray-400 text-center py-8">No testimonials yet.</div>
          ) : (
            <ul className="space-y-4">
              {testimonials.map((t) => (
                <li key={t._id} className="flex items-center gap-4 bg-gray-100 dark:bg-gray-900 rounded-lg p-4 shadow-sm">
                  <img src={t.image} alt={t.name} className="w-14 h-14 rounded-full object-cover border-2 border-blue-500" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 dark:text-white">{t.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-300">{t.position}</div>
                    <div className="text-xs text-gray-700 dark:text-gray-200 mt-1 line-clamp-2">{t.description}</div>
                  </div>
                  {user?.role !== 'microadmin' && (
                  <button
                    onClick={() => handleDelete(t._id)}
                    className="ml-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={deleteLoading === t._id}
                  >
                    {deleteLoading === t._id ? 'Deleting...' : 'Delete'}
                  </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
   
  );
};

export default AddReview;