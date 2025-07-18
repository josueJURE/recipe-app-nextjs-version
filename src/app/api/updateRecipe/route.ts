import { NextResponse } from "next/server";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { NextRequest } from "next/server";
import { Resend } from "resend";
import Welcome from "@/components/ui/Welcome/welcome";
import OpenAI from "openai";


const openaiImage = new OpenAI();



const resend = new Resend(process.env.RESEND_API_KEY);

interface ApiResponse {
  recipe: string;
  emailId?: string;
  error?: string;
}

let recipe = ""

export async function POST(req: NextRequest) {
  try {
    const { countrySelected, dietaryRequirements, email } = await req.json();

    if (email) {
      const emailResponse = await resend.emails.send({
        from: "",
        to: email,
        subject: "Your recipe",
        react: Welcome({ recipe }),
      });

      console.log("emailResponse:", emailResponse.data);

      let emailId = emailResponse.data?.id;

      return NextResponse.json({
        emailId,
      });
    }

    const vegan = "taking into account the fact that I'm vegan";
    const otherText =
      dietaryRequirements?.other?.checked && dietaryRequirements?.other?.text
        ? dietaryRequirements.other.text
        : "";

    const prompt = `Give me a traditional recipe from ${countrySelected}. ${
      dietaryRequirements?.vegan ? vegan : ""
    }. ${otherText}. Include ingredients and step-by-step instructions.`;




    const response = await streamText({
      model: openai("gpt-3.5-turbo"),
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      maxTokens: 1000,
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        for await (const part of response.textStream) {
          recipe += part
          console.log(part);
          console.log("recipe:", recipe)
          controller.enqueue(encoder.encode(part));
        }
        controller.close();
        let recipeForImage = recipe
        const result = await openaiImage.images.generate({
          model: "dall-e-3",
          prompt: recipeForImage,
          n: 1,
          size: "1024x1024",
        });
        console.log("openaiImage",result)
      },
    });

    // Streaming response as text
    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });






  } catch (error) {
    console.error("Error generating recipe:", error);
    return NextResponse.json(
      { error: "Failed to generate recipe" },
      { status: 500 }
    );
  }
}

// const openai = new OpenAI({
//   apiKey: process.env.openaiAPI,
// });
// let emailId

// export async function POST(request: Request) {
//   const { countrySelected, dietaryRequirements, email } =
//       await request.json();
//       const result = await

// }

// export async function POST(request: Request) {
//   try {
//     const { countrySelected, dietaryRequirements, email } =
//       await request.json();
//     console.log("countrySelected:", countrySelected);
//     console.log("dietaryRequirements:", dietaryRequirements);

//     const vegan = "taking into account the fact that I'm vegan";

//     const otherText =
//       dietaryRequirements.other.checked && dietaryRequirements.other.text !== ""
//         ? dietaryRequirements.other.text
//         : "";

//     // Build the full prompt string
//     const prompt = `Give me a traditional recipe from ${countrySelected}. ${
//       dietaryRequirements.vegan ? vegan : ""
//     }. ${otherText}. Include ingredients and step-by-step instructions.`;

//     console.log("Prompt sent to OpenAI:", prompt);

//     const response = await openai.chat.completions.create({
//       messages: [
//         {
//           role: "user",
//           content: prompt,
//         },
//       ],
//       model: "gpt-3.5-turbo",
//       stream: true,
//       max_tokens: 2000,
//     });

//     for await (const chunk of response) {
//       console.log(chunk)
//       console.log(chunk.choices[0].delta)
//     }

//     const result = await openai.images.generate({
//       model: "dall-e-3",
//       prompt: prompt,
//       n: 1,
//       size: "1024x1024",
//     })

//     const recipeImage = result?.data?.[0]?.url;
//     console.log("recipeImage",recipeImage)

//     const recipe = response.choices[0]?.message?.content || "No recipe found";

//     const audioPromise = openai.audio.speech.create({
//       model: "tts-1",
//       voice: "alloy",
//       input: `${recipe}`,
//     });

//     let emailResponse;

//     const mp3 = await audioPromise;
//     const buffer = Buffer.from(await mp3.arrayBuffer());
//     const speechFile = path.join(process.cwd(), "public", "recipe_audio.mp3");
//     await fs.promises.writeFile(speechFile, buffer);

