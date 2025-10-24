import TrainingCourse from '../models/TrainingCourse.js';

// @desc    Create a new training course
// @route   POST /api/training
// @access  Admin
const createCourse = async (req, res) => {
  try {
    const { title, description, provider, applyLink } = req.body;

    // Basic validation
    if (!title || !description || !provider || !applyLink) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    const course = new TrainingCourse({
      title,
      description,
      provider,
      applyLink,
    });

    const createdCourse = await course.save();
    res.status(201).json(createdCourse);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all training courses
// @route   GET /api/training
// @access  Protected (All logged-in users)
const getAllCourses = async (req, res) => {
  try {
    const courses = await TrainingCourse.find({}).sort({ createdAt: -1 }); // Show newest first
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update a training course
// @route   PUT /api/training/:id
// @access  Admin
const updateCourse = async (req, res) => {
  try {
    const { title, description, provider, applyLink } = req.body;
    const course = await TrainingCourse.findById(req.params.id);

    if (course) {
      course.title = title || course.title;
      course.description = description || course.description;
      course.provider = provider || course.provider;
      course.applyLink = applyLink || course.applyLink;

      const updatedCourse = await course.save();
      res.json(updatedCourse);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete a training course
// @route   DELETE /api/training/:id
// @access  Admin
const deleteCourse = async (req, res) => {
  try {
    const course = await TrainingCourse.findById(req.params.id);

    if (course) {
      await course.deleteOne(); // or course.remove() for older mongoose versions
      res.json({ message: 'Course removed' });
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export { createCourse, getAllCourses, updateCourse, deleteCourse };