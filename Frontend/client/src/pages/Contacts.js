import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for map link
import './Contacts.css';
import { useTranslation } from 'react-i18next';
import useAxiosPrivate from '../hooks/useAxiosPrivate'; // Import hook for API calls
import useAuth from '../hooks/useAuth'; // To get user location

const Contacts = () => {
  const { t } = useTranslation();
  const axiosPrivate = useAxiosPrivate(); // Use the private instance
  const { auth } = useAuth(); // Get user info
  const navigate = useNavigate(); // For navigating to map

  const [allContacts, setAllContacts] = useState([]); // State for fetched contacts
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Fetch contacts from the backend
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchContacts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch using authenticated instance. Backend will use user's token
        // to determine their district/taluka for filtering.
        const response = await axiosPrivate.get('/api/contacts', {
          signal: controller.signal
        });
        if (isMounted) {
          setAllContacts(response.data);
        }
      } catch (err) {
        if (err.name !== 'CanceledError' && isMounted) {
          console.error("Failed to fetch contacts:", err);
          setError(t('contacts.fetch_error', 'Failed to load contacts. Please try again.'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchContacts();

    return () => {
      isMounted = false;
      controller.abort();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [axiosPrivate, t]); // Removed auth dependency, backend handles user context

  const filteredContacts = useMemo(() => {
    return allContacts.filter(contact => {
      const matchesCategory = activeCategory === 'All' || contact.category === activeCategory;
      const searchLower = searchTerm.toLowerCase();
      // Search includes translated role and new fields
      const matchesSearch = [
        t(`contacts.${contact.roleKey}`, contact.roleKey),
        contact.name,
        contact.phone,
        contact.email,
        contact.address,
        contact.website,
        contact.operatingHours
      ].some(value =>
        value?.toString().toLowerCase().includes(searchLower) // Added null check
      );
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, activeCategory, t, allContacts]);

  const handleCall = (phoneNumber) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  // --- MODIFIED FUNCTION ---
  const handleViewOnMap = (contact) => {
    // **FIX 1: Check for coordinates *and* ensure the array has 2 values.**
    // An empty array [] from a failed geocode will now fail this check.
    if (contact.location?.coordinates && contact.location.coordinates.length === 2) {
      
      // **FIX 2: Swap coordinates.**
      // Backend provides [Longitude, Latitude].
      // Map (Leaflet) needs [Latitude, Longitude].
      const [lng, lat] = contact.location.coordinates;
      
      // Navigate to your internal /map page with the correct data structure
      navigate('/map', { state: { markerPosition: [lat, lng], contactName: contact.name } });

    } else if (contact.address) {
      // **This is the fallback:**
      // This block will now correctly run for contacts that failed geocoding.
      const query = encodeURIComponent(`${contact.name}, ${contact.address}`);
      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
    } else {
      alert(t('contacts.no_location', 'No location information available for this contact.'));
    }
  };
  // --- END MODIFICATION ---

  if (isLoading) {
    return <div className="content-inner"><p>{t('contacts.loading', 'Loading contacts...')}</p></div>;
  }

  if (error) {
    return <div className="content-inner"><p className="error-message">{error}</p></div>;
  }

  return (
    <div className="content-inner">
      <div className="content-section">
        <h2>{t('contacts.title')}</h2>
        <div className="contact-search">
          <input
            type="text"
            placeholder={t('contacts.search_placeholder')}
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="contact-categories">
          {/* Category Buttons (Translated) */}
          <button className={activeCategory === 'All' ? 'active' : ''} onClick={() => setActiveCategory('All')}>{t('contacts.category_all')}</button>
          <button className={activeCategory === 'Government' ? 'active' : ''} onClick={() => setActiveCategory('Government')}>{t('contacts.category_government')}</button>
          <button className={activeCategory === 'Emergency' ? 'active' : ''} onClick={() => setActiveCategory('Emergency')}>{t('contacts.category_emergency')}</button>
          <button className={activeCategory === 'Services' ? 'active' : ''} onClick={() => setActiveCategory('Services')}>{t('contacts.category_services')}</button>
        </div>

        {/* --- Updated Table --- */}
        <div className="table-responsive-container"> {/* Wrapper for responsiveness */}
          <table className="contacts-table">
            <thead>
              <tr>
                <th>{t('contacts.table_header_role')}</th>
                <th>{t('contacts.table_header_name')}</th>
                <th>{t('contacts.table_header_details')}</th> {/* Combined Details */}
                <th>{t('contacts.table_header_action')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.length > 0 ? filteredContacts.map((contact) => (
                <tr key={contact._id}> {/* Use _id as key */}
                  <td data-label={t('contacts.table_header_role')}>
                    {t(`contacts.${contact.roleKey}`, contact.roleKey)}
                  </td>
                  <td data-label={t('contacts.table_header_name')}>
                    {contact.name}
                  </td>
                  <td data-label={t('contacts.table_header_details')}>
                    {/* Display more details */}
                    <div><strong>{t('contacts.phone_label', 'Phone:')}</strong> {contact.phone}</div>
                    {contact.email && <div><strong>{t('contacts.email_label', 'Email:')}</strong> <a href={`mailto:${contact.email}`}>{contact.email}</a></div>}
                    {contact.address && <div><strong>{t('contacts.address_label', 'Address:')}</strong> {contact.address}</div>}
                    {contact.operatingHours && <div><strong>{t('contacts.hours_label', 'Hours:')}</strong> {contact.operatingHours}</div>}
                    {contact.website && <div><strong>{t('contacts.website_label', 'Website:')}</strong> <a href={contact.website.startsWith('http') ? contact.website : `http://${contact.website}`} target="_blank" rel="noopener noreferrer">{contact.website}</a></div>}
                  </td>
                  <td data-label={t('contacts.table_header_action')}>
                    <div className="action-buttons"> {/* Wrapper for buttons */}
                      <button
                        className={`call-btn ${contact.category === 'Emergency' ? 'emergency' : ''}`}
                        onClick={() => handleCall(contact.phone)}
                        title={t('contacts.call_button_title', 'Call')} // Tooltip
                      >
                         📞 {t('contacts.call_button')}
                      </button>
                      {/* --- Map Button --- */}
                      {/* MODIFIED: Also check for length here for consistency */}
                      {( (contact.location?.coordinates && contact.location.coordinates.length === 2) || contact.address) && (
                        <button
                          className="map-btn"
                          onClick={() => handleViewOnMap(contact)}
                           title={t('contacts.map_button_title', 'View on Map')} // Tooltip
                        >
                           🗺️ {t('contacts.map_button', 'Map')}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                 <tr>
                    <td colSpan="4" style={{ textAlign: 'center' }}>
                        {t('contacts.no_results', 'No contacts found matching your criteria.')}
                    </td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Contacts;