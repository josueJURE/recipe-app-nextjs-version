import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({
  apiKey: process.env.openaiAPI,
});

export async function POST(request: Request) {
  try {
    const { countrySelected, dietaryRequirements } = await request.json();
    console.log("countrySelected:", countrySelected);
    console.log("dietaryRequirements:", dietaryRequirements);

    const vegan = "taking into account the fact that I'm vegan";

    const otherText =
      dietaryRequirements.other.checked && dietaryRequirements.other.text !== ""
        ? dietaryRequirements.other.text
        : "";

    // Build the full prompt string
    const prompt = `Give me a traditional recipe from ${countrySelected}. ${
      dietaryRequirements.vegan ? vegan : ""
    }. ${otherText}. Include ingredients and step-by-step instructions.`;

    console.log("Prompt sent to OpenAI:", prompt);

    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "gpt-3.5-turbo",
    });

    const result = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });


    const recipeImage = result?.data?.[0]?.url;

    const recipe = response.choices[0]?.message?.content || "No recipe found";


    const audioPromise = openai.audio.speech
    .create({
      model: "tts-1",
      voice: "alloy",
      input: `${recipe}`,
    })

    const mp3 = await audioPromise;
    const buffer = Buffer.from(await mp3.arrayBuffer());
    const speechFile = path.join(process.cwd(), "public", "recipe_audio.mp3");
    await fs.promises.writeFile(speechFile, buffer);

    console.log("audioPromise:", audioPromise)

    // const recipe = "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Obcaecati vero nihil dolores officia sequi dicta. Quo ratione ab adipisci culpa aliquam, facilis reprehenderit odio at sapiente inventore laborum ullam qui"
    console.log("recipeImage:", recipeImage);
    console.log("prompt recipe:", prompt);
    console.log("recipe", recipe);

    return NextResponse.json({ recipe, recipeImage });
  } catch (error) {
    console.error("Error generating recipe:", error);
    return NextResponse.json(
      { error: "Failed to generate recipe" },
      { status: 500 }
    );
  }
}

// mock API

// import { NextResponse } from "next/server";

// let recipe = "";
// for (let i = 0; i < 20; i++) {
//   recipe += "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ";
// }
// console.log(recipe);

// export async function POST(request: Request) {
//   try {
//     const { countrySelected, dietaryRequirements } = await request.json();
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

//     const recipeImage =
//       "https://oaidalleapiprodscus.blob.core.windows.net/private/org-nYbqgo3O0LNnYYAoKAmApBfx/user-58Je7efi0iy880e2UYCdYpBm/img-ZlnYHnbCfZn27my3STmYrXTb.png?st=2025-06-13T08%3A16%3A51Z&se=2025-06-13T10%3A16%3A51Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=cc612491-d948-4d2e-9821-2683df3719f5&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-06-12T13%3A39%3A28Z&ske=2025-06-13T13%3A39%3A28Z&sks=b&skv=2024-08-04&sig=WDwrby/E9aA3gVJOsOXWG9ccCuIy8Xqo8%2BC02hVa9IA%3D";

//     // const recipe = "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Obcaecati vero nihil dolores officia sequi dicta. Quo ratione ab adipisci culpa aliquam, facilis reprehenderit odio at sapiente inventore laborum ullam qui"
//     console.log("recipeImage:", recipeImage);
//     console.log("prompt recipe:", prompt);
//     console.log("recipe", recipe);

//     return NextResponse.json({ recipe, recipeImage });
//   } catch (error) {
//     console.error("Error generating recipe:", error);
//     return NextResponse.json(
//       { error: "Failed to generate recipe" },
//       { status: 500 }
//     );
//   }
// }


