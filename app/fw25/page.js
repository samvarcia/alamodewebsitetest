"use client"
import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import Image from 'next/image';
import SignUpfw25 from '../components/SignUpfw25';
import { WorldMapSVG } from '../components/WorldMapSVG';

const FwPage = () => {
  const [showFixedLogo, setShowFixedLogo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [subscriptionSuccess, setSubscriptionSuccess] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const viewportHeight = window.innerHeight;
      const scrollPosition = window.scrollY;
      setShowFixedLogo(scrollPosition > viewportHeight * 0.8);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGoBack = () => {
    setSubscriptionSuccess(false);
    setIsLoading(false);
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.mainContent}> 
          {!isLoading && !subscriptionSuccess && (
            <>
              <div className={styles.logoContainer}>
                <Image 
                  src="https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5ziOWkkGWGeO9CyJiqhFg5S3kH6Q8afZc0DB1"
                  width={380}
                  height={250}
                  priority
                  className={styles.logo}
                />
                <Image 
                  src="/bts.svg"
                  width={380}
                  height={250}
                  priority
                  className={styles.bts}
                />
              </div>
              <div className={styles.check}>
                <SignUpfw25 
                  setIsLoading={setIsLoading} 
                  setSubscriptionSuccess={setSubscriptionSuccess}
                />
              </div>
            </>
          )}
          
          {isLoading && !subscriptionSuccess && (
            <>
              <div className={styles.mapWrapper}>
                <svg
                  viewBox="0 0 2057 1242"
                  xmlns="http://www.w3.org/2000/svg"
                  className={styles.map}
                  preserveAspectRatio="xMidYMid meet"
                >
                  <WorldMapSVG isModalOpen={true} isLoading={true} />
                </svg>
              </div>
              <div className={styles.loadingText}>
                LOADING...
              </div>
            </>
          )}

          {subscriptionSuccess && (
            <>
              <div className={styles.mapWrapper}>
                <svg
                  viewBox="0 0 2057 1242"
                  xmlns="http://www.w3.org/2000/svg"
                  className={styles.map}
                  preserveAspectRatio="xMidYMid meet"
                >
                  <WorldMapSVG isModalOpen={true} isLoading={true} />
                </svg>
              </div>
              <div className={styles.successContent}>
                <h2 className={styles.successTitle}>YOU’RE IN</h2>
                <p className={styles.successMessage}>
                Few get to experience à la mode, but you’re about to see what happens
                behind the seen. Stay tuned—when its time, you'll be the first to know. 
                Keep an eye on your inbox.                
                </p>
                <button onClick={handleGoBack} className={styles.goBackButton}>
                  GO BACK
                </button>
              </div>
            </>
          )}
        </div>
      </main> 
    </div>
  );
};

export default FwPage;