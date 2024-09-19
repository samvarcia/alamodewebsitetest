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
      
      if (session.error) {
        throw new Error(session.error);
      }

      const result = await stripe.redirectToCheckout({ sessionId: session.id });
      
      if (result.error) {
        throw new Error(result.error.message);
      }
      
      onDonationComplete();
    } catch (err) {
      console.error('Donation error:', err);
    }}

  const handleButtonClick = (preset) => {
    setSelectedAmount(preset);
    setAmount(preset.toString());
  };

  return (
    <div className={styles.donation}>
      <h2 className="text-2xl font-bold mb-4">DONATE - SUPPORT US IN CREATING A SAFE SPACE FOR MODELS</h2>
      <p>Your contribution directly supports us to continue to create unforgettable moments that empower fellow models globally. By donating, you also contribute to fostering a vibrant, inclusive community where models celebrate, connect and support one another. Join us in shaping the next chapter of fashion -every contribution makes a difference!</p>
      <div className={styles.buttonsCont}>
        {[10, 35, 50].map((preset) => (
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
          placeholder="$  PAY WHAT YOU CAN"
          className={styles.donaInput}
        />
      </div>
        <button
          onClick={() => handleDonation(Number(amount))}
          className={styles.donateButton}
        >
          DONATE
        </button>
    </div>
  );
};

export default DonationComponent;