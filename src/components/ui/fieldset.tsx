import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "./input";
import { Label } from "@/components/ui/label";

const dietaryRequirements = [
  {
    question: "Vegan?",
  },
  {
    question: "Other?",
  },
];

function Fieldset() {
  const [input, setInput] = useState<boolean>(false);
  function handleToggleOfDietaryRequirements() {
    return setInput((checked) => !checked);
  }
  console.log(input);
  return (
    <fieldset aria-label="allergies section" className="allergies">
      <legend>Indicate any dietary requirements</legend>
      <div className="flex flex-row gap-6">
        {dietaryRequirements.map((requirement, index) =>
          requirement.question === "Other?" ? (
            <div className="flex items-center gap-3">
              <Checkbox
                checked={input}
                onCheckedChange={() => {
                  handleToggleOfDietaryRequirements();
                }}
              />
              <Label htmlFor="terms">Other?</Label>
              {input && <Input />}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {" "}
              <Checkbox />
              <Label htmlFor="terms">lactose intolerant?</Label>
            </div>
          )
        )}
    
      </div>
    </fieldset>
  );
}

export default Fieldset;
