import { motion } from 'framer-motion';
import styles from './PlaylistCard.module.css';

export default function PlaylistCard({ playlist, onClick }) {
  return (
    <motion.div
      className={styles.card}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      layoutId={`card-${playlist.id}`}
    >
      <motion.img
        src={playlist.cover}
        alt={playlist.name}
        className={styles.cover}
        layoutId={`cover-${playlist.id}`}
      />
    </motion.div>
  );
}
