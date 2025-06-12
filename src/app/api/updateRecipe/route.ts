import { NextResponse } from 'next/server';
import { OpenAI } from "openai";
import * as fs from "fs";
import https from 'https';

const openai = new OpenAI({
  apiKey: process.env.openaiAPI,
});

// let recipe = "";
// for (let i = 0; i < 20; i++) { // Adjust loop count
//   recipe += "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ";
// }
// console.log(recipe);




export async function POST(request: Request) {
  try {
    const  { countrySelected, dietaryRequirements } = await request.json();
    console.log("countrySelected:", countrySelected);
    console.log("dietaryRequirements:", dietaryRequirements);

    const vegan = "taking into account the fact that I'm vegan"

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
 
  })

  const recipeImage = result?.data?.[0]?.url

  console.log("result:", result?.data?.[0]?.url)

  // console.log("result:", result.?data[0]?.url)


// const image_url = result.data?.[0]?.url;
// if (!image_url) throw new Error("Image generation failed: URL is undefined");

// const file = fs.createWriteStream("otter.png");
// https.get(image_url, (response) => {
//   console.log("image response:",response)
//   response.pipe(file);
// });



  
//   // Save the image to a file
//   const image_base64 = result.data?.[0]?.b64_json;
//   console.log("image_base64", image_base64)
//   if (!image_base64) {
//     throw new Error("Image generation failed: base64 data is undefined");
//   }
//   const image_bytes = Buffer.from(image_base64, "base64");
//   fs.writeFileSync("otter.png", image_bytes);

    const recipe = response.choices[0]?.message?.content || "No recipe found";
 
    // const recipe = "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Obcaecati vero nihil dolores officia sequi dicta. Quo ratione ab adipisci culpa aliquam, facilis reprehenderit odio at sapiente inventore laborum ullam qui"
    console.log("Generated recipe:", prompt);
    console.log("recipe", recipe)
    
    return NextResponse.json({recipe, recipeImage});
    
  } catch (error) {
    console.error("Error generating recipe:", error);
    return NextResponse.json(
      { error: "Failed to generate recipe" },
      { status: 500 }
    );
  }

  
}

// const prompt = `
// A children's book drawing of a veterinarian using a stethoscope to 
// listen to the heartbeat of a baby otter.
// `;



