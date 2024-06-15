"use client"
import Image from "next/image";
import styles from "./page.module.css";
import { motion, useAnimation } from 'framer-motion';
import Link from "next/link";

export default function Home() {


  return (
    <main className={styles.main}>
          <Image 
            src="/logoalamode.svg"
            width={280}
            height={150}
            className={styles.logo}
          />
        <div className={styles.heroContent}>
          <div></div>
          <div className={styles.heroText}>
            <h3 className={styles.heroTitle}>NEW YORK, LONDON,<br/> MILAN, PARIS</h3>
            <h3 className={styles.mobileHeroText}>NEW YORK<br />LONDON<br />MILAN<br />PARIS</h3>
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
        <section className={styles.slideThree}>
          <div className={styles.slideContent}>
          </div>
        </section>
        <section className={styles.slideTwo}>
          <div className={styles.slideContent}>
          </div>
        </section>
        <section className={styles.slideFour}>
          <div className={styles.slideContent}>
          </div>
        </section>
        <section className={styles.slideSix}>
          <div className={styles.slideContent}>
          </div>
        </section>
        <section className={styles.slideFive}>
          <div className={styles.slideContent}>
          </div>
        </section>
        <section className={styles.About}>
          <div className={styles.slideContent}>
            <div className={styles.aboutText}>
              <h4>ABOUT</h4>
              <p>Location à la mode is a model exclusive event series created to foster a sense of community within the often isolating modeling industry. As models travel with the fashion weeks internationally, we organize networking events and social functions that follow suit—from New York to London to Milan to Paris.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
