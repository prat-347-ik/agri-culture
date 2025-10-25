import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import Dashboard from './Dashboard'; // Import the Dashboard component
import './Admin.css'; // Import the existing CSS

const Admin = () => {
    const { t } = useTranslation();
    const axiosPrivate = useAxiosPrivate();
    const [activeTab, setActiveTab] = useState('dashboard'); // <-- FIX #1: Default tab is now dashboard

    // --- State for all sections ---
    const [training, setTraining] = useState([]);
    const [calendar, setCalendar] = useState([]);
    const [insurance, setInsurance] = useState([]);
    const [users, setUsers] = useState([]); // Optional

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // --- State for forms ---
    const [newCourse, setNewCourse] = useState({ title: '', description: '', provider: '', applyLink: '' });
    const [newEvent, setNewEvent] = useState({ cropName: '', activity: '', startDate: '', endDate: '', region: '', description: '' });
    const [newPlan, setNewPlan] = useState({ planName: '', provider: '', type: 'Government', category: 'Crop', description: '', applyLink: '' });

    // --- Data Fetching Logic ---
    const fetchData = useCallback(async () => {
        // <-- FIX #2: Don't fetch if dashboard is active, it fetches its own data
        if (activeTab === 'dashboard') return;

        setLoading(true);
        setError(null);
        let url = '';
        try {
            switch (activeTab) {
                case 'training':
                    url = '/api/training';
                    const trainingRes = await axiosPrivate.get(url);
                    setTraining(trainingRes.data);
                    break;
                case 'calendar':
                    url = '/api/calendar';
                    const calendarRes = await axiosPrivate.get(url);
                    setCalendar(calendarRes.data);
                    break;
                case 'insurance':
                    url = '/api/insurance';
                    const insuranceRes = await axiosPrivate.get(url);
                    setInsurance(insuranceRes.data);
                    break;
                case 'users':
                    url = '/api/admin/users'; // <-- FIX #3: Corrected URL from '/api/admin/users'
                    const usersRes = await axiosPrivate.get(url);
                    setUsers(usersRes.data);
                    break;
                default:
                    return;
            }
        } catch (err) {
            console.error(`Failed to fetch ${activeTab}:`, err);
            setError(t('admin.error.fetch'));
        } finally {
            setLoading(false);
        }
    }, [activeTab, axiosPrivate, t]);

    // Fetch data when tab changes
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // --- Form Handlers ---
    const handleCourseChange = (e) => setNewCourse({ ...newCourse, [e.target.name]: e.target.value });
    const handleEventChange = (e) => setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
    const handlePlanChange = (e) => setNewPlan({ ...newPlan, [e.target.name]: e.target.value });

    // --- Create Handlers ---
    const handleCreate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        let url = '';
        let data = {};

        try {
            switch (activeTab) {
                case 'training':
                    url = '/api/training'; // <-- FIX #4: Added /api prefix
                    data = newCourse;
                    setNewCourse({ title: '', description: '', provider: '', applyLink: '' }); // Reset form
                    break;
                case 'calendar':
                    url = '/api/calendar'; // <-- FIX #4: Added /api prefix
                    data = newEvent;
                    setNewEvent({ cropName: '', activity: '', startDate: '', endDate: '', region: '', description: '' }); // Reset form
                    break;
                case 'insurance':
                    url = '/api/insurance'; // <-- FIX #4: Added /api prefix
                    data = newPlan;
                    setNewPlan({ planName: '', provider: '', type: 'Government', category: 'Crop', description: '', applyLink: '' }); // Reset form
                    break;
                default:
                    return;
            }
            await axiosPrivate.post(url, data);
            fetchData(); // Refresh the list
        } catch (err) {
            console.error(`Failed to create ${activeTab}:`, err);
            setError(t('admin.error.create'));
        } finally {
            setLoading(false);
        }
    };

    // --- Delete Handler ---
    const handleDelete = async (id) => {
        if (!window.confirm(t('admin.confirmDelete'))) return;

        setLoading(true);
        setError(null);
        let url = '';

        try {
            switch (activeTab) {
                case 'training':
                    url = `/api/training/${id}`; // <-- FIX #5: Added /api prefix
                    break;
                case 'calendar':
                    url = `/api/calendar/${id}`; // <-- FIX #5: Added /api prefix
                    break;
                case 'insurance':
                    url = `/api/insurance/${id}`; // <-- FIX #5: Added /api prefix
                    break;
                default:
                    return;
            }
            await axiosPrivate.delete(url);
            fetchData(); // Refresh the list
        } catch (err) {
            console.error(`Failed to delete ${activeTab} item:`, err);
            setError(t('admin.error.delete'));
        } finally {
            setLoading(false);
        }
    };

    // --- Render Functions for Lists ---
    const renderTrainingForm = () => (
        <form onSubmit={handleCreate} className="admin-form">
            <h3>{t('admin.training.addTitle')}</h3>
            <div className="admin-form-group"><label>{t('admin.training.title')}</label><input type="text" name="title" value={newCourse.title} onChange={handleCourseChange} required /></div>
            <div className="admin-form-group"><label>{t('admin.training.provider')}</label><input type="text" name="provider" value={newCourse.provider} onChange={handleCourseChange} required /></div>
            <div className="admin-form-group"><label>{t('admin.training.applyLink')}</label><input type="url" name="applyLink" value={newCourse.applyLink} onChange={handleCourseChange} required /></div>
            <div className="admin-form-group"><label>{t('admin.training.description')}</label><textarea name="description" value={newCourse.description} onChange={handleCourseChange} required /></div>
            <button type="submit" disabled={loading}>{loading ? t('admin.creatingBtn') : t('admin.createBtn')}</button>
        </form>
    );

    const renderTrainingList = () => training.map(item => (
        <div key={item._id} className="admin-list-item">
            <div className="admin-list-item-header"><strong>{item.title}</strong><button onClick={() => handleDelete(item._id)} className="delete-btn" disabled={loading}>{t('admin.deleteBtn')}</button></div>
            <div className="admin-list-item-body">
                <p><strong>{t('admin.training.provider')}:</strong> {item.provider}</p>
                <p>{item.description}</p>
                <p><a href={item.applyLink} target="_blank" rel="noopener noreferrer">{t('admin.applyLink')}</a></p>
            </div>
        </div>
    ));

    const renderCalendarForm = () => (
        <form onSubmit={handleCreate} className="admin-form">
            <h3>{t('admin.calendar.addTitle')}</h3>
            <div className="admin-form-group"><label>{t('admin.calendar.cropName')}</label><input type="text" name="cropName" value={newEvent.cropName} onChange={handleEventChange} required /></div>
            <div className="admin-form-group"><label>{t('admin.calendar.activity')}</label><input type="text" name="activity" value={newEvent.activity} onChange={handleEventChange} required /></div>
            <div className="admin-form-group"><label>{t('admin.calendar.startDate')}</label><input type="date" name="startDate" value={newEvent.startDate} onChange={handleEventChange} required /></div>
            <div className="admin-form-group"><label>{t('admin.calendar.endDate')}</label><input type="date" name="endDate" value={newEvent.endDate} onChange={handleEventChange} required /></div>
            <div className="admin-form-group"><label>{t('admin.calendar.region')}</label><input type="text" name="region" value={newEvent.region} onChange={handleEventChange} placeholder={t('admin.calendar.regionPlaceholder')} /></div>
            <div className="admin-form-group"><label>{t('admin.calendar.description')}</label><textarea name="description" value={newEvent.description} onChange={handleEventChange} /></div>
            <button type="submit" disabled={loading}>{loading ? t('admin.creatingBtn') : t('admin.createBtn')}</button>
        </form>
    );

    const renderCalendarList = () => calendar.map(item => (
        <div key={item._id} className="admin-list-item">
            <div className="admin-list-item-header"><strong>{item.cropName} - {item.activity}</strong><button onClick={() => handleDelete(item._id)} className="delete-btn" disabled={loading}>{t('admin.deleteBtn')}</button></div>
            <div className="admin-list-item-body">
                <p><strong>{t('admin.calendar.duration')}:</strong> {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}</p>
                <p><strong>{t('admin.calendar.region')}:</strong> {item.region}</p>
                <p>{item.description}</p>
            </div>
        </div>
    ));

    const renderInsuranceForm = () => (
        <form onSubmit={handleCreate} className="admin-form">
            <h3>{t('admin.insurance.addTitle')}</h3>
            <div className="admin-form-group"><label>{t('admin.insurance.planName')}</label><input type="text" name="planName" value={newPlan.planName} onChange={handlePlanChange} required /></div>
            <div className="admin-form-group"><label>{t('admin.insurance.provider')}</label><input type="text" name="provider" value={newPlan.provider} onChange={handlePlanChange} required /></div>
            <div className="admin-form-group"><label>{t('admin.insurance.applyLink')}</label><input type="url" name="applyLink" value={newPlan.applyLink} onChange={handlePlanChange} required /></div>
            <div className="admin-form-group"><label>{t('admin.insurance.type')}</label>
                <select name="type" value={newPlan.type} onChange={handlePlanChange}>
                    <option value="Government">{t('admin.insurance.types.government')}</option>
                    <option value="Private">{t('admin.insurance.types.private')}</option>
                </select>
            </div>
            <div className="admin-form-group"><label>{t('admin.insurance.category')}</label>
                <select name="category" value={newPlan.category} onChange={handlePlanChange}>
                    <option value="Crop">{t('admin.insurance.categories.crop')}</option>
                    <option value="Machinery">{t('admin.insurance.categories.machinery')}</option>
                    <option value="Other">{t('admin.insurance.categories.other')}</option>
                </select>
            </div>
            <div className="admin-form-group"><label>{t('admin.insurance.description')}</label><textarea name="description" value={newPlan.description} onChange={handlePlanChange} required /></div>
            <button type="submit" disabled={loading}>{loading ? t('admin.creatingBtn') : t('admin.createBtn')}</button>
        </form>
    );

    const renderInsuranceList = () => insurance.map(item => (
        <div key={item._id} className="admin-list-item">
            <div className="admin-list-item-header"><strong>{item.planName} ({item.provider})</strong><button onClick={() => handleDelete(item._id)} className="delete-btn" disabled={loading}>{t('admin.deleteBtn')}</button></div>
            <div className="admin-list-item-body">
                <p><strong>{t('admin.insurance.type')}:</strong> {t(`admin.insurance.types.${item.type.toLowerCase()}`)} | <strong>{t('admin.insurance.category')}:</strong> {t(`admin.insurance.categories.${item.category.toLowerCase()}`)}</p>
                <p>{item.description}</p>
                <p><a href={item.applyLink} target="_blank" rel="noopener noreferrer">{t('admin.applyLink')}</a></p>
            </div>
        </div>
    ));
    
    const renderUserList = () => users.map(user => (
        <div key={user._id} className="admin-list-item">
            <div className="admin-list-item-header"><strong>{user.fullName || t('admin.users.noName')}</strong></div>
            <div className="admin-list-item-body">
                <p><strong>{t('admin.users.phone')}:</strong> {user.phone}</p>
            </div>
        </div>
    ));

    // --- Main Render ---
    return (
        <div className="admin-page-container">
            <div className="admin-header">
                <h1>{t('admin.title')}</h1>
                <p>{t('admin.subtitle')}</p>
            </div>

            <div className="admin-tabs">
                <button onClick={() => setActiveTab('dashboard')} className={activeTab === 'dashboard' ? 'active' : ''}>{t('admin.tabs.dashboard')}</button>
               <button onClick={() => setActiveTab('training')} className={activeTab === 'training' ? 'active' : ''}>{t('admin.tabs.training')}</button>
                <button onClick={() => setActiveTab('calendar')} className={activeTab === 'calendar' ? 'active' : ''}>{t('admin.tabs.calendar')}</button>
                <button onClick={() => setActiveTab('insurance')} className={activeTab === 'insurance' ? 'active' : ''}>{t('admin.tabs.insurance')}</button>
                <button onClick={() => setActiveTab('users')} className={activeTab === 'users' ? 'active' : ''}>{t('admin.tabs.users')}</button>
            </div>
            

            <div className="admin-section">
                {error && <div className="error-msg">{error}</div>}

                {/* --- Dashboard Tab --- */}
                {activeTab === 'dashboard' && (
                    <Dashboard />
                )}

                {/* --- Training Tab --- */}
                {activeTab === 'training' && (
                    <>
                        <h2>{t('admin.training.manageTitle')}</h2>
                        {renderTrainingForm()}
                        <div className="admin-list">
                            <h3>{t('admin.training.listTitle')}</h3>
                            {loading && <div className="loading-msg">{t('loading')}</div>}
                            {!loading && training.length === 0 && <p>{t('admin.error.noData')}</p>}
                            {renderTrainingList()}
                        </div>
                    </>
                )}

                {/* --- Calendar Tab --- */}
                {activeTab === 'calendar' && (
                    <>
                        <h2>{t('admin.calendar.manageTitle')}</h2>
                        {renderCalendarForm()}
                        <div className="admin-list">
                            <h3>{t('admin.calendar.listTitle')}</h3>
                            {loading && <div className="loading-msg">{t('loading')}</div>}
                            {!loading && calendar.length === 0 && <p>{t('admin.error.noData')}</p>}
                            {renderCalendarList()}
                        </div>
                    </>
                )}

                {/* --- Insurance Tab --- */}
                {activeTab === 'insurance' && (
                    <>
                        <h2>{t('admin.insurance.manageTitle')}</h2>
                        {renderInsuranceForm()}
                        <div className="admin-list">
                            <h3>{t('admin.insurance.listTitle')}</h3>
                            {loading && <div className="loading-msg">{t('loading')}</div>}
                            {!loading && insurance.length === 0 && <p>{t('admin.error.noData')}</p>}
                            {renderInsuranceList()}
                        </div>
                    </>
                )}

                {/* --- Users Tab (Optional) --- */}
                {activeTab === 'users' && (
                    <>
                        <h2>{t('admin.users.manageTitle')}</h2>
                        <div className="admin-list">
                            <h3>{t('admin.users.listTitle')}</h3>
                            {loading && <div className="loading-msg">{t('loading')}</div>}
                            {!loading && users.length === 0 && <p>{t('admin.error.noData')}</p>}
                            {renderUserList()}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Admin;