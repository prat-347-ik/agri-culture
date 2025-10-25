import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import './Admin.css'; // We can reuse the CSS

// A new stylesheet for the dashboard cards
const dashboardStyles = `
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
  }
  .stat-card {
    background: #fff;
    padding: 25px;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    border-top: 4px solid #2e7d32;
  }
  .stat-card-number {
    font-size: 2.5rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 5px;
  }
  .stat-card-label {
    font-size: 1rem;
    color: #666;
  }
  .activity-feed {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
  .feed-list h3 {
    font-size: 1.25rem;
    color: #333;
    margin-bottom: 15px;
    border-bottom: 2px solid #ffc107;
    padding-bottom: 10px;
  }
  .feed-item {
    background: #f9f9f9;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 10px;
    font-size: 0.9rem;
    border: 1px solid #eee;
  }
  .feed-item-title {
    font-weight: bold;
    color: #2e7d32;
  }
  .feed-item-meta {
    font-size: 0.8rem;
    color: #777;
    margin-top: 5px;
  }
`;

const Dashboard = () => {
  const { t } = useTranslation();
  const axiosPrivate = useAxiosPrivate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosPrivate.get('/api/dashboard/stats');
        setData(response.data);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [axiosPrivate]);

  if (loading) return <div className="loading-msg">{t('loading')}</div>;
  if (error) return <div className="error-msg">{error}</div>;
  if (!data) return null;

  const { stats, recentListings, recentLogins } = data;

  return (
    <>
      <style>{dashboardStyles}</style>
      <div className="dashboard-container">
        <h2>{t('admin.dashboard.title')}</h2>
        
        {/* The Stat Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-number">{stats.totalUsers}</div>
            <div className="stat-card-label">{t('admin.dashboard.totalUsers')}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-number">{stats.activeSellers}</div>
            <div className="stat-card-label">{t('admin.dashboard.activeSellers')}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-number">{stats.totalListings}</div>
            <div className="stat-card-label">{t('admin.dashboard.activeListings')}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-number">{stats.upcomingEventsCount}</div>
            <div className="stat-card-label">{t('admin.dashboard.upcomingEvents')}</div>
          </div>
          {/* --- FIX #1: Removed the broken 4th stat card that was here --- */}
          {/* This was line 89-92 in your file and was an error */}
        </div>

        {/* The Activity Feeds */}
        <div className="activity-feed">
          <div className="feed-list">
            <h3>{t('admin.dashboard.recentListings')}</h3>
            {/* --- FIX #2: Changed item.title to item.name --- */}
            {recentListings.map(item => (
              <div key={item._id} className="feed-item">
                <div className="feed-item-title">{item.name || 'Untitled Listing'}</div>
                <div className="feed-item-meta">
                  {t('admin.dashboard.by')} {item.user?.fullName || 'Unknown User'} ({item.category})
                </div>
              </div>
            ))}
          </div>
          <div className="feed-list">
            <h3>{t('admin.dashboard.recentLogins')}</h3>
            {recentLogins.map(item => (
              <div key={item._id} className="feed-item">
                <div className="feed-item-title">{item.fullName || item.phone}</div>
                <div className="feed-item-meta">
                  {t('admin.dashboard.loggedIn')}: {new Date(item.lastLoginAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
};

export default Dashboard;