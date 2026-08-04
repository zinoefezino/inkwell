import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb"; // your existing Mongoose connection helper
import User from "@/models/User";

export async function POST(req: Request) {
  const payload = await req.text();
  const headerPayload = await headers();

  const svixHeaders = {
    "svix-id": headerPayload.get("svix-id")!,
    "svix-timestamp": headerPayload.get("svix-timestamp")!,
    "svix-signature": headerPayload.get("svix-signature")!,
  };

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);

  let evt: any;
  try {
    evt = wh.verify(payload, svixHeaders);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  await connectDB();

  if (evt.type === "user.created") {
    const { id, email_addresses, first_name } = evt.data;
    await User.create({
      clerkId: id,
      email: email_addresses[0]?.email_address,
      name: first_name || "",
    });
  }

  if (evt.type === "user.deleted") {
    await User.deleteOne({ clerkId: evt.data.id });
  }

  return NextResponse.json({ received: true });
}
