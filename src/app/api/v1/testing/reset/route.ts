import { NextResponse } from "next/server";
import { clearSession } from "@/modules/auth/session";
import { ok } from "@/lib/api/http";
import { resetDemoDb } from "@/modules/store/demo-db";

export async function POST() {
  resetDemoDb();
  await clearSession();
  return NextResponse.json(ok({ reset: true }));
}
