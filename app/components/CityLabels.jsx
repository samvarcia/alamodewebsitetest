import styles from "./WorldMap.module.css";

export const CityLabels = ({ onCityClick, isModalOpen, isMobile }) => {
  // Adjusted label positions for better mobile visibility
  const cities = [
    {
      name: 'New York',
      desktop: { x: 350, y: 390 },
      mobile: { x: 350, y: 390 }
    },
    {
      name: 'London',
      desktop: { x: 776, y: 308 },
      mobile: { x: 776, y: 308 }
    },
    {
      name: 'Milan',
      desktop: { x: 837, y: 448 },
      mobile: { x: 837, y: 428 } // Slightly adjusted for mobile
    },
    {
      name: 'Paris',
      desktop: { x: 870, y: 358 },
      mobile: { x: 870, y: 358 }
    }
  ];

  return (
    <g>
      {cities.map((city) => {
        const coords = isMobile ? city.mobile : city.desktop;
        return (
          <a key={city.name} href="#" onClick={(e) => onCityClick(city.name, e)}>
            <circle 
              cx={coords.x} 
              cy={coords.y}
              className={`${styles.cityDot} ${isModalOpen ? styles.cityHidden : ''}`}
            />
            <text
              className={`${styles.cityLabel} ${isModalOpen ? styles.cityHidden : ''}`}
              x={coords.x}
              y={coords.y}
              textAnchor="middle"
            >
              {city.name}
            </text>
          </a>
        );
      })}
    </g>
  );
}