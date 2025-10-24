import InsurancePlan from '../models/InsurancePlan.js';

// @desc    Create a new insurance plan
// @route   POST /api/insurance
// @access  Admin
const createPlan = async (req, res) => {
  try {
    const { planName, provider, type, category, description, applyLink } = req.body;

    // Validation
    if (!planName || !provider || !type || !category || !description || !applyLink) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const plan = new InsurancePlan({
      planName,
      provider,
      type,
      category,
      description,
      applyLink,
    });

    const createdPlan = await plan.save();
    res.status(201).json(createdPlan);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all insurance plans
// @route   GET /api/insurance
// @access  Protected (All logged-in users)
const getAllPlans = async (req, res) => {
  try {
    // We get all plans; filtering by category will be done on the frontend.
    const plans = await InsurancePlan.find({}).sort({ provider: 1, planName: 1 });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update an insurance plan
// @route   PUT /api/insurance/:id
// @access  Admin
const updatePlan = async (req, res) => {
  try {
    const { planName, provider, type, category, description, applyLink } = req.body;
    const plan = await InsurancePlan.findById(req.params.id);

    if (plan) {
      plan.planName = planName || plan.planName;
      plan.provider = provider || plan.provider;
      plan.type = type || plan.type;
      plan.category = category || plan.category;
      plan.description = description || plan.description;
      plan.applyLink = applyLink || plan.applyLink;

      const updatedPlan = await plan.save();
      res.json(updatedPlan);
    } else {
      res.status(404).json({ message: 'Insurance plan not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete an insurance plan
// @route   DELETE /api/insurance/:id
// @access  Admin
const deletePlan = async (req, res) => {
  try {
    const plan = await InsurancePlan.findById(req.params.id);

    if (plan) {
      await plan.deleteOne();
      res.json({ message: 'Insurance plan removed' });
    } else {
      res.status(404).json({ message: 'Insurance plan not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export { createPlan, getAllPlans, updatePlan, deletePlan };