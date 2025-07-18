"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import Fieldset from "@/components/ui/fieldset";
import Audio from "@/components/ui/audio";
import { Card, CardContent } from "@/components/ui/card";
import RecipeCardSkeleton from "@/components/ui/skeleton";
import { ButtonTypes, DietaryDataType } from "@/utils/types";

import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";

import { Tooltip } from "react-tooltip";
import React, { useState } from "react";
import { useTheme } from "@/context/theme-context";
import { Toaster, toast } from "sonner";
import { Input } from "@/components/ui/input";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

const dietaryObject = {
  vegan: false,
  other: { checked: false, text: "" },
};

export default function Home() {
  const [dietaryData, setDietaryData] =
    useState<DietaryDataType>(dietaryObject);
  const [resetKey, setResetKey] = useState(0);
  const [recipe, setRecipe] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [image, setImage] = useState<string | undefined>("");
  const { isDarkMode } = useTheme();
  const [country, setCountry] = useState<string>("");
  const [isElementVisible, setIsElementVisible] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSentInbox, setIsSentInbox] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");

  const handleCountrySelect = (countryName: string) => {
    setCountry(countryName);
    setSelectedCountry(countryName);
  };

  const folder = "updateRecipe"; // updateRecipe or mock to switch backend

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
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();

    if (!country) {
      toast.error("Please select a country first!");
      return;
    }

    setIsLoading(true);
    setIsElementVisible(false);
    // setRecipe("");
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

      while (!done) {
        //  let stream = ""
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        let formattedChunk = "";
        const chunk = decoder.decode(value).split("-");
        // const chunk = decoder.decode(value).split("-");
        // console.log("chunk.toString().trim():", chunk.toString().trim())
        // let trimmedString = chunk.toString().trim()
        // if  (/^\d/.test(trimmedString)) {
        //   formattedChunk += "\n- " + trimmedString;
        //   console.log(true)
        // } else {
        //   console.log(false)
        //   formattedChunk += " " + trimmedString;
        // }

        console.log(chunk);
        // stream += chunk
        setRecipe((prev) => prev + chunk);
      }

      setDietaryData(dietaryObject);
      setCountry("");
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
          <Toaster position="bottom-center" />

          {isElementVisible && (
            <>
              <h1 className="text-2xl font-bold text-center mb-6 my-7">
                Unsure what to cook? Let recipe for success inspire your next
                meal from any country in the world
              </h1>
              <p className="text-center text-gray-600 mb-4">{country}</p>
              <Tooltip id="country-tooltip" className="z-[100]">
                {country}
              </Tooltip>

              <Card className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Fieldset
                  onDietaryChange={handleDietaryChange}
                  resetKey={resetKey}
                />

                <ComposableMap>
                  <ZoomableGroup zoom={1}>
                    <Geographies geography={geoUrl}>
                      {({ geographies }) =>
                        geographies.map((geo) => (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            onClick={() =>
                              handleCountrySelect(geo.properties.name)
                            }
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
                          result.emailId
                            ? toast.success("Email was sent successfully!")
                            : toast.error("Your email wasn't sent.");
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




// "use client";

// // components/ui folder
// import { Button } from "@/components/ui/button";
// import { Switch } from "@/components/ui/switch";
// import Fieldset from "@/components/ui/fieldset";
// import Audio from "@/components/ui/audio";
// import { Card, CardContent } from "@/components/ui/card";
// import RecipeCardSkeleton from "@/components/ui/skeleton";
// import { ApiResponse, ButtonTypes, DietaryDataType } from "@/utils/types";

// // single map third-party library
// import {
//   ComposableMap,
//   Geographies,
//   Geography,
//   ZoomableGroup,
// } from "react-simple-maps";
// // nodemailer

// //others
// import { Tooltip } from "react-tooltip";
// import React, { useState } from "react";
// import { useTheme } from "@/context/theme-context";
// import { Toaster, toast } from "sonner";
// import { Input } from "@/components/ui/input";
// import { Car } from "lucide-react";

// const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

// const dietaryObject = {
//   vegan: false,
//   other: { checked: false, text: "" },
// };

// export default function Home() {
//   const [dietaryData, setDietaryData] =
//     useState<DietaryDataType>(dietaryObject);
//   const [resetKey, setResetKey] = useState(0);
//   const [recipe, setRecipe] = useState<string>("");
//   const [image, setImage] = useState<string | undefined>("");
//   const { isDarkMode } = useTheme();
//   const [country, setCountry] = useState<string>("");
//   const [isElementVisible, setIsElementVisible] = useState<boolean>(true);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [isSentInbox, setIsSentInbox] = useState<boolean>(false);
//   const [userEmail, setUserEmail] = useState<string>("");
//   const [selectedCountry, setSelectedCountry] = useState<string>("");
//   const [answer, setAnswer] = useState("")

//   const handleCountrySelect = (countryName: string) => {
//     setCountry(countryName);
//     setSelectedCountry(countryName);
//   };

//   async function fetchData(
//     url: string,
//     body: Record<string, string | DietaryDataType>
//   ): Promise<Response> {
//     const response = await fetch(url, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(body),

//     });
//     return response;
//   }

//   const handleDietaryChange = (data: DietaryDataType) => {
//     setDietaryData(data);
//     console.log("data:", data);
//   };

//   const buttonsArray: ButtonTypes[] = [
//     {
//       width: "w-60",
//       type: "button",
//       label: "Send recipe to my inbox",
//       onInboxBtn: () => setIsSentInbox(true),
//     },
//     {
//       width: "w-60",
//       type: "button",
//       label: "I want another recipe",
//       onClick: () => setIsElementVisible(true),
//       onRemoveImage: () => setImage(""),
//       onInboxBtn: () => setIsSentInbox(false),
//     },
//   ];

//   const handleSubmit = async (e: React.FormEvent<HTMLElement>) => {
//     e.preventDefault();
//     if (country === "") {
//       toast.error("select a country first");
//       return;
//     }

//     setIsLoading(true);
//     setIsElementVisible(false);
//     setRecipe("")

//     try {
//       const response = await fetchData("/api/updateRecipe", {
//         countrySelected: selectedCountry,
//         dietaryRequirements: dietaryData,
//       });

//       if (!response.ok) {
//         // Server returned an error JSON
//         const errorData = await response.json();
//         throw new Error(errorData?.error || "An unknown error occurred");
//       }

//       if (!response.body) {
//         throw new Error("No response body received from server.");
//       }

//       // Success: read text stream
//       const reader = response.body.getReader();
//       const decoder = new TextDecoder();
//       let done = false;

//       while (!done) {
//         const { value, done: doneReading } = await reader.read();
//         done = doneReading;
//         if (value) {
//           const chunk = decoder.decode(value);
//           setRecipe((prev) => prev + chunk);
//         }
//       }

//       setDietaryData(dietaryObject);
//       setCountry("");
//       setResetKey((prev) => prev + 1);

//     } catch (error) {
//       console.error(error);
//       setRecipe(`Error: ${error instanceof Error ? error.message : String(error)}`);
//       setIsElementVisible(true);
//     } finally {
//       setIsLoading(false);
//     }

//     // try {
//     //   const response = await fetchData("/api/updateRecipe", {
//     //     countrySelected: selectedCountry,
//     //     dietaryRequirements: dietaryData,
//     //   });

//     //   // const data: ApiResponse = await response.json();

//     //   if (!response.ok || !response.body) {
//     //     throw new Error("Failed to fetch recipe");

//     //   }

//     //   const reader = response.body.getReader();
//     //   const decoder = new TextDecoder();
//     //   let done = false;

//     //   while (!done) {
//     //     const { value, done: doneReading } = await reader.read();
//     //     done = doneReading;
//     //     const chunk = decoder.decode(value);
//     //     setRecipe((prev) => prev + chunk);
//     //   }

//     //   // console.log(data.recipeImage);
//     //   // console.log("emailId", data.emailId);
//     //   // setRecipe(data.recipe);
//     //   setDietaryData(dietaryObject);
//     //   setCountry("");
//     //   setResetKey((prev) => prev + 1); // Trigger Fieldset reset
//     // } catch (error) {
//     //   console.error(error);
//     //   setRecipe("Failed to load recipe. Please try again.");
//     //   setIsElementVisible(true); // Show form again on error
//     // } finally {
//     //   setIsLoading(false); // Always set loading to false when done
//     // }
//   };

//   return (
//     <main className="min-h-screen w-full flex items-center justify-center p-4 ">
//       <form
//         id="form"
//         className="w-full max-w-xl p-6 relative bg-gray-700 bg-[url('/path/to/image.jpg')] rounded-2xl"
//         onSubmit={handleSubmit}
//         style={image ? { backgroundImage: `url('${image}')` } : undefined}
//       >
//         <div className="flex flex-col items-center w-full border-2 border-black-500 rounded-2xl h-screen">
//           <Switch className="my-5" />
//           <Toaster
//             richColors
//             position="bottom-center"
//             toastOptions={{
//               className: "mx-auto",
//             }}
//           />

//           {isElementVisible && (
//             <h1
//               id="header"
//               className="text-2xl font-bold text-center mb-6 my-7"
//             >
//               Unsure what to cook? Let recipe for sucess inspire your next meal
//               from any country in the world
//             </h1>
//           )}
//           <p className="text-center text-gray-600 mb-4">{country}</p>

//           <Tooltip id="country-tooltip" className="z-[100]">
//             {country}
//           </Tooltip>

//           {isElementVisible && (
//             <Card className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
//               <Fieldset
//                 onDietaryChange={handleDietaryChange}
//                 resetKey={resetKey}
//               />

//               <ComposableMap data-tip="">
//                 <ZoomableGroup zoom={1}>
//                   <Geographies geography={geoUrl}>
//                     {({ geographies }) =>
//                       geographies.map((geo) => (
//                         <Geography
//                           pointerEvents="auto"
//                           onClick={() => {
//                             handleCountrySelect(geo.properties.name);
//                           }}
//                           key={geo.rsmKey}
//                           geography={geo}
//                           fill={isDarkMode ? "#374151" : "#EAEAEC"}
//                           stroke={isDarkMode ? "#4B5563" : "#D6D6DA"}
//                           style={{
//                             default: { outline: "none" },
//                             hover: { fill: "#F53" },
//                             pressed: { fill: "#E42" },
//                           }}
//                         />
//                       ))
//                     }
//                   </Geographies>
//                 </ZoomableGroup>
//               </ComposableMap>

//               <Button id="submit" type="submit" disabled={isLoading}>
//                 {isLoading ? "Loading..." : "Submit"}
//               </Button>
//             </Card>
//           )}

//           {/* Show skeleton while loading */}
//           {isLoading && (
//             <Card className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-full">
//               <CardContent className="flex justify-center flex-col items-center gap-0">
//                 <RecipeCardSkeleton />
//               </CardContent>
//             </Card>
//           )}

//           {!isElementVisible && (
//             <Card className="z-[100] h-1/3 w-125 border-2 border-black-500 rounded-2xl overflow-scroll">
//               {recipe}
//             </Card>
//           )}

//           {/* Show recipe when not loading and form is hidden */}
//           {!isElementVisible && !isLoading && (
//             <Card className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-full">
//               <CardContent className=" flex justify-center flex-col items-center gap-0">
//                 {/* <p className="h-1/3 w-125 border-2 border-black-500 rounded-2xl overflow-scroll">
//                   {recipe}
//                 </p> */}
//                 <div className="flex flex-col gap-2 mt-40">
//                   {buttonsArray.map((button, index) => (
//                     <Button
//                       onClick={() => {
//                         button.onClick?.();
//                         button.onRemoveImage?.();
//                         button.onInboxBtn?.();
//                       }}
//                       key={index}
//                       className={button.width}
//                       type={button.type}
//                     >
//                       {button.label}
//                     </Button>
//                   ))}
//                 </div>
//                 <Audio />
//               </CardContent>
//               {isSentInbox && (
//                 <CardContent className="flex justify-center flex-col items-center gap-0">
//                   <Input
//                     placeholder="enter a valid email"
//                     className="text-center"
//                     type="email"
//                     value={userEmail}
//                     onChange={(e) => setUserEmail(e.target.value)}
//                   />
//                   <Button
//                     type="button"
//                     onClick={async () => {
//                       try {
//                         const response = await fetchData("/api/updateRecipe", {
//                           countrySelected: selectedCountry,
//                           dietaryRequirements: dietaryData,
//                           email: userEmail || "josue.jure@gmail.com",
//                         });

//                         const result: ApiResponse = await response.json();

//                         if (!response.ok) {
//                           throw new Error("Request failed");
//                         }

//                         if (userEmail) {
//                           result.emailId
//                             ? toast.success("Emial was sent successfully")
//                             : toast.error("Your email wasn't sent");
//                         }

//                         setImage(result.recipeImage);

//                         console.log("emailId", result.emailId);

//                         console.log(result);
//                       } catch (error) {
//                         console.error(error);
//                       } finally {
//                         setUserEmail("");
//                       }
//                     }}
//                   >
//                     Send to my inbox
//                   </Button>
//                 </CardContent>
//               )}
//             </Card>
//           )}
//         </div>
//       </form>
//     </main>
//   );
// }

