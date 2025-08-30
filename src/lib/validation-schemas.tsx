import { z } from "zod";

const registerFormSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  email: z.string().min(2).max(50),
  password: z.string().min(2).max(50),
  confirmPassword: z.string().min(2).max(50).optional(),

  
});

export default registerFormSchema;
