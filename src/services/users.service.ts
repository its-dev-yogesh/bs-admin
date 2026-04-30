import { apiClient } from "@/lib/api";

export type UserRole = "user" | "admin" | "super_admin";
export type UserStatus = "active" | "banned" | "deleted";
export type UserType = "user" | "agent";

export type AdminUserRow = {
  _id: string;
  username: string;
  phone: string;
  email?: string;
  role: UserRole;
  status: UserStatus;
  type: UserType;
  is_verified: boolean;
  createdAt?: string;
};

export type AdminUserUpdate = {
  role?: UserRole;
  status?: UserStatus;
};

export const usersService = {
  list: () => apiClient.get<AdminUserRow[]>("/users"),
  adminUpdate: (id: string, body: AdminUserUpdate) =>
    apiClient.put<AdminUserRow>(`/users/${id}/admin`, body),
};
