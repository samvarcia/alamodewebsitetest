

// "use client"
// import React, { useState, useEffect } from 'react';
// import styles from './page.module.css';
// import { motion, useAnimation } from 'framer-motion';
// import Image from 'next/image';
// import WorldMap from '@/app/components/WorldMap';
// import Link from 'next/link';
// const checkin = () => {
 
//   return (
//     <div className={styles.container}>
//       <motion.div
//         initial={{ opacity: 0 }}
//         transition={{ duration: 0.3 }}
//         style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 2 }}
//       >
//         <Link href={"/fw25"}>
//           <Image 
//             src="https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5ziOWkkGWGeO9CyJiqhFg5S3kH6Q8afZc0DB1"
//             width={150}
//             height={100}
//             priority
//             className={styles.fixedLogo}
//           />
//         </Link>
//       </motion.div>
//       <WorldMap/>
//     </div>
//   );
// };

// export default checkin;

// "use client"
// import React, { useState, useEffect } from 'react';
// import styles from './page.module.css';
// import Image from 'next/image';
// import SignUpfw25 from './components/SignUpfw25';
// import { WorldMapSVG } from './components/WorldMapSVG';

// const FwPage = () => {
//   const [showFixedLogo, setShowFixedLogo] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [subscriptionSuccess, setSubscriptionSuccess] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       const viewportHeight = window.innerHeight;
//       const scrollPosition = window.scrollY;
//       setShowFixedLogo(scrollPosition > viewportHeight * 0.8);
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   const handleGoBack = () => {
//     setSubscriptionSuccess(false);
//     setIsLoading(false);
//   };

//   return (
//     <div className={styles.container}>
//       <main className={styles.main}>
//         <div className={styles.mainContent}> 
//           {!isLoading && !subscriptionSuccess && (
//             <>
//               <div className={styles.logoContainer}>
//                 <Image 
//                   src="https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5ziOWkkGWGeO9CyJiqhFg5S3kH6Q8afZc0DB1"
//                   width={380}
//                   height={250}
//                   priority
//                   className={styles.logo}
//                 />
//                 <Image 
//                   src="/BTS.svg"
//                   width={380}
//                   height={250}
//                   priority
//                   className={styles.bts}
//                 />
//               </div>
//               <div className={styles.check}>
//                 <SignUpfw25 
//                   setIsLoading={setIsLoading} 
//                   setSubscriptionSuccess={setSubscriptionSuccess}
//                 />
//               </div>
//             </>
//           )}
          
//           {isLoading && !subscriptionSuccess && (
//             <>
//               <div className={styles.mapWrapper}>
//                 <svg
//                   viewBox="0 0 2057 1242"
//                   xmlns="http://www.w3.org/2000/svg"
//                   className={styles.map}
//                   preserveAspectRatio="xMidYMid meet"
//                 >
//                   <WorldMapSVG isModalOpen={true} isLoading={true} />
//                 </svg>
//               </div>
//               <div className={styles.loadingText}>
//                 LOADING...
//               </div>
//             </>
//           )}

//           {subscriptionSuccess && (
//             <>
//               <div className={styles.mapWrapper}>
//                 <svg
//                   viewBox="0 0 2057 1242"
//                   xmlns="http://www.w3.org/2000/svg"
//                   className={styles.map}
//                   preserveAspectRatio="xMidYMid meet"
//                 >
//                   <WorldMapSVG isModalOpen={true} isLoading={true} />
//                 </svg>
//               </div>
//               <div className={styles.successContent}>
//                 <h2 className={styles.successTitle}>YOU’RE IN</h2>
//                 <p className={styles.successMessage}>
//                 Few get to experience à la mode, but you’re about to see what happens
//                 behind the seen. Stay tuned and keep an eye on your inbox.            
//                 </p>
//                 <button onClick={handleGoBack} className={styles.goBackButton}>
//                   GO BACK
//                 </button>
//               </div>
//             </>
//           )}
//         </div>
//       </main> 
//     </div>
//   );
// };

// export default FwPage;
"use client"
import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import Image from 'next/image';
import PhotoGridGallery from './components/PhotoGridGallery.jsx'
import { DateTime } from 'luxon'; // Import luxon for better timezone handling

const fw25Images = () => {
  const [hasAccess, setHasAccess] = useState(true);
  const [countdown, setCountdown] = useState('00:00:00:00');
  const [isExpired, setIsExpired] = useState(false);
  const [inputValue] = useState('Takem3b3h1ndthe5e3n');

  useEffect(() => {
    const updateCountdown = () => {
      // Get current time in EST
      const now = DateTime.now().setZone('America/New_York');
      
      // Set target to 7PM today in EST
      let target = now.set({
        hour: 19,
        minute: 0,
        second: 0,
        millisecond: 0
      });

      // If current time is past 7PM, the countdown should be at 0
      if (now >= target) {
        setCountdown('00:00:00:00');
        setIsExpired(true);
        return;
      }

      // Calculate the duration until target
      const diff = target.diff(now, ['hours', 'minutes', 'seconds']);
      
      // Format the countdown
      const hours = Math.floor(diff.hours);
      const minutes = Math.floor(diff.minutes);
      const seconds = Math.floor(diff.seconds);

      const formattedCountdown = `00:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      setCountdown(formattedCountdown);
    };

    updateCountdown();
    const intervalId = setInterval(updateCountdown, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleAccess = () => {
    setHasAccess(true);
  };

  return (
    <div className={styles.container}>
      {!hasAccess ? (
        <>
          <div className={styles.topLogo}>
            <Image 
              src="https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5ziOWkkGWGeO9CyJiqhFg5S3kH6Q8afZc0DB1"
              width={260}
              height={173}
              priority
              className={styles.logo}
            />
          </div>

          <div className={styles.landingContent}>
            <div className={styles.accessForm}>
              <input
                type="text"
                value={inputValue}
                readOnly
                className={styles.input}
              />
              <button 
                onClick={handleAccess}
                className={styles.accessButton}
              >
                ACCESS
              </button>
            </div>
          </div>

          <div className={styles.bottomCounter}>
            <div className={styles.countdown}>{countdown}</div>
          </div>
        </>
      ) : (
        <div className={styles.galleryContainer}>
          <div className={styles.stickyHeader}>
            <Image 
              src="https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5ziOWkkGWGeO9CyJiqhFg5S3kH6Q8afZc0DB1"
              width={260}
              height={173}
              priority
              className={styles.logo}
            />
          </div>
          
          {isExpired ? (
            <div className={styles.thankYouMessage}>
              <p>
              Thank you for stepping behind the seen, see you at the next one
              </p>
            </div>
          ) : (
            <PhotoGridGallery />
          )}
          
          <div className={styles.stickyFooter}>
            <div className={styles.countdown}>{countdown}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default fw25Images;