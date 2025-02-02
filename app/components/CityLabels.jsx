export const CityLabels = ({ onCityClick }) => (
  <g>
    <a href="#" onClick={(e) => onCityClick('New York', e)}>
      <text
        className="cityLabel"
        x="350"
        y="390"
        textAnchor="middle"
        fill="white"
        fontWeight="bold"
        fontSize="27"
      >
        New York
      </text>
    </a>
    <a href="#" onClick={(e) => onCityClick('London', e)}>
      <text
        className="cityLabel"
        x="776"
        y="308"
        textAnchor="middle"
        fill="white"
        fontWeight="bold"
        fontSize="27"
      >
        London
      </text>
    </a>
    <a href="#" onClick={(e) => onCityClick('Milan', e)}>
      <text
        className="cityLabel"
        x="837"
        y="448"
        textAnchor="middle"
        fill="white"
        fontWeight="bold"
        fontSize="27"
      >
        Milan
      </text>
    </a>
    <a href="#" onClick={(e) => onCityClick('Paris', e)}>
      <text
        className="cityLabel"
        x="870"
        y="358"
        textAnchor="middle"
        fill="white"
        fontWeight="bold"
        fontSize="27"
      >
        Paris
      </text>
    </a>
  </g>
)