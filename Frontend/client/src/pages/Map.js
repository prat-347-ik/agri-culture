import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from 'leaflet';

// CSS Imports
import 'leaflet/dist/leaflet.css';
import './Map.css';
// --- (!!!) HERE IS THE FIX (!!!) ---
// The CSS files are in 'leaflet.markercluster', not 'react-leaflet-cluster'
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import MarkerClusterGroup from 'react-leaflet-cluster';
// --- (!!!) END OF FIX (!!!) ---

import producesIconImg from '../icons8/produces.png'; 

// (!!!) YOU MUST EDIT THESE 2 LINES (!!!)
// Change these filenames to match your files in 'src/icons8/'
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


// --- (!!!) START OF ICON CODE (!!!) ---

// 1. Import Custom Icons
// This icon name is correct based on your project files

// (!!!) END OF EDIT SECTION (!!!)


// 2. Define Leaflet Icon Variables
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
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -15]
});

const machineriesIcon = L.icon({
  iconUrl: machineriesIconImg,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -15]
});

const servicesIcon = L.icon({
  iconUrl: servicesIconImg,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -15]
});

// 3. Helper Function to Get Icon
const getIcon = (category) => {
  switch (category) {
    case 'Produces':
      return producesIcon;
    case 'Machineries':
      return machineriesIcon;
    case 'Services':
      return servicesIcon;
    default:
      return defaultIcon;
  }
};
// --- (!!!) END OF ICON CODE (!!!) ---


const Map = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  const DEFAULT_CENTER = [20.5937, 78.9629];
  const DEFAULT_ZOOM = 5;
  const USER_ZOOM = 13;

  let mapCenter = DEFAULT_CENTER;
  let mapZoom = DEFAULT_ZOOM;

  if (auth.user?.location?.coordinates) {
    mapCenter = [
      auth.user.location.coordinates[1], // Latitude
      auth.user.location.coordinates[0]  // Longitude
    ];
    mapZoom = USER_ZOOM;
  }

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchListings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axiosPrivate.get('/api/listings/map', {
          signal: controller.signal,
        });
        
        if (isMounted) {
          setListings(response.data);
        }
      } catch (err) {
        if (isMounted) {
          if (err.name !== 'CanceledError') {
             setError(err.message || 'Failed to fetch listings');
             console.error(err);
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchListings();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [axiosPrivate]);

  let mapContent;
  if (loading) {
    mapContent = <p className="map-loading">Loading map and listings...</p>;
  } else if (error) {
    mapContent = <p className="map-error">Error: {error}</p>;
  } else {
    mapContent = (
      <MapContainer center={mapCenter} zoom={mapZoom} className="map-container">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={80}
        >
          {listings
            .filter(listing => listing.user?.location?.coordinates?.length === 2)
            .map(listing => (
              <Marker
                key={listing._id}
                position={[
                  listing.user.location.coordinates[1], // Latitude
                  listing.user.location.coordinates[0]  // Longitude
                ]}
                icon={getIcon(listing.category)}
              >
                <Popup>
                  <div className="map-popup">
                    <h4>{listing.name}</h4>
                    <p><strong>Category:</strong> {listing.category}</p>
                    <p>
                      <strong>Price:</strong> ₹{listing.price} / {listing.unit || 'unit'}
                    </p>
                    <Link to={`/listing/${listing._id}`} className="map-popup-link">
                      View Details
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
      <h2>Listings Map</h2>
      {mapContent}
    </div>
  );
};

export default Map;