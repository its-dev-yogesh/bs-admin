const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3004/api";

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  return (await res.json()) as T;
}

export type AdminDashboardData = {
  dau: number;
  listingsCount: number;
  leadVolume: number;
  brokerConversationStarts: number;
  pendingKyc: number;
  openReports: number;
  recentLeads: Array<{
    _id: string;
    status: "new" | "contacted" | "converted" | "closed";
    broker_user_id: string;
    client_user_id: string;
    post_id?: string;
  }>;
};

export const adminDashboardService = {
  async getDashboardData(): Promise<AdminDashboardData> {
    const [analytics, kyc, reports, leads] = await Promise.all([
      fetchJson<{ data?: { dau?: number; listingsCount?: number; leadVolume?: number; brokerConversationStarts?: number } }>(
        "/analytics/dashboard",
      ).catch(() => ({ data: {} })),
      fetchJson<{ data?: unknown[] }>("/verification/kyc/pending").catch(() => ({
        data: [],
      })),
      fetchJson<{ data?: unknown[] }>("/moderation/reports/open").catch(() => ({
        data: [],
      })),
      fetchJson<{ data?: unknown[] }>("/leads").catch(() => ({ data: [] })),
    ]);

    const analyticsData = (analytics.data ?? {}) as {
      dau?: number;
      listingsCount?: number;
      leadVolume?: number;
      brokerConversationStarts?: number;
    };
    const leadList = (leads.data ?? []) as AdminDashboardData["recentLeads"];
    return {
      dau: analyticsData.dau ?? 0,
      listingsCount: analyticsData.listingsCount ?? 0,
      leadVolume: analyticsData.leadVolume ?? leadList.length,
      brokerConversationStarts: analyticsData.brokerConversationStarts ?? 0,
      pendingKyc: (kyc.data ?? []).length,
      openReports: (reports.data ?? []).length,
      recentLeads: leadList.slice(0, 8),
    };
  },
};
