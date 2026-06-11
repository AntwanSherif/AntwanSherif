"use server";

import { cookies, headers } from "next/headers";
import { companyFromPassword } from "@/lib/stories-password";
import { sendServerEvent } from "@/lib/umami-server";

const COOKIE_NAME = "stories-auth";

/** Record a genuine story open. Company comes from the auth cookie (already validated by proxy.ts). */
export async function trackStoryView(story: string): Promise<void> {
  const password = (await cookies()).get(COOKIE_NAME)?.value;
  if (!password) return;
  const company = companyFromPassword(password);
  if (!company) return;
  const hostname = (await headers()).get("host") ?? "antwansherif.com";
  await sendServerEvent({ hostname, name: "story-view", data: { company, story } });
}
