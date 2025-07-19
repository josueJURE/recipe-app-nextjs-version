import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import Welcome from "@/components/ui/Welcome/welcome";


const resend = new Resend(process.env.RESEND_API_KEY);

// Static recipe we will "stream" back:
const staticRecipe = `Ingredients:
1 lb lamb, cut into small pieces
1 lb okra, chopped
1 onion, chopped
2 tomatoes, chopped
2 cloves of garlic, minced
1 tsp ground cumin
1 tsp ground coriander
1 tsp ground turmeric
Salt and pepper to taste
2 cups water
Vegetable oil for cooking

Instructions:
1. In a large pot, heat some vegetable oil over medium heat. Add the chopped onion and garlic and sauté until fragrant.
2. Add the lamb pieces to the pot and cook until browned on all sides.
3. Add the chopped tomatoes, ground cumin, coriander, turmeric, salt, and pepper to the pot. Stir well to combine all the ingredients.
4. Pour in the water and bring the mixture to a boil. Reduce the heat to low, cover the pot, and let it simmer for about 1 hour or until the lamb is tender.
5. Add the chopped okra to the pot and continue to simmer for another 15–20 minutes, or until the okra is cooked through.
6. Taste and adjust the seasoning if needed.
7. Serve the Mulah hot with rice or bread. Enjoy your delicious Sudanese Mulah!`;

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const { countrySelected, dietaryRequirements, email } = await req.json();

    let emailResponse;

    if (email) {
      console.log("Handling email request for:", email);
      emailResponse = await resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: email,
        subject: "Your Recipe",
        react: Welcome({ recipe: staticRecipe }),
      });
      console.log("Email sent. Response:", emailResponse?.data);

      return NextResponse.json({
        success: true,
        emailId: emailResponse?.data?.id ?? null,
      });
    }

    // Simulate streaming by splitting into lines
    const lines = staticRecipe.split("\n");

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        for (const line of lines) {
          console.log("line:", line);
          controller.enqueue(encoder.encode(line + "\n"));
          // optional delay if you want to simulate typing:
          await new Promise((res) => setTimeout(res, 100));
        }
        controller.close();
      },
    });

    // Return the streaming response
    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Error in mock recipe endpoint:", error);
    return NextResponse.json(
      { error: "Failed to return recipe" },
      { status: 500 }
    );
  }
}
