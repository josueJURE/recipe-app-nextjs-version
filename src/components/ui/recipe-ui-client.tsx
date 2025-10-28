"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import Fieldset from "@/components/ui/fieldset";
import Audio from "@/components/ui/audio";
import { Card, CardContent } from "@/components/ui/card";
import RecipeCardSkeleton from "@/components/ui/skeleton";
import { ButtonTypes, DietaryDataType } from "@/utils/types";

import Map from "@/components/map";

import { Tooltip } from "react-tooltip";
import React, { useState } from "react";
import { useTheme } from "@/context/theme-context";
import { Toaster, toast } from "sonner";
import { Input } from "@/components/ui/input";

import { useRouter } from "next/navigation";

interface RecipeUIProps {
  email: string;
  name: string;

  // id: string;
  // createdAt: Date;
  // updatedAt: Date;
  // email: string;
  // emailVerified: boolean;
  // name: string;
  // image?: string | null | undefined | undefined;
}

const dietaryObject = {
  vegan: false,
  other: { checked: false, text: "" },
};

export default function RecipeUI(userProps: RecipeUIProps) {
  const router = useRouter();
  const [dietaryData, setDietaryData] =
    useState<DietaryDataType>(dietaryObject);
  const [resetKey, setResetKey] = useState(0);
  const [recipe, setRecipe] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [image, setImage] = useState<string | undefined>("");
  const { isDarkMode } = useTheme();
  const [isElementVisible, setIsElementVisible] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSentInbox, setIsSentInbox] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");

  const handleCountrySelect = (countryName: string) => {
    setSelectedCountry(countryName);
  };

  const handleSignOut = () => {
    router.push("/sign-in");
  };

  const folder = "mock"; // updateRecipe or mock to switch backend

  console.log(userProps);

  async function fetchData(
    url: string,
    body: Record<string, string | DietaryDataType>
  ): Promise<Response> {
    return fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }

  const handleDietaryChange = (data: DietaryDataType) => {
    setDietaryData(data);
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
    {
      width: "w-60",
      type: "button",
      label: "Sign out",
      onClick: () => handleSignOut(),
    },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLElement>) => {
    {
      console.log("selectedCountry", selectedCountry);
    }
    e.preventDefault();

    if (!selectedCountry) {
      toast.error("Please select a country first!");
      return;
    }

    setIsLoading(true);
    setIsElementVisible(false);
    setErrorMessage(null);

    try {
      const response = await fetchData(`/api/${folder}`, {
        countrySelected: selectedCountry,
        dietaryRequirements: dietaryData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || "An unknown error occurred");
      }

      if (!response.body) {
        throw new Error("No response body received.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let count = 0;

      while (!done) {
        const { value, done: doneReading } = await reader.read();

        count += 1;
        done = doneReading;

        const chunk = decoder.decode(value).split("-");

        setRecipe((prev) => prev + chunk);
      }

      setDietaryData(dietaryObject);

      console.log(selectedCountry);

      setResetKey((prev) => prev + 1);
    } catch (error) {
      console.error(error);
      setErrorMessage(error instanceof Error ? error.message : String(error));
      setIsElementVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4">
      <form
        id="form"
        className="w-full max-w-xl p-6 relative bg-gray-700 rounded-2xl"
        onSubmit={handleSubmit}
        style={image ? { backgroundImage: `url('${image}')` } : undefined}
      >
        <div className="flex flex-col items-center w-full border-2 border-black-500 rounded-2xl h-screen">
          <Switch className="my-5" />
          <div>
            <div>Welcome Back {userProps.name}</div>
          </div>
          <Toaster position="bottom-center" />

          {isElementVisible && (
            <>
              {/* <h1 className="text-2xl font-bold text-center mb-6 my-7">
                Unsure what to cook? Let recipe for success inspire your next
                meal from any country in the world
              </h1> */}
              <p className="text-center text-gray-600 mb-4">
                {selectedCountry}
              </p>
              <Tooltip id="country-tooltip" className="z-[100]">
                {selectedCountry}
              </Tooltip>

              <Card className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Fieldset
                  onDietaryChange={handleDietaryChange}
                  resetKey={resetKey}
                />

                <Map
                  handleCountrySelect={handleCountrySelect}
                  isDarkMode={isDarkMode}
                />

                <Button id="submit" type="submit" disabled={isLoading}>
                  {isLoading ? "Loading..." : "Submit"}
                </Button>
                <Button type="button" onClick={handleSignOut}>
                  Sign out
                </Button>
              </Card>
            </>
          )}

          {isLoading && (
            <Card className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-full">
              <CardContent className="flex justify-center items-center">
                <RecipeCardSkeleton />
              </CardContent>
            </Card>
          )}

          {!isElementVisible && (
            <Card className="z-[100] h-1/3 w-125 border-2 border-black-500 rounded-2xl overflow-scroll">
              {errorMessage ? (
                <p className="text-red-500">{errorMessage}</p>
              ) : (
                <p>{recipe}</p>
              )}
            </Card>
          )}

          {!isElementVisible && !isLoading && (
            <Card className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-full">
              <CardContent className="flex flex-col items-center gap-0">
                <div className="flex flex-col gap-2 mt-40">
                  {buttonsArray.map((button, index) => (
                    <Button
                      key={index}
                      className={button.width}
                      type={button.type}
                      onClick={() => {
                        button.onClick?.();
                        button.onRemoveImage?.();
                        button.onInboxBtn?.();
                      }}
                    >
                      {button.label}
                    </Button>
                  ))}
                </div>
                <Audio />
              </CardContent>
              {isSentInbox && (
                <CardContent className="flex flex-col items-center gap-0">
                  <Input
                    placeholder="Enter a valid email"
                    className="text-center"
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                  />
                  <Button
                    type="button"
                    onClick={async () => {
                      try {
                        const response = await fetchData(`/api/${folder}`, {
                          countrySelected: selectedCountry,
                          dietaryRequirements: dietaryData,
                          email: userEmail || "josue.jure@gmail.com",
                        });
                        const result = await response.json();
                        if (!response.ok)
                          throw new Error(result.error || "Request failed");
                        if (userEmail) {
                          if (result.emailId) {
                            toast.success("Email was sent successfully!");
                          } else {
                            toast.error("Your email wasn't sent.");
                          }
                        }
                        setImage(result.recipeImage);
                      } catch (error) {
                        console.error(error);
                      } finally {
                        setUserEmail("");
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
