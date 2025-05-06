import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { base64Data, contentType, filename } = await request.json();
    
    if (!base64Data || !contentType || !filename) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Convert base64 to Buffer
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Upload to Vercel Blob
    const blob = await put(filename, buffer, {
      contentType,
      access: 'public',
    });
    
    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error('Error uploading to blob storage:', error);
    return NextResponse.json(
      { error: 'Error uploading to blob storage' },
      { status: 500 }
    );
  }
} 