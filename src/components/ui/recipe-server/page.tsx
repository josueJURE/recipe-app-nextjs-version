import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import RecipeUI from "../recipe-ui/page"

export default async function RecipePage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    redirect("/")
  }

//   return <RecipeUI name={session.user} />
  return <RecipeUI />
}
