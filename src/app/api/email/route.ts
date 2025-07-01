import { NextResponse } from "next/server";
import { Resend } from "resend";
import Welcome from "@/components/ui/Welcome/welcome";
// import recipe from "@/app/api/updateRecipe/route";

const recipe = "";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    console.log("is email undefined?:", email);

    // email user
    // can be called from an actual component. then going to use the resend here, which has been instanciated
    if (email && recipe !== "") {
      const emailResponse = await resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: "josue.jure@gmail.com",
        subject: "Your recipe",
        react: Welcome({ recipe }),
      });

      console.log("emailResponse:", emailResponse.error);
    }

    // Build the full prompt string

    // const recipeImage =
    //   "https://oaidalleapiprodscus.blob.core.windows.net/private/org-nYbqgo3O0LNnYYAoKAmApBfx/user-58Je7efi0iy880e2UYCdYpBm/img-ZlnYHnbCfZn27my3STmYrXTb.png?st=2025-06-13T08%3A16%3A51Z&se=2025-06-13T10%3A16%3A51Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=cc612491-d948-4d2e-9821-2683df3719f5&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-06-12T13%3A39%3A28Z&ske=2025-06-13T13%3A39%3A28Z&sks=b&skv=2024-08-04&sig=WDwrby/E9aA3gVJOsOXWG9ccCuIy8Xqo8%2BC02hVa9IA%3D";

    // const recipe = "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Obcaecati vero nihil dolores officia sequi dicta. Quo ratione ab adipisci culpa aliquam, facilis reprehenderit odio at sapiente inventore laborum ullam qui"
    // console.log("recipeImage:", recipeImage);

    console.log("recipe", recipe);

    return NextResponse.json({ recipe });
  } catch (error) {
    console.error("Error generating recipe:", error);
    return NextResponse.json(
      { error: "Failed to generate recipe" },
      { status: 500 }
    );
  }
}
