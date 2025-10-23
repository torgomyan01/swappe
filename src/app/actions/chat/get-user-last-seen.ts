import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function ActionGetUserLastSeen(userId: number) {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { status: "error", data: null, error: "Unauthorized" };
    }

    // Get the user's last seen time
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        last_seen: true,
        company: {
          select: {
            name: true,
            image_path: true,
          },
        },
      },
    });

    if (!user) {
      return { status: "error", data: null, error: "User not found" };
    }

    return { status: "ok", data: user, error: null };
  } catch (error) {
    console.error("Error getting user last seen: 6666666666666666666", error);
    return {
      status: "error",
      data: null,
      error: "Failed to get user last seen",
    };
  }
}
