import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import { axiosPublic } from '../api/axios';
import './Listing.css'; // Your existing CSS file
import { useTranslation } from 'react-i18next'; // 1. Import hook

const Listing = () => {
  const { t } = useTranslation(); // 2. Initialize hook
  const { id } = useParams(); // Get the listing ID from the URL
  const [listing, setListing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Get navigate function

  // Helper function to format price (copied from Marketplace.js)
  // No translation needed here as it uses data and symbols
  const renderPrice = (item) => {
    if (!item) return '';
    const price = `₹${item.price}`;
    if (item.category === 'Machineries') {
      return `${price} ${item.listingType === 'Rent' ? t('listing.price_per_day', '/day') : t('listing.price_for_sale', '(For Sale)')}`;
    }
    if (item.category === 'Produces') {
      return `${price} ${t('listing.price_per_unit_prefix', 'per')} ${item.rate_unit}`;
    }
    if (item.category === 'Services') {
      return `${price} ${t('listing.price_approx', '(approx)')}`;
    }
    return price;
  };

  useEffect(() => {
    const fetchListing = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axiosPublic.get(`/api/listings/${id}`);
        setListing(response.data);
      } catch (err) {
        console.error('Failed to fetch listing:', err);
        setError(err.response?.data?.message || t('listing.fetch_error', 'Failed to fetch listing details.')); // Translate error
      } finally {
        setIsLoading(false);
      }
    };

    fetchListing();
  }, [id, t]); // Add t to dependency array

  if (isLoading) {
    // Using a simple text loading for now, spinner can be added via CSS
    return <div className="listing-page-container"><p>{t('listing.loading', 'Loading listing details...')}</p></div>; // Translate
  }

  if (error) {
    return <div className="listing-page-container"><p className="error-message">{error}</p></div>; // Error is already translated
  }

  if (!listing) {
    return <div className="listing-page-container"><p>{t('listing.not_found', 'Listing not found.')}</p></div>; // Translate
  }

  // Once data is loaded, display it
  return (
    <div className="listing-page-container"> {/* Changed class name */}
      {/* Added back button */}
       <button onClick={() => navigate(-1)} className="back-button">
         {t('listing.back_button', '← Back')}
       </button>

      <div className="listing-content"> {/* Changed class name */}
        <div className="listing-images"> {/* Changed class name */}
          <img
            src={listing.images[0] || 'https://via.placeholder.com/600x400'}
            alt={listing.name}
            className="main-image" // Added class name
          />
        </div>

        <div className="listing-details"> {/* Changed class name */}
           <span className="listing-category">{listing.category}</span> {/* Added category span */}
           <h1>{listing.name}</h1> {/* Changed from h2 to h1 */}
           <p className="listing-price">{renderPrice(listing)}</p> {/* Changed class name */}

           <p className="listing-description">{listing.description || t('listing.no_description', 'No description provided.')}</p> {/* Translate fallback */}

          {/* --- Category Specific Details --- */}
          {listing.category === 'Machineries' && (
            <div className="specific-details">
              <strong>{t('listing.machinery_type', 'Type:')}</strong> {listing.listingType}
            </div>
          )}
          {listing.category === 'Services' && (
            <div className="specific-details">
              <strong>{t('listing.service_type', 'Service Type:')}</strong> {listing.serviceType}
              {listing.service_details && listing.service_details.length > 0 && (
                <ul>
                  {listing.service_details.map((detail, i) => (
                    <li key={i}>{detail}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* --- Seller Information Box --- */}
          <div className="seller-info-box"> {/* Added Box */}
            <h3>{t('listing.contact_seller', 'Contact Seller')}</h3> {/* Translate */}
            {listing.user ? (
              <>
                <p>
                  <strong>{t('listing.seller_name', 'Name:')}</strong> {listing.user.fullName} {/* Translate */}
                </p>
                <p>
                  <strong>{t('listing.seller_phone', 'Phone:')}</strong> {/* Translate */}
                  {/* Make phone number clickable */}
                  <a href={`tel:${listing.user.phone}`}>{listing.user.phone}</a>
                </p>
              </>
            ) : (
              <p>{t('listing.seller_unavailable', 'Seller information is not available.')}</p> // Translate
            )}
            {/* Added Call Now button as a link */}
             <a href={`tel:${listing.user?.phone}`} className="contact-button" style={{ textDecoration: 'none', textAlign: 'center' }}>
               {t('listing.call_now_button', 'Call Now')}
             </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Listing;