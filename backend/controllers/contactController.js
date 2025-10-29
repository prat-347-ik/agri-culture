import Contact from '../models/Contact.js';
import User from '../models/User.js'; // To potentially get user's location later

// @desc    Get contacts, optionally filtered by location
// @route   GET /api/contacts
// @access  Private
export const getContacts = async (req, res) => {
  // ... (This function remains exactly the same as before)
  try {
    const userDistrict = req.user.district; 
    const userTaluka = req.user.taluka; 

    let query = {};

    if (userDistrict) {
      query.district = userDistrict;
      if (userTaluka) {
        query.taluka = userTaluka; 
      }
    }

    const localContacts = await Contact.find(query).sort({ category: 1, name: 1 });

    let allContacts = localContacts;

    if (localContacts.length < 5) { 
        const generalContacts = await Contact.find({
            district: { $exists: false }, 
            _id: { $nin: localContacts.map(c => c._id) } 
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
export const seedContacts = async (req, res) => {
    try {
        await Contact.deleteMany({}); // Clear existing contacts

                const initialContacts = [
             { roleKey: 'role_taluka', name: 'Taluka Office - Mumbai Suburban', phone: '12345 67890', email: 'taluka@example.com', category: 'Government', district: 'Mumbai Suburban', taluka: 'Kurla', address: 'Collector Office, Mumbai Suburban District, Bandra East, Mumbai', operatingHours: 'Mon-Fri 10am-5pm' },
             { roleKey: 'role_police', name: 'Kurla Police Station', phone: '100', email: 'police.kurla@example.com', category: 'Emergency', district: 'Mumbai Suburban', taluka: 'Kurla', address: 'Kurla Station,Kurla,Mumbai 400070'},
             { roleKey: 'role_vet', name: 'Mobile Vet Clinic', phone: '101', email: 'vet@example.com', category: 'Services', district: 'Mumbai Suburban' /* Covers multiple talukas */, operatingHours: 'By Appointment'},
             { roleKey: 'role_soil', name: 'District Agri Lab', phone: '102', email: 'soil@example.com', category: 'Services', district: 'Mumbai Suburban', address: 'Andheri Sports Complex, Veera Desai Road, Andheri West, Mumbai', operatingHours: 'Mon-Sat 9am-4pm'},
             { roleKey: 'role_weather', name: 'State Met Dept', phone: '103', email: 'weather@example.com', category: 'Services', website: 'www.weather.gov.example'},
             { roleKey: 'role_extension', name: 'Agri Extension - Kurla', phone: '104', email: 'extension.kurla@example.com', category: 'Government', district: 'Mumbai Suburban', taluka: 'Kurla', address: 'Kurla Railway Station, Kurla, Mumbai'},
             { roleKey: 'role_helpline', name: 'State Farmer Helpline', phone: '105', email: 'emergency@example.com', category: 'Services', operatingHours: '24/7'},
             { roleKey: 'role_insurance', name: 'Crop Insurance Office', phone: '106', email: 'insurance@example.com', category: 'Services', district: 'Mumbai Suburban', address: 'Station Road, Bandra Terminus Area,Bandra East, Mumbai, Maharashtra, 400051'},
            // Add more contacts for different districts/talukas or general ones
        ];

        // --- MODIFICATION HERE ---
        // Instead of insertMany, loop and create to trigger the 'save' hook
        console.log('Seeding contacts...');
        for (const contactData of initialContacts) {
            await Contact.create(contactData);
        }
        console.log('Contacts seeded successfully.');
        // --- END MODIFICATION ---

        res.status(201).json({ message: 'Contacts seeded successfully' });
    } catch (error) {
        console.error('Error seeding contacts:', error);
        res.status(500).json({ message: 'Failed to seed contacts' });
    }
};