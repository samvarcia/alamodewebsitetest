import styles from "./WorldMap.module.css";

export const CityLabels = ({ onCityClick, isModalOpen, isMobile }) => {
  const cities = [
    {
      name: 'New York City',
      desktop: { x: 510, y: 490 },
      mobile: { x: 510, y: 490 },
      image: '/newyorksvg.svg'  // Add your SVG path here
    },
    {
      name: 'London',
      desktop: { x: 936, y: 408 },
      mobile: { x: 936, y: 408 },
      image: '/londonsvg.svg'  // Add your SVG path here
    },
    {
      name: 'Milan',
      desktop: { x: 992, y: 548 },
      mobile: { x: 992, y: 548 },
      image: '/milansvg.svg'  // Add your SVG path here
    },
    {
      name: 'Paris',
      desktop: { x: 1037, y: 458 },
      mobile: { x: 1037, y: 458 },
      image: '/parissvg.svg'  // Add your SVG path here
    }
  ];

  // Size for the city icons
  const iconSize = isMobile ? 30 : 40;

  return (
    <g>
      {cities.map((city) => {
        const coords = isMobile ? city.mobile : city.desktop;
        return (
          <a 
            key={city.name} 
            href="#" 
            onClick={(e) => onCityClick(city.name, e)}
            className={isModalOpen ? styles.cityHidden : ''}
          >
            {/* Position the image center on the coordinates */}
            <image
              href={city.image}
              width={150}
              height={50}
              className={`${styles.cityIcon} ${isModalOpen ? styles.cityHidden : ''}`}
            />
          </a>
        );
      })}
    </g>
  );
}