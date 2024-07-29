"use client"
import Image from "next/image";
import styles from "./page.module.css";
import { motion, useAnimation } from 'framer-motion';
import Link from "next/link";
import { useState } from "react";
import Form from "../components/Form";

export default function Page() {
    
  return (
    <main className={styles.checkin}>
        <Image 
            src="/logoalamode.svg"
            width={280}
            height={150}
            priority
            className={styles.logo}
          />
        <motion.section className={styles.checkinHero}
        
        >
        <Form/>
      </motion.section>
    </main>
  );
}
