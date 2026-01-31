import { NextResponse } from "next/server";
import { sendMail } from "@/lib/sendMail";

export async function POST(req: Request) {
  const { to, subject, html } = await req.json();

  await sendMail({
    to,
    subject,
    html,
  });

  return NextResponse.json({ ok: true });
}
