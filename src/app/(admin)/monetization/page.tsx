import type { Metadata } from "next";
import ComingSoon from "@/components/admin/ComingSoon";

export const metadata: Metadata = {
  title: "Monetization | Broker-Social Admin",
};

export default function MonetizationPage() {
  return (
    <ComingSoon
      title="Monetization"
      description="Subscription plans, ads, and broker fees."
    />
  );
}
