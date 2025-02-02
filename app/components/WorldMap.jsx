import { useState } from 'react';
import styles from "./WorldMap.module.css";
import Image from 'next/image';
import ModalForm from './ModalForm';
import { WorldMapSVG } from './WorldMapSVG';
import { CityLabels } from './CityLabels';

export default function WorldMap() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('');

  const handleCityClick = (city, e) => {
    e.preventDefault();
    setSelectedCity(city);
    setIsModalOpen(true);
  };

  return (
    <div className={styles.mapContainer}>
      <svg
        viewBox="0 0 1509 980"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.map}
      >
        <WorldMapSVG isModalOpen={isModalOpen} />
        <CityLabels 
          onCityClick={handleCityClick} 
          isModalOpen={isModalOpen}
        />
      </svg>

      <div className={`${styles.logoContainer} ${isModalOpen ? styles.logoModal : styles.logoDefault}`}>
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