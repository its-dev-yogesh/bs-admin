import type { Metadata } from "next";
import ModerationAdmin from "@/components/admin/ModerationAdmin";

export const metadata: Metadata = {
  title: "Moderation | Broker-Social Admin",
};

export default function ModerationPage() {
  return <ModerationAdmin />;
}
