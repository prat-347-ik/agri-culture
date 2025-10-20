import React, { useState, useRef } from 'react';
import './Enroll.css'; // Your existing CSS file

// This is a new, simplified ImageUploader. It now handles File objects directly.
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
    category: '',
    name: '',
    description: '',
    price: '',
    listingType: 'Rent',
  });
  const [files, setFiles] = useState([]); // This will now store File objects
  const [isLoading, setIsLoading] = useState(false); // For loading state

  const { category, name, description, price, listingType } = formData;

  const handleCategoryChange = (newCategory) => {
    setFormData({
      category: newCategory,
      name: '',
      description: '',
      price: '',
      listingType: newCategory === 'Machineries' ? 'Rent' : '',
    });
    setFiles([]); // Reset files when category changes
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to create a listing.');
      return;
    }
    if (!category) {
      alert('Please select a category first.');
      return;
    }

    setIsLoading(true);

    try {
      // Step 1: Upload Images to Cloudinary
      const imageUrls = await Promise.all(
        files.map(async (file) => {
          const uploadFormData = new FormData();
          uploadFormData.append('file', file);

          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'x-auth-token': token },
            body: uploadFormData,
          });

          if (!res.ok) {
            throw new Error('Image upload failed');
          }

const data = await res.json();
// The API response has the URL directly on the `url` property
if (!data.url) {
  throw new Error('URL not found in the response from /api/upload');
}
return data.url;
        })
      );

      // Step 2: Create the Listing with Image URLs
      const listingData = { ...formData, images: imageUrls };
      if (listingData.category !== 'Machineries') {
        delete listingData.listingType;
      }

      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify(listingData),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Listing created successfully!');
        // Reset form completely
        setFormData({
          category: '', name: '', description: '', price: '', listingType: 'Rent',
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

      <div className={`form-container ${category ? 'active' : ''}`}>
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>{category ? `${category.replace(/s$/, '')} Details` : 'Select a Category Above'}</h3>

            {category === 'Machineries' && (
              <div className="form-group">
                <label>Listing Type</label>
                <div className="service-type-selector" style={{ marginBottom: '20px', gap: '10px' }}>
                  <button type="button" name="listingType" className={`service-type-btn ${listingType === 'Rent' ? 'active' : ''}`} onClick={() => setFormData({ ...formData, listingType: 'Rent' })}>For Rent</button>
                  <button type="button" name="listingType" className={`service-type-btn ${listingType === 'Sale' ? 'active' : ''}`} onClick={() => setFormData({ ...formData, listingType: 'Sale' })}>For Sale</button>
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" value={name} onChange={handleChange} placeholder="e.g., Tractor, Wheat, Harvesting Labor" required />
            </div>
            <div className="form-group">
              <label htmlFor="price">
                {category === 'Machineries' && listingType === 'Rent' ? 'Price (per day/hour, in Rs)' : 'Price (in Rs)'}
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
  );
};

export default Enroll;