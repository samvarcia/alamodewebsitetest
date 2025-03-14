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
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5fzxgBcZ7MwLfNjSr8PiFmg2OyCJ49v3ousHz',
      filename: 'fw25-image-01.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5f5qoDKZ7MwLfNjSr8PiFmg2OyCJ49v3ousHz',
      filename: 'fw25-image-02.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN539rdLv8LBglidcVU9rjhyk8MN7e4ouxbanKw',
      filename: 'fw25-image-03.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5AWmZptindTBaZIDG0nxi2RvKb4UskjmMlQ9Y',
      filename: 'fw25-image-04.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5QT0Li8snS05CJXFdom7LABrl32NtsciRUTMG',
      filename: 'fw25-image-05.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5CAqf3g5JUxXV5Weuslt6qj4v2BIEz0P7ypwZ',
      filename: 'fw25-image-06.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5x88cUrjKFtIYdo9AvZnfspCON6KRh4SU5HBT',
      filename: 'fw25-image-07.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5fASLl7Z7MwLfNjSr8PiFmg2OyCJ49v3ousHz',
      filename: 'fw25-image-08.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5o73orQa5JKtXRFgQsOia31TfDuo8MPvznlLy',
      filename: 'fw25-image-09.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5ap3XaOfI0ENGWTiK3VtQs6A2k9FDM5RXdeBj',
      filename: 'fw25-image-10.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5Ctw7EbR5JUxXV5Weuslt6qj4v2BIEz0P7ypw',
      filename: 'fw25-image-11.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5zDUkaMoGWGeO9CyJiqhFg5S3kH6Q8afZc0DB',
      filename: 'fw25-image-12.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5KHXapb32YA98TUXCuphaBQqZm6sJGztlR34W',
      filename: 'fw25-image-13.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5UhaHRFq8VSZXdkougFAfstnKe931vIaRG2qi',
      filename: 'fw25-image-14.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5cVmnT5QAAC8XpqHQoY3tExIyT1BvalJmP20Z',
      filename: 'fw25-image-15.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5IlDB07vaNxEchdfrpk3OHPZGBWwXFCMJeLgY',
      filename: 'fw25-image-16.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN57hBK7exaFNA09pgyriHKbJEsm18IZDQd365T',
      filename: 'fw25-image-17.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5B4w3UuOOJLgRZ7jHdIcMl1E526yrFVPbKz4A',
      filename: 'fw25-image-18.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5eYGjcACC3HfZPSQz6uBoK2tX5Op1rTMcAlJ7',
      filename: 'fw25-image-19.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN50fG2GiXEPKy3CSsVjZfLnuM5GdrpANbvzkIF',
      filename: 'fw25-image-20.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5AWyitJ6ndTBaZIDG0nxi2RvKb4UskjmMlQ9Y',
      filename: 'fw25-image-21.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5EF0LbXi0NIhsqCgWTSJHufoPxB328jbQRk5L',
      filename: 'fw25-image-22.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5mZ1zIpjnYi8vWf9hCg2QHsKlZeR4xqwoBapG',
      filename: 'fw25-image-23.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5hgiOtB4ZOugLUQa4oet2R9m1sJpTb5FVCHSA',
      filename: 'fw25-image-24.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5GpMxE8JDUHE8jhwQBumS4MyNJ1zKOn2PWdao',
      filename: 'fw25-image-25.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5fVXbucZ7MwLfNjSr8PiFmg2OyCJ49v3ousHz',
      filename: 'fw25-image-26.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5aLth6JdfI0ENGWTiK3VtQs6A2k9FDM5RXdeB',
      filename: 'fw25-image-27.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5TV0LBK7fU2XHGIho0RB9SPJmw6dQeajWMD75',
      filename: 'fw25-image-28.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN54g7xxAovPg8Ej6VNX1niwby2CSLKMtxq9mkO',
      filename: 'fw25-image-29.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN50ktNF4XEPKy3CSsVjZfLnuM5GdrpANbvzkIF',
      filename: 'fw25-image-30.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5QIKhkRsnS05CJXFdom7LABrl32NtsciRUTMG',
      filename: 'fw25-image-31.jpg'
    },
    { 
      url: 'https://5b4ey7iavy.ufs.sh/f/sPxirgcVYJN5IR6O1xIvaNxEchdfrpk3OHPZGBWwXFCMJeLg',
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