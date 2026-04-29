"use client";

import React, { useEffect, useState } from "react";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import DemographicCard from "@/components/ecommerce/DemographicCard";
import {
  adminDashboardService,
  type AdminDashboardData,
} from "@/services/admin-dashboard.service";

const initialData: AdminDashboardData = {
  dau: 0,
  listingsCount: 0,
  leadVolume: 0,
  brokerConversationStarts: 0,
  pendingKyc: 0,
  openReports: 0,
  recentLeads: [],
};

export default function AdminDashboardOverview() {
  const [data, setData] = useState<AdminDashboardData>(initialData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    adminDashboardService
      .getDashboardData()
      .then((res) => {
        if (mounted) setData(res);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <EcommerceMetrics data={data} loading={loading} />
        <MonthlySalesChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget />
      </div>

      <div className="col-span-12">
        <StatisticsChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <DemographicCard />
      </div>

      <div className="col-span-12 xl:col-span-7">
        <RecentOrders leads={data.recentLeads} loading={loading} />
      </div>
    </div>
  );
}
