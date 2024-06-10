"use client"
import Image from "next/image";
import styles from "./page.module.css";
import { motion, useAnimation } from 'framer-motion';
import Link from "next/link";

export default function Home() {


  return (
    <main className={styles.main}>
        
        <div className={styles.heroContent}>
          <Image 
            src="/logoalamode.svg"
            width={250}
            height={100}
          />
          <div className={styles.heroText}>
            <h3>NEW YORK, LONDON,<br/> MILAN, PARIS</h3>
            <p>...PRACTICING MY MODEL WALK</p>
          </div>
        </div>
      <div className={styles.slides}>
      <motion.section className={styles.hero}
        animate={{
          background:["radial-gradient(115.53% 100% at 50% 0%, rgba(0, 0, 0, 0.14) 25%, rgba(188, 1, 35, 1) 100%), #000",
          "radial-gradient(115.53% 100% at 50% 0%, rgba(0, 0, 0, 0.57) 30.62%, #BC0123 52.24%), #000", 
          "radial-gradient(115.53% 100% at 50% 0%, rgba(0, 0, 0, 0.14) 25%, rgba(188, 1, 35, 1) 100%), #000",]
        }}
        transition={{ ease: "easeInOut", duration: 5 }}
        >
        
      </motion.section>
        <section className={styles.slideOne}>
          <div className={styles.slideContent}>
          </div>
        </section>
        <section className={styles.slideTwo}>
          <div className={styles.slideContent}>
          </div>
        </section>
        <section className={styles.slideThree}>
          <div className={styles.slideContent}>
          </div>
        </section>
        <section className={styles.slideFour}>
          <div className={styles.slideContent}>
          </div>
        </section>
        <section className={styles.slideFive}>
          <div className={styles.slideContent}>
          </div>
        </section>
      </div>
    </main>
  );
}
