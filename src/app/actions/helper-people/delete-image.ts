// app/actions/helper-people/delete-image.ts
"use server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { fileHost, fileHostRemove } from "@/utils/consts";
import axios from "axios";

export async function ActionDeleteHelperPeopleImage(id: number) {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session) {
      return { status: "error", data: [], error: "Unauthorized" };
    }

    // Get the helper people record
    const helperPeople = await prisma.helper_people.findFirst({
      where: {
        id,
        user_id: session.user.id,
      },
      select: { image_path: true },
    });

    if (!helperPeople) {
      return { status: "error", data: [], error: "Helper people not found" };
    }

    if (!helperPeople.image_path) {
      return { status: "error", data: [], error: "No image to delete" };
    }

    // Delete image from server
    try {
      await axios.post(fileHostRemove, { image_url: helperPeople.image_path });
    } catch (error) {
      console.log("Image deletion from server failed:", error);
      // Continue even if server deletion fails
    }

    // Update database to remove image_path
    await prisma.helper_people.update({
      where: { id },
      data: { image_path: "" as string },
    });

    return {
      status: "ok",
      data: null,
      error: "",
    };
  } catch (error: any) {
    return {
      status: "error",
      data: [],
      error: error.message || String(error),
    };
  }
}
