// app/miami/page.js
"use client"
import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import { motion, useAnimation } from 'framer-motion';
import Image from 'next/image';

const RunawayPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [seatsLeft, setSeatsLeft] = useState();


  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const response = await fetch('/api/get-seats')
        const data = await response.json()
        if (response.ok) {
          setSeatsLeft(data.availableSeats)
        }
      } catch (error) {
        console.error('Error fetching seats:', error)
      }
    }

    fetchSeats()
  }, [])
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/subscribe-miami', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to subscribe');
      }

      setSuccess(true);
      setSeatsLeft(prev => Math.max(0, prev - 1));
      setEmail('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.main className={styles.mainContainer}
    animate={{
      background:["radial-gradient(115.53% 100% at 50% 0%, rgba(0, 0, 0, 0.14) 25%, rgba(188, 1, 35, 1) 100%), #000",
      "radial-gradient(115.53% 100% at 50% 0%, rgba(0, 0, 0, 0.57) 30.62%, #BC0123 52.24%), #000", 
      "radial-gradient(115.53% 100% at 50% 0%, rgba(0, 0, 0, 0.14) 25%, rgba(188, 1, 35, 1) 100%), #000",]
    }}
    transition={{ ease: "easeInOut", duration: 5 }}
    >
      
      {/* <div className={styles.contentWrapper}>
        
        <div className={styles.heroSection}>
          <Image 
            src="/à la mode Miami.png"
            width={380}
            height={250}
            priority
            className={styles.miami}
          />
          <h1 className={styles.title}>Art Basel Miami</h1>
          <p className={styles.subtitle}>
          MODELS RUN-AWAY™
          </p>
        </div>
        <Image 
            src="/miami2.png"
            width={380}
            height={250}
            priority
            className={styles.palm}
          />
        <div className={styles.registrationContainer}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputWrapper}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.input}
              />
            </div>
            
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Check In...' : 'Check In'}
            </button>
          </form>

          {/* Seats Counter 
          <div className={styles.seatsCounter}>
            <p className={styles.seatsCount}>
              Only {seatsLeft} seats remaining!
            </p>
            <p className={styles.seatsMessage}>
              Don't miss out - Check In to secure your spot
            </p>
          </div>


          {success && (
            <div className={styles.alert + ' ' + styles.successAlert}>
              Thank you for registering! Check your email for confirmation.
            </div>
          )}
          {error && (
            <div className={styles.alert + ' ' + styles.errorAlert}>
              {error}
            </div>
          )}
        </div>
      </div> */}
      <h1>TILL NEXT TIME</h1>
    </motion.main>
  );
};

export default RunawayPage;