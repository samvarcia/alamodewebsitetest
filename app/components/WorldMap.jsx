import { useState, useEffect } from 'react';
import styles from "./WorldMap.module.css";
import Image from 'next/image';
import ModalForm from './ModalForm';
import { WorldMapSVG } from './WorldMapSVG';
import { CityLabels } from './CityLabels';

export default function WorldMap() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [viewBox, setViewBox] = useState("0 0 2057 1242");

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      // Zoom into Europe/US area for mobile
      setViewBox(mobile ? "300 250 900 500" : "0 0 2057 1242");
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
      <svg
        viewBox={viewBox}
        xmlns="http://www.w3.org/2000/svg"
        className={styles.map}
        preserveAspectRatio="xMidYMid meet"
      >
        <WorldMapSVG 
          isModalOpen={isModalOpen} 
          isLoading={false} // default state is not loading
        />        
        <CityLabels 
          onCityClick={handleCityClick} 
          isModalOpen={isModalOpen}
          isMobile={isMobile}
        />
      </svg>

      <div className={`${styles.logoContainer} ${styles.logoDefault} ${isModalOpen ? styles.logoHidden : ''}`}>
        <Image 
          src="https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5ziOWkkGWGeO9CyJiqhFg5S3kH6Q8afZc0DB1"
          width={150}
          height={100}
          priority
          className={styles.fixedLogo}
        />
      </div>

      <div className={`${styles.logoContainer} ${styles.logoModal} ${!isModalOpen ? styles.logoHidden : ''}`}>
        <Image 
          src="https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5ziOWkkGWGeO9CyJiqhFg5S3kH6Q8afZc0DB1"
          width={150}
          height={100}
          priority
          className={styles.fixedLogo}
        />
      </div>

      <ModalForm 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedCity={selectedCity}
      />
    </div>
  );
}