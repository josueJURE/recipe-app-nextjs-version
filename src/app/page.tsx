"use client"; // Add this at the very top of the file

import { Button } from "@/components/ui/button";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { Switch } from "@/components/ui/switch";
import { Tooltip } from "react-tooltip";
import React, { useState } from "react";
import Fieldset from "@/components/ui/fieldset";
import { useTheme } from "@/context/theme-context";
// import { Toaster } from "@/components/ui/sonner"
import { Toaster, toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

export default function Home() {
  const [dietaryData, setDietaryData] = useState<{
    vegan: boolean;
    other: { checked: boolean; text: string };
  }>({
    vegan: false,
    other: { checked: false, text: "" },
  });

  const [resetKey, setResetKey] = useState(0);

  const handleDietaryChange = (data: {
    vegan: boolean;
    other: { checked: boolean; text: string };
  }) => {
    setDietaryData(data);
    console.log("data:", data);
  };

  const [recipe, setRecipe] = useState<string>("");

  const { isDarkMode } = useTheme();

  const [country, setCountry] = useState<string>("");
  const [isElementVisible, setIsElementVisible] = useState<boolean>(true);

  const handleSubmit = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    if (country === "") {
      toast.error("select a country first");
      return;
    }
    try {
      const response = await fetch("/api/updateRecipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          countrySelected: country,
          dietaryRequirements: dietaryData,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch recipe");
      }
      // toast.success("information submitted!");
      const data = await response.json();
      setRecipe(data.recipe);
      setIsElementVisible(false);
      setDietaryData({
        vegan: false,
        other: { checked: false, text: "" },
      });
      setCountry("");
      setDietaryData({ vegan: false, other: { checked: false, text: "" } });
      setResetKey((prev) => prev + 1); // Trigger Fieldset reset
    } catch (error) {
      console.error(error);
      setRecipe("Failed to load recipe. Please try again.");
    } finally {
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4">
      <form className="w-full max-w-xl p-6 relative" onSubmit={handleSubmit}>
        <div className="flex flex-col items-center w-full border-2 border-black-500 rounded-2xl h-screen">
          <Switch className="my-5" />
          <Toaster
            richColors
            position="bottom-center"
            toastOptions={{
              className: "mx-auto",
            }}
          />

          <h1 id="header" className="text-2xl font-bold text-center mb-6 my-7">
            Unsure what to cook? Let recipe for sucess inspire your next meal
            from any country in the world
          </h1>
          <p className="text-center text-gray-600 mb-4">{country}</p>

          <Tooltip id="country-tooltip" style={{ zIndex: 100 }}>
            {country}
          </Tooltip>

          {isElementVisible && (
            <Card className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <Fieldset
                onDietaryChange={handleDietaryChange}
                resetKey={resetKey}
              />

              <ComposableMap data-tip="">
                <ZoomableGroup zoom={1}>
                  {" "}
                  <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                      geographies.map((geo) => (
                        <Geography
                          pointerEvents="auto"
                          onClick={() => {
                            setCountry(geo.properties.name);
                          }}
                          key={geo.rsmKey}
                          geography={geo}
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

              <Button type="submit">Submit</Button>
            </Card>
          )}

          {!isElementVisible && (
            <Card className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <CardContent>
                {" "}
                <p className="h-1/3 w-125 border-2 border-black-500 rounded-2xl overflow-scroll">
                  {recipe}
                </p>
              </CardContent>

              <Button type="button">Send recipe to my inbox</Button>
              <Button type="button" onClick={() => setIsElementVisible(true)}>
                I want another recipe
              </Button>
            </Card>
          )}
        </div>
      </form>
    </main>
  );
}
