// PhotoGrid.js
import React from 'react';
import styles from './PhotoGridGallery.module.css';

const PhotoGrid = () => {
  // Function to handle image downloads
  const handleDownload = async (url, filename) => {
    try {
      // Fetch the image as a blob
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

  // Image URLs and filenames mapping
  const images = [
    { 
      section: styles.slideTwo,
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5oR7O4Ma5JKtXRFgQsOia31TfDuo8MPvznlLy',
      filename: 'fw25-image-1.jpg'
    },
    { 
      section: styles.slideThree,
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5k4jfGQFbzaR50NlHWejvVOMES4AJrx8wqiYf',
      filename: 'fw25-image-2.jpg'
    },
    { 
      section: styles.slideFour,
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5ZXe7pVLEwM5xcgiDB81Wf0T2ztHSVbnYCmAo',
      filename: 'fw25-image-3.jpg'
    },
    { 
      section: styles.slideFive,
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5euSGQbqCC3HfZPSQz6uBoK2tX5Op1rTMcAlJ',
      filename: 'fw25-image-4.jpg'
    }
  ];

  return (
    <div className={styles.container}>
      {images.map((image, index) => (
        <section key={index} className={image.section}>
          <div className={styles.slideContent}>
            <button 
              className={styles.downloadButton}
              onClick={() => handleDownload(image.url, image.filename)}
              aria-label="Download image"
            >
              D
            </button>
          </div>
        </section>
      ))}
    </div>
  );
};

export default PhotoGrid;