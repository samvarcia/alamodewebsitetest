// PhotoGrid.js
import styles from './PhotoGrid.module.css';

const PhotoGrid = () => {
  const placeholders = [
    {
      id: 1,
      tag: 'NEW YORK SS25',
      className: styles.image1,
      isVertical: true
    },
    {
      id: 2,
      tag: 'PARIS SS24',
      className: styles.image2,
      isVertical: false
    },
    {
      id: 3,
      tag: 'LONDON FW24',
      className: styles.image3,
      isVertical: false
    },
    {
      id: 4,
      tag: 'PARIS FW25',
      className: styles.image4,
      isVertical: false
    },
    {
      id: 5,
      tag: 'NEW YORK SS24',
      className: styles.image5,
      isVertical: false
    },
    {
      id: 6,
      tag: 'NEW YORK SS25',
      className: styles.image6,
      isVertical: true
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {placeholders.map((item) => (
          <div 
            key={item.id} 
            className={`${styles.imageWrapper} ${item.className} ${
              item.isVertical ? styles.vertical : styles.horizontal
            }`}
          >
            <div className={styles.imageContainer} />
            <div className={styles.tag}>{item.tag}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoGrid;