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
  const [text, setText] = useState<string>("");
  function handleToggleOfDietaryRequirements() {
    return setInput((checked) => !checked);
  }
  function handleUserInput(e: React.ChangeEvent<HTMLInputElement>): void {
    setText(e.target.value);
  }
  console.log(input);
  console.log(text);

  return (
    <fieldset aria-label="allergies section" className="allergies">
      <legend>Indicate any dietary requirements</legend>
      <div className="flex flex-row gap-6">
        {dietaryRequirements.map((requirement, index) =>
          requirement.question === "Other?" ? (
            <div className="flex items-center gap-3" key={index}>
              <Checkbox
                checked={input}
                onCheckedChange={() => {
                  handleToggleOfDietaryRequirements();
                }}
              />
              <Label htmlFor="terms">Other?</Label>
              {input && <Input onChange={handleUserInput} />}
            </div>
          ) : (
            <div className="flex items-center gap-3" key={index}>
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
