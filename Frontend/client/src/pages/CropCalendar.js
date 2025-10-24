import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import './CropCalendar.css'; // The new CSS file

const CropCalendar = () => {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosPrivate = useAxiosPrivate();

  // Helper function to format dates
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    // Get short month name in user's locale (e.g., "Oct")
    const month = date.toLocaleString('default', { month: 'short' });
    return { day, month };
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchEvents = async () => {
      try {
        // Correct endpoint: /api/calendar
        const response = await axiosPrivate.get('/api/calendar', {
          signal: controller.signal,
        });

        if (isMounted) {
          setEvents(response.data);
          setError(null);
        }
      } catch (err) {
        if (err.name === 'CanceledError') {
          console.log('Request to fetch calendar events was canceled');
        } else if (isMounted) {
          console.error(err);
          setError(t('cropCalendar.error', 'Failed to load calendar events.'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchEvents();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [axiosPrivate, t]);

  const renderContent = () => {
    if (isLoading) {
      return <p className="loading-text">{t('loading', 'Loading...')}</p>;
    }

    if (error) {
      return <p className="error-text">{error}</p>;
    }

    if (events.length === 0) {
      return (
        <p className="no-events-text">
          {t('cropCalendar.noEvents', 'No upcoming calendar events found. Please check back later.')}
        </p>
      );
    }

    return (
      <div className="event-list">
        {events.map((event) => {
          const { day: startDay, month: startMonth } = formatDate(event.startDate);
          const { day: endDay, month: endMonth } = formatDate(event.endDate);

          return (
            <div key={event._id} className="event-card">
              <div className="event-date-container">
                <span className="event-date-month">{startMonth}</span>
                <span className="event-date-day">{startDay}</span>
                <span className="event-date-range">
                  {t('cropCalendar.to', 'to')} {endMonth} {endDay}
                </span>
              </div>
              <div className="event-details">
                <h3>{event.activity}</h3>
                <p className="event-region">
                  {event.cropName} ({event.region})
                </p>
                <p className="event-description">{event.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="calendar-container">
      <h1>{t('cropCalendar.title', 'Crop Calendar')}</h1>
      <p className="page-description">
        {t('cropCalendar.description', 'Plan your farming activities with our regional crop calendar.')}
      </p>
      {renderContent()}
    </div>
  );
};

export default CropCalendar;