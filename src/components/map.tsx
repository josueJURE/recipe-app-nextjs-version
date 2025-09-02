import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";

import { MapProps, GeographyFeature } from "@/utils/types";

import World from "@react-map/world";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

function Map({ handleCountrySelect, isDarkMode }: MapProps) {
  return (
    <World
      type="select-single"
      hints
      strokeColor={isDarkMode ? "#4B5563" : "#D6D6DA"}
      mapColor={isDarkMode ? "#374151" : "#EAEAEC"}
      hoverColor="#F53"
      size={500}
      onSelect={(state) => {
        handleCountrySelect(state ?? "");
      }}
      />
  );
}

export default Map;
