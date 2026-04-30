import type { Metadata } from "next";
import ComingSoon from "@/components/admin/ComingSoon";

export const metadata: Metadata = {
  title: "Notifications | Broker-Social Admin",
};

export default function NotificationsPage() {
  return (
    <ComingSoon
      title="Notifications"
      description="Compose broadcasts and inspect delivery."
    />
  );
}
