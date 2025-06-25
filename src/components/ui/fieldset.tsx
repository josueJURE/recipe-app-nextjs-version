import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "./input";
import { Label } from "@/components/ui/label";



interface FieldsetProps {
  onDietaryChange: (data: {
    vegan: boolean;
    other: { checked: boolean; text: string };
  }) => void;
  resetKey: number;
}

interface checkBoxeType {
  booleanValue: boolean;
  callback: (checked: boolean) => void;
  label: string;

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

  const checkBoxesArray: checkBoxeType[] = [
    { booleanValue: veganChecked,
      callback: handleVeganChange,
      label: "vegan"
     },
    {
      booleanValue: otherChecked,
      callback: handleOtherChange,
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
              checked={checkBox.booleanValue}
              onCheckedChange={checkBox.callback}
            />
            <Label htmlFor={checkBox.label}>{checkBox.label}</Label>
            {(otherChecked && checkBox.label === "Other?") && <Input onChange={handleUserInput} />}
          </div>
        ))}
      </div>
    </fieldset>
  );
}

export default Fieldset;
