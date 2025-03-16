"use client"
import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import Image from 'next/image';
import PhotoGridGallery from '../components/PhotoGridGallery.jsx'
import { DateTime } from 'luxon'; // Import luxon for better timezone handling

const fw25Images = () => {
  const [hasAccess, setHasAccess] = useState(false);
  const [countdown, setCountdown] = useState('00:00:00:00');
  const [isExpired, setIsExpired] = useState(false);
  const [inputValue] = useState('Takem3b3h1ndthe5e3n');

  useEffect(() => {
    const updateCountdown = () => {
      // Get current time in EST
      const now = DateTime.now().setZone('America/New_York');
      
      // Set target to 7PM today in EST
      let target = now.set({
        hour: 19,
        minute: 0,
        second: 0,
        millisecond: 0
      });

      // If current time is past 7PM, the countdown should be at 0
      if (now >= target) {
        setCountdown('00:00:00:00');
        setIsExpired(true);
        return;
      }

      // Calculate the duration until target
      const diff = target.diff(now, ['hours', 'minutes', 'seconds']);
      
      // Format the countdown
      const hours = Math.floor(diff.hours);
      const minutes = Math.floor(diff.minutes);
      const seconds = Math.floor(diff.seconds);

      const formattedCountdown = `00:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      setCountdown(formattedCountdown);
    };

    updateCountdown();
    const intervalId = setInterval(updateCountdown, 1000);

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
          
          {isExpired ? (
            <div className={styles.thankYouMessage}>
              Thank you for stepping behind the seen, see you at the next one
            </div>
          ) : (
            <PhotoGridGallery />
          )}
          
          <div className={styles.stickyFooter}>
            <div className={styles.countdown}>{countdown}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default fw25Images;