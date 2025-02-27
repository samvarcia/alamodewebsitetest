"use client"
import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import { motion, useAnimation } from 'framer-motion';
import Image from 'next/image';
import WorldMap from '@/app/components/WorldMap';
import Link from 'next/link';
const checkin = () => {
 
  return (
    <div className={styles.container}>
      <motion.div
        initial={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 2 }}
      >
        <Link href={"/fw25"}>
          <Image 
            src="https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5ziOWkkGWGeO9CyJiqhFg5S3kH6Q8afZc0DB1"
            width={150}
            height={100}
            priority
            className={styles.fixedLogo}
          />
        </Link>
      </motion.div>
      <WorldMap/>
    </div>
  );
};

export default checkin;