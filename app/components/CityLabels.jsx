import styles from "./WorldMap.module.css";

export const CityLabels = ({ onCityClick, isModalOpen, isMobile }) => {
  // Adjusted label positions for better mobile visibility
  const cities = [
    {
      name: 'New York',
      desktop: { x: 510, y: 490 },
      mobile: { x: 510, y: 490 }
    },
    {
      name: 'London',
      desktop: { x: 936, y: 408 },
      mobile: { x: 936, y: 408 }
    },
    {
      name: 'Milan',
      desktop: { x: 997, y: 548 },
      mobile: { x: 997, y: 548 } // Slightly adjusted for mobile
    },
    {
      name: 'Paris',
      desktop: { x: 1035, y: 458 },
      mobile: { x: 1035, y: 458 }
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