//     if (email !== undefined) {
//       emailResponse = await resend.emails.send({
//         from: "Acme <onboarding@resend.dev>",
//         to: email,
//         subject: "Your recipe",
//         react: Welcome({ recipe }),
//       });

//       console.log("audioPromise:", audioPromise);

//       // const recipe = "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Obcaecati vero nihil dolores officia sequi dicta. Quo ratione ab adipisci culpa aliquam, facilis reprehenderit odio at sapiente inventore laborum ullam qui"
//       console.log("recipeImage:",recipeImage );
//       console.log("prompt recipe:", prompt);
//       console.log("recipe", recipe);

//      emailResponse?.data?.id;

//       // return NextResponse.json({ recipe, recipeImage });
//     }
//     return NextResponse.json({ recipe, emailId, success: true, recipeImage } as ApiResponse);
//   } catch (error) {
//     console.error("Error generating recipe:", error);
//     return NextResponse.json(
//       { error: "Failed to generate recipe" },
//       { status: 500 }
//     );
//   }
// }

// mock API

// import { NextResponse } from "next/server";
// import { Resend } from "resend";
// import Welcome from "@/components/ui/Welcome/welcome";

// const resend = new Resend(process.env.RESEND_API_KEY);

// let recipe = "";
// for (let i = 0; i < 20; i++) {
//   recipe += "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ";
// }
// console.log(recipe);

// interface ApiResponse {
//   recipe: string;
//   emailId?: string;
//   error?: string;
// }

// export async function POST(request: Request) {
//   try {
//     const { countrySelected, dietaryRequirements, email } =
//       await request.json();
//     console.log("countrySelected:", countrySelected);
//     console.log("dietaryRequirements:", dietaryRequirements);
//     console.log("email:", email);

//     const vegan = "taking into account the fact that I'm vegan";
//     let emailResponse

//     const otherText =
//       dietaryRequirements.other.checked && dietaryRequirements.other.text !== ""
//         ? dietaryRequirements.other.text
//         : "";

//     // email user
//     // can be called from an actual component. then going to use the resend here, which has been instanciated
//     if (email !== undefined) {
//       emailResponse = await resend.emails.send({
//         from: "Acme <onboarding@resend.dev>",
//         to: email,
//         subject: "Your recipe",
//         react: Welcome({ recipe }),
//       });

//       console.log("emailResponse:", emailResponse.data);

//     }

//     // Build the full prompt string
//     const prompt = `Give me a traditional recipe from ${countrySelected}. ${
//       dietaryRequirements.vegan ? vegan : ""
//     }. ${otherText}. Include ingredients and step-by-step instructions.`;

//     console.log("Prompt sent to OpenAI:", prompt);

//     // const recipeImage =
//     //   "https://oaidalleapiprodscus.blob.core.windows.net/private/org-nYbqgo3O0LNnYYAoKAmApBfx/user-58Je7efi0iy880e2UYCdYpBm/img-ZlnYHnbCfZn27my3STmYrXTb.png?st=2025-06-13T08%3A16%3A51Z&se=2025-06-13T10%3A16%3A51Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=cc612491-d948-4d2e-9821-2683df3719f5&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-06-12T13%3A39%3A28Z&ske=2025-06-13T13%3A39%3A28Z&sks=b&skv=2024-08-04&sig=WDwrby/E9aA3gVJOsOXWG9ccCuIy8Xqo8%2BC02hVa9IA%3D";

//     // const recipe = "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Obcaecati vero nihil dolores officia sequi dicta. Quo ratione ab adipisci culpa aliquam, facilis reprehenderit odio at sapiente inventore laborum ullam qui"
//     // console.log("recipeImage:", recipeImage);
//     console.log("prompt recipe:", prompt);
//     console.log("recipe", recipe);
//     console.log("emailResponse:", typeof emailResponse?.data?.id);

//     let emailId = emailResponse?.data?.id

//     return NextResponse.json({ recipe, emailId, success: true } as ApiResponse);
//     // return NextResponse.json({ recipe });
//   } catch (error) {
//     console.error("Error generating recipe:", error);
//     return NextResponse.json(
//       { error: "Failed to generate recipe" },
//       { status: 500 }
//     );
//   }
// }

//
