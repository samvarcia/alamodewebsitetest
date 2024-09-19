"use client"
import Image from "next/image";
import styles from "./page.module.css";
import { motion, useAnimation } from 'framer-motion';
import Link from "next/link";
import { useState } from "react";
import Form from "../components/Form";

export default function Page() {
    
  return (
    <motion.main className={styles.checkin}
    
    >
        <motion.section className={styles.checkinHero}
        animate={{
          background:["radial-gradient(115.53% 100% at 50% 0%, rgba(0, 0, 0, 0.14) 25%, rgba(112, 0, 22, 1) 100%), #000",
          "radial-gradient(115.53% 100% at 50% 0%, rgba(0, 0, 0, 0.57) 30.62%, #700014 52.24%), #000", 
          "radial-gradient(115.53% 100% at 50% 0%, rgba(0, 0, 0, 0.14) 25%, rgba(112, 0, 22, 1) 100%), #000",]
        }}
        transition={{ ease: "easeInOut", duration: 5 }}
        >
              <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={styles.confirmation}
    >
        <Link href="/">
            <Image 
            src="/logoalamode.svg"
            width={280}
            height={150}
            priority
            className={styles.logo}
            />
        </Link>
      <h1>Thank you for your submission!</h1>
      <p>Your registration is being processed. If approved, an email will be sent to you with further details.</p>
      <Link href="/checkin" className={styles.link}>
            <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={styles.confirmationBtn}
            >
                GO BACK
            </motion.button>
        </Link>
      
    </motion.div>
      </motion.section>
    
    </motion.main>
  );
}
