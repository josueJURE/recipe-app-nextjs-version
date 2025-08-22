export interface ApiResponse {
    recipe: string;
    emailId?: string;
    success: boolean;
    recipeImage?: string;
  }

  export interface ButtonTypes {
    width: `w-${number}`;
    type: "button";
    label: string;
    onClick?: () => void;
    onRemoveImage?: () => void;
    onInboxBtn?: () => void;
  }

 export interface DietaryDataType {
    vegan: boolean;
    other: { checked: boolean; text: string };
  }

  export interface MapProps {
    handleCountrySelect: (countryName: string) => void;
    isDarkMode: boolean;
  }
  
  export interface GeographyFeature {
      rsmKey: string;
      properties: Record<string, string>;
    }