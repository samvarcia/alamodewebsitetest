// app/sound/page.js
'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './page.module.css'
// import PlaylistCard from '../components/PlaylistCard'
import PlaylistCard from '../components/PlayIistCard'
import PlaylistDetail from '../components/PlaylistDetail'

const playlistData = [
  {
    id: 1,
    cover: '/rolling.jpg',
    name: 'PLAYLIST 1',
    creator: 'Model',
    links: {
      spotify: 'https://spotify.com/playlist/xxx',
      apple: 'https://music.apple.com/playlist/xxx',
      deezer: 'https://deezer.com/playlist/xxx',
      amazon: 'https://music.amazon.com/playlist/xxx'
    }
  },
  // ... Add 19 more similar objects with different names and creators
];

export default function SoundPage() {
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  return (
    <div className={styles.container}>
      <AnimatePresence mode="wait">
        {!selectedPlaylist ? (
          <motion.div 
            className={styles.grid}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {playlistData.map((playlist) => (
              <PlaylistCard
                key={playlist.id}
                playlist={playlist}
                onClick={() => setSelectedPlaylist(playlist)}
              />
            ))}
          </motion.div>
        ) : (
          <PlaylistDetail
            playlist={selectedPlaylist}
            onClose={() => setSelectedPlaylist(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}