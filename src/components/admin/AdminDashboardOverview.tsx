"use client";

import React, { useEffect, useState } from "react";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import RecentLeads from "@/components/dashboard/RecentLeads";
import {
  adminDashboardService,
  type AdminDashboardData,
} from "@/services/admin-dashboard.service";

const initialData: AdminDashboardData = {
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

export default function AdminDashboardOverview() {
  const [data, setData] = useState<AdminDashboardData>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    void (async () => {
      try {
        const res = await adminDashboardService.getDashboardData();
        if (mounted) setData(res);
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Failed to load");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-title-md font-semibold text-gray-800 dark:text-white/90">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Overview of platform activity and outstanding admin work.
        </p>
      </div>

      {error ? (
        <div className="rounded-lg border border-error-300 bg-error-50 px-4 py-3 text-sm text-error-700 dark:border-error-500/40 dark:bg-error-500/10 dark:text-error-300">
          {error}
        </div>
      ) : null}

      <DashboardMetrics data={data} loading={loading} />
      <RecentLeads leads={data.recentLeads} loading={loading} />
    </div>
  );
}
