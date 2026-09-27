"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { jenisSampahSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import type { ActionResponse } from "@/types";

// ============================================================
// GET ALL
// ============================================================

export async function getAllJenisSampah() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  return prisma.jenisSampah.findMany({
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

export async function createJenisSampah(
  formData: FormData
): Promise<ActionResponse> {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return { success: false, message: "Unauthorized" };
  }

  const rawData = {
    namaJenis: formData.get("namaJenis") as string,
  };

  const validated = jenisSampahSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      message: "Validasi gagal",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  try {
    const existing = await prisma.jenisSampah.findUnique({
      where: { namaJenis: validated.data.namaJenis },
    });

    if (existing) {
      return {
        success: false,
        message: "Nama jenis sampah sudah ada",
        errors: { namaJenis: ["Nama jenis sampah sudah ada"] },
      };
    }

    await prisma.jenisSampah.create({
      data: { namaJenis: validated.data.namaJenis },
    });

    revalidatePath("/dashboard/admin/jenis-sampah");

    return {
      success: true,
      message: "Jenis sampah berhasil ditambahkan",
    };
  } catch (error) {
    console.error("Create jenis sampah error:", error);
    return {
      success: false,
      message: "Gagal menambahkan jenis sampah",
    };
  }
}

// ============================================================
// UPDATE
// ============================================================

export async function updateJenisSampah(
  id: string,
  formData: FormData
): Promise<ActionResponse> {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return { success: false, message: "Unauthorized" };
  }

  const rawData = {
    namaJenis: formData.get("namaJenis") as string,
  };

  const validated = jenisSampahSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      message: "Validasi gagal",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  try {
    const existing = await prisma.jenisSampah.findFirst({
      where: {
        namaJenis: validated.data.namaJenis,
        NOT: { id },
      },
    });

    if (existing) {
      return {
        success: false,
        message: "Nama jenis sampah sudah ada",
        errors: { namaJenis: ["Nama jenis sampah sudah ada"] },
      };
    }

    await prisma.jenisSampah.update({
      where: { id },
      data: { namaJenis: validated.data.namaJenis },
    });

    revalidatePath("/dashboard/admin/jenis-sampah");

    return {
      success: true,
      message: "Jenis sampah berhasil diperbarui",
    };
  } catch (error) {
    console.error("Update jenis sampah error:", error);
    return {
      success: false,
      message: "Gagal memperbarui jenis sampah",
    };
  }
}

// ============================================================
// DELETE
// ============================================================

export async function deleteJenisSampah(
  id: string
): Promise<ActionResponse> {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return { success: false, message: "Unauthorized" };
  }

  try {
    // Check if jenis sampah is used in laporan (onDelete: Restrict)
    const laporanCount = await prisma.laporanSampah.count({
      where: { jenisSampahId: id },
    });

    if (laporanCount > 0) {
      return {
        success: false,
        message: `Tidak dapat menghapus. Jenis sampah ini digunakan oleh ${laporanCount} laporan.`,
      };
    }

    await prisma.jenisSampah.delete({
      where: { id },
    });

    revalidatePath("/dashboard/admin/jenis-sampah");

    return {
      success: true,
      message: "Jenis sampah berhasil dihapus",
    };
  } catch (error) {
    console.error("Delete jenis sampah error:", error);
    return {
      success: false,
      message: "Gagal menghapus jenis sampah",
    };
  }
}
