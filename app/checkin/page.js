"use client"
import Image from "next/image";
import styles from "./page.module.css";
import { motion, useAnimation } from 'framer-motion';
import Link from "next/link";
import { useState } from "react";

export default function Page() {
    const [name, setName] = useState('');
    const [lastName, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [modelsLink, setModelsLink] = useState('');
    const [instagram, setInstagram] = useState('');
    const [addOn, setAddOns] = useState('');
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });
      if (res.ok) {
        alert('Submission successful!');
        setName('');
        setEmail('');
      } else {
        alert('Submission failed.');
      }
    };
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
        <h1>LONDON SS 25</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formName}>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    required
                />
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastname(e.target.value)}
                        placeholder="Last Name"
                        required
                    />
            </div>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
            />
            <input
                type="text"
                value={modelsLink}
                onChange={(e) => setModelsLink(e.target.value)}
                placeholder="Models.com"
                required
            />
            <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="Instagram"
                required
            />
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Add on"
                required
            />
            <button type="submit">Submit</button>
        </form>
            
      </motion.section>
    </main>
  );
}
