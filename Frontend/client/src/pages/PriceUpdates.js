import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useAxiosPrivate from '../hooks/useAxiosPrivate'; // Your hook for authenticated requests
// import './PriceUpdates.css'; // Assuming styles are embedded

const PriceUpdates = () => {
  const { t } = useTranslation();
  const axiosPrivate = useAxiosPrivate();

  // State for filter dropdowns
  const [filters, setFilters] = useState({
    state: '',
    district: '',
    market: '',
    commodity: ''
  });

  // State for dropdown options
  const [lists, setLists] = useState({
    states: [],
    districts: [],
    markets: [],
    commodities: []
  });

  // State for search results
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // --- Data Fetching for Dropdowns ---

  // Fetch initial list of states on mount
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchStates = async () => {
      try {
        setError('');
        const response = await axiosPrivate.get('/api/prices/states', {
          signal: controller.signal
        });
        if (isMounted) {
          setLists(prev => ({ ...prev, states: response.data }));
        }
      } catch (err) {
        if (err.name !== 'CanceledError') {
          // --- FIX: Use nested key ---
          setError(t('priceUpdates.error_fetching_states'));
          console.error(err);
        }
      }
    };

    fetchStates();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [axiosPrivate, t]);

  // Fetch districts when state changes
  useEffect(() => {
    if (!filters.state) {
      setLists(prev => ({ ...prev, districts: [], markets: [], commodities: [] }));
      setFilters(prev => ({ ...prev, district: '', market: '', commodity: '' }));
      return;
    }
    
    const fetchDistricts = async () => {
      try {
        setError('');
        const response = await axiosPrivate.get(`/api/prices/districts?state=${filters.state}`);
        setLists(prev => ({ ...prev, districts: response.data, markets: [], commodities: [] }));
        setFilters(prev => ({ ...prev, district: '', market: '', commodity: '' }));
      } catch (err) {
        // --- FIX: Use nested key ---
        setError(t('priceUpdates.error_fetching_districts'));
        console.error(err);
      }
    };

    fetchDistricts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.state, axiosPrivate, t]);

  // Fetch markets when district changes
  useEffect(() => {
    if (!filters.district) {
      setLists(prev => ({ ...prev, markets: [], commodities: [] }));
      setFilters(prev => ({ ...prev, market: '', commodity: '' }));
      return;
    }

    const fetchMarkets = async () => {
      try {
        setError('');
        const response = await axiosPrivate.get(`/api/prices/markets?state=${filters.state}&district=${filters.district}`);
        setLists(prev => ({ ...prev, markets: response.data, commodities: [] }));
        setFilters(prev => ({ ...prev, market: '', commodity: '' }));
      } catch (err) {
        // --- FIX: Use nested key ---
        setError(t('priceUpdates.error_fetching_markets'));
        console.error(err);
      }
    };

    fetchMarkets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.district, axiosPrivate, t]);

  // Fetch commodities when market changes
  useEffect(() => {
    if (!filters.market) {
      setLists(prev => ({ ...prev, commodities: [] }));
      setFilters(prev => ({ ...prev, commodity: '' }));
      return;
    }

    const fetchCommodities = async () => {
      try {
        setError('');
        const response = await axiosPrivate.get(`/api/prices/commodities?state=${filters.state}&district=${filters.district}&market=${filters.market}`);
        setLists(prev => ({ ...prev, commodities: response.data }));
        setFilters(prev => ({ ...prev, commodity: '' }));
      } catch (err) {
        // --- FIX: Use nested key ---
        setError(t('priceUpdates.error_fetching_commodities'));
        console.error(err);
      }
    };

    fetchCommodities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.market, axiosPrivate, t]);


  // --- Event Handlers ---

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults([]);

    // Build query params
    const params = new URLSearchParams();
    if (filters.state) params.append('state', filters.state);
    if (filters.district) params.append('district', filters.district);
    if (filters.market) params.append('market', filters.market);
    if (filters.commodity) params.append('commodity', filters.commodity);

    try {
      const response = await axiosPrivate.get(`/api/prices?${params.toString()}`);
      setResults(response.data);
    } catch (err) {
      // --- FIX: Use nested key ---
      setError(t('priceUpdates.error_searching_prices'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFilters({ state: '', district: '', market: '', commodity: '' });
    setLists(prev => ({ ...prev, districts: [], markets: [], commodities: [] }));
    setResults([]);
    setError('');
  };

  const formatPrice = (price) => `₹ ${price ? price.toFixed(2) : '0.00'}`;
  
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (e) {
      return 'Invalid Date';
    }
  };

  // --- STYLES ---
  const styles = `
    .price-updates-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
      font-family: 'Arial', sans-serif;
      background-color: #f9f9f9;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    .price-updates-container h2 {
      text-align: center;
      color: #2c5e2e; /* Dark green */
      margin-bottom: 2rem;
      font-size: 2rem;
    }

    .price-filters-form {
      background-color: #ffffff;
      padding: 1.5rem 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      margin-bottom: 2rem;
    }

    .filter-group {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .filter-item {
      display: flex;
      flex-direction: column;
    }

    .filter-item label {
      font-weight: 600;
      color: #333;
      margin-bottom: 0.5rem;
    }

    .filter-item select {
      padding: 0.75rem;
      border: 1px solid #ccc;
      border-radius: 6px;
      font-size: 1rem;
      background-color: #fff;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .filter-item select:focus {
      outline: none;
      border-color: #4CAF50; /* Green focus */
      box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2);
    }

    .filter-item select:disabled {
      background-color: #e9ecef;
      cursor: not-allowed;
    }

    .filter-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .filter-actions button {
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      font-weight: 600;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: background-color 0.2s, box-shadow 0.2s;
    }

    .search-button {
      background-color: #4CAF50; /* Green */
      color: white;
    }

    .search-button:hover {
      background-color: #45a049;
    }

    .search-button:disabled {
      background-color: #a5d6a7;
      cursor: not-allowed;
    }

    .clear-button {
      background-color: #f44336; /* Red */
      color: white;
    }

    .clear-button:hover {
      background-color: #e53935;
    }

    .price-results {
      margin-top: 2rem;
    }

    .loading-message,
    .no-results-message {
      text-align: center;
      font-size: 1.1rem;
      color: #555;
      padding: 2rem;
      background-color: #fff;
      border-radius: 8px;
    }

    .price-error-message {
      text-align: center;
      font-size: 1.1rem;
      color: #d9534f; /* Red for error */
      padding: 1.5rem;
      background-color: #f2dede;
      border: 1px solid #ebccd1;
      border-radius: 8px;
    }

    .results-table-container {
      overflow-x: auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      border: 1px solid #e0e0e0;
    }

    .price-results table {
      width: 100%;
      border-collapse: collapse;
      min-width: 800px; 
    }

    .price-results th {
      background-color: #2c5e2e; /* Dark green header */
      color: #ffffff; /* White text */
      padding: 1rem 1.25rem;
      text-align: left;
      font-weight: 600;
      font-size: 0.95rem;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      white-space: nowrap;
      border-bottom: 2px solid #254f27;
    }

    .price-results td {
      padding: 1rem 1.25rem;
      border-bottom: 1px solid #e0e0e0;
      color: #333;
      font-size: 0.9rem;
    }

    .price-results tr:last-child td {
      border-bottom: none;
    }

    .price-results tr:nth-child(even) {
      background-color: #f9f9f9; /* Zebra striping */
    }

    .price-results tr:hover {
      background-color: #e8f5e9; /* Light green hover */
    }
  `;

  return (
    <>
      <style>{styles}</style>
      
      <div className="price-updates-container">
        {/* --- FIX: Use nested key --- */}
        <h2>{t('priceUpdates.market_prices_title')}</h2>
        
        <form onSubmit={handleSearch} className="price-filters-form">
          <div className="filter-group">
            {/* State */}
            <div className="filter-item">
               {/* --- FIX: Use nested key --- */}
              <label htmlFor="state">{t('priceUpdates.filter_state')}</label>
              <select id="state" name="state" value={filters.state} onChange={handleFilterChange}>
                 {/* --- FIX: Use nested key --- */}
                <option value="">{t('priceUpdates.select_state')}</option>
                {lists.states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            {/* District */}
            <div className="filter-item">
              {/* --- FIX: Use nested key --- */}
              <label htmlFor="district">{t('priceUpdates.filter_district')}</label>
              <select id="district" name="district" value={filters.district} onChange={handleFilterChange} disabled={!filters.state}>
                {/* --- FIX: Use nested key --- */}
                <option value="">{t('priceUpdates.select_district')}</option>
                {lists.districts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>

            {/* Market */}
            <div className="filter-item">
              {/* --- FIX: Use nested key --- */}
              <label htmlFor="market">{t('priceUpdates.filter_market')}</label>
              <select id="market" name="market" value={filters.market} onChange={handleFilterChange} disabled={!filters.district}>
                 {/* --- FIX: Use nested key --- */}
                <option value="">{t('priceUpdates.select_market')}</option>
                {lists.markets.map(market => (
                  <option key={market} value={market}>{market}</option>
                ))}
              </select>
            </div>

            {/* Commodity */}
            <div className="filter-item">
               {/* --- FIX: Use nested key --- */}
              <label htmlFor="commodity">{t('priceUpdates.filter_commodity')}</label>
              <select id="commodity" name="commodity" value={filters.commodity} onChange={handleFilterChange} disabled={!filters.market}>
                 {/* --- FIX: Use nested key --- */}
                <option value="">{t('priceUpdates.select_commodity')}</option>
                {lists.commodities.map(commodity => (
                  <option key={commodity} value={commodity}>{commodity}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="filter-actions">
            <button type="submit" className="search-button" disabled={loading || !filters.state}>
              {/* --- FIX: Use nested key --- */}
              {loading ? t('priceUpdates.searching') : t('priceUpdates.search')}
            </button>
            <button type="button" className="clear-button" onClick={handleClear}>
               {/* --- FIX: Use nested key --- */}
              {t('priceUpdates.clear_filters')}
            </button>
          </div>
        </form>

        {error && <div className="price-error-message">{error}</div>}

        <div className="price-results">
          {/* --- FIX: Use nested key --- */}
          {loading && <div className="loading-message">{t('priceUpdates.loading_prices')}</div>}
          
          {/* --- FIX: Use nested key --- */}
          {!loading && !error && results.length === 0 && (
            <div className="no-results-message">{t('priceUpdates.no_prices_found')}</div>
          )}

          {!loading && !error && results.length > 0 && (
            <div className="results-table-container">
              <table>
                <thead>
                  <tr>
                     {/* --- FIX: Use nested keys --- */}
                    <th>{t('priceUpdates.table_arrival_date')}</th>
                    <th>{t('priceUpdates.table_commodity')}</th>
                    <th>{t('priceUpdates.table_variety')}</th>
                    <th>{t('priceUpdates.table_market')}</th>
                    <th>{t('priceUpdates.table_min_price')} ( /Qtl)</th>
                    <th>{t('priceUpdates.table_max_price')} ( /Qtl)</th>
                    <th>{t('priceUpdates.table_modal_price')} ( /Qtl)</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((item) => (
                    <tr key={item._id}>
                      <td>{formatDate(item.arrivalDate)}</td>
                      <td>{item.commodity}</td>
                      <td>{item.variety}</td>
                      <td>{item.market}</td>
                      <td>{formatPrice(item.minPrice)}</td>
                      <td>{formatPrice(item.maxPrice)}</td>
                      <td>{formatPrice(item.modalPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PriceUpdates;