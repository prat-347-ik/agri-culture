import React, { useState, useEffect, useCallback } from 'react';
import { axiosPublic } from '../api/axios';
import { Link } from 'react-router-dom';
import './Marketplace.css';
import { useTranslation } from 'react-i18next'; // 1. Import hook

const Marketplace = () => {
    const { t } = useTranslation(); // 2. Initialize hook
    const [listings, setListings] = useState([]);
    const [filteredListings, setFilteredListings] = useState([]);
    const [activeCategory, setActiveCategory] = useState('All');
    const [isNearMeActive, setIsNearMeActive] = useState(false);
    const [userLocation, setUserLocation] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchListings = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            let url = '/api/listings';
            if (isNearMeActive && userLocation) {
                url += `?lat=${userLocation.latitude}&lon=${userLocation.longitude}&radius=50`; // 50km radius
            }
            const response = await axiosPublic.get(url);
            setListings(response.data);
            applyFilters(response.data, activeCategory); // Apply filter after fetch
        } catch (err) {
            console.error('Failed to fetch listings:', err);
            // Translate error message
            setError(err.response?.data?.message || t('marketplace.error', { message: 'An unexpected error occurred while fetching listings.' }));
        } finally {
            setIsLoading(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isNearMeActive, userLocation, t]); // Removed activeCategory from here, applyFilters handles it

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

    const handleNearMeClick = () => {
        if (!isNearMeActive) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setUserLocation({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        });
                        setIsNearMeActive(true); // This will trigger fetchListings via useEffect
                    },
                    (geoError) => {
                        console.error('Geolocation error:', geoError);
                        setError(t('marketplace.error_location')); // Translate error
                        setIsNearMeActive(false);
                    }
                );
            } else {
                setError(t('marketplace.error_geolocation_unsupported')); // Translate error
            }
        } else {
            setUserLocation(null);
            setIsNearMeActive(false); // This will trigger fetchListings via useEffect
        }
    };

    useEffect(() => {
        fetchListings();
    }, [fetchListings]); // Fetch when near me status or location changes

    useEffect(() => {
        // Apply category filter whenever the active category changes or listings data updates
        applyFilters(listings, activeCategory);
    }, [activeCategory, listings]);


    const handleCategoryFilter = (category) => {
        setActiveCategory(category);
        // Filter is applied via the useEffect above
    };

    // Price rendering function (can also be translated if needed)
    const renderPrice = (item) => {
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

    return (
        <div className="marketplace-container">
            <div className="marketplace-header">
                <h1>{t('marketplace.title')}</h1> {/* Translate */}
                <p>{t('marketplace.description')}</p> {/* Translate */}
            </div>

            <div className="category-filters">
                <button
                    className={`filter-btn near-me-btn ${isNearMeActive ? 'active' : ''}`}
                    onClick={handleNearMeClick}
                >
                    {t('marketplace.near_me_button')} {/* Translate */}
                </button>

                <button className={`filter-btn ${activeCategory === 'All' ? 'active' : ''}`} onClick={() => handleCategoryFilter('All')}>
                    {t('marketplace.all_filter')} {/* Translate */}
                </button>
                <button className={`filter-btn ${activeCategory === 'Machineries' ? 'active' : ''}`} onClick={() => handleCategoryFilter('Machineries')}>
                    {t('marketplace.machinery_filter')} {/* Translate */}
                </button>
                <button className={`filter-btn ${activeCategory === 'Produces' ? 'active' : ''}`} onClick={() => handleCategoryFilter('Produces')}>
                    {t('marketplace.produce_filter')} {/* Translate */}
                </button>
                <button className={`filter-btn ${activeCategory === 'Services' ? 'active' : ''}`} onClick={() => handleCategoryFilter('Services')}>
                    {t('marketplace.service_filter')} {/* Translate */}
                </button>
            </div>

            {isLoading ? (
                <div className="loading-spinner"></div> // Use CSS class for spinner
            ) : error ? (
                <div className="error-message">{error}</div> // Display translated error
            ) : (
                <div className="listings-grid">
                    {filteredListings.length > 0 ? (
                        filteredListings.map((item) => (
                            <div key={item._id} className="listing-card">
                                <img src={item.images[0] || 'https://via.placeholder.com/300'} alt={item.name} className="listing-image"/>
                                <div className="listing-details">
                                    <h3 className="listing-title">{item.name}</h3>
                                    <p className="listing-category">
                                        {t(`enroll.category_${item.category.toLowerCase()}`, item.category.replace(/s$/, ''))} {/* Translate Category */}
                                        {item.serviceType ? ` (${t(`enroll.${item.serviceType.toLowerCase().replace(' ','_')}`, item.serviceType)})` : ''} {/* Translate Service Type */}
                                    </p>
                                    <p className="listing-description">
                                        {item.description && `${item.description.substring(0, 70)}...`}
                                    </p>
                                    <div className="listing-footer">
                                        <span className="listing-price">{renderPrice(item)}</span>
                                        <Link to={`/listing/${item._id}`} className="view-details-btn">
                                            {t('marketplace.view_button')} {/* Translate */}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="no-listings-message">{t('marketplace.no_listings_filtered')}</p> // Translate
                    )}
                </div>
            )}
        </div>
    );
};

export default Marketplace;