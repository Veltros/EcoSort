import { z } from "zod";

// ============================================================
// AUTH VALIDATIONS
// ============================================================

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email harus diisi")
    .email("Format email tidak valid"),
  password: z
    .string()
    .min(1, "Password harus diisi")
    .min(6, "Password minimal 6 karakter"),
});

export const registerSchema = z
  .object({
    nama: z
      .string()
      .min(1, "Nama harus diisi")
      .min(3, "Nama minimal 3 karakter"),
    email: z
      .string()
      .min(1, "Email harus diisi")
      .email("Format email tidak valid"),
    noHp: z
      .string()
      .min(1, "No. HP harus diisi")
      .min(10, "No. HP minimal 10 digit")
      .max(15, "No. HP maksimal 15 digit")
      .regex(/^[0-9]+$/, "No. HP hanya boleh berisi angka"),
    password: z
      .string()
      .min(1, "Password harus diisi")
      .min(6, "Password minimal 6 karakter"),
    confirmPassword: z
      .string()
      .min(1, "Konfirmasi password harus diisi"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password dan konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  });

// ============================================================
// JENIS SAMPAH VALIDATIONS
// ============================================================

export const jenisSampahSchema = z.object({
  namaJenis: z
    .string()
    .min(1, "Nama jenis sampah harus diisi")
    .min(2, "Nama jenis sampah minimal 2 karakter"),
});

// ============================================================
// WILAYAH VALIDATIONS
// ============================================================

export const wilayahSchema = z.object({
  namaWilayah: z
    .string()
    .min(1, "Nama wilayah harus diisi")
    .min(3, "Nama wilayah minimal 3 karakter"),
});

// ============================================================
// LAPORAN SAMPAH VALIDATIONS
// ============================================================

export const laporanSampahSchema = z.object({
  berat: z
    .number({ error: "Berat harus berupa angka" })
    .positive("Berat harus lebih dari 0")
    .max(99999, "Berat maksimal 99999 kg"),
  tanggalLapor: z
    .string()
    .min(1, "Tanggal lapor harus diisi"),
  jenisSampahId: z
    .string()
    .min(1, "Jenis sampah harus dipilih"),
  wilayahId: z
    .string()
    .min(1, "Wilayah harus dipilih"),
});

export const updateStatusSchema = z.object({
  status: z.enum(["PENDING", "DIPROSES", "SELESAI"], {
    error: "Status harus dipilih",
  }),
});

// ============================================================
// TYPES
// ============================================================

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type JenisSampahFormData = z.infer<typeof jenisSampahSchema>;
export type WilayahFormData = z.infer<typeof wilayahSchema>;
export type LaporanSampahFormData = z.infer<typeof laporanSampahSchema>;
export type UpdateStatusFormData = z.infer<typeof updateStatusSchema>;
