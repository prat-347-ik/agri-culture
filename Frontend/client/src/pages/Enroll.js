import React, { useState, useRef } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import './Enroll.css';
import { useTranslation } from 'react-i18next'; // 1. Import hook

// --- ImageUploader Component (Add Translation) ---
const ImageUploader = ({ files, setFiles, maxImages = 5 }) => {
  const { t } = useTranslation(); // Get t function
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    if (files.length + newFiles.length > maxImages) {
      alert(t('enroll.alert_max_images', `You can only upload up to ${maxImages} images.`)); // Translate alert
      return;
    }
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeImage = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="image-upload-container">
      <div className="image-upload-area" onClick={() => fileInputRef.current.click()}>
        <div className="upload-icon">📷</div>
        <p>{t('enroll.upload_click', 'Click to upload images')}</p> {/* Translate */}
        <p className="upload-hint">{t('enroll.upload_hint', `You can upload up to ${maxImages} images`)}</p> {/* Translate */}
        <input
          type="file" multiple accept="image/*" className="file-input"
          ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }}
        />
      </div>
      <div className="image-preview-container">
        {files.map((file, index) => (
          <div key={index} className="image-preview">
            <img src={URL.createObjectURL(file)} alt="Preview" />
            <button type="button" className="remove-image" onClick={() => removeImage(index)}>×</button>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Main Enroll Component (Add Translation) ---
const Enroll = () => {
  const { t } = useTranslation(); // 2. Initialize hook
  const axiosPrivate = useAxiosPrivate();
  const [formData, setFormData] = useState({
    category: '', name: '', description: '', price: '',
    listingType: 'Rent', rate_unit: 'kg', serviceType: 'Labour'
  });
  const [service_details, setServiceDetails] = useState([]);
  const [currentDetail, setCurrentDetail] = useState('');
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showMyListings, setShowMyListings] = useState(false);
  const [myListings, setMyListings] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false); // <-- ADDED: State for delete loading

  const { category, name, description, price, listingType, rate_unit, serviceType } = formData;

  const handleCategoryChange = (newCategory) => {
    setFormData({
      category: newCategory, name: '', description: '', price: '',
      listingType: newCategory === 'Machineries' ? 'Rent' : '',
      rate_unit: newCategory === 'Produces' ? 'kg' : '',
      serviceType: newCategory === 'Services' ? 'Labour' : ''
    });
    setFiles([]); setServiceDetails([]); setCurrentDetail('');
  };

  const handleServiceTypeChange = (e) => {
    setFormData({ ...formData, serviceType: e.target.value });
    setServiceDetails([]); setCurrentDetail('');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddDetail = () => {
    if (currentDetail.trim() && !service_details.includes(currentDetail.trim())) {
      setServiceDetails([...service_details, currentDetail.trim()]);
      setCurrentDetail('');
    }
  };

  const handleRemoveDetail = (detailToRemove) => {
    setServiceDetails(service_details.filter(detail => detail !== detailToRemove));
  };

  const fetchMyListings = async () => {
    try {
      setIsLoading(true);
      const response = await axiosPrivate.get('/api/listings/my-listings');
      setMyListings(response.data);
      setShowMyListings(true);
    } catch (error) {
      console.error(error);
      alert(t('enroll.alert_fetch_listings_fail', error.response?.data?.message || 'Failed to fetch your listings.')); // Translate alert
    } finally {
      setIsLoading(false);
    }
  };

  // --- ADDED: Handle Delete Listing Function ---
  const handleDeleteListing = async (listingId) => {
    if (!window.confirm(t('enroll.alert_delete_confirm', 'Are you sure you want to delete this listing?'))) {
      return;
    }
    setIsDeleting(true);
    try {
      const response = await axiosPrivate.delete(`/api/listings/${listingId}`);
      
      if (response.status === 200) {
        alert(t('enroll.alert_delete_success', 'Listing removed successfully.'));
        // Update the state to remove the item from the list
        setMyListings(prevListings => 
          prevListings.filter(item => item._id !== listingId)
        );
      }
    } catch (error) {
      console.error('Failed to delete listing:', error);
      alert(t('enroll.alert_delete_fail', error.response?.data?.message || 'Failed to remove listing.'));
    } finally {
      setIsDeleting(false);
    }
  };
  // ---------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category) {
        alert(t('enroll.alert_select_category')); // Translate alert
        return;
    }
    if (category === 'Services' && service_details.length === 0) {
      alert(t('enroll.alert_add_service_detail')); // Translate alert
      return;
    }
    setIsLoading(true);
    try {
      const imageUrls = await Promise.all(
        files.map(async (file) => {
          const uploadFormData = new FormData(); uploadFormData.append('file', file);
          const res = await axiosPrivate.post('/api/upload', uploadFormData, { headers: { 'Content-Type': 'multipart/form-data' }, });
          return res.data.url;
        })
      );
      const listingData = { ...formData, images: imageUrls, service_details };
      if (listingData.category !== 'Machineries') delete listingData.listingType;
      if (listingData.category !== 'Produces') delete listingData.rate_unit;
      if (listingData.category !== 'Services') { delete listingData.serviceType; delete listingData.service_details; }
      const response = await axiosPrivate.post('/api/listings', JSON.stringify(listingData));
      if (response.status === 201 || response.status === 200) {
        alert(t('enroll.alert_created_success')); // Translate alert
        setFormData({ category: '', name: '', description: '', price: '', listingType: 'Rent', rate_unit: 'kg', serviceType: 'Labour' });
        setFiles([]); setServiceDetails([]); setCurrentDetail('');
      }
    } catch (error) {
      console.error('Failed to create listing:', error);
      alert(t('enroll.alert_created_fail', { message: error.response?.data?.message || error.message })); // Translate alert
    } finally {
      setIsLoading(false);
    }
  };

  // --- Functions to get dynamic labels/placeholders (Add Translation) ---
  const getServiceDetailLabel = () => {
    switch(serviceType) {
        case 'Labour': return t('enroll.details_label_labour', 'Skills Offered');
        case 'Drone': return t('enroll.details_label_drone', 'Drone Capabilities');
        case 'Soil Testing': return t('enroll.details_label_soil', 'Tests Provided');
        case 'Equipment Repair': return t('enroll.details_label_repair', 'Specializations');
        default: return t('enroll.details_label_default');
    }
  };
  const getServiceDetailPlaceholder = () => {
      switch(serviceType) {
        case 'Labour': return t('enroll.add_detail_placeholder_labour', 'e.g., Harvesting');
        case 'Drone': return t('enroll.add_detail_placeholder_drone', 'e.g., Pesticide Spraying');
        case 'Soil Testing': return t('enroll.add_detail_placeholder_soil', 'e.g., NPK Levels');
        case 'Equipment Repair': return t('enroll.add_detail_placeholder_repair', 'e.g., Tractor Engines');
        default: return t('enroll.add_detail_placeholder_default');
    }
  }
  const getPriceLabel = () => {
    if (category === 'Machineries' && listingType === 'Rent') return t('enroll.price_label_rent');
    if (category === 'Produces') return t('enroll.price_label_produce', { unit: rate_unit });
    if (category === 'Services') return t('enroll.price_label_service');
    return t('enroll.price_label_default');
  };
  const getTitlePlaceholder = () => {
    return category === 'Services' ? t('enroll.title_placeholder_service') : t('enroll.title_placeholder_other');
  };

  return (
    <>
      <div className="enroll-container">
        <div className="enroll-header">
          <h1>{t('enroll.title')}</h1> {/* Translate */}
          <p>{t('enroll.description')}</p> {/* Translate */}
        </div>

        <div className="service-type-selector">
          <button className={`service-type-btn ${category === 'Machineries' ? 'active' : ''}`} onClick={() => handleCategoryChange('Machineries')}>
            {t('enroll.machinery_button')} {/* Translate */}
          </button>
          <button className={`service-type-btn ${category === 'Produces' ? 'active' : ''}`} onClick={() => handleCategoryChange('Produces')}>
            {t('enroll.produce_button')} {/* Translate */}
          </button>
          <button className={`service-type-btn ${category === 'Services' ? 'active' : ''}`} onClick={() => handleCategoryChange('Services')}>
            {t('enroll.service_button')} {/* Translate */}
          </button>
        </div>
        
        <div className="service-type-selector" style={{ marginTop: '-20px' }}>
             <button className="service-type-btn my-listings-btn" onClick={fetchMyListings}>
               {t('enroll.view_my_listings')} {/* Translate */}
             </button>
        </div>

        <div className={`form-container ${category ? 'active' : ''}`}>
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h3>{category ? `${t(`enroll.category_${category.toLowerCase()}`, category.replace(/s$/, ''))}${t('enroll.details_suffix')}` : t('enroll.select_category')}</h3> {/* Translate */}

              {category === 'Machineries' && (
                <div className="form-group">
                  <label>{t('enroll.listing_type')}</label> {/* Translate */}
                  <div className="service-type-selector" style={{ marginBottom: '20px', gap: '10px' }}>
                    <button type="button" className={`service-type-btn ${listingType === 'Rent' ? 'active' : ''}`} onClick={() => setFormData({ ...formData, listingType: 'Rent' })}>
                      {t('enroll.for_rent')} {/* Translate */}
                    </button>
                    <button type="button" className={`service-type-btn ${listingType === 'Sale' ? 'active' : ''}`} onClick={() => setFormData({ ...formData, listingType: 'Sale' })}>
                      {t('enroll.for_sale')} {/* Translate */}
                    </button>
                  </div>
                </div>
              )}
              
              {category === 'Produces' && (
                <div className="form-group">
                    <label htmlFor="rate_unit">{t('enroll.rate_unit')}</label> {/* Translate */}
                    <select id="rate_unit" name="rate_unit" value={rate_unit} onChange={handleChange}>
                        <option value="kg">{t('enroll.unit_kg')}</option> {/* Translate */}
                        <option value="ton">{t('enroll.unit_ton')}</option> {/* Translate */}
                    </select>
                </div>
              )}

              {category === 'Services' && (
                <div className='service-details-container'>
                    <div className="form-group">
                        <label htmlFor="serviceType">{t('enroll.service_type')}</label> {/* Translate */}
                        <select id="serviceType" name="serviceType" value={serviceType} onChange={handleServiceTypeChange}>
                            <option value="Labour">{t('enroll.labour')}</option> {/* Translate */}
                            <option value="Drone">{t('enroll.drone')}</option> {/* Translate */}
                            <option value="Soil Testing">{t('enroll.soil_testing')}</option> {/* Translate */}
                            <option value="Equipment Repair">{t('enroll.equipment_repair')}</option> {/* Translate */}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="details">{getServiceDetailLabel()}</label> {/* Uses translated function */}
                        <div className="skills-input-container">
                            <input
                                type="text" id="details" value={currentDetail}
                                onChange={(e) => setCurrentDetail(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddDetail())}
                                placeholder={getServiceDetailPlaceholder()} // Uses translated function
                            />
                            <button type="button" className="add-skill-btn" onClick={handleAddDetail}>{t('enroll.add_button')}</button> {/* Translate */}
                        </div>
                        <ul className="skills-list">
                            {service_details.map(detail => (
                                <li key={detail} className="skill-tag">
                                    {detail}
                                    <button type="button" className="remove-skill-btn" onClick={() => handleRemoveDetail(detail)}>×</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="name">{t('enroll.title_name')}</label> {/* Translate */}
                <input type="text" id="name" name="name" value={name} onChange={handleChange} placeholder={getTitlePlaceholder()} required /> {/* Uses translated function */}
              </div>

              <div className="form-group">
                <label htmlFor="price">{getPriceLabel()}</label> {/* Uses translated function */}
                <input type="number" id="price" name="price" value={price} onChange={handleChange} placeholder={t('enroll.price_placeholder')} required /> {/* Translate */}
              </div>

              <div className="form-group">
                <label htmlFor="description">{t('enroll.description_label')}</label> {/* Translate */}
                <textarea id="description" name="description" value={description} onChange={handleChange} rows="4" placeholder={t('enroll.description_placeholder')}></textarea> {/* Translate */}
              </div>
            </div>

            <div className="form-section">
              <h3>{t('enroll.images_label')}</h3> {/* Translate */}
              <ImageUploader files={files} setFiles={setFiles} /> {/* Uses translated component */}
            </div>

            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? t('enroll.submitting_button') : t('enroll.submit_button')} {/* Translate */}
            </button>
          </form>
        </div>
      </div>
      
      {/* --- Modal (Add Translation) --- */}
      {showMyListings && (
        <div className="modal-overlay" onClick={() => setShowMyListings(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{t('enroll.modal_title')}</h2> {/* Translate */}
              <button className="modal-close-btn" onClick={() => setShowMyListings(false)}>{t('enroll.modal_close')}</button> {/* Translate */}
            </div>
            {isLoading ? <p>{t('enroll.modal_loading')}</p> : myListings.length > 0 ? ( // Translate
              myListings.map(item => (
                <div key={item._id} className="listed-item">
                  <img src={item.images[0] || 'https://via.placeholder.com/100'} alt={item.name} className="listed-item-img" />
                  <div className="listed-item-details">
                    <h4>{item.name}</h4>
                    <p><strong>{t('enroll.modal_category')}</strong> {t(`enroll.category_${item.category.toLowerCase()}`, item.category.replace(/s$/, ''))}{item.serviceType ? ` (${t(`enroll.${item.serviceType.toLowerCase().replace(' ','_')}`, item.serviceType)})` : ''}</p> {/* Translate */}
                    <p><strong>{t('enroll.modal_price')}</strong> ₹{item.price}
                       {item.rate_unit ? t('enroll.modal_per_unit', { unit: item.rate_unit }) : ''} {/* Translate */}
                       {item.listingType ? t('enroll.modal_for_type', { type: item.listingType }) : ''} {/* Translate */}
                       {item.category === 'Services' && !item.rate_unit ? t('enroll.modal_price_approx') : ''} {/* Translate */}
                    </p>
                    {item.service_details && item.service_details.length > 0 && (
                        <p><strong>{t('enroll.modal_details')}</strong> {item.service_details.join(', ')}</p> // Translate
                    )}
                  </div>
                  
                  {/* --- ADDED DELETE BUTTON --- */}
                  <button 
                    className="listed-item-delete-btn" 
                    onClick={() => handleDeleteListing(item._id)}
                    disabled={isDeleting}
                  >
                    {t('enroll.modal_delete', 'Remove')}
                  </button>
                  {/* --------------------------- */}
                  
                </div>
              ))
            ) : (
              <p>{t('enroll.modal_no_items')}</p> // Translate
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Enroll;