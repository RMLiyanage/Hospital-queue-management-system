import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AppointmentBooking.css';

function AppointmentBooking() {
  const [userName, setUserName] = useState('Patient');
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [bookingError, setBookingError] = useState(null);

  useEffect(() => {
    // Authenticate routing
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user && user.fullName) {
          setUserName(user.fullName);
        }
      } catch (e) {
        console.error('Failed to parse user details', e);
      }
    } else {
      window.location.hash = '#login';
    }
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:8080/api/doctors');
      setDoctors(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch available doctors. Please verify the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.hash = '#login';
  };

  const handleBookAppointment = async (id, doctorName) => {
    setBookingSuccess(null);
    setBookingError(null);
    try {
      const response = await axios.get(`http://localhost:8080/api/doctors/${id}/availability`);
      if (response.data && response.data.available) {
        setBookingSuccess(`Booking initiated with ${doctorName}!`);
        setTimeout(() => {
          setBookingSuccess(null);
        }, 4000);
      } else {
        setBookingError(`Doctor is unavailable today.`);
        setTimeout(() => {
          setBookingError(null);
        }, 4000);
      }
    } catch (err) {
      console.error(err);
      setBookingError('Error checking availability. Please try again.');
      setTimeout(() => {
        setBookingError(null);
      }, 4000);
    }
  };

  const getSpecializationClass = (specialization) => {
    const spec = specialization?.toLowerCase() || '';
    if (spec.includes('cardio')) return 'cardiology';
    if (spec.includes('dent')) return 'dentistry';
    return 'general';
  };

  const getSpecializationIcon = (specialization) => {
    const spec = specialization?.toLowerCase() || '';
    if (spec.includes('cardio')) {
      // Heart Icon
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
        </svg>
      );
    }
    if (spec.includes('dent')) {
      // Tooth-like SVG (Shield/Deco representation)
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2c-.5 0-1 .5-1 1v2c0 .5.5 1 1 1s1-.5 1-1V3c0-.5-.5-1-1-1Z"/>
          <path d="M6 8a5 5 0 0 1 10-2.5A5 5 0 0 1 20 8c0 3-1.5 5.5-2.5 7.5a6 6 0 0 0-.5 2v1a3 3 0 0 1-6 0v-1a6 6 0 0 0-.5-2C9.5 13.5 8 11 8 8Z"/>
        </svg>
      );
    }
    // Stethoscope / Doctor shield
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 16.5c-1.5 1.26-2.5 3.19-2.5 5.5h20c0-2.31-1-4.24-2.5-5.5"/>
        <path d="M12 2v10M8 8h8"/>
        <path d="M6 12a6 6 0 0 0 12 0"/>
      </svg>
    );
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const query = searchQuery.toLowerCase();
    return (
      doctor.doctorName?.toLowerCase().includes(query) ||
      doctor.specialization?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="booking-container" id="booking-page-container">
      <div className="booking-content">
        
        {/* Navigation & Header */}
        <header className="booking-header" id="booking-header">
          <div className="brand-section">
            <h1>ApexCare Portal</h1>
            <p>Queue & Appointment Management System</p>
          </div>
          <div className="user-profile">
            <div className="user-info">
              <div className="user-label">Welcome back</div>
              <div className="user-name" id="user-display-name">{userName}</div>
            </div>
            <button className="logout-btn" onClick={handleLogout} id="logout-button">
              Log Out
            </button>
          </div>
        </header>

        {/* Global notification */}
        {bookingSuccess && (
          <div className="success-alert" id="booking-success-alert" style={{ marginBottom: '2rem' }}>
            {bookingSuccess}
          </div>
        )}

        {bookingError && (
          <div className="error-alert" id="booking-error-alert" style={{ marginBottom: '2rem' }}>
            {bookingError}
          </div>
        )}

        {/* Search bar */}
        <section className="search-filter-section">
          <div className="search-input-wrapper">
            <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              className="search-input"
              id="doctor-search-input"
              placeholder="Search by doctor name or specialization (e.g. Silva, Dentist...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </section>

        <h2 className="doctors-section-title">Available Medical Experts</h2>

        {/* Loading state */}
        {loading && (
          <div className="loading-wrapper" id="doctors-loading-state">
            <div className="spinner"></div>
            <p>Loading available doctors...</p>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="error-wrapper" id="doctors-error-state">
            <div className="error-icon">⚠️</div>
            <p>{error}</p>
            <button className="retry-btn" onClick={fetchDoctors}>
              Try Again
            </button>
          </div>
        )}

        {/* Doctor lists */}
        {!loading && !error && (
          <>
            {filteredDoctors.length === 0 ? (
              <div className="no-results-wrapper" id="no-doctors-found">
                <div className="no-results-icon">🔍</div>
                <p>No doctors match your search query.</p>
              </div>
            ) : (
              <div className="doctors-grid" id="doctors-grid-container">
                {filteredDoctors.map((doctor) => (
                  <div className="doctor-card" key={doctor.id} id={`doctor-card-${doctor.id}`}>
                    <div className="doctor-avatar-wrapper">
                      {getSpecializationIcon(doctor.specialization)}
                    </div>
                    <h3 className="doctor-name">{doctor.doctorName}</h3>
                    <span className={`specialization-badge ${getSpecializationClass(doctor.specialization)}`}>
                      {doctor.specialization}
                    </span>
                    <button
                      className="book-now-btn"
                      onClick={() => handleBookAppointment(doctor.id, doctor.doctorName)}
                      id={`book-doctor-btn-${doctor.id}`}
                    >
                      Book Appointment
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}

export default AppointmentBooking;
