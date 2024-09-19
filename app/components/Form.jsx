import { useState, useEffect } from 'react';
import styles from './Form.module.css';
import Image from 'next/image';
import Link from "next/link";
import { motion, AnimatePresence } from 'framer-motion';
import DonationComponent from './DonationComponent'

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
    agreeToTerms: false,

  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentGlassStage, setCurrentGlassStage] = useState(0);
  const [showDonation, setShowDonation] = useState(false);
  const [hasDonated, setHasDonated] = useState(false);
  
  const parties = [
    { id: 'New York City', name: 'NEW YORK', imageWhite: '/newyork-party-white.svg', imageRed: '/newyork-party-red.svg' },
    { id: 'London', name: 'LONDON', imageWhite: '/london-party-white.svg', imageRed: '/london-party-red.svg' },
    { id: 'Milan', name: 'MILAN', imageWhite: '/milan-party-white.svg', imageRed: '/milan-party-red.svg' },
    { id: 'Paris', name: 'PARIS', imageWhite: '/paris-party-white.svg', imageRed: '/paris-party-red.svg' },
  ];

  const glassStages = [
    '/empty-glass.svg',
    '/quarter-full-glass.svg',
    '/half-full-glass.svg',
    '/full-glass.svg'
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

    if (partyId === 'London' || partyId === 'Milan') {
      setTimeout(() => {
        setStep(3); // Step 3 will be the custom message screen
      }, 800);
    } else {
      setTimeout(() => {
        setStep(2);
      }, 800);
    }
  };
  const handleBackToSelector = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submission started");
    setShowDonation(true);
    
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
        console.error(`Error: ${responseData.error || 'Unknown error occurred'}`);
      }
    } catch (error) {
      console.error('Error:', error);
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
    });
    setStep(1);
    setIsSubmitted(false);
    setShowDonation(false);
    setHasDonated(false);
  };

  const renderDonation = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={styles.donationContainer}
    >
      <DonationComponent onDonationComplete={handleDonationComplete} />
      <motion.button 
        onClick={handleSkipDonation}
        // whileHover={{ scale: 1.05 }}
        // whileTap={{ scale: 0.95 }}
        className={styles.skipButton}
      >
        NO THANKS
      </motion.button>
    </motion.div>
  );

  const renderCustomMessage = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={styles.customMessage}
    >
      <h1>TRY AGAIN NEXT SEASON</h1>
      <motion.div 
          className={styles.backMessage} 
          onClick={handleBackToSelector} 
          style={{ cursor: "pointer" }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Image
              width={40}
              height={40}
              src="/backIcon.svg"
              className={styles.backMessage}
            />
        </motion.div>
    </motion.div>
  );

  const handleDonationComplete = () => {
    setHasDonated(true);
    setShowDonation(false);
  };

  const handleSkipDonation = () => {
    setShowDonation(false);
  };


  const renderSelectedParty = () => {
    const selectedParty = parties.find(party => party.id === formData.parties[0]);
    if (!selectedParty) return null;
  
    return (
      <motion.div 
        initial={{ opacity: 0,  }}
        animate={{ opacity: 1, }}
        exit={{ opacity: 0 }}
        className={styles.selectedParty} 
        style={{ marginBottom: "20px", display: "flex", gap: "5px", alignItems: "flex-start", flexDirection: "column"}}
      >
        <h2>{selectedParty.name} SS 25</h2>
      </motion.div>
    );
  };

  const renderPartySelection = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
      className={styles.partySelection}
    >
      <h1>JOIN US IN:</h1>
      <div className={styles.options}>
        {parties.map(party => {
          // const isDisabled = party.id === 'London' || party.id === 'Milan';
          return (
            <motion.div 
              key={party.id} 
              className={`
                ${styles.partyOption} 
                ${formData.parties.includes(party.id) ? styles.selected : ''}
              `}
              onClick={ () => handlePartySelection(party.id) }
              whileHover={{ scale: 1.05 } }
              transition={{ duration: 0.3 }}
              whileTap={{ scale: 0.95 } }
              // style={isDisabled ? { cursor: 'not-allowed'} : {}}
            >
              <Image 
                src={formData.parties.includes(party.id) ? party.imageRed : party.imageWhite} 
                alt={party.name} 
                width={150} 
                height={300} 
                className={styles.partyImg}
              />
              <h3 className={formData.parties.includes(party.id) ? styles.selectedText : ''}>
                {party.name}
              </h3>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
  const renderPersonalInfo = () => (
    <motion.form 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2 }}
      onSubmit={handleSubmit} 
      className={styles.form}
    >
      {renderSelectedParty()}
      <div className={styles.nameInfo}>
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
          required
          placeholder="Models.com or Agency Profile Link"
        />
        <input
          type="text"
          name="instagramLink"
          value={formData.instagramLink}
          onChange={handleChange}
          required
          placeholder="Instagram Handle"
        />
        <div className={styles.plusOneSelection}>
          <p>Bringing a plus one?</p>
          <div className={styles.plusOneOptions}>
            <motion.span 
              className={`${styles.plusOneOption} ${formData.plusOne ? styles.selected : ''}`}
              onClick={() => setFormData(prev => ({ ...prev, plusOne: true }))}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.5 }}
            >
              Yes
            </motion.span>
            <motion.span 
              className={`${styles.plusOneOption} ${!formData.plusOne ? styles.selected : ''}`}
              onClick={() => setFormData(prev => ({ ...prev, plusOne: false, plusOneName: '' }))}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              No
            </motion.span>
          </div>
        </div>
        <AnimatePresence>
          {formData.plusOne && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={styles.plusoneDiv}
            >
              <input
                type="text"
                name="plusOneName"
                value={formData.plusOneName}
                onChange={handleChange}
                placeholder="Plus One's Name"
                required
                className={formData.plusOne ? styles.visible : ''}
              />
              <p>Is your plus one a model? Please get them to sign up</p>
            </motion.div>
          )}
        </AnimatePresence>
        <div className={styles.termsCheckbox}>
          <input
            type="checkbox"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleChange}
            required
            id="agreeToTerms"
          />
          <label htmlFor="agreeToTerms">
            By signing up, I agree to the <a href="/Terms and Conditions.pdf" target="_blank" rel="noopener noreferrer">Terms and Conditions</a>
          </label>
        </div>
      </div>
      
      <motion.button 
        type="submit" 
        disabled={isSubmitting}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.5 }}
      >
        <h3>
          SUBMIT        
        </h3>
      </motion.button>
      {formData.parties.includes('New York City') && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={styles.zoraText}
        >
          NEW YORK à la mode IS POWERED BY{' '}
          <Link href="https://zora.co/invite/0xE4A0a7aeb42454A05f669d4DE85BcB29eE19dC84" target="_blank" >
            ZORA
          </Link>
        </motion.p>
      )}
    </motion.form>
  );

  const renderConfirmation = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={styles.confirmation}
    >
      <h1>Thank you for your submission!</h1>
      <p>Your registration is being processed. If approved, an email will be sent to {formData.email} with further details.</p>
      {hasDonated && <p>Thank you for your donation!</p>}
      <motion.button 
        onClick={handleReset}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={styles.confirmationBtn}
      >
        GO BACK
      </motion.button>
    </motion.div>
  );

  return (
    <div className={styles.formContainer}>
    {step !== 1 && (
        <motion.div 
          className={styles.backArrow} 
          onClick={handleBackToSelector} 
          style={{ cursor: "pointer" }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Image
              width={40}
              height={40}
              src="/backIcon.svg"
              className={styles.back}
            />
        </motion.div>
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
      <AnimatePresence mode="wait">
      {showDonation ? renderDonation() : 
          (isSubmitted ? renderConfirmation() : 
            (step === 1 ? renderPartySelection() : 
              (step === 3 ? renderCustomMessage() : renderPersonalInfo())
            )
          )
        }
      </AnimatePresence>
    </div>
  );
}