// In-memory data store for prototype usage
// Resets on server restart

const db = {
  users: {},
  tokens: {},
  marketplace: {
    items: [
      { id: 'itm-tractor', type: 'buy', title: 'Tractor', description: 'High-quality farming tractor', price: 12000 },
      { id: 'itm-seeds', type: 'buy', title: 'Seeds Package', description: 'Premium quality seeds', price: 100 },
      { id: 'itm-pesticide', type: 'bid', title: 'Pesticide', description: 'Eco-friendly pesticide', currentBid: 50 },
      { id: 'itm-harvester', type: 'bid', title: 'Harvester', description: 'Advanced harvesting machine', currentBid: 15000 },
      { id: 'itm-tractor-rent', type: 'rent', title: 'Tractor', description: 'Daily tractor rental', ratePerDay: 80 },
    ],
    bids: [],
    rentals: [],
    orders: []
  },
  contacts: [
    { id: 'c1', category: 'government', role: 'Taluka Office', name: 'Taluka Office', phone: '+91 2222-111111' },
    { id: 'c2', category: 'emergency', role: 'Police Station', name: 'Police Station', phone: '100' },
    { id: 'c3', category: 'services', role: 'Soil Testing', name: 'Soil Testing Lab', phone: '+91 2222-333333' },
  ],
};

export default db;


