import dbConnect from '../../lib/dbConnect';
import Review from '../../models/Review';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    const { image, name, position, description } = req.body;
    if (!image || !name || !position || !description) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }
    try {
      const review = await Review.create({ image, name, position, description });
      return res.status(201).json({ success: true, review });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  } else if (req.method === 'GET') {
    try {
      const reviews = await Review.find({}).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, reviews });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  } else if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Review id is required.' });
    }
    try {
      const deleted = await Review.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Review not found.' });
      }
      return res.status(200).json({ success: true, message: 'Review deleted.' });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
} 