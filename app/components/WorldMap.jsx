import { useState, useEffect } from 'react';
import styles from "./WorldMap.module.css";
import Image from 'next/image';
import ModalForm from './ModalForm';
import { WorldMapSVG } from './WorldMapSVG';
import { CityLabels } from './CityLabels';
import Link from 'next/link';

export default function WorldMap() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [viewBox, setViewBox] = useState("0 0 2057 1242");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      // More precise zoom for mobile, focusing on US and Europe
      setViewBox(mobile ? "0 150 1800 1000" : "0 0 2057 1242");
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCityClick = (city, e) => {
    e.preventDefault();
    setSelectedCity(city);
    setIsModalOpen(true);
  };
  
  return (
    <div className={styles.mapContainer}>
      <h1 className={`${styles.select} ${isModalOpen ? styles.selectHidden : ''}`}>SELECT A CITY</h1>
      <svg
        viewBox={viewBox}
        xmlns="http://www.w3.org/2000/svg"
        className={styles.map}
        preserveAspectRatio="xMidYMid meet"
      >
        <WorldMapSVG 
          isModalOpen={isModalOpen} 
          isLoading={isSubmitting} // Pass isSubmitting here
        />        
        <CityLabels 
          onCityClick={handleCityClick} 
          isModalOpen={isModalOpen}
          isMobile={isMobile}
        />
      </svg>


      <Link href={"/fw25"}>
        <div className={`${styles.logoContainer} ${styles.logoDefault} ${isModalOpen ? styles.logoHidden : ''}`}>
          <Image 
            src="https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5ziOWkkGWGeO9CyJiqhFg5S3kH6Q8afZc0DB1"
            width={150}
            height={100}
            priority
            className={styles.fixedLogo}
          />
        </div>
      </Link>


      <Link href={"/fw25"}>
        <div className={`${styles.logoContainer} ${styles.logoModal} ${!isModalOpen ? styles.logoHidden : ''}`}>
          <Image 
            src="https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5ziOWkkGWGeO9CyJiqhFg5S3kH6Q8afZc0DB1"
            width={150}
            height={100}
            priority
            className={styles.fixedLogo}
          />
        </div>
      </Link>

      <ModalForm 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedCity={selectedCity}
        onSubmitStart={() => setIsSubmitting(true)}
        onSubmitEnd={() => setIsSubmitting(false)}
      />
    </div>
  );
}