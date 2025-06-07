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

interface FieldsetProps {
  onDietaryChange: (data: {
    vegan: boolean;
    other: { checked: boolean; text: string };
  }) => void;
  resetKey: number;
}

function Fieldset({ onDietaryChange, resetKey }: FieldsetProps) {
  const [veganChecked, setVeganChecked] = useState<boolean>(false);
  const [otherChecked, setOtherChecked] = useState<boolean>(false);
  const [otherText, setOtherText] = useState<string>("");

  React.useEffect(() => {
    setVeganChecked(false);
    setOtherChecked(false);
    setOtherText("");
  }, [resetKey]);

  function handleVeganChange(checked: boolean) {
    setVeganChecked(checked);
    onDietaryChange({
      vegan: checked,
      other: { checked: otherChecked, text: otherText },
    });
  }

  function handleOtherChange(checked: boolean) {
    setOtherChecked(checked);
    onDietaryChange({
      vegan: veganChecked,
      other: { checked, text: otherText },
    });
  }

  function handleUserInput(e: React.ChangeEvent<HTMLInputElement>): void {
    const text = e.target.value;
    setOtherText(text);
    onDietaryChange({
      vegan: veganChecked,
      other: { checked: otherChecked, text },
    });
  }

  const checkBoxesArray = [
    { boolanValue: veganChecked,
      callback: (checked: boolean) => handleVeganChange(checked as boolean),
      label: "vegan?"
     },
    {
      boolanValue: otherChecked,
      callback: (checked:boolean) => handleOtherChange(checked as boolean),
       label: "Other?"
    },
  ];

  return (
    <fieldset
      aria-label="allergies section"
      className="allergies align-self: flex-start"
    >
      <legend>Indicate any dietary requirements</legend>
      <div className="flex flex-row gap-6">

        {checkBoxesArray.map((checkBox, index) => (
          <div key={index} className="flex items-center gap-3">
            <Checkbox 
              checked={checkBox.boolanValue}
              onCheckedChange={checkBox.callback}
            />
            <Label htmlFor={checkBox.label}>{checkBox.label}</Label>
            {(otherChecked && checkBox.label === "Other?") && <Input onChange={handleUserInput} />}
          </div>
        ))}
        {/* <div className="flex items-center gap-3">
          <Checkbox
            checked={veganChecked}
            onCheckedChange={(checked) => handleVeganChange(checked as boolean)}
          />
          <Label htmlFor="vegan">Vegan?</Label>
        </div> */}

        {/* <div className="flex items-center gap-3">
          <Checkbox
            checked={otherChecked}
            onCheckedChange={(checked) => handleOtherChange(checked as boolean)}
          />
          <Label htmlFor="other">Other?</Label>
          {otherChecked && <Input onChange={handleUserInput} />}
        </div> */}
      </div>
    </fieldset>
  );
}

export default Fieldset;
