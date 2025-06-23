import Plan from '../Models/Plan.model.js';

// Get All Plans
export async function getPlans(req, res) {
  try {
    const plans = await Plan.find();
    return res.status(200).json({ plans });
  } catch (error) {
    console.error('Error fetching plans:', error);
    return res.status(500).json({ message: 'Failed to fetch plans' });
  }
}
