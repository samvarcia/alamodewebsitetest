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
        {/* <section className={styles.slideOne}>
          <div className={styles.slideContent}>
          </div>
        </section> */}
        <section className={styles.slideTwo}>
          <div className={styles.slideContent}>
          </div>
        </section>
        <section className={styles.slideThree}>
          <div className={styles.slideContent}>
          </div>
        </section>
        <section className={styles.slideFour}>
          <div className={styles.slideContent}>
          </div>
        </section>
        <section className={styles.slideFive}>
          <div className={styles.slideContent}>
          </div>
        </section>
        {/* <section className={styles.slideSix}>
          <div className={styles.slideContent}>
          </div>
        </section> */}
    </div>
  );
};

export default PhotoGrid;