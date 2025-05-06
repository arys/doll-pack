import { NextResponse } from 'next/server';
import axios from 'axios';

// Segmind API configuration
const SEGMIND_API_KEY = process.env.SEGMIND_API_KEY;
const SEGMIND_API_URL = "https://api.segmind.com/v1/gpt-image-1-edit";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { image, name, description, accessories, clothingStyle } = body;

    if (!image || !name || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Upload the base64 image to Vercel Blob via our API
    // Extract the base64 data from the data URL
    const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    
    if (!matches || matches.length !== 3) {
      return NextResponse.json(
        { error: 'Invalid image format' },
        { status: 400 }
      );
    }
    
    const contentType = matches[1];
    const base64Data = matches[2];
    const timestamp = new Date().getTime();
    const filename = `uploaded-image-${timestamp}.png`;
    
    // Upload to our Blob API
    const blobResponse = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/blob`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        base64Data,
        contentType,
        filename,
      }),
    });
    
    if (!blobResponse.ok) {
      throw new Error('Failed to upload image to Blob storage');
    }
    
    const blobData = await blobResponse.json();
    const imageUrl = blobData.url;

    // Create the prompt for the action figure
    let prompt = `Create a photorealistic action figure of the person in the photo.
The figure should be full-body and placed inside a clear plastic box with a colorful cardboard background, just like real collectible toys.
Make the packaging look as realistic as possible — shiny plastic, a top hook for hanging, and toy-store-style design.
Place accessories next to the figure that reflect its style and image.
On the box:
— At the top, write in large letters: ${name}
— Below that — description: ${description}`;

    // Add accessories and clothing style if provided
    if (accessories) {
      prompt += `\nInclude these accessories with the figure: ${accessories}`;
    }
    
    if (clothingStyle) {
      prompt += `\nThe figure should wear: ${clothingStyle}`;
    }

    prompt += `\nMake the image as realistic as possible — as if it's a real toy you'd find in a store.`;

    // Prepare the request data for Segmind API
    const requestData = {
      prompt: prompt,
      image_urls: [imageUrl],
      size: "auto",
      quality: "auto",
      background: "opaque",
      output_compression: 100,
      output_format: "png"
    };

    // Call Segmind API to generate the image
    const response = await axios.post(
      SEGMIND_API_URL, 
      requestData, 
      { 
        headers: { 
          'x-api-key': SEGMIND_API_KEY 
        } 
      }
    );

    // Check if we have a valid response
    if (!response.data || !response.data.image_url) {
      return NextResponse.json(
        { error: 'No image generated' },
        { status: 500 }
      );
    }

    // Return the generated image URL
    return NextResponse.json({ imageUrl: response.data.image_url });
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    );
  }
} 