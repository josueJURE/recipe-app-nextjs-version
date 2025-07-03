"use client";

// components/ui folder
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import Fieldset from "@/components/ui/fieldset";
import Audio from "@/components/ui/audio";
import { Card, CardContent } from "@/components/ui/card";
import RecipeCardSkeleton from "@/components/ui/skeleton";

// single map third-party library
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
// nodemailer

//others
import { Tooltip } from "react-tooltip";
import React, { useState } from "react";
import { useTheme } from "@/context/theme-context";
import { Toaster, toast } from "sonner";
import { Input } from "@/components/ui/input";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

interface ButtonTypes {
  width: `w-${number}`;
  type: "button";
  label: string;
  onClick?: () => void;
  onRemoveImage?: () => void;
  onInboxBtn?: () => void;
}

export default function Home() {
  const [dietaryData, setDietaryData] = useState<{
    vegan: boolean;
    other: { checked: boolean; text: string };
  }>({
    vegan: false,
    other: { checked: false, text: "" },
  });

  const [resetKey, setResetKey] = useState(0);
  const [recipe, setRecipe] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const { isDarkMode } = useTheme();
  const [country, setCountry] = useState<string>("");
  const [isElementVisible, setIsElementVisible] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSentInbox, setIsSentInbox] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>("");

  const handleDietaryChange = (data: {
    vegan: boolean;
    other: { checked: boolean; text: string };
  }) => {
    setDietaryData(data);
    console.log("data:", data);
  };

  const buttonsArray: ButtonTypes[] = [
    {
      width: "w-60",
      type: "button",
      label: "Send recipe to my inbox",
      onInboxBtn: () => setIsSentInbox(true),
    },
    {
      width: "w-60",
      type: "button",
      label: "I want another recipe",
      onClick: () => setIsElementVisible(true),
      onRemoveImage: () => setImage(""),
      onInboxBtn: () => setIsSentInbox(false),
    },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    if (country === "") {
      toast.error("select a country first");
      return;
    }

    console.log("userEmail: JJ", userEmail);

    setIsLoading(true); // Set loading to true when starting the request
    setIsElementVisible(false); // Hide the form immediately

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

      const data = await response.json();
      // setImage(data.recipeImage);
      setRecipe(data.recipe);
      setDietaryData({
        vegan: false,
        other: { checked: false, text: "" },
      });
      setCountry("");

      setResetKey((prev) => prev + 1); // Trigger Fieldset reset
    } catch (error) {
      console.error(error);
      setRecipe("Failed to load recipe. Please try again.");
      setIsElementVisible(true); // Show form again on error
    } finally {
      setIsLoading(false); // Always set loading to false when done
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 ">
      <form
        id="form"
        className="w-full max-w-xl p-6 relative bg-gray-700 bg-[url('/path/to/image.jpg')] rounded-2xl"
        onSubmit={handleSubmit}
        style={{ backgroundImage: `url('${image}')` }}
      >
        <div className="flex flex-col items-center w-full border-2 border-black-500 rounded-2xl h-screen">
          <Switch className="my-5" />
          <Toaster
            richColors
            position="bottom-center"
            toastOptions={{
              className: "mx-auto",
            }}
          />

          {isElementVisible && (
            <h1
              id="header"
              className="text-2xl font-bold text-center mb-6 my-7"
            >
              Unsure what to cook? Let recipe for sucess inspire your next meal
              from any country in the world
            </h1>
          )}
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

              <Button id="submit" type="submit" disabled={isLoading}>
                {isLoading ? "Loading..." : "Submit"}
              </Button>
            </Card>
          )}

          {/* Show skeleton while loading */}
          {isLoading && (
            <Card className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-full">
              <CardContent className="flex justify-center flex-col items-center gap-0">
                <RecipeCardSkeleton />
              </CardContent>
            </Card>
          )}

          {/* Show recipe when not loading and form is hidden */}
          {!isElementVisible && !isLoading && (
            <Card className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-full">
              <CardContent className=" flex justify-center flex-col items-center gap-0">
                <p className="h-1/3 w-125 border-2 border-black-500 rounded-2xl overflow-scroll">
                  {recipe}
                </p>
                <div className="flex flex-col gap-2 mt-40">
                  {buttonsArray.map((button, index) => (
                    <Button
                      onClick={() => {
                        button.onClick?.();
                        button.onRemoveImage?.();
                        button.onInboxBtn?.();
                        button.onInboxBtn?.();
                      }}
                      key={index}
                      className={button.width}
                      type={button.type}
                    >
                      {button.label}
                    </Button>
                  ))}
                </div>
                <Audio />
              </CardContent>
              {isSentInbox && (
                <CardContent className="flex justify-center flex-col items-center gap-0">
                  <Input
                    placeholder="enter a valid email"
                    className="text-center"
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                  />
                  <Button
                    type="button"
                    onClick={async () => {
                      try {
                        const response = await fetch("/api/updateRecipe", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            countrySelected: country,
                            dietaryRequirements: dietaryData,
                            email: userEmail || "josue.jure@gmail.com",
                          }),
                        });
                        if (!response.ok) {
                          throw new Error("Failed to send email");
                        }
                        const result = await response.json();
                        toast.success("an email was send to your inbox");
                        console.log(result);
                        setUserEmail("");
                      } catch (error) {
                        console.error(error);
                      } 
                    }}
                  >
                    Send to my inbox
                  </Button>
                </CardContent>
              )}
            </Card>
          )}
        </div>
      </form>
    </main>
  );
}
