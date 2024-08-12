import { useState } from 'react';
import styles from './Form.module.css';
import Image from 'next/image';
import Link from "next/link";

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
    { id: 'New York', name: 'NEW YORK', imageWhite: '/newyork-party-white.svg', imageRed: '/newyork-party-red.svg' },
    { id: 'London', name: 'LONDON', imageWhite: '/london-party-white.svg', imageRed: '/london-party-red.svg' },
    { id: 'Milan', name: 'MILAN', imageWhite: '/milan-party-white.svg', imageRed: '/milan-party-red.svg' },
    { id: 'Paris', name: 'PARIS', imageWhite: '/paris-party-white.svg', imageRed: '/paris-party-red.svg' },
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
      parties: [partyId]
    }));
    
    // Delay the transition to the next step
    setTimeout(() => {
      setStep(2);
    }, 800); // 500ms delay, adjust as needed
  };
  const handleBackToSelector = () => {
    setStep(1);
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

  const renderSelectedParty = () => {
    const selectedParty = parties.find(party => party.id === formData.parties[0]);
    if (!selectedParty) return null;
  
    return (
      <div className={styles.selectedParty} style={{ marginBottom: "20px", display: "flex", gap: "5px", alignItems: "flex-start", flexDirection: "column"}}>
        
        <h2>{selectedParty.name} SS 25</h2>
      </div>
    );
  };

  const renderPartySelection = () => (
    <div className={styles.partySelection}>
      <h1>JOIN US IN:</h1>
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
              layout="responsive"
            />
            <h3 className={formData.parties.includes(party.id) ? styles.selectedText : ''}>{party.name}</h3>
          </div>
        ))}
      </div>
      {/* <button type="button" onClick={handleNextStep}>CONTINUE</button> */}
    </div>
  );

  const renderPersonalInfo = () => (
    <form onSubmit={handleSubmit} className={styles.form}>
      {renderSelectedParty()}
      <div className={styles.nameInfo}>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
          placeholder="Name"
        />
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
          placeholder="Last Name"
        />
      </div>
      <div className={styles.extrainfo}>
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
          placeholder="Models.com or Agency Profile"
        />
        <input
          type="text"
          name="instagramLink"
          value={formData.instagramLink}
          onChange={handleChange}
          placeholder="Instagram Handle"
        />
        <div className={styles.plusOneSelection}>
          <p>Bringing a plus one?</p>
          <div className={styles.plusOneOptions}>
          <span 
            className={`${styles.plusOneOption} ${formData.plusOne ? styles.selected : ''}`}
            onClick={() => setFormData(prev => ({ ...prev, plusOne: true }))}
          >
            Yes
          </span>
          <span 
            className={`${styles.plusOneOption} ${!formData.plusOne ? styles.selected : ''}`}
            onClick={() => setFormData(prev => ({ ...prev, plusOne: false, plusOneName: '' }))}
          >
            No
          </span>
        </div>
        </div>
        {formData.plusOne && (
          <div className={styles.plusoneDiv}>
              <input
                type="text"
                name="plusOneName"
                value={formData.plusOneName}
                onChange={handleChange}
                placeholder="Plus One's Name"
                required
                className={formData.plusOne ? styles.visible : ''}
              />
              <p>Is your plus one a model? Please get them sign up</p>
          </div>
        )}
      </div>
      <button type="submit" disabled={isSubmitting}>
        <h3>
          {isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}
        </h3>
      </button>
    </form>
  );

  const renderConfirmation = () => (
    <div className={styles.confirmation}>
      <h1>Thank you for your submission!</h1>
      <p>Your invitation is under review. If approved, an email will be sent to {formData.email} with further details.</p>
      <button onClick={handleReset}>GO BACK</button>
    </div>
  );
  const selectedParty = parties.find(party => party.id === formData.parties[0]);

  return (
    <div className={styles.formContainer}>
        {step === 2 && (
      <div className={styles.backArrow} onClick={handleBackToSelector} style={{ cursor: "pointer" }}>
        <p>Back</p>
      </div>
    )}
      <Link href="/">
        <Image 
          src="/logoalamode.svg"
          width={280}
          height={150}
          priority
          className={styles.logo}
        />
      </Link>
      {isSubmitted ? renderConfirmation() : (step === 1 ? renderPartySelection() : renderPersonalInfo())}
    </div>
  );
}