import React, { useState, useEffect, useCallback } from 'react';
import { axiosPublic } from '../api/axios';
import './Marketplace.css';

const Marketplace = () => {
    const [listings, setListings] = useState([]);
    const [filteredListings, setFilteredListings] = useState([]);
    const [activeCategory, setActiveCategory] = useState('All');
    const [isNearMeActive, setIsNearMeActive] = useState(false);
    const [userLocation, setUserLocation] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch listings from the API, now aware of the "Near Me" filter
    const fetchListings = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            let url = '/api/listings'; // The endpoint is /api/listings

            // If "Near Me" is active and we have the user's location, add coordinates to the URL
            if (isNearMeActive && userLocation) {
                url += `?lat=${userLocation.latitude}&lon=${userLocation.longitude}&radius=50`; // 50km radius
            }
            
            const response = await axiosPublic.get(url);
            setListings(response.data);
            // After fetching, apply the current category filter to the results
            applyFilters(response.data, activeCategory);

        } catch (err) {
            console.error('Failed to fetch listings:', err);
            setError(err.response?.data?.message || 'An unexpected error occurred while fetching listings.');
        } finally {
            setIsLoading(false);
        }
    }, [isNearMeActive, userLocation, activeCategory]); // Dependencies for refetching

    // Function to handle the "Near Me" button click
    const handleNearMeClick = () => {
        // If the filter is being activated
        if (!isNearMeActive) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        // On success, save location and activate the filter
                        setUserLocation({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        });
                        setIsNearMeActive(true);
                    },
                    (geoError) => {
                        // On error, show a message to the user
                        console.error('Geolocation error:', geoError);
                        setError('Could not get your location. Please enable location services in your browser.');
                        setIsNearMeActive(false);
                    }
                );
            } else {
                setError('Geolocation is not supported by this browser.');
            }
        } else {
            // If the filter is being deactivated, reset location and turn it off
            setUserLocation(null);
            setIsNearMeActive(false);
        }
    };

    // Applies category filters to the currently held list of items
    const applyFilters = (listingsToFilter, category) => {
        if (category === 'All') {
            setFilteredListings(listingsToFilter);
        } else {
            const filtered = listingsToFilter.filter(
                (listing) => listing.category.toLowerCase() === category.toLowerCase()
            );
            setFilteredListings(filtered);
        }
    };
    
    // This effect triggers the API call whenever a dependency changes
    useEffect(() => {
        fetchListings();
    }, [fetchListings]);

    // This handles clicks on the category buttons
    const handleCategoryFilter = (category) => {
        setActiveCategory(category);
        // This applies the filter instantly on the client-side without a new API call
        applyFilters(listings, category); 
    };

    const renderPrice = (item) => {
        const price = `₹${item.price}`;
        if (item.category === 'Machineries') {
            return `${price} ${item.listingType === 'Rent' ? '/day' : '(For Sale)'}`;
        }
        if (item.category === 'Produces') {
            return `${price} per ${item.rate_unit}`;
        }
        if (item.category === 'Services') {
            return `${price} (approx)`;
        }
        return price;
    };

    return (
        <div className="marketplace-container">
            <div className="marketplace-header">
                <h1>Marketplace</h1>
                <p>Browse and find the best agricultural products and services</p>
            </div>

            <div className="category-filters">
                {/* --- NEW BUTTON --- */}
                <button
                    className={`filter-btn near-me-btn ${isNearMeActive ? 'active' : ''}`}
                    onClick={handleNearMeClick}
                >
                    Near Me
                </button>
                
                {/* Category Filter Buttons */}
                <button className={`filter-btn ${activeCategory === 'All' ? 'active' : ''}`} onClick={() => handleCategoryFilter('All')}>All</button>
                <button className={`filter-btn ${activeCategory === 'Machineries' ? 'active' : ''}`} onClick={() => handleCategoryFilter('Machineries')}>Machinery</button>
                <button className={`filter-btn ${activeCategory === 'Produces' ? 'active' : ''}`} onClick={() => handleCategoryFilter('Produces')}>Produce</button>
                <button className={`filter-btn ${activeCategory === 'Services' ? 'active' : ''}`} onClick={() => handleCategoryFilter('Services')}>Service</button>
            </div>

            {isLoading ? (
                <div className="loading-spinner"></div>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : (
                <div className="listings-grid">
                    {filteredListings.length > 0 ? (
                        filteredListings.map((item) => (
                            <div key={item._id} className="listing-card">
                                <img src={item.images[0] || 'https://via.placeholder.com/300'} alt={item.name} className="listing-image"/>
                                <div className="listing-details">
                                    <h3 className="listing-title">{item.name}</h3>
                                    <p className="listing-category">
                                        {item.category.replace(/s$/, '')}
                                        {item.serviceType ? ` (${item.serviceType})` : ''}
                                    </p>
                                    <p className="listing-description">
                                        {item.description && `${item.description.substring(0, 70)}...`}
                                    </p>
                                    <div className="listing-footer">
                                        <span className="listing-price">{renderPrice(item)}</span>
                                        <button className="view-details-btn">View</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="no-listings-message">No items found. Try adjusting your filters.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Marketplace;