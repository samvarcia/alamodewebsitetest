// app/sound/page.js
'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './page.module.css'
// import PlaylistCard from '../components/PlaylistCard'
import PlaylistCard from '../components/PlayIistCard'
import PlaylistDetail from '../components/PlaylistDetail'
import Image from 'next/image'

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
    },
    date: 'MAY 10',
    on: true
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
    },
    date: 'MAY 24',
    on: false
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
    },
    date: 'JUN 07',
    on: false
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
    },
    date: 'JUN 21',
    on: false
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
    },
    date: 'JUL 05',
    on: false
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
    },
    date: 'JUL 19',
    on: false
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
    },
    date: 'AUG 02',
    on: false
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
    },
    date: 'AUG 16',
    on: false
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
    },
    date: 'AUG 30',
    on: false
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
    },
    date: 'SEP 13',
    on: false
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
    },
    date: 'SEP 27',
    on: false
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
    },
    date: 'OCT 11',
    on: false
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
    },
    date: 'OCT 25',
    on: false
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
    },
    date: 'NOV 08',
    on: false
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
    },
    date: 'NOV 22',
    on: false
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
    },
    date: 'DEC 06',
    on: false
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
    },
    date: 'DEC 20',
    on: false
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
    },
    date: 'JAN 03',
    on: false
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
    },
    date: 'JAN 17',
    on: false
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
    },
    date: 'JAN 31',
    on: false
  },
  // ... Add 19 more similar objects with different names and creators
];

export default function SoundPage() {
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  return (
    <>
    <div className={styles.container}>
      <div className={styles.header}>
        <Image className={styles.soundLogo} src={"/SoundLogo.png"} width={400} height={200}/>
        <h1>Our diverse community means that each playlist offers a rich tapestry of sounds and cultures from around the globe.</h1>
      </div>
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
      <div className={styles.footer}>
        <Image className={styles.footerImage} src={"/footerSound.png"} width={400} height={200}/>
      </div>
    </>
  );
}