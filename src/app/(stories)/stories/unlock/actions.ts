"use server";

import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";
import { validate } from "@/lib/stories-password";

const COOKIE_NAME = "stories-auth";

export async function unlockAction(formData: FormData) {
  const input = (formData.get("password") as string) ?? "";
  const from = (formData.get("from") as string) ?? "";
  const safeTo = from.startsWith("/stories/") ? from : "/stories";

  const seed = process.env.STORIES_SEED ?? "";
  if (!(await validate(seed, input.trim()))) {
    // replace, not push — wrong attempts shouldn't stack history entries.
    redirect(`/stories/unlock?from=${encodeURIComponent(safeTo)}&error=1`, RedirectType.replace);
  }

  // Store the validated password itself; the proxy re-validates it on every
  // request, so access lapses automatically when the password rotates out.
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, input.trim(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/stories",
  });

  // replace, not push (Next defaults server-action redirects to push) — so the unlock
  // page is removed from history and the back button lands on /stories, not the gate.
  redirect(safeTo, RedirectType.replace);
}
