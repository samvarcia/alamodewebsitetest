import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import styles from './DonationComponent.module.css'

// Replace with your Stripe publishable key
const stripePromise = loadStripe('pk_test_51Q0PE7JjQt0BXWdpgTOC5qX7J0D4kUmH9JY8nMcrpeX4Alx2huSrvB1oumTeVoORUnDtFojjIU3e00RGYkqyMHox00KaDOEU6h');

const DonationComponent = () => {
  const [amount, setAmount] = useState('');
  const [selectedAmount, setSelectedAmount] = useState(null);

  const handleDonation = async (donationAmount) => {
    const stripe = await stripePromise;
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: donationAmount }),
    });

    const session = await response.json();
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.error(result.error.message);
    }
  };

  const handleButtonClick = (preset) => {
    setSelectedAmount(preset);
    setAmount(preset)
  };

  return (
    <div className={styles.donation}>
      <h2 className="text-2xl font-bold mb-4">Donation Message</h2>
      <div className={styles.buttonsCont}>
        {[25, 50, 100].map((preset) => (
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
          placeholder="Custom amount"
          className={styles.donaInput}
        />
        <button
          onClick={() => handleDonation(Number(amount))}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Donate
        </button>
      </div>
    </div>
  );
};

export default DonationComponent;