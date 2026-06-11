import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Your Next.js server fetches from AWS, bypassing browser CORS entirely
    const awsUrl = process.env.NEXT_PUBLIC_UPDATE_ALARM_URL;
    
    if (!awsUrl) {
      return NextResponse.json({ error: "Missing AWS URL" }, { status: 500 });
    }

    const response = await fetch(awsUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`AWS rejected with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error: any) {
    console.error("Next.js Proxy Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}