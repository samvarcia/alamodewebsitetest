import { useState } from 'react';
import styles from './Form.module.css';
import Image from 'next/image';

export default function Form() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    parties: [],
    firstName: '',
    lastName: '',
    email: '',
    modelsLink: '',
    instagramLink: '',
    plusOne: false,
    plusOneName: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const parties = [
    { id: 'london', name: 'LONDON', imageWhite: '/london-party-white.svg', imageRed: '/london-party-red.svg' },
    { id: 'milan', name: 'MILAN', imageWhite: '/milan-party-white.svg', imageRed: '/milan-party-red.svg' },
    { id: 'paris', name: 'PARIS', imageWhite: '/paris-party-white.svg', imageRed: '/paris-party-red.svg' },
    { id: 'newyork', name: 'NEW YORK', imageWhite: '/newyork-party-white.svg', imageRed: '/newyork-party-red.svg' },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePartySelection = (partyId) => {
    setFormData(prev => ({
      ...prev,
      parties: prev.parties.includes(partyId)
        ? prev.parties.filter(id => id !== partyId)
        : [...prev.parties, partyId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form data:", formData);
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();
      console.log("Server response:", responseData);

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

  const handleNextStep = () => {
    if (formData.parties.length === 0) {
      alert('Please select at least one party to attend.');
      return;
    }
    setStep(2);
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
    });
    setStep(1);
    setIsSubmitted(false);
  };

  const renderPartySelection = () => (
    <div className={styles.partySelection}>
      <h2>Select the parties you will attend:</h2>
      <div className={styles.options}>
        {parties.map(party => (
          <div 
            key={party.id} 
            className={`${styles.partyOption} ${formData.parties.includes(party.id) ? styles.selected : ''}`}
            onClick={() => handlePartySelection(party.id)}
          >
            <Image 
              src={formData.parties.includes(party.id) ? party.imageRed : party.imageWhite} 
              alt={party.name} 
              width={300} 
              height={300} 
              className={styles.partyImg}
            />
            <span className={formData.parties.includes(party.id) ? styles.selectedText : ''}>{party.name}</span>
          </div>
        ))}
      </div>
      <button type="button" onClick={handleNextStep}>Next</button>
    </div>
  );

  const renderPersonalInfo = () => (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="text"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        required
        placeholder="First Name"
      />
      <input
        type="text"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
        required
        placeholder="Last Name"
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
        placeholder="Email"
      />
      <input
        type="url"
        name="modelsLink"
        value={formData.modelsLink}
        onChange={handleChange}
        placeholder="Models.com Link"
      />
      <input
        type="url"
        name="instagramLink"
        value={formData.instagramLink}
        onChange={handleChange}
        placeholder="Instagram Profile Link"
      />
      <label>
        <input
          type="checkbox"
          name="plusOne"
          checked={formData.plusOne}
          onChange={handleChange}
        />
        Bringing a plus one?
      </label>
      {formData.plusOne && (
        <input
          type="text"
          name="plusOneName"
          value={formData.plusOneName}
          onChange={handleChange}
          placeholder="Plus One's Name"
          required
        />
      )}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );

  const renderConfirmation = () => (
    <div className={styles.confirmation}>
      <h2>Thank you for your submission!</h2>
      <p>Your invitation is being approved. If approved, an email will be sent to {formData.email} with further details.</p>
      <button onClick={handleReset}>Submit Another Response</button>
    </div>
  );

  return (
    <div className={styles.formContainer}>
      {isSubmitted ? renderConfirmation() : (step === 1 ? renderPartySelection() : renderPersonalInfo())}
    </div>
  );
}