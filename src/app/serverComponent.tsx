import { NextResponse } from 'next/server';

import { OpenAI } from "openai";


const openai = new OpenAI({
    apiKey: process.env.openaiAPI,
  });
  



  const stream = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `${prompt}`,
      },
    ],
    model: "gpt-3.5-turbo",
    max_tokens: 2000,
    stream: true,
  });

  console.log(stream)
