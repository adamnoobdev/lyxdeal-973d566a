import { Role } from "@/types/auth";

export const getRedirectPath = (role: Role | null): string => {
  switch (role) {
    case "admin":
      return "/salon/dashboard";
    case "salon":
      return "/salon/dashboard";
    default:
      return "/salon/login";
  }
};

export const isAuthorizedForRoute = (role: Role | null, path: string): boolean => {
  // Admin har tillgång till alla routes
  if (role === "admin") return true;

  // Salong har endast tillgång till sin egen dashboard
  if (role === "salon") {
    return path.startsWith("/salon/dashboard");
  }

  // Om ingen roll finns, tillåt endast login-sidan
  return path === "/salon/login";
};