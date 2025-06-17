"use client";
import { UserResponse } from "@/app/profile/page";
import axios from "axios";

export function requireAuth() {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    window.location.href = "/";
  }
}

export async function isLogged(): Promise<boolean> {
  let user: UserResponse;
  const userId = localStorage.getItem("userId");
  if (!userId) return false;

  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/users/` + userId
    );
    user = res.data;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return false;
  }

  if (!user) return false;
  return true;
}

export function isRequiredUsedLogged(userId: string): boolean {
  return localStorage.getItem("userId") === userId;
}
