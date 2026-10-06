import { clearTheme } from "@/lib/theme";
import { clearDisplay } from "@/lib/display";

export function getRole(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("role");
}

export function getUsername(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("username");
}

export function setAuth(role: string, username: string) {
  localStorage.setItem("role", role);
  localStorage.setItem("username", username);
}

export function clearAuth() {
  localStorage.removeItem("role");
  localStorage.removeItem("username");
  clearTheme();
  clearDisplay(); // the next person on this device gets their own text size and font
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("role");
}
