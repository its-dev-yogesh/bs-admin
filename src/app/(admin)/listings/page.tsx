import type { Metadata } from "next";
import ComingSoon from "@/components/admin/ComingSoon";

export const metadata: Metadata = { title: "Listings | Broker-Social Admin" };

export default function ListingsPage() {
  return (
    <ComingSoon
      title="Listings"
      description="Browse and moderate property listings posted by brokers."
    />
  );
}
