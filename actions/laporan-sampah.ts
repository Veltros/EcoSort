"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { laporanSampahSchema, updateStatusSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir, unlink } from "fs/promises";
import { join } from "path";
import type { ActionResponse } from "@/types";

// Helper to save file as Base64 Data URL (100% serverless compatible)
async function saveUploadedFile(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const mimeType = file.type || "image/jpeg";
  const base64 = buffer.toString("base64");
  return `data:${mimeType};base64,${base64}`;
}

// Helper to delete file (safe for both local files and base64 URLs)
async function deleteLocalFile(imageUrl: string) {
  if (!imageUrl || imageUrl.startsWith("data:")) return;
  try {
    const filename = imageUrl.replace("/uploads/", "");
    const filePath = join(process.cwd(), "public", "uploads", filename);
    await unlink(filePath);
  } catch {
    // Ignore error on serverless / read-only filesystem
  }
}

// ============================================================
// CREATE LAPORAN
// ============================================================

export async function createLaporanSampah(
  formData: FormData
): Promise<ActionResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Silakan login terlebih dahulu" };
  }

  const rawData = {
    berat: parseFloat(formData.get("berat") as string),
    tanggalLapor: formData.get("tanggalLapor") as string,
    jenisSampahId: formData.get("jenisSampahId") as string,
    wilayahId: formData.get("wilayahId") as string,
  };

  const validated = laporanSampahSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      message: "Validasi gagal",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const fotoFile = formData.get("foto") as File | null;
  if (!fotoFile || fotoFile.size === 0) {
    return {
      success: false,
      message: "Foto sampah wajib dilampirkan",
      errors: { foto: ["Foto sampah wajib dilampirkan"] },
    };
  }

  if (fotoFile.size > 3.5 * 1024 * 1024) {
    return {
      success: false,
      message: "Ukuran foto maksimal 3.5 MB",
      errors: { foto: ["Ukuran foto maksimal 3.5 MB"] },
    };
  }

  let imageUrl = "";
  try {
    imageUrl = await saveUploadedFile(fotoFile);

    await prisma.laporanSampah.create({
      data: {
        berat: validated.data.berat,
        tanggalLapor: new Date(validated.data.tanggalLapor),
        userId: session.user.id,
        jenisSampahId: validated.data.jenisSampahId,
        wilayahId: validated.data.wilayahId,
        status: "PENDING",
        fotoSampah: {
          create: {
            imageUrl,
          },
        },
      },
    });

    revalidatePath("/dashboard/user/laporan");
    revalidatePath("/dashboard/user");
    revalidatePath("/dashboard/admin/laporan");
    revalidatePath("/dashboard/admin");

    return {
      success: true,
      message: "Laporan sampah berhasil dibuat",
    };
  } catch (error) {
    console.error("Create laporan error:", error);
    if (imageUrl) {
      await deleteLocalFile(imageUrl);
    }
    return {
      success: false,
      message: "Terjadi kesalahan saat menyimpan laporan",
    };
  }
}

// ============================================================
// UPDATE STATUS (ADMIN ONLY)
// ============================================================

export async function updateLaporanStatus(
  id: string,
  formData: FormData
): Promise<ActionResponse> {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return { success: false, message: "Unauthorized" };
  }

  const rawData = {
    status: formData.get("status") as string,
  };

  const validated = updateStatusSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      message: "Validasi gagal",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.laporanSampah.update({
      where: { id },
      data: { status: validated.data.status },
    });

    revalidatePath("/dashboard/admin/laporan");
    revalidatePath("/dashboard/admin");

    return {
      success: true,
      message: "Status laporan berhasil diperbarui",
    };
  } catch (error) {
    console.error("Update status error:", error);
    return {
      success: false,
      message: "Gagal memperbarui status laporan",
    };
  }
}

// ============================================================
// DELETE LAPORAN (ADMIN ONLY)
// ============================================================

export async function deleteLaporanSampah(
  id: string
): Promise<ActionResponse> {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const laporan = await prisma.laporanSampah.findUnique({
      where: { id },
      include: { fotoSampah: true },
    });

    if (laporan?.fotoSampah?.imageUrl) {
      await deleteLocalFile(laporan.fotoSampah.imageUrl);
    }

    // Cascade onDelete configured in Prisma schema will automatically delete FotoSampah
    await prisma.laporanSampah.delete({
      where: { id },
    });

    revalidatePath("/dashboard/admin/laporan");
    revalidatePath("/dashboard/admin");

    return {
      success: true,
      message: "Laporan sampah berhasil dihapus beserta foto terkait",
    };
  } catch (error) {
    console.error("Delete laporan error:", error);
    return {
      success: false,
      message: "Gagal menghapus laporan sampah",
    };
  }
}
