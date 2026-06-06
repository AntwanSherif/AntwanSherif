"use server";

import { createHash } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "stories-auth";

function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

export async function unlockAction(formData: FormData) {
  const input = (formData.get("password") as string) ?? "";
  const from = (formData.get("from") as string) ?? "";
  const safeTo = from.startsWith("/stories/") ? from : "/stories";

  const stored = process.env.STORIES_PASSWORD ?? "";
  if (!stored || hashPassword(input) !== hashPassword(stored)) {
    redirect(`/stories/unlock?from=${encodeURIComponent(safeTo)}&error=1`);
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, hashPassword(stored), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/stories",
  });

  redirect(safeTo);
}
