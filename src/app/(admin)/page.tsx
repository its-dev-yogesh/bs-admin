import type { Metadata } from "next";
import React from "react";
import AdminDashboardOverview from "@/components/admin/AdminDashboardOverview";

export const metadata: Metadata = {
  title: "Dashboard | Broker-Social Admin",
  description: "Broker-Social admin dashboard",
};

export default function AdminDashboardPage() {
  return <AdminDashboardOverview />;
}
