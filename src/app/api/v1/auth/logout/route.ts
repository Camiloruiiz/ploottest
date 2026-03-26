import { NextResponse } from "next/server";
import { clearSession } from "@/modules/auth/session";
import { ok } from "@/lib/api/http";

export async function POST() {
  await clearSession();
  return NextResponse.json(ok({ loggedOut: true }));
}
