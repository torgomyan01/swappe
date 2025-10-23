import { NextRequest, NextResponse } from "next/server";
import { ActionUpdateLastSeen } from "@/app/actions/auth/update-last-seen";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, timestamp, instant } = body;

    console.log(`⚡ INSTANT: Updating last seen for user ${userId}`, {
      instant,
      timestamp,
    });

    const result = await ActionUpdateLastSeen();

    if (result.status === "error") {
      console.error(
        `❌ INSTANT: Failed to update last seen for user ${userId}:`,
        result.error,
      );
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    console.log(
      `✅ INSTANT: Successfully updated last seen for user ${userId}`,
    );
    return NextResponse.json({
      success: true,
      instant: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ INSTANT: Error in update-last-seen API route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
