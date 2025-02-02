import { useState } from 'react';
import styles from './ModalForm.module.css';
import Link from 'next/link';

const ModalForm = ({ isOpen, onClose, selectedCity }) => {
  const [formData, setFormData] = useState({
    parties: [],
    firstName: '',
    lastName: '',
    email: '',
    modelsLink: '',
    instagramLink: '',
    plusOne: false,
    plusOneName: '',
    agreeToTerms: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, parties: [selectedCity] }),
      });
  
      const responseData = await response.json();
      
      if (response.ok) {
        setIsSubmitted(true);
      } else {
        alert(`Error: ${responseData.error || 'Unknown error occurred'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert(`Error submitting form: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      parties: [],
      firstName: '',
      lastName: '',
      email: '',
      modelsLink: '',
      instagramLink: '',
      plusOne: false,
      plusOneName: '',
      agreeToTerms: false,
    });
    setIsSubmitted(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button 
          onClick={onClose}
          className={styles.closeButton}
        >
          ✕
        </button>

        {isSubmitting ? (
          <div className={styles.loadingState}>
            <h2>SUBMITTING, PLEASE WAIT...</h2>
          </div>
        ) : isSubmitted ? (
          <div className={styles.successState}>
            <h2>Thank you for your submission!</h2>
            <p>Your registration is being processed. If approved, an email will be sent to {formData.email} with further details.</p>
            <button 
              onClick={handleReset}
              className={styles.backButton}
            >
              GO BACK
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <h2 className={styles.title}>{selectedCity.toUpperCase()} FW 25</h2>
            
            <div className={styles.nameInputs}>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                placeholder="Name"
                className={styles.input}
              />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                placeholder="Last Name"
                className={styles.input}
              />
            </div>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Email"
              className={styles.input}
            />
            <input
              type="url"
              name="modelsLink"
              value={formData.modelsLink}
              onChange={handleChange}
              required
              placeholder="Models.com or Agency Profile Link"
              className={styles.input}
            />
            <input
              type="text"
              name="instagramLink"
              value={formData.instagramLink}
              onChange={handleChange}
              required
              placeholder="Instagram Handle"
              className={styles.input}
            />

            <div className={styles.plusOneSection}>
              <p>Bringing a plus one?</p>
              <div className={styles.plusOneButtons}>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, plusOne: true }))}
                  className={`${styles.plusOneButton} ${formData.plusOne ? styles.selected : ''}`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, plusOne: false, plusOneName: '' }))}
                  className={`${styles.plusOneButton} ${!formData.plusOne ? styles.selected : ''}`}
                >
                  No
                </button>
              </div>
            </div>

            {formData.plusOne && (
              <div>
                <input
                  type="text"
                  name="plusOneName"
                  value={formData.plusOneName}
                  onChange={handleChange}
                  placeholder="Plus One's Name"
                  required
                  className={styles.input}
                />
                <p className={styles.plusOneText}>Is your plus one a model? Please get them to sign up</p>
              </div>
            )}

            <div className={styles.termsSection}>
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                required
                id="agreeToTerms"
              />
              <label htmlFor="agreeToTerms">
                By signing up, I agree to the <Link href="/terms">Terms and Conditions</Link>
              </label>
            </div>

            <button 
              type="submit"
              className={styles.submitButton}
            >
              SUBMIT
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ModalForm;