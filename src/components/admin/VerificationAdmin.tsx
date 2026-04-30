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
  KycRequestRow,
  KycStatus,
  verificationService,
} from "@/services/verification.service";
import PageHeader from "./PageHeader";

type Tab = "pending" | "all";

function statusBadge(status: KycStatus) {
  if (status === "approved") return "success" as const;
  if (status === "rejected") return "error" as const;
  return "warning" as const;
}

function formatDate(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

export default function VerificationAdmin() {
  const [tab, setTab] = useState<Tab>("pending");
  const [rows, setRows] = useState<KycRequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [reviewing, setReviewing] = useState<KycRequestRow | null>(null);
  const [reviewNote, setReviewNote] = useState("");
  const [reviewDecision, setReviewDecision] = useState<KycStatus>("approved");

  const load = (next: Tab = tab) => {
    setLoading(true);
    setError(null);
    const fetcher =
      next === "pending"
        ? verificationService.listPending()
        : verificationService.listAll();
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

  function startReview(row: KycRequestRow, decision: KycStatus) {
    setReviewing(row);
    setReviewDecision(decision);
    setReviewNote(row.admin_note ?? "");
  }

  async function submitReview() {
    if (!reviewing) return;
    setPendingId(reviewing._id);
    try {
      await verificationService.review(
        reviewing._id,
        reviewDecision,
        reviewNote.trim() || undefined,
      );
      setReviewing(null);
      setReviewNote("");
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
        title="KYC verification"
        description="Approve or reject KYC documents submitted by users."
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
        {(["pending", "all"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm rounded-md ${
              tab === t
                ? "bg-brand-500 text-white"
                : "text-gray-700 dark:text-gray-300"
            }`}
          >
            {t === "pending" ? "Pending" : "All"}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-y border-gray-100 dark:border-gray-800">
              <TableRow>
                <TableCell isHeader className="px-4 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">User</TableCell>
                <TableCell isHeader className="px-4 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">PAN</TableCell>
                <TableCell isHeader className="px-4 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Aadhaar</TableCell>
                <TableCell isHeader className="px-4 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Documents</TableCell>
                <TableCell isHeader className="px-4 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Submitted</TableCell>
                <TableCell isHeader className="px-4 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Status</TableCell>
                <TableCell isHeader className="px-4 py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400">Action</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <TableRow>
                  <TableCell className="px-4 py-6 text-sm text-gray-500">Loading…</TableCell>
                  <TableCell>&nbsp;</TableCell><TableCell>&nbsp;</TableCell><TableCell>&nbsp;</TableCell><TableCell>&nbsp;</TableCell><TableCell>&nbsp;</TableCell><TableCell>&nbsp;</TableCell>
                </TableRow>
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell className="px-4 py-6 text-sm text-gray-500">
                    {tab === "pending" ? "No pending KYC requests." : "No KYC records yet."}
                  </TableCell>
                  <TableCell>&nbsp;</TableCell><TableCell>&nbsp;</TableCell><TableCell>&nbsp;</TableCell><TableCell>&nbsp;</TableCell><TableCell>&nbsp;</TableCell><TableCell>&nbsp;</TableCell>
                </TableRow>
              ) : (
                rows.map((row) => (
                  <TableRow key={row._id}>
                    <TableCell className="px-4 py-3 text-theme-sm text-gray-700 dark:text-gray-300">
                      {row.user_id.slice(0, 12)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-theme-sm text-gray-700 dark:text-gray-300">
                      {row.pan_number}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-theme-sm text-gray-700 dark:text-gray-300">
                      {row.aadhaar_number}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-theme-sm">
                      <div className="flex gap-3">
                        <a className="text-brand-500 hover:underline" href={row.pan_doc_url} target="_blank" rel="noopener noreferrer">PAN doc</a>
                        <a className="text-brand-500 hover:underline" href={row.aadhaar_doc_url} target="_blank" rel="noopener noreferrer">Aadhaar doc</a>
                      </div>
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
                      {row.status === "pending" ? (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            disabled={pendingId === row._id}
                            onClick={() => startReview(row, "approved")}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={pendingId === row._id}
                            onClick={() => startReview(row, "rejected")}
                          >
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500">{row.admin_note ?? "—"}</span>
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
              {reviewDecision === "approved" ? "Approve KYC" : "Reject KYC"}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              User <span className="font-mono">{reviewing.user_id.slice(0, 12)}</span>
            </p>
            <textarea
              value={reviewNote}
              onChange={(e) => setReviewNote(e.target.value)}
              rows={4}
              placeholder="Admin note (optional)"
              className="mt-4 w-full rounded-lg border border-gray-200 p-3 text-sm dark:border-gray-800 dark:bg-gray-800 dark:text-white/90"
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
                {pendingId === reviewing._id
                  ? "Saving…"
                  : reviewDecision === "approved"
                  ? "Confirm approve"
                  : "Confirm reject"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
