import type { Metadata } from "next";
import ComingSoon from "@/components/admin/ComingSoon";

export const metadata: Metadata = {
  title: "Analytics | Broker-Social Admin",
};

export default function AnalyticsPage() {
  return (
    <ComingSoon
      title="Analytics"
      description="Time-series breakdowns and cohort analysis."
    />
  );
}
