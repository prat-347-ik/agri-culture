import CropCalendarEvent from '../models/CropCalendarEvent.js';

// @desc    Create a new calendar event
// @route   POST /api/calendar
// @access  Admin
const createEvent = async (req, res) => {
  try {
    const { cropName, activity, startDate, endDate, region, description } = req.body;

    // Basic validation
    if (!cropName || !activity || !startDate || !endDate) {
      return res.status(400).json({ message: 'Crop name, activity, start date, and end date are required' });
    }

    const event = new CropCalendarEvent({
      cropName,
      activity,
      startDate,
      endDate,
      region: region || 'General',
      description,
    });

    const createdEvent = await event.save();
    res.status(201).json(createdEvent);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all calendar events
// @route   GET /api/calendar
// @access  Protected (All logged-in users)
const getAllEvents = async (req, res) => {
  try {
    // Find events where the end date is in the future, sort by start date
    const events = await CropCalendarEvent.find({
      endDate: { $gte: new Date() }
    }).sort({ startDate: 1 }); // Show soonest first
    
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update a calendar event
// @route   PUT /api/calendar/:id
// @access  Admin
const updateEvent = async (req, res) => {
  try {
    const { cropName, activity, startDate, endDate, region, description } = req.body;
    const event = await CropCalendarEvent.findById(req.params.id);

    if (event) {
      event.cropName = cropName || event.cropName;
      event.activity = activity || event.activity;
      event.startDate = startDate || event.startDate;
      event.endDate = endDate || event.endDate;
      event.region = region || event.region;
      event.description = description || event.description;

      const updatedEvent = await event.save();
      res.json(updatedEvent);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete a calendar event
// @route   DELETE /api/calendar/:id
// @access  Admin
const deleteEvent = async (req, res) => {
  try {
    const event = await CropCalendarEvent.findById(req.params.id);

    if (event) {
      await event.deleteOne();
      res.json({ message: 'Event removed' });
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export { createEvent, getAllEvents, updateEvent, deleteEvent };