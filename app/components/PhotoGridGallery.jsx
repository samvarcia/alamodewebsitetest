// PhotoGrid.js
import React from 'react';
import styles from './PhotoGridGallery.module.css';
import Image from 'next/image';

const PhotoGrid = () => {
  // Function to handle image downloads
  const handleDownload = async (url, filename, index) => {
    try {
      // Track the download using the image number
      await fetch('/api/track-download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageNumber: index + 1 // Adding 1 because array is 0-based
        }),
      });

      // Proceed with the download
      const response = await fetch(url);
      const blob = await response.blob();
      
      // Create a blob URL
      const blobUrl = URL.createObjectURL(blob);
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename || 'fw25-image.jpg';
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  // Expanded images array for 30 sections
  const images = [
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5fASqV0Z7MwLfNjSr8PiFmg2OyCJ49v3ousHz',
      filename: 'fw25-image-01.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5FJS94lhMU4tkHBgbRj7eTPApDWXJG503dEiq',
      filename: 'fw25-image-02.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN50YBCMOmXEPKy3CSsVjZfLnuM5GdrpANbvzkI',
      filename: 'fw25-image-03.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5McA98mjQbGZ0Rk5IYPyqdxOfDNnTsHv1F9hW',
      filename: 'fw25-image-04.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5oh8AlNa5JKtXRFgQsOia31TfDuo8MPvznlLy',
      filename: 'fw25-image-05.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5zyJadyGWGeO9CyJiqhFg5S3kH6Q8afZc0DB1',
      filename: 'fw25-image-06.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5SW9CsdMNsUq1MfgSJwtZaId6VXxYPFLey3Tc',
      filename: 'fw25-image-07.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5zlKIEbGWGeO9CyJiqhFg5S3kH6Q8afZc0DB1',
      filename: 'fw25-image-08.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5uP1liX6tYOMhI1Xe8xsnupv7TEoZab6Jt30k',
      filename: 'fw25-image-09.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5qfHMR7m6XABJGytEPKZOCLlIR40YbiWvTHc1',
      filename: 'fw25-image-10.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5LuDk5IHJ8Q4gcFIotri07uWqXaGVZHUxYspB',
      filename: 'fw25-image-11.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5EIpprAi0NIhsqCgWTSJHufoPxB328jbQRk5L',
      filename: 'fw25-image-12.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5AZXsXsndTBaZIDG0nxi2RvKb4UskjmMlQ9Y1',
      filename: 'fw25-image-13.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5Mcqri4OQbGZ0Rk5IYPyqdxOfDNnTsHv1F9hW',
      filename: 'fw25-image-14.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5uE9xoTtYOMhI1Xe8xsnupv7TEoZab6Jt30kl',
      filename: 'fw25-image-15.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5GFYMK9JDUHE8jhwQBumS4MyNJ1zKOn2PWdao',
      filename: 'fw25-image-16.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5MvjfI7QbGZ0Rk5IYPyqdxOfDNnTsHv1F9hWc',
      filename: 'fw25-image-17.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5ly2usHeDnlQE4qepWr8SXINw9v0hUaGyd3JM',
      filename: 'fw25-image-18.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN51MJr1zHPDdEtgFTqbYjONpJ32ikoezwyLmCZ',
      filename: 'fw25-image-19.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5iggkUABm9L16gFHXnQ4xJMzvpt5AlI3weVZi',
      filename: 'fw25-image-20.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5rbsIoZkU6IkVe1p48yMCcizsGjDgamNORlF9',
      filename: 'fw25-image-21.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5FHzbIYhMU4tkHBgbRj7eTPApDWXJG503dEiq',
      filename: 'fw25-image-22.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5cVgytUJAAC8XpqHQoY3tExIyT1BvalJmP20Z',
      filename: 'fw25-image-23.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5ylxb8OYMqtL5hPovGWSpXJYH4auOUblN9KgA',
      filename: 'fw25-image-24.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5emu8JeCC3HfZPSQz6uBoK2tX5Op1rTMcAlJ7',
      filename: 'fw25-image-25.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5f3kDY1Z7MwLfNjSr8PiFmg2OyCJ49v3ousHz',
      filename: 'fw25-image-26.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5onZXrIa5JKtXRFgQsOia31TfDuo8MPvznlLy',
      filename: 'fw25-image-27.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5llhK5weDnlQE4qepWr8SXINw9v0hUaGyd3JM',
      filename: 'fw25-image-28.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5SEu3YlMNsUq1MfgSJwtZaId6VXxYPFLey3Tc',
      filename: 'fw25-image-29.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5stgQBmcVYJN5qE8WIpzfFsXUxDnu6y17tLHT',
      filename: 'fw25-image-30.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5a7DJaufI0ENGWTiK3VtQs6A2k9FDM5RXdeBj',
      filename: 'fw25-image-31.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5PfJPrnSJvABWCIGeraYnZy0p7LbdOcqE43Si',
      filename: 'fw25-image-32.jpg'
    }
  ];

  return (
    <div className={styles.container}>
      {images.map((image, index) => (
        <div key={index} className={styles.imageWrapper}>
          <Image 
            src={image.url}
            alt={`FW25 image ${index + 1}`}
            width={2437}
            height={3656}
            className={styles.image}
            priority={index < 10} // Load first 4 images immediately
          />
            <button 
              className={styles.downloadButton}
            onClick={() => handleDownload(image.url, image.filename, index)}
              aria-label="Download image"
            >
            </button>
          </div>
      ))}
    </div>
  );
};

export default PhotoGrid;