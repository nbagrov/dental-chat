import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01'  // Возвращаем стабильную версию API
      },
      body: JSON.stringify({
        model: 'claude-3-opus-20240229',
        max_tokens: 4096,
        temperature: 0.7,
        messages: [{
          role: 'user',
          content: body.message
        }],
        system: body.systemPrompt
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Claude API Error:', errorText);
      return NextResponse.json({ error: errorText }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}