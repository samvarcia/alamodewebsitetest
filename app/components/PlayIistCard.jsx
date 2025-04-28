import { useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import styles from './PlaylistCard.module.css';

export default function PlaylistCard({ playlist, onClick }) {
  const controls = useAnimation();
  const isAnimating = useRef(false);

  // Animation variants
  const bounceVariant = {
    bounce: {
      y: [0, -20, 0],
      transition: { 
        duration: 0.5,
        type: "spring",
        stiffness: 500,
        damping: 10
      }
    },
    still: { y: 0 }
  };

  const handleDateClick = async (e) => {
    e.stopPropagation();
    if (!playlist.on && !isAnimating.current) {
      isAnimating.current = true;
      await controls.start("bounce");
      await controls.start("still");
      isAnimating.current = false;
    }
  };

  const handleCardClick = async () => {
    if (playlist.on) {
      onClick();
    } else if (!isAnimating.current) {
      isAnimating.current = true;
      await controls.start("bounce");
      await controls.start("still");
      isAnimating.current = false;
    }
  };

  return (
    <motion.div
      className={styles.card}
      onClick={handleCardClick}
      whileHover={playlist.on ? { scale: 1.05 } : {scale: 1.09}}
      animate={controls}
      variants={bounceVariant}
      layoutId={`card-${playlist.id}`}
      style={{
        border: playlist.on ? 'none' : '2px solid #E00022',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '150px',
        minWidth: '150px',
        background: playlist.on ? 'transparent' : '#f0f0f0',
        overflow: 'hidden',
        cursor: 'pointer'
      }}
    >
      {playlist.on ? (
        <motion.img
          src={playlist.cover}
          alt={playlist.name || 'Playlist Cover'}
          className={styles.cover}
          layoutId={`cover-${playlist.id}`}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      ) : (
        <motion.span 
          onClick={handleDateClick}
          style={{
            color: '#E00022',
            fontWeight: 'bold',
            fontSize: '1rem',
            textAlign: 'center',
            padding: '5px',
            cursor: 'pointer'
          }}>
          {playlist.date}
        </motion.span>
      )}
    </motion.div>
  );
}
