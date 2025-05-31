import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

function Fieldset() {
  return (
    <fieldset aria-label="allergies section" className="allergies">
      <legend className="legend">Indicate any dietary requirements</legend>
      <div className="flex flex-row gap-6">
        <div className="flex items-center gap-3">
          {" "}
          <Checkbox />
          <Label htmlFor="terms">lactose intolerant?</Label>
        </div>
        <div className="flex items-center gap-3">
          <Checkbox />
          <Label htmlFor="terms">Vegan?</Label>
        </div>
        <div className="flex items-center gap-3">
          <Checkbox />
          <Label htmlFor="terms">Other?</Label>
          <input/>
        </div>

    
      </div>
    </fieldset>
  );
}

export default Fieldset;
