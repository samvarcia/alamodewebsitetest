import styles from "./WorldMap.module.css";

export const CityLabels = ({ onCityClick, isModalOpen }) => (
  <g>
    <a href="#" onClick={(e) => onCityClick('New York', e)}>
      <circle 
        cx="350" 
        cy="390" 
        // r="4" 
        className={`${styles.cityDot} ${isModalOpen ? styles.cityHidden : ''}`}
      />
      <text
        className={`${styles.cityLabel} ${isModalOpen ? styles.cityHidden : ''}`}
        x="350"
        y="390"
        textAnchor="middle"
      >
        New York
      </text>
    </a>
    <a href="#" onClick={(e) => onCityClick('London', e)}>
      <circle 
        cx="776" 
        cy="308" 
        // r="4" 
        className={`${styles.cityDot} ${isModalOpen ? styles.cityHidden : ''}`}
      />
      <text
        className={`${styles.cityLabel} ${isModalOpen ? styles.cityHidden : ''}`}
        x="776"
        y="308"
        textAnchor="middle"
      >
        London
      </text>
    </a>
    <a href="#" onClick={(e) => onCityClick('Milan', e)}>
      <circle 
        cx="837" 
        cy="448" 
        // r="4" 
        className={`${styles.cityDot} ${isModalOpen ? styles.cityHidden : ''}`}
      />
      <text
        className={`${styles.cityLabel} ${isModalOpen ? styles.cityHidden : ''}`}
        x="837"
        y="448"
        textAnchor="middle"
      >
        Milan
      </text>
    </a>
    <a href="#" onClick={(e) => onCityClick('Paris', e)}>
      <circle 
        cx="870" 
        cy="358" 
        // r="4" 
        className={`${styles.cityDot} ${isModalOpen ? styles.cityHidden : ''}`}
      />
      <text
        className={`${styles.cityLabel} ${isModalOpen ? styles.cityHidden : ''}`}
        x="870"
        y="358"
        textAnchor="middle"
      >
        Paris
      </text>
    </a>
  </g>
)