"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface RecipeVariables {
  country?: string;
  vegan: boolean;
  lactoseIntolerant: boolean;
  specialRequest?: string;
}

interface RecipeVariablesContextType {
  recipeVariables: RecipeVariables;
  updateCountry: (country: string) => void;
  updateVegan: (vegan: boolean) => void;
  updateLactoseIntolerant: (lactoseIntolerant: boolean) => void;
  updateSpecialRequest: (specialRequest: string) => void;
  submitRecipeRequest: () => Promise<string>;
}

const RecipeVariablesContext = createContext<RecipeVariablesContextType | undefined>(undefined);

export function RecipeVariablesProvider({ children }: { children: ReactNode }) {
  const [recipeVariables, setRecipeVariables] = useState<RecipeVariables>({
    country: undefined,
    vegan: false,
    lactoseIntolerant: false,
    specialRequest: undefined,
  });

  const updateCountry = (country: string) => {
    setRecipeVariables(prev => ({ ...prev, country }));
  };

  const updateVegan = (vegan: boolean) => {
    setRecipeVariables(prev => ({ ...prev, vegan }));
  };

  const updateLactoseIntolerant = (lactoseIntolerant: boolean) => {
    setRecipeVariables(prev => ({ ...prev, lactoseIntolerant }));
  };

  const updateSpecialRequest = (specialRequest: string) => {
    setRecipeVariables(prev => ({ ...prev, specialRequest }));
  };

  const submitRecipeRequest = async (): Promise<string> => {
    try {
      const response = await fetch("/api/updateRecipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recipeVariables),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recipe');
      }

      const data = await response.json();
      return data.recipe;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to load recipe. Please try again.");
    }
  };

  return (
    <RecipeVariablesContext.Provider 
      value={{
        recipeVariables,
        updateCountry,
        updateVegan,
        updateLactoseIntolerant,
        updateSpecialRequest,
        submitRecipeRequest,
      }}
    >
      {children}
    </RecipeVariablesContext.Provider>
  );
}

export function useRecipeVariables() {
  const context = useContext(RecipeVariablesContext);
  if (context === undefined) {
    throw new Error("useRecipeVariables must be used within a RecipeVariablesProvider");
  }
  return context;
}

export type { RecipeVariables };
