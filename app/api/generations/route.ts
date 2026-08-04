import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import Generation from "@/models/Generation";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  await connectDB();
  const generations = await Generation.find({ userId })
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({ generations });
}
