import React, { useState, useRef } from 'react';

// --- Custom CSS for the enroll page ---
const customEnrollStyles = `
    .enroll-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
    }
    .enroll-header {
        text-align: center;
        margin-bottom: 40px;
    }
    .enroll-header h1 {
        font-size: clamp(1.6rem, 5vw, 2.5rem);
        margin-bottom: 10px;
        background: linear-gradient(135deg, #2e7d32, #ffc107);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }
    .enroll-header p {
        font-size: clamp(0.9rem, 3.5vw, 1.1rem);
        color: #666;
    }
    .service-type-selector {
        display: flex;
        justify-content: center;
        gap: 20px;
        margin-bottom: 40px;
        flex-wrap: wrap;
    }
    .service-type-btn {
        padding: 15px 30px;
        font-size: 1.1rem;
        border: 2px solid #2e7d32;
        background: white;
        color: #2e7d32;
        border-radius: 25px;
        cursor: pointer;
        transition: all 0.3s ease;
        min-width: 150px;
    }
    .service-type-btn:hover,
    .service-type-btn.active {
        background: #2e7d32;
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(46, 125, 50, 0.3);
    }
    .form-container {
        background: white;
        border-radius: 15px;
        padding: clamp(16px, 4vw, 30px);
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        margin-bottom: 30px;
        display: none;
    }
    .form-container.active {
        display: block;
        animation: fadeIn 0.5s ease;
    }
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .form-section {
        margin-bottom: 25px;
    }
    .form-section h3 {
        color: #2e7d32;
        margin-bottom: 15px;
        font-size: 1.3rem;
        border-bottom: 2px solid #ffc107;
        padding-bottom: 8px;
    }
    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        margin-bottom: 20px;
    }
    .form-group {
        margin-bottom: 20px;
    }
    .form-group label {
        display: block;
        margin-bottom: 8px;
        font-weight: 600;
        color: #333;
    }
    .form-group input,
    .form-group select,
    .form-group textarea {
        width: 100%;
        padding: 12px 15px;
        border: 2px solid #e0e0e0;
        border-radius: 8px;
        font-size: 1rem;
        transition: border-color 0.3s ease;
    }
    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
        outline: none;
        border-color: #2e7d32;
        box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.1);
    }
    .form-group textarea {
        resize: vertical;
        min-height: 100px;
    }
    .checkbox-group {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 15px;
    }
    .checkbox-group input[type="checkbox"] {
        width: auto;
        margin: 0;
    }
    .submit-btn {
        background: linear-gradient(135deg, #2e7d32, #4caf50);
        color: white;
        padding: 15px 40px;
        border: none;
        border-radius: 25px;
        font-size: 1.1rem;
        cursor: pointer;
        transition: all 0.3s ease;
        display: block;
        margin: 30px auto 0;
    }
    .submit-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(46, 125, 50, 0.3);
    }
    .other-service-input {
        margin-top: 10px;
        display: none;
    }
    .other-service-input.show {
        display: block;
    }
    .product-categories {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 15px;
        margin-top: 15px;
    }
    .category-card {
        border: 2px solid #e0e0e0;
        border-radius: 10px;
        padding: 15px;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    .category-card:hover {
        border-color: #2e7d32;
        background: rgba(46, 125, 50, 0.05);
    }
    .category-card.selected {
        border-color: #2e7d32;
        background: rgba(46, 125, 50, 0.1);
    }
    .category-card h4 {
        color: #2e7d32;
        margin-bottom: 5px;
    }
    .category-card p {
        font-size: 0.9rem;
        color: #666;
    }
    .image-upload-container {
        margin-top: 15px;
    }
    .image-upload-area {
        border: 2px dashed #2e7d32;
        border-radius: 10px;
        padding: 30px;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s ease;
        background: rgba(46, 125, 50, 0.05);
        position: relative;
    }
    .image-upload-area:hover {
        border-color: #ffc107;
        background: rgba(46, 125, 50, 0.1);
    }
    .upload-icon {
        font-size: 3rem;
        margin-bottom: 10px;
        color: #2e7d32;
    }
    .image-upload-area p {
        margin: 5px 0;
        color: #333;
    }
    .upload-hint {
        font-size: 0.9rem;
        color: #666;
    }
    .file-input {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
    }
    .image-preview-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 15px;
        margin-top: 20px;
    }
    .image-preview {
        position: relative;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .image-preview img {
        width: 100%;
        height: 120px;
        object-fit: cover;
        display: block;
    }
    .remove-image {
        position: absolute;
        top: 5px;
        right: 5px;
        background: rgba(255, 0, 0, 0.8);
        color: white;
        border: none;
        border-radius: 50%;
        width: 25px;
        height: 25px;
        cursor: pointer;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .remove-image:hover {
        background: rgba(255, 0, 0, 1);
    }
    @media (max-width: 768px) {
        .form-row {
            grid-template-columns: 1fr;
        }
        .service-type-selector {
            flex-direction: column;
            align-items: center;
        }
        .enroll-container {
            padding: 12px;
        }
        .service-type-btn { width: 100%; max-width: 360px; }
    }
`;

