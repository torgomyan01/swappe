import { NextResponse } from "next/server";
import { ActionUpdateLastSeen } from "@/app/actions/auth/update-last-seen";

export async function POST() {
  try {
    const result = await ActionUpdateLastSeen();

    if (result.status === "error") {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Error updating last seen:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
