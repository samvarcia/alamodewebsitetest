"use client"
import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import Image from 'next/image';
import PhotoGridGallery from '../components/PhotoGridGallery.jsx'

const fw25Images = () => {
  const [hasAccess, setHasAccess] = useState(false);
  const [countdown, setCountdown] = useState('00:00:00:00');
  const [inputValue] = useState('Takem3b3h1ndthe5e3n');

  useEffect(() => {
    const updateCountdown = () => {
      // Get today's date
      const now = new Date();
      
      // Create target date for today at 7pm EST
      const target = new Date();
      target.setHours(19, 0, 0, 0); // 7pm
      // Adjust for EST (UTC-5)
      // target.setHours(target.getHours() + 5); // Convert from EST to UTC
      
      let diff = target.getTime() - now.getTime();
      
      // If it's already past 7pm today, show zeros
      if (diff <= 0) {
        setCountdown('00:00:00:00');
        return;
      }

      // Calculate time units
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      // Format the countdown string
      const formattedCountdown = `${String(days).padStart(2, '0')}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      setCountdown(formattedCountdown);
    };

    // Update immediately and then every second
    updateCountdown();
    const intervalId = setInterval(updateCountdown, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleAccess = () => {
    setHasAccess(true);
  };

  return (
    <div className={`${styles.container} ${hasAccess ? styles.containerAccess : styles.containerLanding}`}>
      {!hasAccess ? (
        <>
          <div className={styles.topLogo}>
            <Image 
              src="https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5ziOWkkGWGeO9CyJiqhFg5S3kH6Q8afZc0DB1"
              width={260}
              height={173}
              priority
              className={styles.logo}
            />
          </div>
          <div className={styles.landingContent}>
                <Image 
                  src="/BTS.svg"
                  width={380}
                  height={250}
                  priority
                  className={styles.bts}
                />
            <p>
              YOU'VE UNLOCKED EXCLUSIVE ACCESS. <br/>
              STEP IN AND SEE WHAT UNFOLDED IN PARIS.
            </p>
            <div className={styles.accessForm}>
              <input
                type="text"
                value={inputValue}
                readOnly
                className={styles.input}
              />
              <button 
                onClick={handleAccess}
                className={styles.accessButton}
              >
                ACCESS
              </button>
            </div>
          </div>

          <div className={styles.bottomCounter}>
            <div className={styles.countdown}>{countdown}</div>
          </div>
        </>
      ) : (
        <div className={styles.galleryContainer}>
          <div className={styles.stickyHeader}>
            <Image 
              src="https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5ziOWkkGWGeO9CyJiqhFg5S3kH6Q8afZc0DB1"
              width={260}
              height={173}
              priority
              className={styles.logo}
            />
          </div>
          
          <PhotoGridGallery />
          
          <div className={styles.stickyFooter}>
            <div className={styles.countdown}>{countdown}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default fw25Images;