// Image Uploader Component
const ImageUploader = ({ images, setImages, maxImages = 5 }) => {
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (images.length + files.length > maxImages) {
            alert(`You can only upload up to ${maxImages} images.`);
            return;
        }

        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImages(prev => [...prev, { src: event.target.result, id: Date.now() + Math.random() }]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (id) => {
        setImages(prev => prev.filter(image => image.id !== id));
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
                />
            </div>
            <div className="image-preview-container">
                {images.map(image => (
                    <div key={image.id} className="image-preview">
                        <img src={image.src} alt="Preview" />
                        <button type="button" className="remove-image" onClick={() => removeImage(image.id)}>×</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Main Enroll Component
const Enroll = () => {
    const [activeForm, setActiveForm] = useState(null);
    const [biddingImages, setBiddingImages] = useState([]);
    const [sellingImages, setSellingImages] = useState([]);
    const [rentingImages, setRentingImages] = useState([]);

    const handleFormSubmit = (e, formType) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        let images;
        if (formType === 'bidding') images = biddingImages;
        if (formType === 'selling') images = sellingImages;
        if (formType === 'renting') images = rentingImages;

        console.log(`--- ${formType.toUpperCase()} FORM SUBMISSION ---`);
        console.log('Form Data:', data);
        console.log('Images:', images);
        alert(`${formType.charAt(0).toUpperCase() + formType.slice(1)} form submitted successfully! (Check console for data)`);
        e.target.reset(); // Reset form fields
        // Reset corresponding image state
        if (formType === 'bidding') setBiddingImages([]);
        if (formType === 'selling') setSellingImages([]);
        if (formType === 'renting') setRentingImages([]);
    };

    return (
        <>
            <style>{customEnrollStyles}</style>
            <div className="enroll-container">
                <div className="enroll-header">
                    <h1>Enroll Your Services</h1>
                    <p>Choose your service type and fill out the form to get started</p>
                </div>

                <div className="service-type-selector">
                    <button className={`service-type-btn ${activeForm === 'bidding' ? 'active' : ''}`} onClick={() => setActiveForm('bidding')}>Bidding</button>
                    <button className={`service-type-btn ${activeForm === 'selling' ? 'active' : ''}`} onClick={() => setActiveForm('selling')}>Selling</button>
                    <button className={`service-type-btn ${activeForm === 'renting' ? 'active' : ''}`} onClick={() => setActiveForm('renting')}>Renting</button>
                </div>

                {/* Bidding Form */}
                <div id="biddingForm" className={`form-container ${activeForm === 'bidding' ? 'active' : ''}`}>
                    <form onSubmit={(e) => handleFormSubmit(e, 'bidding')}>
                        {/* Bidding form fields */}
                        <div className="form-section">
                            <h3>What do you offer?</h3>
                            {/* ... other bidding fields ... */}
                        </div>
                        <div className="form-section">
                            <h3>Work/Service details</h3>
                            {/* ... */}
                        </div>
                        <div className="form-section">
                            <h3>Images</h3>
                            <ImageUploader images={biddingImages} setImages={setBiddingImages} />
                        </div>
                        <div className="form-section">
                            <h3>Your contact details</h3>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Your name</label>
                                    <input type="text" name="fullName" placeholder="Enter your full name" required />
                                </div>
                                <div className="form-group">
                                    <label>Mobile number</label>
                                    <input type="tel" name="phone" placeholder="Enter your mobile number" required />
                                </div>
                            </div>
                        </div>
                        <button type="submit" className="submit-btn">Submit your info</button>
                    </form>
                </div>

                {/* Selling Form */}
                <div id="sellingForm" className={`form-container ${activeForm === 'selling' ? 'active' : ''}`}>
                    <form onSubmit={(e) => handleFormSubmit(e, 'selling')}>
                        <div className="form-section">
                            <h3>Product Information</h3>
                            {/* ... selling fields ... */}
                        </div>
                        <div className="form-section">
                            <h3>Product Images</h3>
                            <ImageUploader images={sellingImages} setImages={setSellingImages} />
                        </div>
                        <div className="form-section">
                            <h3>Your contact details</h3>
                             <div className="form-row">
                                <div className="form-group">
                                    <label>Your name</label>
                                    <input type="text" name="fullName" placeholder="Enter your full name" required />
                                </div>
                                <div className="form-group">
                                    <label>Mobile number</label>
                                    <input type="tel" name="phone" placeholder="Enter your mobile number" required />
                                </div>
                            </div>
                        </div>
                        <button type="submit" className="submit-btn">Submit Selling Request</button>
                    </form>
                </div>

                {/* Renting Form */}
                <div id="rentingForm" className={`form-container ${activeForm === 'renting' ? 'active' : ''}`}>
                    <form onSubmit={(e) => handleFormSubmit(e, 'renting')}>
                        <div className="form-section">
                            <h3>Equipment/Service Info</h3>
                            {/* ... renting fields ... */}
                        </div>
                         <div className="form-section">
                            <h3>Item Images</h3>
                            <ImageUploader images={rentingImages} setImages={setRentingImages} />
                        </div>
                        <div className="form-section">
                            <h3>Contact Information</h3>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input type="text" name="fullName" placeholder="Enter your full name" required />
                                </div>
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input type="tel" name="phone" placeholder="Enter your phone number" required />
                                </div>
                            </div>
                        </div>
                        <button type="submit" className="submit-btn">Submit Renting Request</button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Enroll;