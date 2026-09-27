"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import type { ActionResponse } from "@/types";

export async function getAllUserWilayah() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  return prisma.wilayah.findMany({
    orderBy: { namaWilayah: "asc" },
    include: {
      userWilayah: {
        include: {
          user: {
            select: { id: true, nama: true, email: true, noHp: true, role: true },
          },
        },
        orderBy: { createdAt: "asc" },
      },
      _count: {
        select: { userWilayah: true, laporanSampah: true },
      },
    },
  });
}

export async function getAllUsersForAssign() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  return prisma.user.findMany({
    where: { role: "USER" },
    select: { id: true, nama: true, email: true },
    orderBy: { nama: "asc" },
  });
}

export async function assignUserToWilayah(
  userId: string,
  wilayahId: string
): Promise<ActionResponse> {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const existing = await prisma.userWilayah.findUnique({
      where: { userId_wilayahId: { userId, wilayahId } },
    });

    if (existing) {
      return { success: false, message: "User sudah terdaftar di wilayah ini" };
    }

    await prisma.userWilayah.create({
      data: { userId, wilayahId },
    });

    revalidatePath("/dashboard/admin/pemantauan");

    return { success: true, message: "User berhasil ditambahkan ke wilayah" };
  } catch (error) {
    console.error("Assign user to wilayah error:", error);
    return { success: false, message: "Gagal menambahkan user ke wilayah" };
  }
}

export async function removeUserFromWilayah(
  userId: string,
  wilayahId: string
): Promise<ActionResponse> {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return { success: false, message: "Unauthorized" };
  }

  try {
    await prisma.userWilayah.delete({
      where: { userId_wilayahId: { userId, wilayahId } },
    });

    revalidatePath("/dashboard/admin/pemantauan");

    return { success: true, message: "User berhasil dihapus dari wilayah" };
  } catch (error) {
    console.error("Remove user from wilayah error:", error);
    return { success: false, message: "Gagal menghapus user dari wilayah" };
  }
}
