import React, { useEffect, useState } from 'react';

export default function AdminAmcEnquiry() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewModal, setViewModal] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/amc-enquiry');
      const data = await res.json();
      if (res.ok && data.success) {
        setEnquiries(data.enquiries);
      } else {
        setError(data.error || 'Failed to fetch enquiries');
      }
    } catch (err) {
      setError('Failed to fetch enquiries');
    }
    setLoading(false);
  };

  const handleView = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setViewModal(true);
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/amc-enquiry?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        setEnquiries((prev) => prev.filter((e) => e._id !== id));
      } else {
        alert(data.error || 'Failed to delete enquiry');
      }
    } catch (err) {
      alert('Failed to delete enquiry');
    }
    setDeletingId(null);
    setDeleteModal(false);
    setDeleteTarget(null);
  };

  return (
    <div className="min-h-screen bg-white py-12 px-2 sm:px-4">
      <div className="mx-auto w-full max-w-6xl">
        <h1 className="text-3xl font-bold text-blue-800 mb-8 text-center">AMC Enquiries</h1>
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-800 px-4 py-2 rounded text-center font-semibold mb-6">{error}</div>
        ) : enquiries.length === 0 ? (
          <div className="text-center text-gray-500 py-20">No AMC enquiries found.</div>
        ) : (
          <div className="rounded-xl shadow-lg bg-white overflow-x-auto">
            <table className="w-full min-w-[900px] divide-y divide-gray-200">
              <thead className="bg-blue-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Mobile</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Address</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Message</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {enquiries.map((enquiry) => (
                  <tr key={enquiry._id} className="hover:bg-blue-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-800">{enquiry.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-blue-700">{enquiry.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-black">{enquiry.mobile}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{enquiry.address}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 max-w-xs truncate">{enquiry.message || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{new Date(enquiry.createdAt).toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                      <button
                        onClick={() => handleView(enquiry)}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs font-semibold shadow"
                      >
                        View
                      </button>
                      <button
                        onClick={() => { setDeleteModal(true); setDeleteTarget(enquiry); }}
                        disabled={deletingId === enquiry._id}
                        className={`px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs font-semibold shadow ${deletingId === enquiry._id ? 'opacity-60 cursor-not-allowed' : ''}`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* View Modal */}
        {viewModal && selectedEnquiry && (
 <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-sm">

            <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-8 relative overflow-y-auto max-h-[80vh]">
              <button
                onClick={() => setViewModal(false)}
                className="absolute top-3 right-3  text-gray-800 text-2xl font-bold"
                aria-label="Close"
              >
                ×
              </button>
              <h2 className="text-2xl font-bold text-blue-700 mb-4">AMC Enquiry Details</h2>
              <div className="space-y-3 text-gray-800">
                <div><span className="font-semibold text-black">Name:</span> {selectedEnquiry.name}</div>
                <div><span className="font-semibold text-black">Email:</span> {selectedEnquiry.email}</div>
                <div><span className="font-semibold text-black">Mobile:</span> {selectedEnquiry.mobile}</div>
                <div><span className="font-semibold text-black">Address:</span> {selectedEnquiry.address}</div>
                <div><span className="font-semibold text-black">Message:</span> {selectedEnquiry.message || '-'}</div>
                <div><span className="font-semibold text-black">Date:</span> {new Date(selectedEnquiry.createdAt).toLocaleString()}</div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {deleteModal && deleteTarget && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-sm">

            <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-8 relative">
              <button
                onClick={() => { setDeleteModal(false); setDeleteTarget(null); }}
                className="absolute top-3 right-3  text-gray-800 text-2xl font-bold"
                aria-label="Close"
              >
                ×
              </button>
              <h2 className="text-xl font-bold text-red-700 mb-4">Delete AMC Enquiry</h2>
              <p className="mb-6 text-gray-700">Are you sure you want to delete the enquiry from <span className="font-semibold">{deleteTarget.name}</span>?</p>
              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => { setDeleteModal(false); setDeleteTarget(null); }}
                  className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteTarget._id)}
                  disabled={deletingId === deleteTarget._id}
                  className={`px-4 py-2 rounded bg-red-600 text-white font-semibold shadow hover:bg-red-700 ${deletingId === deleteTarget._id ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  {deletingId === deleteTarget._id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
