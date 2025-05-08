import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { put } from '@vercel/blob';
import { toFile } from 'openai/uploads';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    // Parse the request body
    const { image, name, description, accessories, clothingStyle } = await request.json();
    
    if (!image || !name || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create prompt with accessories and clothing style if provided
    let prompt = `Create a photorealistic action figure of the person in the photo.
The figure should be full-body and placed inside a clear plastic box with a colorful cardboard background, just like real collectible toys.
Make the packaging look as realistic as possible — shiny plastic, a top hook for hanging, and toy-store-style design.
Place accessories next to the figure that reflect its style and image.
On the box:
— At the top, write in large letters: ${name}
— Below that — short description: ${description}`;

    // Add accessories info if provided
    if (accessories) {
      prompt += `\nInclude these accessories with the figure: ${accessories}`;
    }

    // Add clothing style info if provided
    if (clothingStyle) {
      prompt += `\nThe figure should be wearing: ${clothingStyle}`;
    }

    // Convert base64 image data
    const base64Image = image.split(',')[1];
    const inputBuffer = Buffer.from(base64Image, 'base64');
    
    // Create a File object for the OpenAI API
    const imageFile = await toFile(inputBuffer, 'image.png', { type: 'image/png' });
    
    // Edit image using OpenAI SDK
    const response = await openai.images.edit({
      model: "gpt-image-1",
      image: imageFile,
      prompt: prompt,
      n: 1,
      size: "1024x1536"
    });

    const b64Json = response.data?.[0]?.b64_json;
    
    if (!b64Json) {
      throw new Error('Failed to generate image or b64_json is missing');
    }
    
    // Upload to Vercel Blob
    const blob = await put(`doll-${Date.now()}.png`, Buffer.from(b64Json, 'base64'), {
      contentType: 'image/png',
      access: 'public',
    });

    return NextResponse.json({ imageUrl: blob.url });
    
  } catch (error) {
    console.error('Error in image generation:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate image' },
      { status: 500 }
    );
  }
}
