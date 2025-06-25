"use client"

import * as React from 'react';
import { Html, Button } from "@react-email/components";

interface EmailProps {
  url: string;
}

export function Email() {
  // const { url } = props;

  return (
    <Html lang="en">
      <Button href="http://localhost:3000/">Click me</Button>
    </Html>
  );
}

export default Email;