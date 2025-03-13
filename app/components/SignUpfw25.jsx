"use client"

// SignUp.js
"use client"

// SignUp.js
import { useState } from 'react';
import styles from './SignUpfw25.module.css'

const SignUp = ({ setIsLoading, setSubscriptionSuccess }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  const subscribe = async (e) => {
    e.preventDefault();
    setLocalLoading(true);
    setIsLoading(true);
    setMessage('');
    setIsError(false);

    try {
      const res = await fetch('/api/subscribe', {
        body: JSON.stringify({ email }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });

      const data = await res.json();

      if (!res.ok) {
        setIsError(true);
        setMessage(data.error || 'Something went wrong');
        setIsLoading(false);
        setLocalLoading(false);
        return;
      }

      setMessage(data.message);
      setEmail('');
      
      setTimeout(() => {
        setSubscriptionSuccess(true);
      }, 1500);
      
    } catch (err) {
      setIsError(true);
      setMessage('Failed to subscribe. Please try again.');
      setIsLoading(false);
      setLocalLoading(false);
    }
  };

  return (
    <form onSubmit={subscribe} className={styles.form}>
      <p>GET ACCESS TO à la mode FW25 IMAGES:</p>
      <div className={styles.inputBox}>
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={localLoading}
          required
          className=""
        />
        <button 
          type="submit"
          disabled={localLoading}
        >
          {localLoading ? 'LOADING...' : 'ACCESS'}
        </button>  
      </div>
      {message && isError && (
        <p className={styles.errorMessage}>
          {message}
        </p>
      )}
    </form>
  );
};

export default SignUp;