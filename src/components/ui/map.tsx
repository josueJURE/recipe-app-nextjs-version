"use client";

// import React, { useState } from 'react';
// import {
//   ComposableMap,
//   Geographies,
//   Geography,
// } from 'react-simple-maps';

// const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@3/countries-110m.json";

// function Map() {
//   const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

//   const handleCountryClick = (geo: any) => {
//     const countryName = geo.properties.NAME;
//     setSelectedCountry(countryName);
//     console.log('Selected country:', countryName);
//   };

//   return (
//     <div className="w-full max-w-4xl mx-auto">
//       {selectedCountry && (
//         <div className="mb-4 p-4 bg-blue-100 rounded-lg text-center">
//           <h3 className="text-lg font-semibold">Selected Country: {selectedCountry}</h3>
//         </div>
//       )}
      
//       <ComposableMap
//         projection="geoMercator"
//         projectionConfig={{
//           scale: 100,
//         }}
//         style={{
//           width: "100%",
//           height: "auto",
//         }}
//       >
//         <Geographies geography={geoUrl}>
//           {({ geographies }) =>
//             geographies.map((geo) => (
//               <Geography
//                 key={geo.rsmKey}
//                 geography={geo}
//                 onClick={() => handleCountryClick(geo)}
//                 style={{
//                   default: {
//                     fill: "#D6D6DA",
//                     outline: "none",
//                     stroke: "#FFFFFF",
//                     strokeWidth: 0.5,
//                   },
//                   hover: {
//                     fill: "#F53E3E",
//                     outline: "none",
//                     cursor: "pointer",
//                   },
//                   pressed: {
//                     fill: "#E42E2E",
//                     outline: "none",
//                   },
//                 }}
//               />
//             ))
//           }
//         </Geographies>
//       </ComposableMap>
//     </div>
//   );
// }

import React from "react"
import { ComposableMap, Geographies, Geography } from "react-simple-maps"

const geoUrl =
  "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json"

export default function Map() {
  return (
    <ComposableMap>
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography key={geo.rsmKey} geography={geo} />
          ))
        }
      </Geographies>
    </ComposableMap>
  )
}


