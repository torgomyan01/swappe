"use server";

import { headers } from "next/headers";

export async function ActionFindProjectUrl() {
  const headersList = await headers();
  const host = await headersList.get("host");
  const proto = await headersList.get("x-forwarded-proto");

  return `${proto}://${host}`;
}
