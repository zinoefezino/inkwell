import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import Generation from "@/models/Generation";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { posting, profile } = await req.json();

  const sys = `You write freelance/job proposals for someone applying to a specific posting. Voice: ${profile.tone}. Keep it concise and targeted to the specific posting — no generic filler, no restating the whole job description back. Never call out perceived gaps or things the applicant does not have experience in; instead lead with relevant, adjacent experience. End with a clear, low-friction next step, not a hard sell.

Applicant name: ${profile.name || "the applicant"}
Skills / expertise: ${profile.skills || "general professional experience"}
Relevant past work to draw on: ${profile.snippet || "general freelance project history"}`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: sys }] },
        contents: [
          {
            role: "user",
            parts: [
              { text: `Job posting:\n\n${posting}\n\nDraft the proposal.` },
            ],
          },
        ],
      }),
    },
  );

  const data = await res.json();
  const draft =
    data.candidates?.[0]?.content?.parts
      ?.map((p: { text: string }) => p.text)
      .join("\n") || "";

  try {
    await connectDB();
    await Generation.create({
      userId,
      type: "proposal",
      posting,
      output: draft,
    });
  } catch (e) {
    console.error("Failed to save proposal:", e);
  }

  return NextResponse.json({ draft });
}
