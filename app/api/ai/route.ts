import { NextRequest, NextResponse } from 'next/server';

const API_URL = 'https://api.artemox.com/v1';
const API_KEY = 'sk-0pme-SrCrIDmVKmLnrc0uw';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const response = await fetch(`${API_URL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`,
            },
            body: JSON.stringify({
                model: body.model || 'gemini-2.5-flash',
                messages: body.messages,
                max_tokens: body.max_tokens || 2048,
                temperature: body.temperature || 0.7,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json(
                { error: `API Error: ${response.status} - ${errorText}` },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('AI Proxy Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
