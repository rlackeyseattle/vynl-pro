import { NextResponse } from "next/server";
import { crawlVenueIntelligence } from "@/lib/xai";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const venueData = await crawlVenueIntelligence(query);

    if (!venueData) {
      return NextResponse.json({ error: "Could not crawl venue data" }, { status: 500 });
    }

    // Optional: Auto-create the venue in the database if it doesn't exist
    // const venue = await prisma.venueProfile.upsert({
    //   where: { name: venueData.name },
    //   update: venueData,
    //   create: venueData,
    // });

    return NextResponse.json(venueData);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
