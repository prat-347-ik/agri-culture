import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate'; // 1. Import your private axios hook

// No API Key or useAuth needed!

const WeatherWidget = () => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const axiosPrivate = useAxiosPrivate(); // 2. Get the private axios instance

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                // 3. Call your *own* backend endpoint
                const response = await axiosPrivate.get('/api/weather');
                setWeather(response.data);
            } catch (err) {
                // 4. Handle errors from your backend
                // Your backend now sends the user-friendly error message
                if (err.response && err.response.data && err.response.data.msg) {
                    setError(err.response.data.msg);
                } else {
                    setError('Could not fetch weather');
                }
                console.error('Weather fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, [axiosPrivate]); // Run this effect when the hook is ready

    const renderContent = () => {
        if (loading) {
            return <p>Loading weather...</p>;
        }
        if (error) {
            // This will now correctly display "Set your location in Profile to see weather."
            return <p style={{ color: 'red' }}>{error}</p>;
        }
        if (weather) {
            return (
                <div className="weather-info">
                    {/* Display the city name from the API response */}
                    <span className="condition" style={{fontWeight: 'bold'}}>{weather.name}</span>
                    <span className="temp">{Math.round(weather.main.temp)}°C</span>
                    <span className="condition">
                        {weather.weather[0].description.charAt(0).toUpperCase() + weather.weather[0].description.slice(1)}
                    </span>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="weather-widget">
            {renderContent()}
            <Link to="/weather-details" className="service-btn">
                View Details
            </Link>
        </div>
    );
};

export default WeatherWidget;