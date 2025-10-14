import React, { useState, useMemo } from 'react';
import './Contacts.css';

const allContacts = [
  { role: 'Taluka Office', name: 'Main Taluka', phone: '12345 67890', email: 'taluka@agri.gov', category: 'Government' },
  { role: 'Police Station', name: 'Main Police', phone: '100', email: 'police@agri.gov', category: 'Emergency' },
  { role: 'Vet Van', name: 'Vet Service Dept', phone: '101', email: 'vet@agri.gov', category: 'Services' },
  { role: 'Soil Testing', name: 'Agri Lab', phone: '102', email: 'soil@agri.gov', category: 'Services' },
  { role: 'Weather Service', name: 'Met Dept', phone: '103', email: 'weather@agri.gov', category: 'Services' },
  { role: 'Agricultural Extension', name: 'Extension Office', phone: '104', email: 'extension@agri.gov', category: 'Government' },
  { role: 'Emergency Helpline', name: '24/7 Support', phone: '105', email: 'emergency@agri.gov', category: 'Emergency' },
  { role: 'Crop Insurance', name: 'Insurance Dept', phone: '106', email: 'insurance@agri.gov', category: 'Services' },
];

const Contacts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredContacts = useMemo(() => {
    return allContacts.filter(contact => {
      const matchesCategory = activeCategory === 'All' || contact.category === activeCategory;
      const matchesSearch = Object.values(contact).some(value =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, activeCategory]);

  const handleCall = (phoneNumber) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <div className="content-inner">
      <div className="content-section">
        <h2>Important Contacts</h2>
        <div className="contact-search">
          <input
            type="text"
            placeholder="Search contacts..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="contact-categories">
          <button className={activeCategory === 'All' ? 'active' : ''} onClick={() => setActiveCategory('All')}>All</button>
          <button className={activeCategory === 'Government' ? 'active' : ''} onClick={() => setActiveCategory('Government')}>Government</button>
          <button className={activeCategory === 'Emergency' ? 'active' : ''} onClick={() => setActiveCategory('Emergency')}>Emergency</button>
          <button className={activeCategory === 'Services' ? 'active' : ''} onClick={() => setActiveCategory('Services')}>Services</button>
        </div>
        
        <table className="contacts-table">
          <thead>
            <tr>
              <th>Role</th>
              <th>Name/Dept</th>
              <th>Contact Number</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredContacts.map((contact, index) => (
              <tr key={index}>
                <td>{contact.role}</td>
                <td>{contact.name}</td>
                <td>{contact.phone}</td>
                <td>{contact.email}</td>
                <td>
                  <button 
                    className={`call-btn ${contact.category === 'Emergency' ? 'emergency' : ''}`} 
                    onClick={() => handleCall(contact.phone)}
                  >
                    Call
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Contacts;