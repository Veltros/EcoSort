"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import type { ActionResponse } from "@/types";

export async function getUserPoinDanTransaksi() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { poin: true, nama: true, email: true, noHp: true },
  });

  const riwayat = await prisma.transaksiPoin.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  const totalReward = riwayat
    .filter((t) => t.tipe === "REWARD")
    .reduce((acc, t) => acc + t.nominalRupiah, 0);

  const totalPenukaran = riwayat
    .filter((t) => t.tipe === "PENUKARAN")
    .reduce((acc, t) => acc + t.nominalRupiah, 0);

  return {
    saldoPoin: user?.poin || 0,
    totalReward,
    totalPenukaran,
    riwayat,
  };
}

export async function tukarPoinAction(
  formData: FormData
): Promise<ActionResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Silakan login terlebih dahulu" };
  }

  const jumlahPoin = parseFloat(formData.get("jumlahPoin") as string);
  const metode = (formData.get("metode") as string)?.toUpperCase();
  const nomorTujuan = (formData.get("nomorTujuan") as string)?.trim().replace(/[^0-9]/g, "");

  if (isNaN(jumlahPoin) || jumlahPoin < 5000) {
    return {
      success: false,
      message: "Minimal penukaran adalah 5.000 Poin (Rp 5.000)",
      errors: { jumlahPoin: ["Minimal penukaran 5.000 Poin"] },
    };
  }

  if (!["DANA", "GOPAY", "OVO", "SHOPEEPAY"].includes(metode)) {
    return {
      success: false,
      message: "Pilih metode E-Wallet yang valid",
      errors: { metode: ["Metode e-wallet tidak valid"] },
    };
  }

  if (!nomorTujuan || nomorTujuan.length < 10) {
    return {
      success: false,
      message: "Nomor HP E-Wallet minimal 10 digit angka",
      errors: { nomorTujuan: ["Nomor HP tidak valid"] },
    };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { poin: true },
    });

    if (!user || user.poin < jumlahPoin) {
      return {
        success: false,
        message: `Saldo tidak mencukupi. Saldo Anda: Rp ${(user?.poin || 0).toLocaleString("id-ID")}`,
      };
    }

    // Jalankan transaksi debit saldo dan catat riwayat
    await prisma.$transaction([
      prisma.user.update({
        where: { id: session.user.id },
        data: { poin: { decrement: jumlahPoin } },
      }),
      prisma.transaksiPoin.create({
        data: {
          userId: session.user.id,
          tipe: "PENUKARAN",
          jumlahPoin,
          nominalRupiah: jumlahPoin,
          metode,
          nomorTujuan,
          status: "BERHASIL",
          keterangan: `Pencairan Saldo ke ${metode} (${nomorTujuan})`,
        },
      }),
    ]);

    revalidatePath("/dashboard/user/transaksi");
    revalidatePath("/dashboard/user");
    revalidatePath("/dashboard/admin/transaksi");

    return {
      success: true,
      message: `Berhasil mencairkan Rp ${jumlahPoin.toLocaleString("id-ID")} ke ${metode}!`,
    };
  } catch (error) {
    console.error("Tukar poin error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat memproses penukaran",
    };
  }
}

export async function getAllTransaksiAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const transaksi = await prisma.transaksiPoin.findMany({
    include: {
      user: {
        select: { id: true, nama: true, email: true, noHp: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalRewardKota = transaksi
    .filter((t) => t.tipe === "REWARD")
    .reduce((acc, t) => acc + t.nominalRupiah, 0);

  const totalPencairanKota = transaksi
    .filter((t) => t.tipe === "PENUKARAN")
    .reduce((acc, t) => acc + t.nominalRupiah, 0);

  return {
    transaksi,
    totalRewardKota,
    totalPencairanKota,
  };
}
