import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";

import { MapProps, GeographyFeature } from "@/utils/types";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

function Map({ handleCountrySelect, isDarkMode }: MapProps) {
  return (
    <ComposableMap>
      <ZoomableGroup zoom={1}>
        <Geographies geography={geoUrl}>
          {({ geographies }: { geographies: GeographyFeature[] }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                onClick={() => handleCountrySelect(geo.properties.name)}
                fill={isDarkMode ? "#374151" : "#EAEAEC"}
                stroke={isDarkMode ? "#4B5563" : "#D6D6DA"}
                style={{
                  default: { outline: "none" },
                  hover: { fill: "#F53" },
                  pressed: { fill: "#E42" },
                }}
              />
            ))
          }
        </Geographies>
      </ZoomableGroup>
    </ComposableMap>
  );
}

export default Map;
