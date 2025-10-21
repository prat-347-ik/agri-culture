import React, { useState, useRef } from 'react';
import './Enroll.css'; // Your existing CSS file

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
  const [formData, setFormData] = useState({
    category: '', name: '', description: '', price: '',
    listingType: 'Rent', rate_unit: 'kg',
  });
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // New state for the modal
  const [showMyListings, setShowMyListings] = useState(false);
  const [myListings, setMyListings] = useState([]);

  const { category, name, description, price, listingType, rate_unit } = formData;

  const handleCategoryChange = (newCategory) => {
    setFormData({
      category: newCategory, name: '', description: '', price: '',
      listingType: newCategory === 'Machineries' ? 'Rent' : '',
      rate_unit: newCategory === 'Produces' ? 'kg' : '',
    });
    setFiles([]);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Function to fetch and show the user's listings
  const fetchMyListings = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to view your listings.');
      return;
    }
    try {
      setIsLoading(true);
      const res = await fetch('/api/listings/my-listings', {
        headers: { 'x-auth-token': token }
      });
      if (!res.ok) throw new Error('Failed to fetch your listings.');
      const data = await res.json();
      setMyListings(data);
      setShowMyListings(true);
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token || !category) {
      alert('You must be logged in and select a category.');
      return;
    }

    setIsLoading(true);
    try {
      const imageUrls = await Promise.all(
        files.map(async (file) => {
          const uploadFormData = new FormData();
          uploadFormData.append('file', file);
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'x-auth-token': token },
            body: uploadFormData,
          });
          if (!res.ok) throw new Error('Image upload failed');
          const data = await res.json();
          if (!data.url) throw new Error('URL not found in response');
          return data.url;
        })
      );

      const listingData = { ...formData, images: imageUrls };
      if (listingData.category !== 'Machineries') delete listingData.listingType;
      if (listingData.category !== 'Produces') delete listingData.rate_unit;

      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify(listingData),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Listing created successfully!');
        setFormData({
          category: '', name: '', description: '', price: '', listingType: 'Rent', rate_unit: 'kg',
        });
        setFiles([]);
      } else {
        alert(`Error: ${data.message || 'Something went wrong'}`);
      }
    } catch (error) {
      console.error('Failed to create listing:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
        
        {/* New Button Added Here */}
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

              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" value={name} onChange={handleChange} placeholder="e.g., Tractor, Wheat, Harvesting Labor" required />
              </div>

              <div className="form-group">
                <label htmlFor="price">
                  {category === 'Machineries' && listingType === 'Rent' ? 'Price (per day/hour, in Rs)' :
                   category === 'Produces' ? `Price (in Rs per ${rate_unit})` :
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

      {/* Modal for displaying user's listings */}
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
                    <p><strong>Category:</strong> {item.category.replace(/s$/, '')}</p>
                    <p><strong>Price:</strong> ₹{item.price}
                       {item.rate_unit ? ` per ${item.rate_unit}`: ''}
                       {item.listingType ? ` (For ${item.listingType})`: ''}
                    </p>
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