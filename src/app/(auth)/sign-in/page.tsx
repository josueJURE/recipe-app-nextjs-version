'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod"

import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { signInFormSchema } from "@/lib/validation-schemas";
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client";

export default function SignIn() {
  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof signInFormSchema>) {
    const { email, password } = values;
    const { data, error } = await authClient.signIn.email({
      email,
      password,
      callbackURL: "/recipe-ui",
    }, {
      onRequest: () => {
      
        toast( "Please wait.")
      },
      onSuccess: () => {
        form.reset()
      },
      onError: (ctx) => {
        toast(ctx.error.message)
      },
    });
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center items-center justify-center">
        <CardTitle>Sign In</CardTitle>
        <CardDescription className="whitespace-nowrap">
          Welcome back! Please sign in to continue.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john@mail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter your password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter className='flex justify-center'>
        <p className='text-sm text-muted-foreground'>
          Don&apos;t have an account yet?{' '}
          <Link href='/sign-up' className='text-primary hover:underline'>
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>

  )
}



// import React from "react";
// import LoginForm from "@/components/login-form";
// import registerFormSchema from "@/lib/validation-schemas";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { toast } from 'sonner'
// import { RegisterFormWithHook } from "@/utils/types";

// const formSchema = registerFormSchema;

// export default function SingIn() {
//   const form = useForm<RegisterFormWithHook>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });
  

//   async function onSubmit(values: z.infer<typeof formSchema>) {
//     try {
//       // Assuming an async registration function
//       console.log("values", values)
//       toast(
//         <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
//           <code className="tex-white">{JSON.stringify(values, null, 2)}</code>
//         </pre>,
//       )
//     } catch (error) {
//       console.error('Form submission error', error)
//       toast.error('Failed to submit the form. Please try again.')
//     }
//   }


//   return (
//     // <div>Sign in</div>
//     <LoginForm onSubmit={form.handleSubmit(onSubmit)} register={form.register} className="space-y-8"/>
    
//   );
// }

// export default SingIn
