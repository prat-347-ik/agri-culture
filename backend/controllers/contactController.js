import Contact from '../models/Contact.js';
import User from '../models/User.js'; // To potentially get user's location later

// @desc    Get contacts, optionally filtered by location
// @route   GET /api/contacts
// @access  Private
export const getContacts = async (req, res) => {
  try {
    const userDistrict = req.user.district; // Get district from logged-in user (from protect middleware)
    const userTaluka = req.user.taluka; // Get taluka from logged-in user

    let query = {};

    // Basic location filtering (can be made more sophisticated)
    if (userDistrict) {
      query.district = userDistrict;
      if (userTaluka) {
        query.taluka = userTaluka; // Prioritize contacts in the exact taluka
      }
    }

    // Find contacts matching the location query first
    const localContacts = await Contact.find(query).sort({ category: 1, name: 1 });

    let allContacts = localContacts;

    // If local results are few, broaden the search (optional)
    // You might fetch general/state-level contacts if local count is low
    if (localContacts.length < 5) { // Example threshold
        const generalContacts = await Contact.find({
            district: { $exists: false }, // Contacts without specific district/taluka
            _id: { $nin: localContacts.map(c => c._id) } // Exclude already found local contacts
        }).sort({ category: 1, name: 1 });
        allContacts = [...localContacts, ...generalContacts];
    }


    res.status(200).json(allContacts);

  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ message: 'Server error fetching contacts' });
  }
};

// --- Add Seed Function (Optional but Recommended) ---
// You can call this once manually or via a script to populate initial data
export const seedContacts = async (req, res) => {
    try {
        await Contact.deleteMany({}); // Clear existing contacts

        const initialContacts = [
             { roleKey: 'role_taluka', name: 'Taluka Office - Mumbai Suburban', phone: '12345 67890', email: 'taluka@example.com', category: 'Government', district: 'Mumbai Suburban', taluka: 'Kurla', address: '123 Taluka Rd, Kurla', operatingHours: 'Mon-Fri 10am-5pm' },
             { roleKey: 'role_police', name: 'Kurla Police Station', phone: '100', email: 'police.kurla@example.com', category: 'Emergency', district: 'Mumbai Suburban', taluka: 'Kurla', address: '456 Police Ln, Kurla'},
             { roleKey: 'role_vet', name: 'Mobile Vet Clinic', phone: '101', email: 'vet@example.com', category: 'Services', district: 'Mumbai Suburban' /* Covers multiple talukas */, operatingHours: 'By Appointment'},
             { roleKey: 'role_soil', name: 'District Agri Lab', phone: '102', email: 'soil@example.com', category: 'Services', district: 'Mumbai Suburban', address: '789 Lab St, Andheri', operatingHours: 'Mon-Sat 9am-4pm'},
             { roleKey: 'role_weather', name: 'State Met Dept', phone: '103', email: 'weather@example.com', category: 'Services', website: 'www.weather.gov.example'},
             { roleKey: 'role_extension', name: 'Agri Extension - Kurla', phone: '104', email: 'extension.kurla@example.com', category: 'Government', district: 'Mumbai Suburban', taluka: 'Kurla', address: '101 Agri Ave, Kurla'},
             { roleKey: 'role_helpline', name: 'State Farmer Helpline', phone: '105', email: 'emergency@example.com', category: 'Emergency', operatingHours: '24/7'},
             { roleKey: 'role_insurance', name: 'Crop Insurance Office', phone: '106', email: 'insurance@example.com', category: 'Services', district: 'Mumbai Suburban', address: '202 Insurance Plaza, Bandra'},
            // Add more contacts for different districts/talukas or general ones
        ];

        await Contact.insertMany(initialContacts);
        res.status(201).json({ message: 'Contacts seeded successfully' });
    } catch (error) {
        console.error('Error seeding contacts:', error);
        res.status(500).json({ message: 'Failed to seed contacts' });
    }
};