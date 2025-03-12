"use client"
import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import { motion, useAnimation } from 'framer-motion';
import Image from 'next/image';
import PhotoGridGallery from '../components/PhotoGridGallery.jsx'
import AboutFw25 from '../components/AboutFw25';
import Link from 'next/link';

const fw25Gallery = () => {
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
      <div className={styles.logoOverlay}>
        <Link href={"/fw25"}>
          <Image 
            src="https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5ziOWkkGWGeO9CyJiqhFg5S3kH6Q8afZc0DB1"
            width={150}
            height={100}
            priority
            className={styles.logo}
          />
        </Link>
      </div>
      <PhotoGridGallery/>
    </div>
  );
};

export default fw25Gallery;