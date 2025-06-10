"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
    //   className="toaster group"
    //   style={
    //     {
    //       "--normal": "var(--popover)",
    //       "--normal-text": "var(--popover-foreground)",
    //       "--normal-border": "var(--border)",
    //     //   "--toaster-width": "400px",  // Define as CSS variable
    //     //   "--toaster-height": "200px",
    //     //   width: "var(--toaster-width)",
    //     //   height: "var(--toaster-height)",
       
    //     } as React.CSSProperties
    //   }
      {...props}
    />
  )
}

export { Toaster }
