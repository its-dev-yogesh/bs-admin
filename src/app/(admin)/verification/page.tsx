import type { Metadata } from "next";
import VerificationAdmin from "@/components/admin/VerificationAdmin";

export const metadata: Metadata = {
  title: "KYC Verification | Broker-Social Admin",
};

export default function VerificationPage() {
  return <VerificationAdmin />;
}
