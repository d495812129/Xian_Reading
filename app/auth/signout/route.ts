import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = createClient();
  await supabase.auth.signOut();

  const url = new URL("/", request.url);
  return NextResponse.redirect(url, { status: 302 });
}
