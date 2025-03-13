"use client"

// SignUp.js
"use client"

// SignUp.js
import { useState } from 'react';
import styles from './SignUpfw25.module.css'

const SignUp = ({ setIsLoading, setSubscriptionSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
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
      const res = await fetch('/api/subscribe-fw25P', {
        body: JSON.stringify(formData),
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
      setFormData({ firstName: '', lastName: '', email: '' });
      
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={subscribe} className={styles.form}>
      <p>GET EXCLUSIVE ACCESS TO OUR FW25 IMAGES:</p>
      <div className={styles.inputBox}>
        <input
          type="text"
          name="firstName"
          placeholder="First name"
          value={formData.firstName}
          onChange={handleChange}
          disabled={localLoading}
          required
          className={styles.input}
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last name"
          value={formData.lastName}
          onChange={handleChange}
          disabled={localLoading}
          required
          className={styles.input}
        />
      </div>
        <input
          type="email"
          name="email"
          placeholder="Your email"
          value={formData.email}
          onChange={handleChange}
          disabled={localLoading}
          required
          className={styles.input}
        />
        <button 
        className={styles.loadingButton}
          type="submit"
          disabled={localLoading}
        >
          {localLoading ? 'LOADING...' : 'ACCESS'}
        </button>  
      {message && isError && (
        <p className={styles.errorMessage}>
          {message}
        </p>
      )}
    </form>
  );
};

export default SignUp;