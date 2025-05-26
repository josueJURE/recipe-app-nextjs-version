
"use client"; // Add this at the very top of the file


import { Card } from "@/components/ui/card";
import Map from "@/components/ui/map";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

export default function Home() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4">
      <Card className="w-full max-w-xl p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Interactive World Map</h1>
        <p className="text-center text-gray-600 mb-4">Click on any country to see its name</p>
        {/* <Map /> */}
        <ComposableMap >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
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
        </ComposableMap>
      </Card>
    </main>
  );
}
