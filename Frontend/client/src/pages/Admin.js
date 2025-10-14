import React, { useState, useEffect, useCallback } from 'react';

// --- Custom CSS for the admin page ---
const customAdminStyles = `
    .admin-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
    }
    .admin-header {
        text-align: center;
        margin-bottom: 40px;
    }
    .admin-header h1 {
        font-size: 2.5rem;
        margin-bottom: 10px;
        background: linear-gradient(135deg, #2e7d32, #ffc107);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }
    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin-bottom: 40px;
    }
    .stat-card {
        background: white;
        padding: 20px;
        border-radius: 10px;
        text-align: center;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }
    .stat-number {
        font-size: 2rem;
        font-weight: bold;
        color: #2e7d32;
        margin-bottom: 10px;
    }
    .stat-label {
        color: #666;
        font-size: 0.9rem;
    }
    .enrollments-list {
        background: white;
        border-radius: 15px;
        padding: 30px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }
    .enrollment-item {
        border: 1px solid #e0e0e0;
        border-radius: 10px;
        padding: 20px;
        margin-bottom: 20px;
        background: #f9f9f9;
    }
    .enrollment-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 2px solid #ffc107;
    }
    .enrollment-type {
        background: #2e7d32;
        color: white;
        padding: 5px 15px;
        border-radius: 15px;
        font-size: 0.9rem;
        font-weight: bold;
    }
    .enrollment-time {
        color: #666;
        font-size: 0.9rem;
    }
    .enrollment-details {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 15px;
    }
    .detail-group {
        margin-bottom: 10px;
    }
    .detail-label {
        font-weight: 600;
        color: #2e7d32;
        font-size: 0.9rem;
        margin-bottom: 5px;
    }
    .detail-value {
        color: #333;
        word-break: break-word;
    }
    .refresh-btn {
        background: linear-gradient(135deg, #2e7d32, #4caf50);
        color: white;
        padding: 12px 25px;
        border: none;
        border-radius: 25px;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-bottom: 20px;
    }
    .refresh-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(46, 125, 50, 0.3);
    }
    .loading, .error, .no-data {
        text-align: center;
        padding: 40px;
        color: #666;
    }
    .error {
        background: #ffebee;
        color: #c62828;
        border-radius: 8px;
    }
`;

const Admin = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [stats, setStats] = useState({ total: 0, bidding: 0, selling: 0, renting: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadEnrollments = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // NOTE: You will need to set up CORS on your server for this to work
            const response = await fetch('http://localhost:5000/api/enrollments');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            
            if (result.success) {
                const sortedData = result.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                setEnrollments(sortedData);
                updateStats(sortedData);
            } else {
                setError(result.message);
            }
        } catch (err) {
            console.error('Error loading enrollments:', err);
            setError('Failed to load enrollments. Please check if the server is running and accessible.');
        } finally {
            setLoading(false);
        }
    }, []);

    const updateStats = (data) => {
        setStats({
            total: data.length,
            bidding: data.filter(e => e.type === 'bidding').length,
            selling: data.filter(e => e.type === 'selling').length,
            renting: data.filter(e => e.type === 'renting').length,
        });
    };

    useEffect(() => {
        loadEnrollments(); // Initial load
        const interval = setInterval(loadEnrollments, 30000); // Auto-refresh every 30 seconds
        return () => clearInterval(interval); // Cleanup on component unmount
    }, [loadEnrollments]);

    const renderDetails = (data) => {
        return Object.entries(data).map(([key, value]) => {
            if (!value || value.toString().trim() === '') return null;
            const formattedKey = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
            return (
                <div className="detail-group" key={key}>
                    <div className="detail-label">{formattedKey}</div>
                    <div className="detail-value">{value.toString()}</div>
                </div>
            );
        });
    };

    return (
        <>
            <style>{customAdminStyles}</style>
            <div className="admin-container">
                <div className="admin-header">
                    <h1>Admin Panel</h1>
                    <p>View and manage enrollment submissions</p>
                </div>

                <button className="refresh-btn" onClick={loadEnrollments} disabled={loading}>
                    {loading ? '🔄 Refreshing...' : '🔄 Refresh Data'}
                </button>

                <div className="stats-grid">
                    <div className="stat-card"><div className="stat-number">{stats.total}</div><div className="stat-label">Total Enrollments</div></div>
                    <div className="stat-card"><div className="stat-number">{stats.bidding}</div><div className="stat-label">Bidding Requests</div></div>
                    <div className="stat-card"><div className="stat-number">{stats.selling}</div><div className="stat-label">Selling Requests</div></div>
                    <div className="stat-card"><div className="stat-number">{stats.renting}</div><div className="stat-label">Renting Requests</div></div>
                </div>

                <div className="enrollments-list">
                    <h2>Recent Enrollments</h2>
                    <div id="enrollmentsContainer">
                        {loading && <div className="loading">Loading enrollments...</div>}
                        {error && <div className="error">{error}</div>}
                        {!loading && !error && enrollments.length === 0 && <div className="no-data">No enrollments found.</div>}
                        {!loading && !error && enrollments.map(item => (
                            <div className="enrollment-item" key={item._id || item.timestamp}>
                                <div className="enrollment-header">
                                    <span className="enrollment-type">{item.type.toUpperCase()}</span>
                                    <span className="enrollment-time">{new Date(item.timestamp).toLocaleString()}</span>
                                </div>
                                <div className="enrollment-details">
                                    {renderDetails(item.data)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Admin;