import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useAxiosPrivate from '../hooks/useAxiosPrivate'; // Your private hook
import './TrainingPrograms.css'; // The CSS file we just created

const TrainingPrograms = () => {
  const { t } = useTranslation();
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchCourses = async () => {
      try {
        // Use your private axios instance to make the authenticated GET request
        const response = await axiosPrivate.get('/api/training', {
          signal: controller.signal,
        });

        if (isMounted) {
          setCourses(response.data);
          setError(null);
        }
      } catch (err) {
        if (err.name === 'CanceledError') {
          console.log('Request to fetch training courses was canceled');
        } else if (isMounted) {
          console.error(err);
          setError(t('trainingPrograms.error', 'Failed to load training programs. Please try again later.'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchCourses();

    // Cleanup function
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [axiosPrivate, t]); // Add dependencies

  // Helper function to render the list content
  const renderContent = () => {
    if (isLoading) {
      return <p className="loading-text">{t('loading', 'Loading...')}</p>;
    }

    if (error) {
      return <p className="error-text">{error}</p>;
    }

    if (courses.length === 0) {
      return (
        <p className="no-courses-text">
          {t('trainingPrograms.noCourses', 'No training programs are available at this time. Please check back later.')}
        </p>
      );
    }

    return (
      <div className="course-list">
        {courses.map((course) => (
          <div key={course._id} className="course-card">
            <div className="course-card-content">
              <h3>{course.title}</h3>
              <p className="provider">{course.provider}</p>
              <p className="description">{course.description}</p>
            </div>
            <div className="course-card-footer">
              <a
                href={course.applyLink}
                target="_blank" // Opens in a new tab
                rel="noopener noreferrer" // Security best practice
                className="apply-btn"
              >
                {t('trainingPrograms.applyNow', 'Apply Now')}
              </a>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="training-container">
      <h1>{t('trainingPrograms.title', 'Training Programs')}</h1>
      <p className="page-description">
        {t('trainingPrograms.description', 'Browse government and private courses to enhance your agricultural skills.')}
      </p>
      {renderContent()}
    </div>
  );
};

export default TrainingPrograms;