'use client'

import React from "react";
import LoginForm from "@/components/login-form";
import registerFormSchema from "@/lib/validation-schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from 'sonner'
import { RegisterFormWithHook } from "@/utils/types";

const formSchema = registerFormSchema;

export default function SingIn() {
  const form = useForm<RegisterFormWithHook>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Assuming an async registration function
      console.log("values", values)
      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="tex-white">{JSON.stringify(values, null, 2)}</code>
        </pre>,
      )
    } catch (error) {
      console.error('Form submission error', error)
      toast.error('Failed to submit the form. Please try again.')
    }
  }


  return (
    // <div>Sign in</div>
    <LoginForm onSubmit={form.handleSubmit(onSubmit)} register={form.register} className="space-y-8"/>
    
  );
}

// export default SingIn
