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
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5oAhWN6a5JKtXRFgQsOia31TfDuo8MPvznlLy',
      filename: 'fw25-image-01.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5If7IktvaNxEchdfrpk3OHPZGBWwXFCMJeLgY',
      filename: 'fw25-image-02.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5TIxlpv7fU2XHGIho0RB9SPJmw6dQeajWMD75',
      filename: 'fw25-image-03.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5OIvAlm5bx6mn0yG5r4KzfYh8g739AwitckEZ',
      filename: 'fw25-image-04.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5EJwJ0Si0NIhsqCgWTSJHufoPxB328jbQRk5L',
      filename: 'fw25-image-05.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5zq9rJSGWGeO9CyJiqhFg5S3kH6Q8afZc0DB1',
      filename: 'fw25-image-06.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5rul7ZikU6IkVe1p48yMCcizsGjDgamNORlF9',
      filename: 'fw25-image-07.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5OILYVNcbx6mn0yG5r4KzfYh8g739AwitckEZ',
      filename: 'fw25-image-08.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN52yL1hNE8Fmf4SytL5DGJrRUVzqv1QsgaOPpc',
      filename: 'fw25-image-09.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5CtMwtRp5JUxXV5Weuslt6qj4v2BIEz0P7ypw',
      filename: 'fw25-image-10.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5t2nBq61sIMDbYaw4Ki02yjLOTlufP68HSopc',
      filename: 'fw25-image-11.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5SG0LSfMNsUq1MfgSJwtZaId6VXxYPFLey3Tc',
      filename: 'fw25-image-12.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5A4Az3andTBaZIDG0nxi2RvKb4UskjmMlQ9Y1',
      filename: 'fw25-image-13.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5eyHnxjCC3HfZPSQz6uBoK2tX5Op1rTMcAlJ7',
      filename: 'fw25-image-14.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5Q2maAtsnS05CJXFdom7LABrl32NtsciRUTMG',
      filename: 'fw25-image-15.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5OINwWG6bx6mn0yG5r4KzfYh8g739AwitckEZ',
      filename: 'fw25-image-16.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5tScNtJg1sIMDbYaw4Ki02yjLOTlufP68HSop',
      filename: 'fw25-image-17.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5yXWoMVYMqtL5hPovGWSpXJYH4auOUblN9KgA',
      filename: 'fw25-image-18.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5t7LYOu1sIMDbYaw4Ki02yjLOTlufP68HSopc',
      filename: 'fw25-image-19.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5sYzkUtcVYJN5qE8WIpzfFsXUxDnu6y17tLHT',
      filename: 'fw25-image-20.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5ibFslJGBm9L16gFHXnQ4xJMzvpt5AlI3weVZ',
      filename: 'fw25-image-21.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5zkpPV6GWGeO9CyJiqhFg5S3kH6Q8afZc0DB1',
      filename: 'fw25-image-22.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5HCeiXB5lorAWPdZh7iQ3JmpOBDzRvE5XguMn',
      filename: 'fw25-image-23.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5fgeTstZ7MwLfNjSr8PiFmg2OyCJ49v3ousHz',
      filename: 'fw25-image-24.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5fh2PXFZ7MwLfNjSr8PiFmg2OyCJ49v3ousHz',
      filename: 'fw25-image-25.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5tScbSAt1sIMDbYaw4Ki02yjLOTlufP68HSop',
      filename: 'fw25-image-26.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5oZZxP5Va5JKtXRFgQsOia31TfDuo8MPvznlL',
      filename: 'fw25-image-27.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN50Y3DbyPXEPKy3CSsVjZfLnuM5GdrpANbvzkI',
      filename: 'fw25-image-28.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5aGeUXqfI0ENGWTiK3VtQs6A2k9FDM5RXdeBj',
      filename: 'fw25-image-29.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5ccEmjgAAC8XpqHQoY3tExIyT1BvalJmP20Z7',
      filename: 'fw25-image-30.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5jx3ILq0i8Ml3urIKcgY5aozEwNGpshLq17SH',
      filename: 'fw25-image-31.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN578TVTjxaFNA09pgyriHKbJEsm18IZDQd365T',
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