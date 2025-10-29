import React, { useState, useEffect, useRef } from 'react'; // --- MODIFIED --- (Added useRef)
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'; 
import { Link, useLocation } from 'react-router-dom'; 
import L from 'leaflet';
import { useTranslation } from 'react-i18next'; 

// CSS Imports
import 'leaflet/dist/leaflet.css';
import './Map.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import MarkerClusterGroup from 'react-leaflet-cluster';

// --- Icon Imports ---
import producesIconImg from '../icons8/produces.png';
import machineriesIconImg from '../icons8/machineries.png';
import servicesIconImg from '../icons8/services.png';

import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from '../hooks/useAuth';

// --- Leaflet Icon Fix ---
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});
// --- End Icon Fix ---


// --- Icon Code (Unchanged) ---
const defaultIcon = L.icon({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
const producesIcon = L.icon({
  iconUrl: producesIconImg,
  iconSize: [30, 30], iconAnchor: [15, 15], popupAnchor: [0, -15]
});
const machineriesIcon = L.icon({
  iconUrl: machineriesIconImg,
  iconSize: [30, 30], iconAnchor: [15, 15], popupAnchor: [0, -15]
});
const servicesIcon = L.icon({
  iconUrl: servicesIconImg,
  iconSize: [30, 30], iconAnchor: [15, 15], popupAnchor: [0, -15]
});
const getIcon = (category) => {
  switch (category) {
    case 'Produces': return producesIcon;
    case 'Machineries': return machineriesIcon;
    case 'Services': return servicesIcon;
    default: return defaultIcon;
  }
};
// --- End Icon Code ---

// --- MapFocusController (MODIFIED) ---
// This controller now also accepts a ref to the marker to open its popup
const MapFocusController = ({ contactLocation, markerRef }) => { // --- MODIFIED ---
    const map = useMap();
    useEffect(() => {
        // contactLocation is already [lat, lng] from Contacts.js
        if (contactLocation?.length === 2) {
            map.flyTo(contactLocation, 15); // Fly to the [lat, lng]
             
             // --- MODIFIED ---
             // Remove the old L.popup logic
             // Instead, open the popup of the marker we created
             if (markerRef.current) {
                markerRef.current.openPopup();
             }
        }
    }, [map, contactLocation, markerRef]); // --- MODIFIED ---
    return null;
};
// --- End MapFocusController ---


const Map = () => {
  const { t } = useTranslation(); 
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const location = useLocation();
  const contactMarkerRef = useRef(null); // --- ADDED --- (Ref for the new contact marker)

  // --- MODIFIED ---
  // Read the correct state keys from Contacts.js
  const contactLocationFromState = location.state?.markerPosition; // Was 'contactLocation'
  const contactNameFromState = location.state?.contactName;
  // --- END MODIFICATION ---

  const DEFAULT_CENTER = [20.5937, 78.9629];
  const DEFAULT_ZOOM = 5;
  const USER_ZOOM = 13;

  let initialCenter = DEFAULT_CENTER;
  let initialZoom = DEFAULT_ZOOM;

  if (auth.user?.location?.coordinates) {
    initialCenter = [auth.user.location.coordinates[1], auth.user.location.coordinates[0]];
    initialZoom = USER_ZOOM;
  }
  
  // --- MODIFIED ---
  // Override if coming from Contacts page
  // The location is already [lat, lng], no need to swap
  if (contactLocationFromState?.length === 2) {
      initialCenter = contactLocationFromState; // Was [contactLocationFromState[1], contactLocationFromState[0]]
      initialZoom = 15;
  }
  // --- END MODIFICATION ---

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const fetchListings = async () => {
      try {
        setLoading(true); setError(null);
        const response = await axiosPrivate.get('/api/listings/map', { signal: controller.signal });
        if (isMounted) setListings(response.data);
      } catch (err) {
        if (isMounted && err.name !== 'CanceledError') {
           setError(err.message || t('map.fetch_error', 'Failed to fetch listings')); 
           console.error(err);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchListings();
    return () => { isMounted = false; controller.abort(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [axiosPrivate, t]); 

  let mapContent;
  if (loading) {
    mapContent = <p className="map-loading">{t('map.loading', 'Loading map and listings...')}</p>; 
  } else if (error) {
    mapContent = <p className="map-error">{t('map.error', 'Error:')} {error}</p>; 
  } else {
    mapContent = (
      <MapContainer center={initialCenter} zoom={initialZoom} className="map-container">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* --- MODIFIED --- 
           Pass the markerRef to the controller */}
        <MapFocusController
           contactLocation={contactLocationFromState}
           markerRef={contactMarkerRef}
        />
        {/* --- END MODIFICATION --- */}


        {/* --- ADDED --- 
           Render the marker for the contact, if it exists */}
        {contactLocationFromState && (
          <Marker 
            position={contactLocationFromState} 
            icon={defaultIcon} // Use the default icon
            ref={contactMarkerRef} // Assign the ref
          >
            <Popup>
              <b>{contactNameFromState || t('contacts.selected_contact', 'Selected Contact')}</b>
            </Popup>
          </Marker>
        )}
        {/* --- END ADDED --- */}


        <MarkerClusterGroup chunkedLoading maxClusterRadius={80}>
          {listings
            .filter(listing => listing.user?.location?.coordinates?.length === 2)
            .map(listing => (
              <Marker
                key={listing._id}
                position={[listing.user.location.coordinates[1], listing.user.location.coordinates[0]]}
                icon={getIcon(listing.category)}
              >
                <Popup>
                  <div className="map-popup">
                    <h4>{listing.name}</h4>
                    <p><strong>{t('map.popup_category', 'Category:')}</strong> {t(`enroll.category_${listing.category.toLowerCase()}`, listing.category)}</p>
                    <p>
                      <strong>{t('map.popup_price', 'Price:')}</strong> ₹{listing.price} {listing.unit ? t('map.popup_per_unit', { unit: listing.unit }) : t('map.popup_unit', 'unit')}
                    </p>
                    <Link to={`/listing/${listing._id}`} className="map-popup-link">
                      {t('listing.view_details', 'View Details')} 
                    </Link>
                  </div>
                </Popup>
              </Marker>
            ))}
        </MarkerClusterGroup>
      </MapContainer>
    );
  }

  return (
    <div className="map-page-container">
      <h2>{t('map.title', 'Listings Map')}</h2> 
      {mapContent}
    </div>
  );
};

export default Map;