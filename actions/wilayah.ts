"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { wilayahSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import type { ActionResponse } from "@/types";

// ============================================================
// GET ALL
// ============================================================

export async function getAllWilayah() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  return prisma.wilayah.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      _count: {
        select: { laporanSampah: true },
      },
    },
  });
}

// ============================================================
// CREATE
// ============================================================

export async function createWilayah(
  formData: FormData
): Promise<ActionResponse> {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return { success: false, message: "Unauthorized" };
  }

  const rawData = {
    namaWilayah: formData.get("namaWilayah") as string,
  };

  const validated = wilayahSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      message: "Validasi gagal",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  try {
    const existing = await prisma.wilayah.findUnique({
      where: { namaWilayah: validated.data.namaWilayah },
    });

    if (existing) {
      return {
        success: false,
        message: "Nama wilayah sudah ada",
        errors: { namaWilayah: ["Nama wilayah sudah ada"] },
      };
    }

    await prisma.wilayah.create({
      data: { namaWilayah: validated.data.namaWilayah },
    });

    revalidatePath("/dashboard/admin/wilayah");

    return {
      success: true,
      message: "Wilayah berhasil ditambahkan",
    };
  } catch (error) {
    console.error("Create wilayah error:", error);
    return {
      success: false,
      message: "Gagal menambahkan wilayah",
    };
  }
}

// ============================================================
// UPDATE
// ============================================================

export async function updateWilayah(
  id: string,
  formData: FormData
): Promise<ActionResponse> {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return { success: false, message: "Unauthorized" };
  }

  const rawData = {
    namaWilayah: formData.get("namaWilayah") as string,
  };

  const validated = wilayahSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      message: "Validasi gagal",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  try {
    const existing = await prisma.wilayah.findFirst({
      where: {
        namaWilayah: validated.data.namaWilayah,
        NOT: { id },
      },
    });

    if (existing) {
      return {
        success: false,
        message: "Nama wilayah sudah ada",
        errors: { namaWilayah: ["Nama wilayah sudah ada"] },
      };
    }

    await prisma.wilayah.update({
      where: { id },
      data: { namaWilayah: validated.data.namaWilayah },
    });

    revalidatePath("/dashboard/admin/wilayah");

    return {
      success: true,
      message: "Wilayah berhasil diperbarui",
    };
  } catch (error) {
    console.error("Update wilayah error:", error);
    return {
      success: false,
      message: "Gagal memperbarui wilayah",
    };
  }
}

// ============================================================
// DELETE
// ============================================================

export async function deleteWilayah(
  id: string
): Promise<ActionResponse> {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return { success: false, message: "Unauthorized" };
  }

  try {
    // Check if wilayah is used in laporan (onDelete: Restrict)
    const laporanCount = await prisma.laporanSampah.count({
      where: { wilayahId: id },
    });

    if (laporanCount > 0) {
      return {
        success: false,
        message: `Tidak dapat menghapus. Wilayah ini digunakan oleh ${laporanCount} laporan.`,
      };
    }

    await prisma.wilayah.delete({
      where: { id },
    });

    revalidatePath("/dashboard/admin/wilayah");

    return {
      success: true,
      message: "Wilayah berhasil dihapus",
    };
  } catch (error) {
    console.error("Delete wilayah error:", error);
    return {
      success: false,
      message: "Gagal menghapus wilayah",
    };
  }
}
