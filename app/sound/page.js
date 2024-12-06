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
  {
    id: 2,
    cover: '/rolling.jpg',
    name: 'PLAYLIST 2',
    creator: 'Model',
    links: {
      spotify: 'https://spotify.com/playlist/xxx',
      apple: 'https://music.apple.com/playlist/xxx',
      deezer: 'https://deezer.com/playlist/xxx',
      amazon: 'https://music.amazon.com/playlist/xxx'
    }
  },
  {
    id: 3,
    cover: '/rolling.jpg',
    name: 'PLAYLIST 3',
    creator: 'Model',
    links: {
      spotify: 'https://spotify.com/playlist/xxx',
      apple: 'https://music.apple.com/playlist/xxx',
      deezer: 'https://deezer.com/playlist/xxx',
      amazon: 'https://music.amazon.com/playlist/xxx'
    }
  },
  {
    id: 4,
    cover: '/rolling.jpg',
    name: 'PLAYLIST 4',
    creator: 'Model',
    links: {
      spotify: 'https://spotify.com/playlist/xxx',
      apple: 'https://music.apple.com/playlist/xxx',
      deezer: 'https://deezer.com/playlist/xxx',
      amazon: 'https://music.amazon.com/playlist/xxx'
    }
  },
  {
    id: 5,
    cover: '/rolling.jpg',
    name: 'PLAYLIST 5',
    creator: 'Model',
    links: {
      spotify: 'https://spotify.com/playlist/xxx',
      apple: 'https://music.apple.com/playlist/xxx',
      deezer: 'https://deezer.com/playlist/xxx',
      amazon: 'https://music.amazon.com/playlist/xxx'
    }
  },
  {
    id: 6,
    cover: '/rolling.jpg',
    name: 'PLAYLIST 6',
    creator: 'Model',
    links: {
      spotify: 'https://spotify.com/playlist/xxx',
      apple: 'https://music.apple.com/playlist/xxx',
      deezer: 'https://deezer.com/playlist/xxx',
      amazon: 'https://music.amazon.com/playlist/xxx'
    }
  },
  {
    id: 7,
    cover: '/rolling.jpg',
    name: 'PLAYLIST 7',
    creator: 'Model',
    links: {
      spotify: 'https://spotify.com/playlist/xxx',
      apple: 'https://music.apple.com/playlist/xxx',
      deezer: 'https://deezer.com/playlist/xxx',
      amazon: 'https://music.amazon.com/playlist/xxx'
    }
  },
  {
    id: 8,
    cover: '/rolling.jpg',
    name: 'PLAYLIST 8',
    creator: 'Model',
    links: {
      spotify: 'https://spotify.com/playlist/xxx',
      apple: 'https://music.apple.com/playlist/xxx',
      deezer: 'https://deezer.com/playlist/xxx',
      amazon: 'https://music.amazon.com/playlist/xxx'
    }
  },
  {
    id: 9,
    cover: '/rolling.jpg',
    name: 'PLAYLIST 9',
    creator: 'Model',
    links: {
      spotify: 'https://spotify.com/playlist/xxx',
      apple: 'https://music.apple.com/playlist/xxx',
      deezer: 'https://deezer.com/playlist/xxx',
      amazon: 'https://music.amazon.com/playlist/xxx'
    }
  },
  {
    id: 10,
    cover: '/rolling.jpg',
    name: 'PLAYLIST 10',
    creator: 'Model',
    links: {
      spotify: 'https://spotify.com/playlist/xxx',
      apple: 'https://music.apple.com/playlist/xxx',
      deezer: 'https://deezer.com/playlist/xxx',
      amazon: 'https://music.amazon.com/playlist/xxx'
    }
  },
  {
    id: 11,
    cover: '/rolling.jpg',
    name: 'PLAYLIST 11',
    creator: 'Model',
    links: {
      spotify: 'https://spotify.com/playlist/xxx',
      apple: 'https://music.apple.com/playlist/xxx',
      deezer: 'https://deezer.com/playlist/xxx',
      amazon: 'https://music.amazon.com/playlist/xxx'
    }
  },
  {
    id: 12,
    cover: '/rolling.jpg',
    name: 'PLAYLIST 12',
    creator: 'Model',
    links: {
      spotify: 'https://spotify.com/playlist/xxx',
      apple: 'https://music.apple.com/playlist/xxx',
      deezer: 'https://deezer.com/playlist/xxx',
      amazon: 'https://music.amazon.com/playlist/xxx'
    }
  },
  {
    id: 13,
    cover: '/rolling.jpg',
    name: 'PLAYLIST 13',
    creator: 'Model',
    links: {
      spotify: 'https://spotify.com/playlist/xxx',
      apple: 'https://music.apple.com/playlist/xxx',
      deezer: 'https://deezer.com/playlist/xxx',
      amazon: 'https://music.amazon.com/playlist/xxx'
    }
  },
  {
    id: 14,
    cover: '/rolling.jpg',
    name: 'PLAYLIST 14',
    creator: 'Model',
    links: {
      spotify: 'https://spotify.com/playlist/xxx',
      apple: 'https://music.apple.com/playlist/xxx',
      deezer: 'https://deezer.com/playlist/xxx',
      amazon: 'https://music.amazon.com/playlist/xxx'
    }
  },
  {
    id: 15,
    cover: '/rolling.jpg',
    name: 'PLAYLIST 15',
    creator: 'Model',
    links: {
      spotify: 'https://spotify.com/playlist/xxx',
      apple: 'https://music.apple.com/playlist/xxx',
      deezer: 'https://deezer.com/playlist/xxx',
      amazon: 'https://music.amazon.com/playlist/xxx'
    }
  },
  {
    id: 16,
    cover: '/rolling.jpg',
    name: 'PLAYLIST 16',
    creator: 'Model',
    links: {
      spotify: 'https://spotify.com/playlist/xxx',
      apple: 'https://music.apple.com/playlist/xxx',
      deezer: 'https://deezer.com/playlist/xxx',
      amazon: 'https://music.amazon.com/playlist/xxx'
    }
  },
  {
    id: 17,
    cover: '/rolling.jpg',
    name: 'PLAYLIST 17',
    creator: 'Model',
    links: {
      spotify: 'https://spotify.com/playlist/xxx',
      apple: 'https://music.apple.com/playlist/xxx',
      deezer: 'https://deezer.com/playlist/xxx',
      amazon: 'https://music.amazon.com/playlist/xxx'
    }
  },
  {
    id: 18,
    cover: '/rolling.jpg',
    name: 'PLAYLIST 18',
    creator: 'Model',
    links: {
      spotify: 'https://spotify.com/playlist/xxx',
      apple: 'https://music.apple.com/playlist/xxx',
      deezer: 'https://deezer.com/playlist/xxx',
      amazon: 'https://music.amazon.com/playlist/xxx'
    }
  },
  {
    id: 19,
    cover: '/rolling.jpg',
    name: 'PLAYLIST 19',
    creator: 'Model',
    links: {
      spotify: 'https://spotify.com/playlist/xxx',
      apple: 'https://music.apple.com/playlist/xxx',
      deezer: 'https://deezer.com/playlist/xxx',
      amazon: 'https://music.amazon.com/playlist/xxx'
    }
  },
  {
    id: 20,
    cover: '/rolling.jpg',
    name: 'PLAYLIST 20',
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
      <h1>EVERY TWO WEEKS A MODEL SHARES A PLAYLIST WITH YOU</h1>
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