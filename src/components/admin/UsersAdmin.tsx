"use client";

import { useEffect, useMemo, useState } from "react";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AdminUserRow,
  UserRole,
  UserStatus,
  usersService,
} from "@/services/users.service";
import { useAuth } from "@/context/AuthContext";
import PageHeader from "./PageHeader";

const ROLE_OPTIONS: UserRole[] = ["user", "admin", "super_admin"];
const STATUS_OPTIONS: UserStatus[] = ["active", "banned", "deleted"];
const ROLE_FILTERS: ("all" | UserRole)[] = [
  "all",
  "user",
  "admin",
  "super_admin",
];
const STATUS_FILTERS: ("all" | UserStatus)[] = [
  "all",
  "active",
  "banned",
  "deleted",
];

function statusBadge(status: UserStatus) {
  if (status === "active") return "success" as const;
  if (status === "banned") return "error" as const;
  return "warning" as const;
}

function roleBadge(role: UserRole) {
  if (role === "super_admin") return "info" as const;
  if (role === "admin") return "warning" as const;
  return "light" as const;
}

export default function UsersAdmin() {
  const { user: me } = useAuth();
  const [rows, setRows] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | UserRole>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | UserStatus>("all");
  const [pendingId, setPendingId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    usersService
      .list()
      .then((data) => setRows(data))
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load"),
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (roleFilter !== "all" && r.role !== roleFilter) return false;
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (!q) return true;
      return (
        r.username.toLowerCase().includes(q) ||
        r.phone.toLowerCase().includes(q) ||
        (r.email ?? "").toLowerCase().includes(q)
      );
    });
  }, [rows, search, roleFilter, statusFilter]);

  async function changeRole(row: AdminUserRow, role: UserRole) {
    if (role === row.role) return;
    setPendingId(row._id);
    try {
      const updated = await usersService.adminUpdate(row._id, { role });
      setRows((prev) => prev.map((r) => (r._id === row._id ? updated : r)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setPendingId(null);
    }
  }

  async function changeStatus(row: AdminUserRow, status: UserStatus) {
    if (status === row.status) return;
    setPendingId(row._id);
    try {
      const updated = await usersService.adminUpdate(row._id, { status });
      setRows((prev) => prev.map((r) => (r._id === row._id ? updated : r)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Manage user roles, suspend accounts, and audit registrations."
        action={
          <Button size="sm" variant="outline" onClick={load}>
            Refresh
          </Button>
        }
      />

      {error ? (
        <div className="rounded-lg border border-error-300 bg-error-50 px-4 py-3 text-sm text-error-700 dark:border-error-500/40 dark:bg-error-500/10 dark:text-error-300">
          {error}
        </div>
      ) : null}

      <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/3">
        <div className="grid gap-3 sm:grid-cols-3">
          <input
            type="text"
            placeholder="Search by name, phone, or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="dark:bg-dark-900 h-10 rounded-lg border border-gray-200 px-3 text-sm dark:border-gray-800 dark:bg-gray-900 dark:text-white/90"
          />
          <select
            value={roleFilter}
            onChange={(e) =>
              setRoleFilter(e.target.value as "all" | UserRole)
            }
            className="h-10 rounded-lg border border-gray-200 px-3 text-sm dark:border-gray-800 dark:bg-gray-900 dark:text-white/90"
          >
            {ROLE_FILTERS.map((r) => (
              <option key={r} value={r}>
                {r === "all" ? "All roles" : r}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "all" | UserStatus)
            }
            className="h-10 rounded-lg border border-gray-200 px-3 text-sm dark:border-gray-800 dark:bg-gray-900 dark:text-white/90"
          >
            {STATUS_FILTERS.map((s) => (
              <option key={s} value={s}>
                {s === "all" ? "All statuses" : s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-y border-gray-100 dark:border-gray-800">
              <TableRow>
                <TableCell isHeader className="px-4 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">User</TableCell>
                <TableCell isHeader className="px-4 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Phone</TableCell>
                <TableCell isHeader className="px-4 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Type</TableCell>
                <TableCell isHeader className="px-4 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Verified</TableCell>
                <TableCell isHeader className="px-4 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Role</TableCell>
                <TableCell isHeader className="px-4 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Status</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <TableRow>
                  <TableCell className="px-4 py-6 text-sm text-gray-500">Loading…</TableCell>
                  <TableCell>&nbsp;</TableCell><TableCell>&nbsp;</TableCell><TableCell>&nbsp;</TableCell><TableCell>&nbsp;</TableCell><TableCell>&nbsp;</TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell className="px-4 py-6 text-sm text-gray-500">No users match the current filters.</TableCell>
                  <TableCell>&nbsp;</TableCell><TableCell>&nbsp;</TableCell><TableCell>&nbsp;</TableCell><TableCell>&nbsp;</TableCell><TableCell>&nbsp;</TableCell>
                </TableRow>
              ) : (
                filtered.map((row) => {
                  const isMe = me && (row._id === me._id);
                  const disabled = pendingId === row._id;
                  return (
                    <TableRow key={row._id}>
                      <TableCell className="px-4 py-3">
                        <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {row.username}
                        </p>
                        <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                          {row.email ?? "—"}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-theme-sm text-gray-700 dark:text-gray-300">
                        {row.phone}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-theme-sm text-gray-700 dark:text-gray-300">
                        {row.type}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Badge size="sm" color={row.is_verified ? "success" : "warning"}>
                          {row.is_verified ? "yes" : "no"}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Badge size="sm" color={roleBadge(row.role)}>
                            {row.role}
                          </Badge>
                          <select
                            disabled={disabled || !!isMe}
                            value={row.role}
                            onChange={(e) =>
                              changeRole(row, e.target.value as UserRole)
                            }
                            className="h-8 rounded border border-gray-200 px-2 text-xs dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 disabled:opacity-50"
                          >
                            {ROLE_OPTIONS.map((r) => (
                              <option key={r} value={r}>
                                {r}
                              </option>
                            ))}
                          </select>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Badge size="sm" color={statusBadge(row.status)}>
                            {row.status}
                          </Badge>
                          <select
                            disabled={disabled || !!isMe}
                            value={row.status}
                            onChange={(e) =>
                              changeStatus(row, e.target.value as UserStatus)
                            }
                            className="h-8 rounded border border-gray-200 px-2 text-xs dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 disabled:opacity-50"
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
