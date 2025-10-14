import React, { useState } from 'react';

const Marketplace = () => {
  const [activeTab, setActiveTab] = useState('buy');

  const openMarketTab = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <div className="content-inner">
      <div className="content-section">
        <h2>Marketplace</h2>
        <div className="market-tabs">
          <button className={`tab-link ${activeTab === 'buy' ? 'active' : ''}`} onClick={() => openMarketTab('buy')}>Buy</button>
          <button className={`tab-link ${activeTab === 'bid' ? 'active' : ''}`} onClick={() => openMarketTab('bid')}>Bid</button>
          <button className={`tab-link ${activeTab === 'rent' ? 'active' : ''}`} onClick={() => openMarketTab('rent')}>Rent</button>
        </div>

        {/* Buy Tab Content */}
        <div id="buy" className="tab-content" style={{ display: activeTab === 'buy' ? 'block' : 'none' }}>
          <div className="market-items">
            <div className="market-item">
              <h3>Tractor</h3>
              <p className="price">$10,000</p>
              <p className="description">High-quality farming tractor</p>
              <button className="buy-btn">Buy Now</button>
            </div>
            <div className="market-item">
              <h3>Seeds Package</h3>
              <p className="price">$200</p>
              <p className="description">Premium quality seeds</p>
              <button className="buy-btn">Buy Now</button>
            </div>
            <div className="market-item">
              <h3>Fertilizer</h3>
              <p className="price">$150</p>
              <p className="description">Organic fertilizer blend</p>
              <button className="buy-btn">Buy Now</button>
            </div>
            <div className="market-item">
              <h3>Irrigation System</h3>
              <p className="price">$5,000</p>
              <p className="description">Complete irrigation setup</p>
              <button className="buy-btn">Buy Now</button>
            </div>
          </div>
        </div>

        {/* Bid Tab Content */}
        <div id="bid" className="tab-content" style={{ display: activeTab === 'bid' ? 'block' : 'none' }}>
            <div className="bid-section-header">
                <h3>Live Auctions</h3>
                <p>Place your bids on agricultural equipment and supplies</p>
            </div>
            <div className="market-items">
                <div className="market-item bid-item">
                    <div className="bid-status active">Live Auction</div>
                    <h3>Pesticide</h3>
                    <p className="price">Starting: $50</p>
                    <p className="current-bid">Current Bid: $75</p>
                    <p className="description">Eco-friendly pesticide</p>
                    <div className="bid-input-group">
                        <input type="number" placeholder="Enter your bid" min="76" className="bid-input" />
                        <button className="bid-btn">Place Bid</button>
                    </div>
                    <p className="auction-end">Ends in: 2h 15m</p>
                </div>
                <div className="market-item bid-item">
                    <div className="bid-status active">Live Auction</div>
                    <h3>Harvester</h3>
                    <p className="price">Starting: $15,000</p>
                    <p className="current-bid">Current Bid: $18,500</p>
                    <p className="description">Advanced harvesting machine</p>
                    <div className="bid-input-group">
                        <input type="number" placeholder="Enter your bid" min="18501" className="bid-input" />
                        <button className="bid-btn">Place Bid</button>
                    </div>
                    <p className="auction-end">Ends in: 1d 8h</p>
                </div>
                <div className="market-item bid-item">
                    <div className="bid-status active">Live Auction</div>
                    <h3>Greenhouse</h3>
                    <p className="price">Starting: $8,000</p>
                    <p className="current-bid">Current Bid: $9,200</p>
                    <p className="description">Complete greenhouse setup</p>
                    <div className="bid-input-group">
                        <input type="number" placeholder="Enter your bid" min="9201" className="bid-input" />
                        <button className="bid-btn">Place Bid</button>
                    </div>
                    <p className="auction-end">Ends in: 5h 30m</p>
                </div>
                <div className="market-item bid-item">
                    <div className="bid-status ending">Ending Soon</div>
                    <h3>Tractor Parts</h3>
                    <p className="price">Starting: $500</p>
                    <p className="current-bid">Current Bid: $750</p>
                    <p className="description">Complete set of tractor replacement parts</p>
                    <div className="bid-input-group">
                        <input type="number" placeholder="Enter your bid" min="751" className="bid-input" />
                        <button className="bid-btn">Place Bid</button>
                    </div>
                    <p className="auction-end">Ends in: 45m</p>
                </div>
            </div>
        </div>

        {/* Rent Tab Content */}
        <div id="rent" className="tab-content" style={{ display: activeTab === 'rent' ? 'block' : 'none' }}>
            <div className="rent-section-header">
                <h3>Equipment Rental</h3>
                <p>Rent agricultural equipment for your farming needs</p>
            </div>
            <div className="market-items">
                <div className="market-item rent-item">
                    <div className="rent-status available">Available</div>
                    <h3>Irrigation Pump</h3>
                    <p className="price">$40/month</p>
                    <p className="rental-period">Minimum: 1 month</p>
                    <p className="description">High-capacity pump</p>
                    <div className="rent-input-group">
                        <select className="rent-duration">
                            <option value="1">1 Month</option>
                            <option value="3">3 Months</option>
                            <option value="6">6 Months</option>
                            <option value="12">1 Year</option>
                        </select>
                        <button className="rent-btn">Rent Now</button>
                    </div>
                    <p className="delivery-info">Free delivery within 50km</p>
                </div>
                <div className="market-item rent-item">
                    <div className="rent-status available">Available</div>
                    <h3>Tractor</h3>
                    <p className="price">$200/day</p>
                    <p className="rental-period">Minimum: 1 day</p>
                    <p className="description">Daily tractor rental</p>
                    <div className="rent-input-group">
                        <select className="rent-duration">
                            <option value="1">1 Day</option>
                            <option value="7">1 Week</option>
                            <option value="30">1 Month</option>
                        </select>
                        <button className="rent-btn">Rent Now</button>
                    </div>
                    <p className="delivery-info">Operator included</p>
                </div>
                <div className="market-item rent-item">
                    <div className="rent-status available">Available</div>
                    <h3>Harvester</h3>
                    <p className="price">$500/day</p>
                    <p className="rental-period">Minimum: 1 day</p>
                    <p className="description">Professional harvester</p>
                    <div className="rent-input-group">
                        <select className="rent-duration">
                            <option value="1">1 Day</option>
                            <option value="7">1 Week</option>
                            <option value="30">1 Month</option>
                        </select>
                        <button className="rent-btn">Rent Now</button>
                    </div>
                    <p className="delivery-info">Professional operator included</p>
                </div>
                <div className="market-item rent-item">
                    <div className="rent-status available">Available</div>
                    <h3>Seed Drill</h3>
                    <p className="price">$80/day</p>
                    <p className="rental-period">Minimum: 1 day</p>
                    <p className="description">Precision seed drilling equipment</p>
                    <div className="rent-input-group">
                        <select className="rent-duration">
                            <option value="1">1 Day</option>
                            <option value="7">1 Week</option>
                            <option value="30">1 Month</option>
                        </select>
                        <button className="rent-btn">Rent Now</button>
                    </div>
                    <p className="delivery-info">Setup assistance included</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;