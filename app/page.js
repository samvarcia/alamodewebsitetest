// "use client"
// import Image from "next/image";
// import styles from "./page.module.css";
// import { motion, useAnimation } from 'framer-motion';
// import Link from "next/link";
// import SignUp from "./components/SignUp";
 
// export default function Home() {
//   return (
//     <main className={styles.main}>
//           <Image 
//             src="/logoalamode.svg"
//             width={280}
//             height={150}
//             priority
//             className={styles.logo}
//           />
//           {/* <Link href={"/checkin"}>
//             <Image
//               width={45}
//               height={65}
//               src="/newcup.svg"
//               className={styles.check} 
//             />
//           </Link> */}
//           <div className={styles.check}>
//             <SignUp/>
//           </div>
//         <div className={styles.heroContent}>
//           <div></div>
//           <div className={styles.heroText}>
//             {/* <Link href={"/checkin"}>
//               <h1>LONDON CHECKIN</h1>
//             </Link> */}
//             <h3 className={styles.heroTitle}>NEW YORK, LONDON,<br/> MILAN, PARIS</h3>
//             <h3 className={styles.mobileHeroText}>NEW YORK<br />LONDON<br />MILAN<br />PARIS</h3>
//             <p>...PRACTICING MY MODEL WALK</p>
//           </div>
//         </div>
//       <div className={styles.slides}>
//       <motion.section className={styles.hero}
//         animate={{
//           background:["radial-gradient(115.53% 100% at 50% 0%, rgba(0, 0, 0, 0.14) 25%, rgba(188, 1, 35, 1) 100%), #000",
//           "radial-gradient(115.53% 100% at 50% 0%, rgba(0, 0, 0, 0.57) 30.62%, #BC0123 52.24%), #000", 
//           "radial-gradient(115.53% 100% at 50% 0%, rgba(0, 0, 0, 0.14) 25%, rgba(188, 1, 35, 1) 100%), #000",]
//         }}
//         transition={{ ease: "easeInOut", duration: 5 }}
//         >
        
//       </motion.section>
//         <section className={styles.slideOne}>
//           <div className={styles.slideContent}>
//           </div>
//         </section>
//         <section className={styles.slideThree}>
//           <div className={styles.slideContent}>
//           </div>
//         </section>
//         <section className={styles.slideTwo}>
//           <div className={styles.slideContent}>
//           </div>
//         </section>
//         <section className={styles.slideFour}>
//           <div className={styles.slideContent}>
//           </div>
//         </section>
//         <section className={styles.slideSix}>
//           <div className={styles.slideContent}>
//           </div>
//         </section>
//         <section className={styles.slideFive}>
//           <div className={styles.slideContent}>
//           </div>
//         </section>
//         <section className={styles.About}>
//           <div className={styles.slideContent}>
//             <div className={styles.aboutText}>
//               <h4>ABOUT</h4>
//               <p>Location à la Mode is a model-exclusive event series. Created to foster a sense of community within the often isolating modeling industry, we create safe spaces for models to connect and support one another. We organize events and social functions following their journeys across international fashion weeks — from New York to London, Milan, and Paris</p>
//               <div className={styles.contact}>
//                 <a href="mailto: WHERE@LOCATIONALAMODE.COM" target="_blank">where@locationalamode.com</a>
//                 <a href="https://www.instagram.com/location.alamode/" target="_blank">@location.alamode</a>
//               </div>
//             </div>
//           </div>
//         </section>
//       </div>
//     </main>
//   );
// }

"use client"
import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import { motion, useAnimation } from 'framer-motion';
import Image from 'next/image';
import PhotoGrid from './components/PhotoGrid.jsx'
import AboutFw25 from './components/AboutFw25';
import Link from 'next/link';

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
        <Link href={"/checkin"}>
          <div className={styles.checkinDot}></div>
        </Link>
        <div className={styles.mainContent}> 
          <Image 
            src="https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5ziOWkkGWGeO9CyJiqhFg5S3kH6Q8afZc0DB1"
            width={380}
            height={250}
            priority
            className={styles.logo}
          />
          <div className={styles.citiesList}>
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