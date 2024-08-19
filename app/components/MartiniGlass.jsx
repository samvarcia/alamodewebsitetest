import { motion } from 'framer-motion';
import styles from './MartiniGlass.module.css';

const MartiniGlass = ({ isAnimating }) => {
  return (
    <motion.svg
      width="120"
      height="120"
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className={styles.martiniGlass}
    >
      <motion.path
        d="M32 2 L12 24 L20 24 L32 12 L44 24 L52 24 Z"
        fill="none"
        stroke="black"
        strokeWidth="2"
      />
      <motion.path
        d="M32 2 L32 60"
        fill="none"
        stroke="black"
        strokeWidth="2"
      />
      <motion.path
        d="M20 48 L44 48"
        fill="none"
        stroke="black"
        strokeWidth="2"
      />
      <motion.rect
        x="23"
        y="24"
        width="18"
        height="24"
        fill="red"
        initial={{ height: 0 }}
        animate={{ height: isAnimating ? 24 : 0 }}
        transition={{ duration: 10 }}
      />
    </motion.svg>
  );
};

export default MartiniGlass;
