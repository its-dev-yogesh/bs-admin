import { apiClient } from "@/lib/api";

export type LeadStatus = "new" | "contacted" | "converted" | "closed";

export type AdminDashboardData = {
  totalUsers: number;
  activeUsers: number;
  bannedUsers: number;
  newUsers24h: number;
  listingsCount: number;
  leadVolume: number;
  leadsConverted: number;
  pendingKyc: number;
  openReports: number;
  recentLeads: Array<{
    _id: string;
    status: LeadStatus;
    broker_user_id: string;
    client_user_id: string;
    post_id?: string;
    createdAt?: string;
  }>;
};

const empty: AdminDashboardData = {
  totalUsers: 0,
  activeUsers: 0,
  bannedUsers: 0,
  newUsers24h: 0,
  listingsCount: 0,
  leadVolume: 0,
  leadsConverted: 0,
  pendingKyc: 0,
  openReports: 0,
  recentLeads: [],
};

export const adminDashboardService = {
  async getDashboardData(): Promise<AdminDashboardData> {
    const [analytics, leads] = await Promise.all([
      apiClient
        .get<{ data?: Partial<AdminDashboardData> }>("/analytics/dashboard")
        .catch(() => ({ data: {} as Partial<AdminDashboardData> })),
      apiClient
        .get<{ data?: AdminDashboardData["recentLeads"] }>("/leads/admin/all")
        .catch(() => ({ data: [] as AdminDashboardData["recentLeads"] })),
    ]);

    const a = analytics.data ?? {};
    const leadList = leads.data ?? [];
    return {
      ...empty,
      ...a,
      recentLeads: leadList.slice(0, 8),
    };
  },
};
