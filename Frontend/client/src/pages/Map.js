import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Link, useLocation } from 'react-router-dom';
import L from 'leaflet';
import { useTranslation } from 'react-i18next';

// CSS Imports
import 'leaflet/dist/leaflet.css';
import './Map.css'; // Make sure to update this file
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

// --- MapFocusController (Unchanged) ---
const MapFocusController = ({ contactLocation, markerRef }) => {
    const map = useMap();
    useEffect(() => {
        if (contactLocation?.length === 2) {
            map.flyTo(contactLocation, 15); 
             if (markerRef.current) {
                markerRef.current.openPopup();
             }
        }
    }, [map, contactLocation, markerRef]);
    return null;
};
// --- End MapFocusController ---


const Map = () => {
  const { t } = useTranslation(); 
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // --- NEW --- Add state for the filter
  const [filterCategory, setFilterCategory] = useState('All'); // 'All', 'Produces', 'Machineries', 'Services'
  // --- END NEW ---

  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const location = useLocation();
  const contactMarkerRef = useRef(null); 

  const contactLocationFromState = location.state?.markerPosition; 
  const contactNameFromState = location.state?.contactName;

  const DEFAULT_CENTER = [20.5937, 78.9629];
  const DEFAULT_ZOOM = 5;
  const USER_ZOOM = 13;

  let initialCenter = DEFAULT_CENTER;
  let initialZoom = DEFAULT_ZOOM;

  if (auth.user?.location?.coordinates) {
    initialCenter = [auth.user.location.coordinates[1], auth.user.location.coordinates[0]];
    initialZoom = USER_ZOOM;
  }
  
  if (contactLocationFromState?.length === 2) {
      initialCenter = contactLocationFromState; 
      initialZoom = 15;
  }

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

    // --- NEW --- Apply filter logic ---
    const filteredListings = listings
      .filter(listing => listing.user?.location?.coordinates?.length === 2)
      .filter(listing => {
        if (filterCategory === 'All') {
          return true; // Show all
        }
        return listing.category === filterCategory; // Show only matching category
      });
    // --- END NEW ---

    mapContent = (
      <MapContainer center={initialCenter} zoom={initialZoom} className="map-container">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapFocusController
           contactLocation={contactLocationFromState}
           markerRef={contactMarkerRef}
        />

        {contactLocationFromState && (
          <Marker 
            position={contactLocationFromState} 
            icon={defaultIcon}
            ref={contactMarkerRef}
          >
            <Popup>
              <b>{contactNameFromState || t('contacts.selected_contact', 'Selected Contact')}</b>
            </Popup>
          </Marker>
        )}

        <MarkerClusterGroup chunkedLoading maxClusterRadius={80}>
          {/* --- MODIFIED --- Use filteredListings here --- */}
          {filteredListings.map(listing => (
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
          {/* --- END MODIFICATION --- */}
        </MarkerClusterGroup>
      </MapContainer>
    );
  }

  return (
    <div className="map-page-container">
      <h2>{t('map.title', 'Listings Map')}</h2> 
      
      {/* --- NEW --- Filter Buttons --- */}
      <div className="map-filter-container">
        <button
          className={`map-filter-btn ${filterCategory === 'All' ? 'active' : ''}`}
          onClick={() => setFilterCategory('All')}
        >
          {t('map.filter_all', 'All')}
        </button>
        <button
          className={`map-filter-btn ${filterCategory === 'Produces' ? 'active' : ''}`}
          onClick={() => setFilterCategory('Produces')}
        >
          {t('map.filter_produces', 'Produces')}
        </button>
        <button
          className={`map-filter-btn ${filterCategory === 'Machineries' ? 'active' : ''}`}
          onClick={() => setFilterCategory('Machineries')}
        >
          {t('map.filter_machineries', 'Machineries')}
        </button>
        <button
          className={`map-filter-btn ${filterCategory === 'Services' ? 'active' : ''}`}
          onClick={() => setFilterCategory('Services')}
        >
          {t('map.filter_services', 'Services')}
        </button>
      </div>
      {/* --- END NEW --- */}

      {mapContent}
    </div>
  );
};

export default Map;