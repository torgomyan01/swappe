import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function ActionUpdateLastSeen() {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { status: "error", data: null, error: "Unauthorized" };
    }

    // Update the user's last_seen timestamp
    await prisma.users.update({
      where: { id: session.user.id },
      data: {
        last_seen: new Date(),
      },
    });

    return { status: "ok", data: null, error: null };
  } catch (error) {
    console.error("Error updating last seen:", error);
    return { status: "error", data: null, error: "Failed to update last seen" };
  }
}
