"use client"; // Add this at the very top of the file

import { Card } from "@/components/ui/card";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { Switch } from "@/components/ui/switch";
import { Tooltip } from "react-tooltip";
import React, { useState } from "react";
import Fieldset from "@/components/ui/fieldset"

import { Suspense } from "react";



const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

export default function Home() {
  const [content, setContent] = useState<string>("");
  const [recipe, setRecipe] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleCountryClick = async (countryName: string) => {
    setIsLoading(true)
    try {

  
      const response = await fetch("/api/updateRecipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({country: countryName})
      });
      if (!response.ok) {
        throw new Error('Failed to fetch recipe');
      }
      const data = await response.json()
      setRecipe(data.recipe)
    }
    catch (error) {
      console.error(error)
      setRecipe("Failed to load recipe. Please try again.");
    } finally {
      setIsLoading(false);
    }
  } 
  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4">
      <Card className="w-full max-w-xl p-6">
        <Switch />
       
        <h1 className="text-2xl font-bold text-center mb-6">
          Unsure what to cook? Let recipe for sucess inspire your next meal from
          any country in the world
        </h1>
        <p className="text-center text-gray-600 mb-4">{content}</p>
        <Tooltip id="country-tooltip" style={{ zIndex: 100 }}>{content}</Tooltip>
        <Fieldset/>
     
     

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
                  onClick={() => {
                    handleCountryClick(geo.properties.name);
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
        <p>{recipe}</p>
      </Card>
    </main>
  );
}





   