// Frontend/client/src/pages/ItemListing.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ItemListing.css'; // You'll need to create this CSS file

const ItemListing = () => {
  const { category, itemType } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/marketplace/${category}/${itemType}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setItems(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [category, itemType]);

  if (loading) return <div className="loading">Loading listings...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="item-listing-container">
      <h1 className="listing-header">
        {category === 'buy' ? 'Buying' : 'Renting'}: {itemType}
      </h1>
      
      <div className="items-grid">
        {items.length === 0 ? (
          <p>No listings found for this item.</p>
        ) : (
          items.map(item => (
            <div key={item._id} className="item-card">
              <div className="item-image-container">
                {item.images && item.images.length > 0 ? (
                  <img src={item.images[0].url} alt={item.name} className="item-image" />
                ) : (
                  <div className="no-image">No Image</div>
                )}
              </div>
              <div className="item-details">
                <h3 className="item-name">{item.name}</h3>
                <p className="item-description">{item.description}</p>
                <p className="item-price">${item.price} {item.category === 'rent' ? `/${item.rentalPeriod}` : ''}</p>
                
                {item.seller && (
                  <div className="seller-info">
                    <h4>Seller Information</h4>
                    <p><strong>Name:</strong> {item.seller.fullName}</p>
                    <p><strong>Contact:</strong> {item.seller.phone}</p>
                    <p><strong>Location:</strong> {`${item.seller.village || ''}, ${item.seller.taluka || ''}`}</p>
                  </div>
                )}
                <Link to={`/marketplace/item/${item._id}`} className="view-details-btn">View Details</Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ItemListing;