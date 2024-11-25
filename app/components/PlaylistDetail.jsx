// app/sound/PlaylistDetail.js
'use client'
import { motion } from 'framer-motion';
import styles from './PlaylistDetail.module.css';
import { X, Music } from 'lucide-react';

const PlaylistDetail = ({ playlist, onClose }) => {
  return (
    <motion.div
      className={styles.detail}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.button
        className={styles.closeButton}
        onClick={onClose}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <X size={24} />
      </motion.button>

      <motion.div className={styles.content} layoutId={`card-${playlist.id}`}>
        <motion.img
          src={playlist.cover}
          alt={playlist.name}
          className={styles.detailCover}
          layoutId={`cover-${playlist.id}`}
        />
        
        <motion.div
          className={styles.info}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2>{playlist.name}</h2>
          <p>Created by {playlist.creator}</p>
          
          <div className={styles.links}>
            <a href={playlist.links.spotify} target="_blank" rel="noopener noreferrer">
              <Music size={24} />
            </a>
            <a href={playlist.links.apple} target="_blank" rel="noopener noreferrer">
              <Music size={24} />
            </a>
            <a href={playlist.links.deezer} target="_blank" rel="noopener noreferrer">
              <Music size={24} />
            </a>
            <a href={playlist.links.amazon} target="_blank" rel="noopener noreferrer">
              <Music size={24} />
            </a>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default PlaylistDetail;