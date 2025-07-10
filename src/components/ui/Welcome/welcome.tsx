// "use client"

import { Button, Html } from "@react-email/components";
import * as React from "react";

export default function Welcome({recipe}: {recipe: string}) {
  return (
    <Html>
          <h1>Here's Your Recipe!</h1>
          <p>{recipe}</p>
      <Button
        href="https://example.com"
        style={{ background: "#000", color: "#fff", padding: "12px 20px" }}
      >
        {/* Click me */}
      </Button>
    </Html>
  );
}