"use client";
import React from "react";
import Badge from "../ui/badge/Badge";
import {
  BoxIconLine,
  CheckCircleIcon,
  GroupIcon,
  ShootingStarIcon,
  TaskIcon,
} from "@/icons";
import type { AdminDashboardData } from "@/services/admin-dashboard.service";

type Tile = {
  label: string;
  value: number;
  icon: React.ReactNode;
  badge?: { color: "success" | "warning" | "error" | "info"; text: string };
};

export const DashboardMetrics = ({
  data,
  loading,
}: {
  data: AdminDashboardData;
  loading?: boolean;
}) => {
  const conversionRate =
    data.leadVolume > 0
      ? Math.round((data.leadsConverted / data.leadVolume) * 100)
      : 0;

  const tiles: Tile[] = [
    {
      label: "Total users",
      value: data.totalUsers,
      icon: <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />,
      badge: {
        color: "success",
        text: `+${data.newUsers24h} in 24h`,
      },
    },
    {
      label: "Active listings",
      value: data.listingsCount,
      icon: <BoxIconLine className="text-gray-800 dark:text-white/90" />,
    },
    {
      label: "Leads",
      value: data.leadVolume,
      icon: <TaskIcon className="text-gray-800 size-6 dark:text-white/90" />,
      badge: {
        color: conversionRate > 0 ? "success" : "info",
        text: `${conversionRate}% converted`,
      },
    },
    {
      label: "Pending KYC",
      value: data.pendingKyc,
      icon: (
        <CheckCircleIcon className="text-gray-800 size-6 dark:text-white/90" />
      ),
      badge: {
        color: data.pendingKyc > 0 ? "warning" : "success",
        text: data.pendingKyc > 0 ? "needs review" : "clear",
      },
    },
    {
      label: "Open reports",
      value: data.openReports,
      icon: (
        <ShootingStarIcon className="text-gray-800 size-6 dark:text-white/90" />
      ),
      badge: {
        color: data.openReports > 0 ? "error" : "success",
        text: data.openReports > 0 ? "action required" : "none",
      },
    },
    {
      label: "Banned users",
      value: data.bannedUsers,
      icon: <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
      {tiles.map((tile) => (
        <div
          key={tile.label}
          className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 md:p-6"
        >
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            {tile.icon}
          </div>
          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {tile.label}
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {loading ? "…" : tile.value.toLocaleString()}
              </h4>
            </div>
            {tile.badge ? (
              <Badge color={tile.badge.color}>{tile.badge.text}</Badge>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
};
