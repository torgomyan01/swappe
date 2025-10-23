import { NextResponse } from "next/server";
import { ActionUpdateLastSeen } from "@/app/actions/auth/update-last-seen";

export async function POST() {
  try {
    console.log(`⚡ INSTANT: Updating last seen (simple route)`);

    const result = await ActionUpdateLastSeen();

    if (result.status === "error") {
      console.error(`❌ INSTANT: Failed to update last seen:`, result.error);
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    console.log(`✅ INSTANT: Successfully updated last seen`);
    return NextResponse.json({
      success: true,
      instant: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error(
      "❌ INSTANT: Error in update-last-seen-simple API route:",
      error,
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
