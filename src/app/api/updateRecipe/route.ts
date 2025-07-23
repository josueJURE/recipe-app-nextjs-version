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

      const emailId = emailResponse.data?.id;

      return NextResponse.json({
        emailId,
      } as ApiResponse);
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
        const recipeForImage = recipe
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
