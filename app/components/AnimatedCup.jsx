import { motion } from 'framer-motion';

const AnimatedCup = ({ progress }) => (
  <svg width="161" height="241" viewBox="0 0 161 241" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M80.1392 122.834L6.5 4.45703L153.778 4.45704L80.1392 122.834Z" stroke="white" strokeWidth="7"/>
    <line x1="80.1758" y1="123.492" x2="80.1758" y2="235.023" stroke="white" strokeWidth="7"/>
    <ellipse cx="80.1387" cy="228.996" rx="35.9785" ry="11.8594" fill="white"/>
    <motion.rect 
      x="6.5" 
      y="122.834" 
      width="147.278" 
      initial={{ height: 0 }}
      animate={{ height: 118.189 * progress }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      fill="white"
    />
  </svg>
);

export default AnimatedCup;