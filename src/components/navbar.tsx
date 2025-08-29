import React from "react";
import Link from "next/link";
import { AirVent } from "lucide-react";
import { buttonVariants } from "./ui/button";


function Navbar() {
  return (
    <div className="border-b px-4">
      <div className="flex tiems-center justify-between mx-auto max-w-4xl h-16k">

        <Link href="/" className="flex items-center gap-2">
        <AirVent className="h-6 w-6"/>
        <span className="font-boldk">nextsecure.</span>
        
        </Link>
        <div>
            <Link href="/sign-in" className={buttonVariants()} >
                Sign in
            </Link>
        </div>
        {/* <h1>right</h1> */}
      </div>
    </div>
  );
}

export default Navbar;
