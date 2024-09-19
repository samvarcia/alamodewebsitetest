import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import styles from './DonationComponent.module.css'

const stripePromise = loadStripe('pk_live_51Q0PE7JjQt0BXWdpcYd2YmdMA3O0BaUtkWZxJQhNPp35UApyP8cxgtzsGxYA8VCH4fOyk23rUvUqTI394PVOw6yV00UW94NLFH');

const DonationComponent = ({ onDonationComplete }) => {
  const [amount, setAmount] = useState('');
  const [selectedAmount, setSelectedAmount] = useState(null);

  const handleDonation = async (donationAmount) => {
      try {
     const stripe = await stripePromise;
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: donationAmount }),
      });


      const session = await response.json();
      
      
      await stripe.redirectToCheckout({ sessionId: session.id });
      if (error) {
        console.error('Stripe redirect error:', error);
      } else {
        onDonationComplete();
      }
    } catch (err) {
      console.error('Donation error:', err);
    }
  };

  const handleButtonClick = (preset) => {
    setSelectedAmount(preset);
    setAmount(preset.toString());
  };

  return (
    <div className={styles.donation}>
      <h2 className="text-2xl font-bold mb-4">Support us in creating more fun safe spaces for Models - Donate</h2>
      <div className={styles.buttonsCont}>
        {[15, 30, 100].map((preset) => (
          <button
            key={preset}
            onClick={() => handleButtonClick(preset)}
            className={`${styles.donaButton} ${selectedAmount === preset ? styles.selected : ''}`}
          >
            ${preset}
          </button>
        ))}
      </div>
      <div className={styles.donaCustomContainer}>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Pay what you can"
          className={styles.donaInput}
        />
        <button
          onClick={() => handleDonation(Number(amount))}
          className={styles.donateButton}
        >
          Donate
        </button>
      </div>
    </div>
  );
};

export default DonationComponent;