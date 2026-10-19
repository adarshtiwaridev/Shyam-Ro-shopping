import dbConnect from '../../lib/dbConnect';
import AmcEnquiry from '@/src/models/AmcEnquiry';

export default async function handler(req, res) {
  await dbConnect();
  if (req.method === 'POST') {
    try {
      const { name, email, address, mobile, message } = req.body;
      if (!name || !email || !address || !mobile) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      const enquiry = await AmcEnquiry.create({ name, email, address, mobile, message });
      return res.status(201).json({ success: true, enquiry });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to save enquiry' });
    }
  } else if (req.method === 'GET') {
    try {
      const enquiries = await AmcEnquiry.find().sort({ createdAt: -1 });
      return res.status(200).json({ success: true, enquiries });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch enquiries' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'Missing id' });
      await AmcEnquiry.findByIdAndDelete(id);
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete enquiry' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET', 'DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 