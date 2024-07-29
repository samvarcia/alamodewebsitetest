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
        animate={{
          background:["radial-gradient(115.53% 100% at 50% 0%, rgba(0, 0, 0, 0.14) 25%, rgba(188, 1, 35, 1) 100%), #000",
          "radial-gradient(115.53% 100% at 50% 0%, rgba(0, 0, 0, 0.57) 30.62%, #BC0123 52.24%), #000", 
          "radial-gradient(115.53% 100% at 50% 0%, rgba(0, 0, 0, 0.14) 25%, rgba(188, 1, 35, 1) 100%), #000",]
        }}
        transition={{ ease: "easeInOut", duration: 5 }}
        >
        <h1>CHECK IN SS 25</h1>

        <Form/>
      </motion.section>
    </main>
  );
}
