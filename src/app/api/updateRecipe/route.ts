import { NextResponse } from 'next/server';
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.openaiAPI,
});

let recipe = "";
for (let i = 0; i < 20; i++) { // Adjust loop count
  recipe += "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ";
}
console.log(recipe);




export async function POST(request: Request) {
  try {
    const  { countrySelected, dietaryRequirements } = await request.json();
    console.log("countrySelected:", countrySelected);
    console.log("dietaryRequirements:", dietaryRequirements);
    
    // const response = await openai.chat.completions.create({
    //   messages: [
    //     {
    //       role: "user",
    //       content: `Give me a traditional recipe from ${countrySelected}. Include ingredients and step-by-step instructions.`,
    //     },
    //   ],
    //   model: "gpt-3.5-turbo",
    // });

    // const recipe = response.choices[0]?.message?.content || "No recipe found";
    // const recipe = "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Obcaecati vero nihil dolores officia sequi dicta. Quo ratione ab adipisci culpa aliquam, facilis reprehenderit odio at sapiente inventore laborum ullam qui"
    // console.log("Generated recipe:", recipe);
    
    return NextResponse.json({recipe});
    
  } catch (error) {
    console.error("Error generating recipe:", error);
    return NextResponse.json(
      { error: "Failed to generate recipe" },
      { status: 500 }
    );
  }
}

// ${errorJSON}\n\n`)