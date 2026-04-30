import type { Metadata } from "next";
import LeadsAdmin from "@/components/admin/LeadsAdmin";

export const metadata: Metadata = {
  title: "Leads | Broker-Social Admin",
};

export default function LeadsPage() {
  return <LeadsAdmin />;
}
