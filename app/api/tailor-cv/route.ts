import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import Generation from "@/models/Generation";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { cvText, posting } = await req.json();

  const sys = `You tailor CVs/resumes for someone applying to a specific job posting, in any field. Re-order and re-weight the existing CV content so the most relevant experience for THIS posting appears first — do not invent new experience, skills, or projects that aren't already in the CV. Keep every real fact from the original CV; only change ordering, framing, and emphasis. Do not call out or apologize for anything the CV lacks. Keep formatting clean and plain (no markdown symbols), ready to paste into a document.`;

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
              {
                text: `Job posting:\n\n${posting}\n\nOriginal CV:\n\n${cvText}\n\nTailor the CV for this posting.`,
              },
            ],
          },
        ],
      }),
    },
  );

  const data = await res.json();
  const tailored =
    data.candidates?.[0]?.content?.parts
      ?.map((p: { text: string }) => p.text)
      .join("\n") || "";

  try {
    await connectDB();
    await Generation.create({
      userId,
      type: "cv",
      posting,
      input: cvText,
      output: tailored,
    });
  } catch (e) {
    console.error("Failed to save tailored CV:", e);
  }

  return NextResponse.json({ tailored });
}
