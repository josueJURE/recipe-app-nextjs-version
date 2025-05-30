import { NextResponse } from 'next/server';
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.openaiAPI,
});

export async function POST(request: Request) {
  try {
    const { country } = await request.json();
    console.log("Received request for country:", country);
    
    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Give me a traditional recipe from ${country}. Include ingredients and step-by-step instructions.`,
        },
      ],
      model: "gpt-3.5-turbo",
    });

    const recipe = response.choices[0]?.message?.content || "No recipe found";
    console.log("Generated recipe:", recipe);
    
    return NextResponse.json({ recipe });
  } catch (error) {
    console.error("Error generating recipe:", error);
    return NextResponse.json(
      { error: "Failed to generate recipe" },
      { status: 500 }
    );
  }
}