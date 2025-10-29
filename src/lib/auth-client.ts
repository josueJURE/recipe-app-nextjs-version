import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: process.env.NODE_ENV === "development" 
        ? "http://localhost:3000" 
        : "https://recipe-app-nextjs-version.onrender.com"
}) 


export const { signIn, signUp, useSession } = createAuthClient()