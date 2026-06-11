import { NextResponse } from "next/server";

export async function GET() {
  try {
    const awsUrl = process.env.NEXT_PUBLIC_GET_ALARMS_URL;

    if (!awsUrl) {
      return NextResponse.json({ error: "Missing AWS URL" }, { status: 500 });
    }

    // The proxy asks AWS for the historical data
    const response = await fetch(awsUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store", // Forces Next.js to always get fresh DB data
    });

    if (!response.ok)
      throw new Error(`AWS rejected with status: ${response.status}`);

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("Next.js Proxy Fetch Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
