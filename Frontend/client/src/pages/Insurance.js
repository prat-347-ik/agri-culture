import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import './Insurance.css'; // The new CSS file

const Insurance = () => {
  const { t } = useTranslation();
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All'); // 'All', 'Crop', 'Machinery', 'Other'
  const axiosPrivate = useAxiosPrivate();

  const categories = ['All', 'Crop', 'Machinery', 'Other'];

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchPlans = async () => {
      try {
        const response = await axiosPrivate.get('/api/insurance', {
          signal: controller.signal,
        });

        if (isMounted) {
          setPlans(response.data);
          setError(null);
        }
      } catch (err) {
        if (err.name === 'CanceledError') {
          console.log('Request to fetch insurance plans was canceled');
        } else if (isMounted) {
          console.error(err);
          setError(t('insurancePage.error', 'Failed to load insurance plans.'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchPlans();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [axiosPrivate, t]);

  // Filter plans based on the selected category
  const filteredPlans = useMemo(() => {
    if (selectedCategory === 'All') {
      return plans;
    }
    return plans.filter(plan => plan.category === selectedCategory);
  }, [plans, selectedCategory]);

  const renderContent = () => {
    if (isLoading) {
      return <p className="loading-text">{t('loading', 'Loading...')}</p>;
    }

    if (error) {
      return <p className="error-text">{error}</p>;
    }

    if (plans.length === 0) {
       return <p className="no-plans-text">{t('insurancePage.noPlansInitial', 'No insurance plans available at the moment.')}</p>;
    }

    if (filteredPlans.length === 0) {
        return <p className="no-plans-text">{t('insurancePage.noPlansFiltered', 'No insurance plans found for this category.')}</p>;
    }

    return (
      <div className="plan-list">
        {filteredPlans.map((plan) => (
          <div key={plan._id} className="plan-card">
            <div className="plan-card-content">
              <h3>{plan.planName}</h3>
              <p className="provider">{plan.provider}</p>
              <div className="tags">
                 <span className={`tag ${plan.type?.toLowerCase()}`}>
                    {t(`insurancePage.type${plan.type}`, plan.type)} {/* Translate Gov/Private */}
                 </span>
                 <span className="tag">
                    {t(`insurancePage.category${plan.category}`, plan.category)} {/* Translate Category */}
                 </span>
              </div>
              <p className="description">{plan.description}</p>
            </div>
            <div className="plan-card-footer">
              <a
                href={plan.applyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="apply-btn"
              >
                {t('insurancePage.applyButton', 'Get Quote / Apply')}
              </a>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="insurance-container">
      <h1>{t('insurancePage.title', 'Insurance Services')}</h1>
      <p className="page-description">
        {t('insurancePage.description', 'Find government and private insurance plans to protect your crops and machinery.')}
      </p>

      {/* Filter Buttons */}
      <div className="filter-buttons">
        {categories.map((category) => (
          <button
            key={category}
            className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {t(`insurancePage.filter${category}`, category)} {/* Translate Filter Button Text */}
          </button>
        ))}
      </div>

      {renderContent()}
    </div>
  );
};

export default Insurance;