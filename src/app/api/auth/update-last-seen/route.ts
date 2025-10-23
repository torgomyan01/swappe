import { NextRequest, NextResponse } from "next/server";
import { ActionUpdateLastSeen } from "@/app/actions/auth/update-last-seen";

export async function POST(request: NextRequest) {
  try {
    // Check if request has body
    const contentType = request.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.log(`⚡ INSTANT: No JSON body, updating last seen directly`);
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
    }

    // Parse JSON body if present
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.log(`⚡ INSTANT: JSON parse error, updating last seen directly`);
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
    }

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
