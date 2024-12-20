"use client"
import Image from "next/image";
import styles from "./page.module.css";
import { motion, useAnimation } from 'framer-motion';
import Link from "next/link";
import SignUp from "./components/SignUp";

export default function Home() {
  return (
    <main className={styles.main}>
          <Image 
            src="/logoalamode.svg"
            width={280}
            height={150}
            priority
            className={styles.logo}
          />
          {/* <Link href={"/checkin"}>
            <Image
              width={45}
              height={65}
              src="/newcup.svg"
              className={styles.check}
            />
          </Link> */}
          <div className={styles.check}>
            <SignUp/>
          </div>
        <div className={styles.heroContent}>
          <div></div>
          <div className={styles.heroText}>
            {/* <Link href={"/checkin"}>
              <h1>LONDON CHECKIN</h1>
            </Link> */}
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
              <p>Location à la Mode is a model-exclusive event series. Created to foster a sense of community within the often isolating modeling industry, we create safe spaces for models to connect and support one another. We organize events and social functions following their journeys across international fashion weeks — from New York to London, Milan, and Paris</p>
              <div className={styles.contact}>
                <a href="mailto: WHERE@LOCATIONALAMODE.COM" target="_blank">where@locationalamode.com</a>
                <a href="https://www.instagram.com/location.alamode/" target="_blank">@location.alamode</a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
