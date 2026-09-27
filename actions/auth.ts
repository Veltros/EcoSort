"use server";

import { prisma } from "@/lib/prisma";
import { signIn, signOut } from "@/lib/auth";
import { registerSchema, loginSchema } from "@/lib/validations";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import type { ActionResponse } from "@/types";

// ============================================================
// REGISTER
// ============================================================

export async function registerAction(
  formData: FormData
): Promise<ActionResponse> {
  const rawData = {
    nama: (formData.get("nama") as string)?.trim(),
    email: (formData.get("email") as string)?.trim().toLowerCase(),
    noHp: (formData.get("noHp") as string)?.trim().replace(/[^0-9]/g, ""),
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const validated = registerSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      message: "Validasi gagal",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  try {
    // Check if email already exists
    const existingEmail = await prisma.user.findUnique({
      where: { email: validated.data.email },
    });

    if (existingEmail) {
      return {
        success: false,
        message: "Email sudah terdaftar",
        errors: { email: ["Email sudah terdaftar"] },
      };
    }

    // Check if noHp already exists
    const existingPhone = await prisma.user.findUnique({
      where: { noHp: validated.data.noHp },
    });

    if (existingPhone) {
      return {
        success: false,
        message: "No. HP sudah terdaftar",
        errors: { noHp: ["No. HP sudah terdaftar"] },
      };
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(validated.data.password, 12);

    await prisma.user.create({
      data: {
        nama: validated.data.nama,
        email: validated.data.email,
        noHp: validated.data.noHp,
        password: hashedPassword,
        role: "USER",
      },
    });

    return {
      success: true,
      message: "Registrasi berhasil! Silakan login.",
    };
  } catch (error) {
    console.error("Register error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat registrasi",
    };
  }
}

// ============================================================
// LOGIN
// ============================================================

export async function loginAction(
  formData: FormData
): Promise<ActionResponse<{ redirectUrl: string }>> {
  const rawData = {
    email: (formData.get("email") as string)?.trim().toLowerCase(),
    password: formData.get("password") as string,
  };

  const validated = loginSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      message: "Validasi gagal",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  try {
    await signIn("credentials", {
      email: validated.data.email,
      password: validated.data.password,
      redirect: false,
    });

    const user = await prisma.user.findUnique({
      where: { email: validated.data.email },
      select: { role: true },
    });

    const redirectUrl =
      user?.role === "ADMIN" ? "/dashboard/admin" : "/dashboard/user";

    return {
      success: true,
      message: "Login berhasil!",
      data: { redirectUrl },
    };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        success: false,
        message: "Email atau password salah",
      };
    }
    throw error;
  }
}

// ============================================================
// LOGOUT
// ============================================================

export async function logoutAction() {
  await signOut({ redirect: false });
}
