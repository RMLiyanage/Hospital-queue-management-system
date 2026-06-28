import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AppointmentBooking.css';

const TIME_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
  '05:00 PM',
];

function AppointmentBooking() {
  const [userName, setUserName] = useState('Patient');
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [bookingError, setBookingError] = useState(null);

  // Date/time selection state
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
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

  const handleSelectDoctor = (id) => {
    if (selectedDoctorId === id) {
      setSelectedDoctorId(null);
      setSelectedDate('');
      setSelectedTime('');
      setFieldErrors({});
    } else {
      setSelectedDoctorId(id);
      setSelectedDate('');
      setSelectedTime('');
      setFieldErrors({});
      setBookingSuccess(null);
      setBookingError(null);
    }
  };

  const handleConfirmBooking = async (id, doctorName) => {
    const errors = {};
    if (!selectedDate) errors.date = 'Please select a date.';
    if (!selectedTime) errors.time = 'Please select a time slot.';
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setBookingSuccess(null);
    setBookingError(null);

    try {
      const response = await axios.get(`http://localhost:8080/api/doctors/${id}/availability`);
      if (response.data && response.data.available) {
        setBookingSuccess(
          `Appointment confirmed with ${doctorName} on ${selectedDate} at ${selectedTime}!`
        );
        setSelectedDoctorId(null);
        setSelectedDate('');
        setSelectedTime('');
        setTimeout(() => setBookingSuccess(null), 5000);
      } else {
        setBookingError('Doctor is unavailable today.');
        setTimeout(() => setBookingError(null), 4000);
      }
    } catch (err) {
      console.error(err);
      setBookingError('Error checking availability. Please try again.');
      setTimeout(() => setBookingError(null), 4000);
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
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
        </svg>
      );
    }
    if (spec.includes('dent')) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2c-.5 0-1 .5-1 1v2c0 .5.5 1 1 1s1-.5 1-1V3c0-.5-.5-1-1-1Z"/>
          <path d="M6 8a5 5 0 0 1 10-2.5A5 5 0 0 1 20 8c0 3-1.5 5.5-2.5 7.5a6 6 0 0 0-.5 2v1a3 3 0 0 1-6 0v-1a6 6 0 0 0-.5-2C9.5 13.5 8 11 8 8Z"/>
        </svg>
      );
    }
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 16.5c-1.5 1.26-2.5 3.19-2.5 5.5h20c0-2.31-1-4.24-2.5-5.5"/>
        <path d="M12 2v10M8 8h8"/>
        <path d="M6 12a6 6 0 0 0 12 0"/>
      </svg>
    );
  };

  const todayStr = new Date().toISOString().split('T')[0];

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

        <header className="booking-header" id="booking-header">
          <div className="brand-section">
            <h1>ApexCare Portal</h1>
            <p>Queue &amp; Appointment Management System</p>
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

        {loading && (
          <div className="loading-wrapper" id="doctors-loading-state">
            <div className="spinner"></div>
            <p>Loading available doctors...</p>
          </div>
        )}

        {!loading && error && (
          <div className="error-wrapper" id="doctors-error-state">
            <div className="error-icon">⚠️</div>
            <p>{error}</p>
            <button className="retry-btn" onClick={fetchDoctors}>
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {filteredDoctors.length === 0 ? (
              <div className="no-results-wrapper" id="no-doctors-found">
                <div className="no-results-icon">🔍</div>
                <p>No doctors match your search query.</p>
              </div>
            ) : (
              <div className="doctors-grid" id="doctors-grid-container">
                {filteredDoctors.map((doctor) => {
                  const isExpanded = selectedDoctorId === doctor.id;
                  return (
                    <div
                      className={`doctor-card${isExpanded ? ' doctor-card--expanded' : ''}`}
                      key={doctor.id}
                      id={`doctor-card-${doctor.id}`}
                    >
                      <div className="doctor-avatar-wrapper">
                        {getSpecializationIcon(doctor.specialization)}
                      </div>
                      <h3 className="doctor-name">{doctor.doctorName}</h3>
                      <span className={`specialization-badge ${getSpecializationClass(doctor.specialization)}`}>
                        {doctor.specialization}
                      </span>

                      <button
                        className={`book-now-btn${isExpanded ? ' book-now-btn--active' : ''}`}
                        onClick={() => handleSelectDoctor(doctor.id)}
                        id={`book-doctor-btn-${doctor.id}`}
                      >
                        {isExpanded ? 'Cancel' : 'Book Appointment'}
                      </button>

                      {isExpanded && (
                        <div className="date-time-panel" id={`date-time-panel-${doctor.id}`}>
                          <div className="dt-divider"></div>

                          <div className="dt-field-group">
                            <label className="dt-label" htmlFor={`date-input-${doctor.id}`}>
                              Select Date
                            </label>
                            <input
                              type="date"
                              id={`date-input-${doctor.id}`}
                              className={`dt-input${fieldErrors.date ? ' dt-input--error' : ''}`}
                              value={selectedDate}
                              min={todayStr}
                              onChange={(e) => {
                                setSelectedDate(e.target.value);
                                if (fieldErrors.date) setFieldErrors(prev => ({ ...prev, date: null }));
                              }}
                            />
                            {fieldErrors.date && (
                              <span className="field-error" id={`date-error-${doctor.id}`}>
                                {fieldErrors.date}
                              </span>
                            )}
                          </div>

                          <div className="dt-field-group">
                            <label className="dt-label" htmlFor={`time-select-${doctor.id}`}>
                              Select Time
                            </label>
                            <select
                              id={`time-select-${doctor.id}`}
                              className={`dt-select${fieldErrors.time ? ' dt-select--error' : ''}`}
                              value={selectedTime}
                              onChange={(e) => {
                                setSelectedTime(e.target.value);
                                if (fieldErrors.time) setFieldErrors(prev => ({ ...prev, time: null }));
                              }}
                            >
                              <option value="">-- Choose a time slot --</option>
                              {TIME_SLOTS.map((slot) => (
                                <option key={slot} value={slot}>{slot}</option>
                              ))}
                            </select>
                            {fieldErrors.time && (
                              <span className="field-error" id={`time-error-${doctor.id}`}>
                                {fieldErrors.time}
                              </span>
                            )}
                          </div>

                          <button
                            className="confirm-btn"
                            onClick={() => handleConfirmBooking(doctor.id, doctor.doctorName)}
                            id={`confirm-booking-btn-${doctor.id}`}
                          >
                            Confirm Booking
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}

export default AppointmentBooking;
