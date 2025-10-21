import React, { useState, useRef } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate'; // 1. Import the custom hook
import './Enroll.css'; 

// ImageUploader component remains the same
const ImageUploader = ({ files, setFiles, maxImages = 5 }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    if (files.length + newFiles.length > maxImages) {
      alert(`You can only upload up to ${maxImages} images.`);
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
        <p>Click to upload images</p>
        <p className="upload-hint">You can upload up to {maxImages} images</p>
        <input
          type="file"
          multiple
          accept="image/*"
          className="file-input"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
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


// Main Enroll Component
const Enroll = () => {
  const axiosPrivate = useAxiosPrivate(); // 2. Call the hook to get the configured axios instance
  const [formData, setFormData] = useState({
    category: '', name: '', description: '', price: '',
    listingType: 'Rent',
    rate_unit: 'kg',
    serviceType: 'Labour'
  });

  const [service_details, setServiceDetails] = useState([]);
  const [currentDetail, setCurrentDetail] = useState('');

  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showMyListings, setShowMyListings] = useState(false);
  const [myListings, setMyListings] = useState([]);

  const { category, name, description, price, listingType, rate_unit, serviceType } = formData;

  const handleCategoryChange = (newCategory) => {
    setFormData({
      category: newCategory, name: '', description: '', price: '',
      listingType: newCategory === 'Machineries' ? 'Rent' : '',
      rate_unit: newCategory === 'Produces' ? 'kg' : '',
      serviceType: newCategory === 'Services' ? 'Labour' : ''
    });
    setFiles([]);
    setServiceDetails([]);
    setCurrentDetail('');
  };

  const handleServiceTypeChange = (e) => {
    setFormData({ ...formData, serviceType: e.target.value });
    setServiceDetails([]);
    setCurrentDetail('');
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
      // 3. Use the axiosPrivate instance from the hook
      const response = await axiosPrivate.get('/api/listings/my-listings');
      setMyListings(response.data);
      setShowMyListings(true);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Failed to fetch your listings.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!category) {
        alert('Please select a category.');
        return;
    }

    if (category === 'Services' && service_details.length === 0) {
      alert('Please add at least one detail for the selected service.');
      return;
    }

    setIsLoading(true);
    try {
      const imageUrls = await Promise.all(
        files.map(async (file) => {
          const uploadFormData = new FormData();
          uploadFormData.append('file', file);
          
          const res = await axiosPrivate.post('/api/upload', uploadFormData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          return res.data.url;
        })
      );

      const listingData = { ...formData, images: imageUrls, service_details };
      if (listingData.category !== 'Machineries') delete listingData.listingType;
      if (listingData.category !== 'Produces') delete listingData.rate_unit;
      if (listingData.category !== 'Services') {
          delete listingData.serviceType;
          delete listingData.service_details;
      }

      const response = await axiosPrivate.post('/api/listings', JSON.stringify(listingData));

      if (response.status === 201 || response.status === 200) {
        alert('Listing created successfully!');
        setFormData({
          category: '', name: '', description: '', price: '', listingType: 'Rent', rate_unit: 'kg', serviceType: 'Labour'
        });
        setFiles([]);
        setServiceDetails([]);
        setCurrentDetail('');
      }
    } catch (error) {
      console.error('Failed to create listing:', error);
      alert(`An error occurred: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getServiceDetailLabel = () => {
    switch(serviceType) {
        case 'Labour': return 'Skills Offered';
        case 'Drone': return 'Drone Capabilities';
        case 'Soil Testing': return 'Tests Provided';
        case 'Equipment Repair': return 'Specializations';
        default: return 'Details';
    }
  };
  
  const getServiceDetailPlaceholder = () => {
      switch(serviceType) {
        case 'Labour': return 'e.g., Harvesting';
        case 'Drone': return 'e.g., Pesticide Spraying';
        case 'Soil Testing': return 'e.g., NPK Levels';
        case 'Equipment Repair': return 'e.g., Tractor Engines';
        default: return 'Add a detail';
    }
  }

  return (
    <>
      <div className="enroll-container">
        <div className="enroll-header">
          <h1>Enroll Your Services</h1>
          <p>Choose your service type and fill out the form to get started</p>
        </div>

        <div className="service-type-selector">
          <button className={`service-type-btn ${category === 'Machineries' ? 'active' : ''}`} onClick={() => handleCategoryChange('Machineries')}>Machinery</button>
          <button className={`service-type-btn ${category === 'Produces' ? 'active' : ''}`} onClick={() => handleCategoryChange('Produces')}>Produce</button>
          <button className={`service-type-btn ${category === 'Services' ? 'active' : ''}`} onClick={() => handleCategoryChange('Services')}>Service</button>
        </div>
        
        <div className="service-type-selector" style={{ marginTop: '-20px' }}>
             <button className="service-type-btn my-listings-btn" onClick={fetchMyListings}>View My Listings</button>
        </div>

        <div className={`form-container ${category ? 'active' : ''}`}>
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h3>{category ? `${category.replace(/s$/, '')} Details` : 'Select a Category Above'}</h3>

              {category === 'Machineries' && (
                <div className="form-group">
                  <label>Listing Type</label>
                  <div className="service-type-selector" style={{ marginBottom: '20px', gap: '10px' }}>
                    <button type="button" className={`service-type-btn ${listingType === 'Rent' ? 'active' : ''}`} onClick={() => setFormData({ ...formData, listingType: 'Rent' })}>For Rent</button>
                    <button type="button" className={`service-type-btn ${listingType === 'Sale' ? 'active' : ''}`} onClick={() => setFormData({ ...formData, listingType: 'Sale' })}>For Sale</button>
                  </div>
                </div>
              )}
              
              {category === 'Produces' && (
                <div className="form-group">
                    <label htmlFor="rate_unit">Rate Unit</label>
                    <select id="rate_unit" name="rate_unit" value={rate_unit} onChange={handleChange}>
                        <option value="kg">Per Kilogram (kg)</option>
                        <option value="ton">Per Ton</option>
                    </select>
                </div>
              )}

              {category === 'Services' && (
                <div className='service-details-container'>
                    <div className="form-group">
                        <label htmlFor="serviceType">Type of Service</label>
                        <select id="serviceType" name="serviceType" value={serviceType} onChange={handleServiceTypeChange}>
                            <option value="Labour">Labour</option>
                            <option value="Drone">Drone</option>
                            <option value="Soil Testing">Soil Testing</option>
                            <option value="Equipment Repair">Equipment Repair</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="details">{getServiceDetailLabel()}</label>
                        <div className="skills-input-container">
                            <input
                                type="text"
                                id="details"
                                value={currentDetail}
                                onChange={(e) => setCurrentDetail(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddDetail())}
                                placeholder={getServiceDetailPlaceholder()}
                            />
                            <button type="button" className="add-skill-btn" onClick={handleAddDetail}>Add</button>
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
                <label htmlFor="name">Title / Name</label>
                <input type="text" id="name" name="name" value={name} onChange={handleChange} placeholder={
                    category === 'Services' ? "e.g., Experienced Farm Laborer" : "e.g., Tractor, Wheat"
                } required />
              </div>

              <div className="form-group">
                <label htmlFor="price">
                  {category === 'Machineries' && listingType === 'Rent' ? 'Price (per day/hour, in Rs)' :
                   category === 'Produces' ? `Price (in Rs per ${rate_unit})` :
                   category === 'Services' ? 'Price (in Rs)' :
                   'Price (in Rs)'}
                </label>
                <input type="number" id="price" name="price" value={price} onChange={handleChange} placeholder="500" required />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea id="description" name="description" value={description} onChange={handleChange} rows="4" placeholder="Provide details about your item or service"></textarea>
              </div>
            </div>

            <div className="form-section">
              <h3>Images</h3>
              <ImageUploader files={files} setFiles={setFiles} />
            </div>

            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'Submit Listing'}
            </button>
          </form>
        </div>
      </div>
      
      {showMyListings && (
        <div className="modal-overlay" onClick={() => setShowMyListings(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>My Listed Items</h2>
              <button className="modal-close-btn" onClick={() => setShowMyListings(false)}>×</button>
            </div>
            {isLoading ? <p>Loading...</p> : myListings.length > 0 ? (
              myListings.map(item => (
                <div key={item._id} className="listed-item">
                  <img src={item.images[0] || 'https://via.placeholder.com/100'} alt={item.name} className="listed-item-img" />
                  <div className="listed-item-details">
                    <h4>{item.name}</h4>
                    <p><strong>Category:</strong> {item.category.replace(/s$/, '')}{item.serviceType ? ` (${item.serviceType})` : ''}</p>
                    <p><strong>Price:</strong> ₹{item.price}
                       {item.rate_unit ? ` per ${item.rate_unit}`: ''}
                       {item.listingType ? ` (For ${item.listingType})`: ''}
                       {item.category === 'Services' && !item.rate_unit ? ' (approx)' : ''}
                    </p>
                    {item.service_details && item.service_details.length > 0 && (
                        <p><strong>Details:</strong> {item.service_details.join(', ')}</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p>You have not listed any items yet.</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Enroll;