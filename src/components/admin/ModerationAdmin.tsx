"use client";

import { useEffect, useState } from "react";
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
  ReportRow,
  ReportStatus,
  moderationService,
} from "@/services/moderation.service";
import PageHeader from "./PageHeader";

type Tab = "open" | "all";

const ACTION_OPTIONS: { value: ReportStatus; label: string }[] = [
  { value: "actioned", label: "Take action (remove content)" },
  { value: "reviewed", label: "Reviewed (no action needed)" },
  { value: "rejected", label: "Reject report (invalid)" },
];

function statusBadge(status: ReportStatus) {
  switch (status) {
    case "open":
      return "warning" as const;
    case "actioned":
      return "error" as const;
    case "reviewed":
      return "success" as const;
    case "rejected":
    default:
      return "light" as const;
  }
}

function formatDate(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

export default function ModerationAdmin() {
  const [tab, setTab] = useState<Tab>("open");
  const [rows, setRows] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [reviewing, setReviewing] = useState<ReportRow | null>(null);
  const [decision, setDecision] = useState<ReportStatus>("actioned");
  const [note, setNote] = useState("");

  const load = (next: Tab = tab) => {
    setLoading(true);
    setError(null);
    const fetcher =
      next === "open"
        ? moderationService.listOpen()
        : moderationService.listAll();
    fetcher
      .then((res) => setRows(res.data ?? []))
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load"),
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load(tab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  function startReview(row: ReportRow) {
    setReviewing(row);
    setDecision("actioned");
    setNote(row.action_note ?? "");
  }

  async function submitReview() {
    if (!reviewing) return;
    setPendingId(reviewing._id);
    try {
      await moderationService.review(
        reviewing._id,
        decision,
        note.trim() || undefined,
      );
      setReviewing(null);
      setNote("");
      load(tab);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Review failed");
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Moderation"
        description="Review user-submitted reports against posts and other users."
        action={
          <Button size="sm" variant="outline" onClick={() => load(tab)}>
            Refresh
          </Button>
        }
      />

      {error ? (
        <div className="rounded-lg border border-error-300 bg-error-50 px-4 py-3 text-sm text-error-700 dark:border-error-500/40 dark:bg-error-500/10 dark:text-error-300">
          {error}
        </div>
      ) : null}

      <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1 dark:border-gray-800 dark:bg-white/3">
        {(["open", "all"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm rounded-md ${
              tab === t
                ? "bg-brand-500 text-white"
                : "text-gray-700 dark:text-gray-300"
            }`}
          >
            {t === "open" ? "Open" : "All"}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-y border-gray-100 dark:border-gray-800">
              <TableRow>
                <TableCell isHeader className="px-4 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Reporter</TableCell>
                <TableCell isHeader className="px-4 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Target</TableCell>
                <TableCell isHeader className="px-4 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Reason</TableCell>
                <TableCell isHeader className="px-4 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Created</TableCell>
                <TableCell isHeader className="px-4 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Status</TableCell>
                <TableCell isHeader className="px-4 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Action</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <TableRow>
                  <TableCell className="px-4 py-6 text-sm text-gray-500">Loading…</TableCell>
                  <TableCell>&nbsp;</TableCell><TableCell>&nbsp;</TableCell><TableCell>&nbsp;</TableCell><TableCell>&nbsp;</TableCell><TableCell>&nbsp;</TableCell>
                </TableRow>
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell className="px-4 py-6 text-sm text-gray-500">
                    {tab === "open" ? "Nothing in the queue. Nice." : "No reports submitted yet."}
                  </TableCell>
                  <TableCell>&nbsp;</TableCell><TableCell>&nbsp;</TableCell><TableCell>&nbsp;</TableCell><TableCell>&nbsp;</TableCell><TableCell>&nbsp;</TableCell>
                </TableRow>
              ) : (
                rows.map((row) => (
                  <TableRow key={row._id}>
                    <TableCell className="px-4 py-3 text-theme-sm text-gray-700 dark:text-gray-300">
                      {row.reporter_user_id.slice(0, 12)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-theme-sm">
                      <div className="flex flex-col">
                        <Badge size="sm" color={row.target_type === "user" ? "info" : "primary"}>
                          {row.target_type}
                        </Badge>
                        <span className="mt-1 font-mono text-xs text-gray-500">
                          {row.target_id.slice(0, 16)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-theme-sm text-gray-700 dark:text-gray-300 max-w-xs">
                      <p className="line-clamp-3">{row.reason}</p>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
                      {formatDate(row.createdAt)}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <Badge size="sm" color={statusBadge(row.status)}>
                        {row.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      {row.status === "open" ? (
                        <Button
                          size="sm"
                          disabled={pendingId === row._id}
                          onClick={() => startReview(row)}
                        >
                          Review
                        </Button>
                      ) : (
                        <span className="text-xs text-gray-500">{row.action_note ?? "—"}</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {reviewing ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 dark:bg-gray-900">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Review report
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {reviewing.target_type} <span className="font-mono">{reviewing.target_id.slice(0, 16)}</span>
            </p>
            <p className="mt-3 rounded-lg bg-gray-50 p-3 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300">
              {reviewing.reason}
            </p>
            <label className="mt-4 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Decision
            </label>
            <select
              value={decision}
              onChange={(e) => setDecision(e.target.value as ReportStatus)}
              className="mt-1 h-10 w-full rounded-lg border border-gray-200 px-3 text-sm dark:border-gray-800 dark:bg-gray-800 dark:text-white/90"
            >
              {ACTION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <label className="mt-4 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Internal note
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Why this decision?"
              className="mt-1 w-full rounded-lg border border-gray-200 p-3 text-sm dark:border-gray-800 dark:bg-gray-800 dark:text-white/90"
            />
            <div className="mt-4 flex justify-end gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setReviewing(null)}
                disabled={pendingId === reviewing._id}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={submitReview}
                disabled={pendingId === reviewing._id}
              >
                {pendingId === reviewing._id ? "Saving…" : "Submit"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
