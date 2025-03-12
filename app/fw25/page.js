"use client"
import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import { motion, useAnimation } from 'framer-motion';
import Image from 'next/image';
import PhotoGrid from '../components/PhotoGrid.jsx'
import AboutFw25 from '../components/AboutFw25';
import Link from 'next/link';
import SignUpfw25 from '../components/SignUpfw25'

const FwPage = () => {
  const [showFixedLogo, setShowFixedLogo] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Get the height of the viewport
      const viewportHeight = window.innerHeight;
      // Get current scroll position
      const scrollPosition = window.scrollY;

      // Show fixed logo when we've scrolled past 80% of the first viewport
      setShowFixedLogo(scrollPosition > viewportHeight * 0.8);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {/* <Link href={"/fw25/checkin"}>
          <div className={styles.checkinDot}></div>
        </Link> */}
        <div className={styles.mainContent}> 
          <Image 
            src="https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5ziOWkkGWGeO9CyJiqhFg5S3kH6Q8afZc0DB1"
            width={380}
            height={250}
            priority
            className={styles.logo}
          />
          {/* <div className={styles.citiesList}>
            <ul>
              <li>
                <Image 
                  src="/newyorksvg.svg"
                  width={150}
                  height={50}
                  priority
                  style={{ width: '100%', height: '100%' }}
                />
              </li>
              <li>
                <Image 
                    src="/londonsvg.svg"
                    width={150}
                    height={50}
                    priority
                    style={{ width: '100%', height: '100%' }}
                  />
              </li>
              <li>
                <Image 
                    src="/milansvg.svg"
                    width={150}
                    height={50}
                    priority
                    style={{ width: '100%', height: '100%' }}
                  />
              </li>
              <li>
                <Image 
                    src="/parissvg.svg"
                    width={150}
                    height={50}
                    priority
                    style={{ width: '100%', height: '100%' }}
                  />
              </li>
            </ul>
          </div> */}
          <div className={styles.check}>
            <SignUpfw25/>
          </div>
        </div>
      </main> 

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showFixedLogo ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 100 }}
      >
        <Image 
          src="https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5ziOWkkGWGeO9CyJiqhFg5S3kH6Q8afZc0DB1"
          width={150}
          height={100}
          priority
          className={`${styles.fixedLogo} ${showFixedLogo ? styles.fixedLogoVisible : ''}`}
        />
      </motion.div>

      <section>
        <PhotoGrid/>
      </section>
      <section>
        <AboutFw25/>
      </section>
    </div>
  );
};

export default FwPage;