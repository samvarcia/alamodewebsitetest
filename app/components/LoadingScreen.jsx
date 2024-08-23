import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './LoadingScreen.module.css';
import { MartiniCup } from './AnimatedCup';

export const LoadingScreen = () => {
  const [fillPercentage, setFillPercentage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFillPercentage(prev => prev < 1 ? prev + 0.1 : 1);
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      className={styles.loadingScreen}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h2>SUBMITTING, PLEASE WAIT...</h2>
      <MartiniCup fillPercentage={fillPercentage} />
    </motion.div>
  );
};