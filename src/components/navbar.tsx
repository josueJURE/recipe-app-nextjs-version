import React from "react";
import Link from "next/link";
import { AirVent } from "lucide-react";
import { buttonVariants } from "./ui/button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Button } from "@react-email/components";

const h = headers();

console.log("headers", h);

async function Navbar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  console.log("session", session);
  return (
    <div className="border-b px-4">
      <div className="flex tiems-center justify-between mx-auto max-w-4xl h-16k">
        <Link href="/" className="flex items-center gap-2">
          <AirVent className="h-6 w-6" />
          <span className="font-boldk">nextsecure.</span>
        </Link>
        <div>
          {" "}
          {session ? (
            <form>
              <Button type="submit">Sign Out</Button>
            </form>
          ) : (
            <Link href="/sign-in" className={buttonVariants()}>
              Sign in
            </Link>
          )}
        </div>
        {/* <h1>right</h1> */}
      </div>
    </div>
  );
}

export default Navbar;
