"use client"; // Add this at the very top of the file

import { Card } from "@/components/ui/card";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Annotation,
  ZoomableGroup,
} from "react-simple-maps";
import { Switch } from "@/components/ui/switch";
import { Tooltip } from "react-tooltip";
import React, { useState } from "react";

const markers = [
  {
    markerOffset: -15,
    name: "Sau Paulo",
    coordinates: [-58.3016,-34.6037],
  }
]

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

export default function Home() {
  const [content, setContent] = useState<string>("");
  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4">
      <Card className="w-full max-w-xl p-6">
        <Switch />
        <h1 className="text-2xl font-bold text-center mb-6">
          Unsure what to cook? Let recipe for sucess inspire your next meal from
          any country in the world
        </h1>
        <h1>{content}</h1>
        <p className="text-center text-gray-600 mb-4">Select a country</p>
        <Tooltip id="country-tooltip" style={{ zIndex: 100 }}>{content}</Tooltip>

        <ComposableMap data-tip="">
          <ZoomableGroup zoom={1}>
            {" "}
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                  onMouseEnter={()=> {
                    const NAME = geo.properties.name;
                    console.log("countries name;", geo.properties.name)
                    setContent(NAME)
                  } }
                  onMouseLeave={() =>{
                    setContent("")
                  }}
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#EAEAEC"
                    stroke="#D6D6DA"
                    style={{
                      default: { outline: "none" },
                      hover: { fill: "#F53" },
                      pressed: { fill: "#E42" },
                    }}
                  />
                ))
              }
            </Geographies>
            {/* {markers.map({name, coordinates, markerOffset})} */}
     
          </ZoomableGroup>
        </ComposableMap>
      </Card>
    </main>
  );
}





   