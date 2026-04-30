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
  AdminLeadRow,
  LeadStatus,
  leadsService,
} from "@/services/leads.service";
import PageHeader from "./PageHeader";

const STATUS_FILTERS: ("all" | LeadStatus)[] = [
  "all",
  "new",
  "contacted",
  "converted",
  "closed",
];

function statusBadge(status: LeadStatus) {
  switch (status) {
    case "converted":
      return "success" as const;
    case "new":
    case "contacted":
      return "warning" as const;
    case "closed":
    default:
      return "error" as const;
  }
}

function formatDate(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

export default function LeadsAdmin() {
  const [rows, setRows] = useState<AdminLeadRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | LeadStatus>("all");
  const [search, setSearch] = useState("");

  const load = () => {
    setLoading(true);
    setError(null);
    leadsService
      .list()
      .then((res) => setRows(res.data ?? []))
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load"),
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (!q) return true;
      return (
        r._id.toLowerCase().includes(q) ||
        r.broker_user_id.toLowerCase().includes(q) ||
        r.client_user_id.toLowerCase().includes(q) ||
        (r.post_id ?? "").toLowerCase().includes(q)
      );
    });
  }, [rows, statusFilter, search]);

  const counts = useMemo(() => {
    const c: Record<LeadStatus, number> = {
      new: 0,
      contacted: 0,
      converted: 0,
      closed: 0,
    };
    rows.forEach((r) => {
      c[r.status] += 1;
    });
    return c;
  }, [rows]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leads"
        description="All broker–client leads on the platform."
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

      <div className="grid gap-4 sm:grid-cols-4">
        {(["new", "contacted", "converted", "closed"] as LeadStatus[]).map(
          (s) => (
            <div
              key={s}
              className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/3"
            >
              <span className="text-xs uppercase text-gray-500 dark:text-gray-400">
                {s}
              </span>
              <p className="mt-1 text-title-sm font-bold text-gray-800 dark:text-white/90">
                {loading ? "…" : counts[s]}
              </p>
            </div>
          ),
        )}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/3">
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            type="text"
            placeholder="Search by lead, broker, client or post id"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 rounded-lg border border-gray-200 px-3 text-sm dark:border-gray-800 dark:bg-gray-900 dark:text-white/90"
          />
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "all" | LeadStatus)
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
                <TableCell isHeader className="px-4 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Lead</TableCell>
                <TableCell isHeader className="px-4 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Broker</TableCell>
                <TableCell isHeader className="px-4 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Client</TableCell>
                <TableCell isHeader className="px-4 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Post</TableCell>
                <TableCell isHeader className="px-4 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Created</TableCell>
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
                  <TableCell className="px-4 py-6 text-sm text-gray-500">No leads match the filter.</TableCell>
                  <TableCell>&nbsp;</TableCell><TableCell>&nbsp;</TableCell><TableCell>&nbsp;</TableCell><TableCell>&nbsp;</TableCell><TableCell>&nbsp;</TableCell>
                </TableRow>
              ) : (
                filtered.map((row) => (
                  <TableRow key={row._id}>
                    <TableCell className="px-4 py-3 text-theme-sm text-gray-700 dark:text-gray-300">
                      #{row._id.slice(0, 8)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-theme-sm text-gray-700 dark:text-gray-300">
                      {row.broker_user_id.slice(0, 12)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-theme-sm text-gray-700 dark:text-gray-300">
                      {row.client_user_id.slice(0, 12)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-theme-sm text-gray-700 dark:text-gray-300">
                      {row.post_id ? row.post_id.slice(0, 12) : "—"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                      {formatDate(row.createdAt)}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <Badge size="sm" color={statusBadge(row.status)}>
                        {row.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
