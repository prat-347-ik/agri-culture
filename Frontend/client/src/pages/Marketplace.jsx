import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Marketplace.css';

const Marketplace = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Mock data for the 5 farming machines
  const farmingMachines = [
    { name: 'Tractor', slug: 'tractor' },
    { name: 'Harvester', slug: 'harvester' },
    { name: 'Cultivator', slug: 'cultivator' },
    { name: 'Plow', slug: 'plow' },
    { name: 'Seeder', slug: 'seeder' }
  ];

  const renderCategoryCards = () => (
    <div className="category-container">
      <Link to="/marketplace/machineries" className="category-card">
        <h3>Machineries</h3>
      </Link>
      <Link to="/marketplace/labour" className="category-card">
        <h3>Labour</h3>
      </Link>
      <Link to="/marketplace/services" className="category-card">
        <h3>Services</h3>
      </Link>
    </div>
  );

  const renderMachineCards = () => (
    <div className="machine-container">
      {farmingMachines.map(machine => (
        <Link to={`/marketplace/machineries/${machine.slug}`} key={machine.slug} className="machine-card">
          <h4>{machine.name}</h4>
        </Link>
      ))}
    </div>
  );

  return (
    <div className="content-inner">
      <div className="content-section">
        <h2>Marketplace</h2>
        {renderCategoryCards()}
        {/* The machineries will be shown on a sub-route */}
      </div>
    </div>
  );
};

export default Marketplace;
