import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://digital-phonebook-backend.onrender.com/api';

function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [contacts, setContacts] = useState([]);
  const [currentContact, setCurrentContact] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [phoneError, setPhoneError] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: ''
  });

  // Israeli phone number validation
  const validateIsraeliPhone = (phone) => {
    // Remove all non-digit characters
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Israeli mobile numbers: 05X-XXXXXXX (10 digits starting with 05)
    // Israeli landline: 0X-XXXXXXX (9 digits starting with 0, not 05)
    const mobilePattern = /^05[0-9]{8}$/;
    const landlinePattern = /^0[1-9][0-9]{7}$/;
    
    if (mobilePattern.test(cleanPhone)) {
      return { isValid: true, type: 'mobile' };
    } else if (landlinePattern.test(cleanPhone)) {
      return { isValid: true, type: 'landline' };
    } else {
      return { isValid: false, type: 'invalid' };
    }
  };

  const formatPhoneNumber = (phone) => {
    // Remove all non-digit characters
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Format based on length
    if (cleanPhone.length <= 3) {
      return cleanPhone;
    } else if (cleanPhone.length <= 6) {
      return cleanPhone.slice(0, 3) + '-' + cleanPhone.slice(3);
    } else if (cleanPhone.length <= 9) {
      return cleanPhone.slice(0, 3) + '-' + cleanPhone.slice(3);
    } else {
      return cleanPhone.slice(0, 3) + '-' + cleanPhone.slice(3);
    }
  };

  const handlePhoneChange = (e) => {
    const phone = e.target.value;
    const formattedPhone = formatPhoneNumber(phone);
    setFormData({...formData, phone: formattedPhone});
    
    // Clear error when user starts typing
    if (phoneError) {
      setPhoneError('');
    }
    
    // Validate phone number
    if (formattedPhone.trim()) {
      const validation = validateIsraeliPhone(formattedPhone);
      if (!validation.isValid) {
        setPhoneError('מספר טלפון לא תקין. אנא הכנס מספר ישראלי תקין (למשל: 050-1234567)');
      }
    }
  };

  const loadContacts = useCallback(async () => {
    setLoading(true);
    try {
      console.log('Loading contacts from:', `${API_BASE_URL}/contacts`);
      const params = new URLSearchParams();
      if (filter !== 'all') params.append('filter', filter);
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await axios.get(`${API_BASE_URL}/contacts?${params}`);
      console.log('Contacts loaded:', response.data);
      setContacts(response.data);
    } catch (error) {
      console.error('Error loading contacts:', error);
      console.error('Error details:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  }, [filter, searchTerm]);

  useEffect(() => {
    if (currentScreen === 'list') {
      loadContacts();
    }
  }, [currentScreen, loadContacts]);

  const showScreen = (screen) => {
    setCurrentScreen(screen);
    if (screen === 'home') {
      setFormData({ firstName: '', lastName: '', phone: '' });
      setCurrentContact(null);
      setPhoneError('');
    }
    if (screen === 'list') {
      setSearchTerm('');
      setFilter('all');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Validate phone number before submission
    const phoneValidation = validateIsraeliPhone(formData.phone);
    if (!phoneValidation.isValid) {
      setPhoneError('מספר טלפון לא תקין. אנא הכנס מספר ישראלי תקין (למשל: 050-1234567)');
      return;
    }
    
    setLoading(true);
    setPhoneError('');
    
    try {
      if (currentScreen === 'add') {
        console.log('Adding contact:', formData);
        const response = await axios.post(`${API_BASE_URL}/contacts`, formData);
        console.log('Contact added:', response.data);
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 2000);
        setFormData({ firstName: '', lastName: '', phone: '' });
        showScreen('home');
      } else if (currentScreen === 'edit') {
        console.log('Updating contact:', formData);
        const response = await axios.put(`${API_BASE_URL}/contacts/${currentContact.id}`, formData);
        console.log('Contact updated:', response.data);
        showScreen('list');
      }
    } catch (error) {
      console.error('Error saving contact:', error);
      console.error('Error details:', error.response?.data || error.message);
      alert('שגיאה בשמירת איש הקשר: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (id, event) => {
    event.stopPropagation();
    try {
      await axios.patch(`${API_BASE_URL}/contacts/${id}/favorite`);
      loadContacts();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const editContact = (contact) => {
    setCurrentContact(contact);
    setFormData({
      firstName: contact.firstName,
      lastName: contact.lastName,
      phone: contact.phone
    });
    setCurrentScreen('edit');
  };

  const cancelEdit = () => {
    setCurrentScreen('list');
  };

  const confirmDelete = (contact) => {
    setContactToDelete(contact);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setContactToDelete(null);
  };

  const deleteContact = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/contacts/${contactToDelete.id}`);
      closeDeleteModal();
      loadContacts(); // Reload the contact list
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const fullName = `${contact.firstName} ${contact.lastName}`.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    return fullName.includes(searchLower) || contact.phone.includes(searchLower);
  });

  const renderHomeScreen = () => (
    <div className="home-screen">
      <button className="home-btn" onClick={() => showScreen('add')}>
        ➕ הוספת איש קשר
      </button>
      <button className="home-btn" onClick={() => showScreen('list')}>
        📋 רשימת אנשי קשר
      </button>
    </div>
  );

  const renderAddScreen = () => (
    <div>
      <button className="back-btn" onClick={() => showScreen('home')}>
        ← חזרה למסך הבית
      </button>
      
      {showSuccessMessage && (
        <div className="success-message show">
          ✓ איש הקשר נשמר בהצלחה!
        </div>
      )}

      <div className="form-container">
        <h2 className="form-title">הוספת איש קשר חדש</h2>
        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label>שם פרטי</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>שם משפחה</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>מספר טלפון</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={handlePhoneChange}
              placeholder="050-1234567"
              required
              className={phoneError ? 'error' : ''}
            />
            {phoneError && <div className="error-message">{phoneError}</div>}
          </div>
          <div className="form-buttons">
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? 'שומר...' : 'שמור'}
            </button>
            <button type="button" className="btn-cancel" onClick={() => showScreen('home')}>
              ביטול
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderEditScreen = () => (
    <div>
      <button className="back-btn" onClick={cancelEdit}>← ביטול</button>
      
      <div className="form-container">
        <h2 className="form-title">עריכת איש קשר</h2>
        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label>שם פרטי</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>שם משפחה</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>מספר טלפון</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={handlePhoneChange}
              required
              className={phoneError ? 'error' : ''}
            />
            {phoneError && <div className="error-message">{phoneError}</div>}
          </div>
          <div className="form-buttons">
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? 'שומר...' : 'שמור שינויים'}
            </button>
            <button type="button" className="btn-cancel" onClick={cancelEdit}>
              ביטול
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderListScreen = () => (
    <div>
      <button className="back-btn" onClick={() => showScreen('home')}>
        ← חזרה למסך הבית
      </button>
      
      <div className="list-header">
        <h2 className="list-title">אנשי הקשר שלי</h2>
        <div className="contact-count">
          {contacts.length === 0 ? 'אין אנשי קשר' :
           contacts.length === 1 ? 'איש קשר אחד' :
           contacts.length === 2 ? '2 אנשי קשר' :
           `${contacts.length} אנשי קשר`}
        </div>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="חפש לפי שם או מספר טלפון..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="filter-tabs">
        <button 
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          הכל
        </button>
        <button 
          className={`filter-tab ${filter === 'favorites' ? 'active' : ''}`}
          onClick={() => setFilter('favorites')}
        >
          ⭐ מועדפים
        </button>
      </div>

      <div className="contact-table">
        {loading ? (
          <div className="empty-state">
            <p>טוען...</p>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="empty-state">
            <p>אין אנשי קשר להצגה</p>
          </div>
        ) : (
          filteredContacts.map(contact => (
            <div key={contact.id} className="contact-row">
              <span className="favorite-star" onClick={(e) => toggleFavorite(contact.id, e)}>
                {contact.isFavorite ? '⭐' : '☆'}
              </span>
              <span className="contact-name">{contact.firstName} {contact.lastName}</span>
              <span className="contact-phone">{contact.phone}</span>
              <div className="contact-actions">
                <button className="edit-btn" onClick={(e) => {editContact(contact); e.stopPropagation();}}>
                  ✏️ ערוך
                </button>
                <button className="delete-btn" onClick={(e) => {confirmDelete(contact); e.stopPropagation();}}>
                  🗑️ מחק
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );


  return (
    <div className="container">
      <div className="header">
        <h1>📱 אלפון דיגיטלי</h1>
      </div>

      <div className={`screen ${currentScreen === 'home' ? 'active' : ''}`}>
        {renderHomeScreen()}
      </div>

      <div className={`screen ${currentScreen === 'add' ? 'active' : ''}`}>
        {renderAddScreen()}
      </div>

      <div className={`screen ${currentScreen === 'list' ? 'active' : ''}`}>
        {renderListScreen()}
      </div>

      <div className={`screen ${currentScreen === 'edit' ? 'active' : ''}`}>
        {renderEditScreen()}
      </div>

      {/* Delete Confirmation Modal */}
      <div className={`modal ${showDeleteModal ? 'show' : ''}`}>
        <div className="modal-content">
          <h3 className="modal-title">⚠️ אישור מחיקה</h3>
          <p className="modal-text">
            האם אתה בטוח שברצונך למחוק את<br />
            <strong>{contactToDelete ? `${contactToDelete.firstName} ${contactToDelete.lastName}` : ''}</strong>?
          </p>
          <div className="modal-buttons">
            <button className="modal-btn modal-btn-confirm" onClick={deleteContact}>
              כן, מחק
            </button>
            <button className="modal-btn modal-btn-cancel" onClick={closeDeleteModal}>
              ביטול
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;