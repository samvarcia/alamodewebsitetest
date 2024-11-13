"use client"

// SignUp.js
import { useState } from 'react';
import styles from './SignUp.module.css'

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const subscribe = async (e) => {
    e.preventDefault();
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
        return;
      }

      setMessage(data.message);
      setEmail(''); // Clear the input on success
    } catch (err) {
      setIsError(true);
      setMessage('Failed to subscribe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={subscribe} className={styles.form}>
      <p>Keep up with à la Mode, subscribe to our newsletter: </p>
      <div className={styles.inputBox}>
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          required
          className=""
        />
        <button 
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Subscribing...' : 'Subscribe'}
        </button>  
      </div>
      {message && (
        <p>
          {message}
        </p>
      )}
    </form>
  );
};

export default SignUp;