import { NextRequest, NextResponse } from "next/server";
import { ActionGetUserLastSeen } from "@/app/actions/chat/get-user-last-seen";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    const result = await ActionGetUserLastSeen(parseInt(userId));

    if (result.status === "error") {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    return NextResponse.json({ data: result.data });
  } catch (error) {
    console.error("API Error getting user last seen:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
