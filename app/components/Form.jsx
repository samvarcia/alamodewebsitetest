import { useState, useEffect } from 'react';
import styles from './Form.module.css';
import Image from 'next/image';
import Link from "next/link";
import { motion, AnimatePresence } from 'framer-motion';

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
  const [currentGlassStage, setCurrentGlassStage] = useState(0);
  
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

  useEffect(() => {
    let timer;
    if (isSubmitting) {
      timer = setInterval(() => {
        setCurrentGlassStage((prevStage) => (prevStage + 1) % glassStages.length);
      }, 1500); // Change stage every 1.5 seconds for a slower animation
    } else {
      setCurrentGlassStage(0);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isSubmitting]);
  
  const AnimatedGlass = () => {
    return (
      <div className={styles.glassContainer}>
        {glassStages.map((src, index) => (
          <motion.div
            key={src}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              opacity: index === currentGlassStage ? 1 : 0,
            }}
            animate={{ opacity: index === currentGlassStage ? 1 : 0 }}
            transition={{ duration: 1, ease: "easeInOut" }} // Longer, smoother transition
          >
            <Image 
              src={src}
              alt={`Glass fill stage ${index}`}
              width={100}
              height={100}
              className={styles.glass}
            />
          </motion.div>
        ))}
      </div>
    );
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePartySelection = (partyId) => {
    if (partyId !== 'London') {
      setFormData(prev => ({
        ...prev,
        parties: [partyId]
      }));
      
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
    setIsSubmitting(true);
    
    try {
      // Simulate a submission process
      await new Promise(resolve => setTimeout(resolve, 3000));
  
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      const responseData = await response.json();
      console.log("Server response:", responseData);
  
      if (response.ok) {
        await new Promise(resolve => setTimeout(resolve, 500)); // Wait for final animation
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
    });
    setStep(1);
    setIsSubmitted(false);
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
        {parties.map(party => (
          <motion.div 
            key={party.id} 
            className={`
              ${styles.partyOption} 
              ${formData.parties.includes(party.id) ? styles.selected : ''}
              ${party.id === 'London' ? styles.disabled : ''}
            `}
            onClick={party.id !== 'London' ? () => handlePartySelection(party.id) : undefined}
            whileHover={party.id !== 'London' ? { scale: 1.05 } : {}}
            transition={{ duration: 0.3 }}
            whileTap={party.id !== 'London' ? { scale: 0.95 } : {}}
            style={party.id === 'London' ? { cursor: 'not-allowed'} : {}}
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
        ))}
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
          placeholder="Models.com or Agency Profile Link"
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
      </div>
      <motion.button 
        type="submit" 
        disabled={isSubmitting}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.5 }}
      >
        <h3>
          {isSubmitting ? 'SUBMITTING, PLEASE WAIT...' : 'SUBMIT'}
        </h3>
      </motion.button>
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
      <motion.button 
        onClick={handleReset}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.5 }}
      >
        GO BACK
      </motion.button>
    </motion.div>
  );

  const renderIsSubmitting = () => {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={styles.submitting}
      >
        <div className={styles.submittingContent}>
          <AnimatedGlass />
          <h1>SUBMITTING, PLEASE WAIT...</h1>
        </div>
      </motion.div>
    );
  };

  return (
    <div className={styles.formContainer}>
      {step === 2 && !isSubmitted && !isSubmitting && (
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
        {isSubmitting ? renderIsSubmitting() : 
          (isSubmitted ? renderConfirmation() : 
            (step === 1 ? renderPartySelection() : renderPersonalInfo())
          )
        }
      </AnimatePresence>
    </div>
  );
}