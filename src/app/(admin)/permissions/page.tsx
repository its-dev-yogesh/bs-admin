import type { Metadata } from "next";
import ComingSoon from "@/components/admin/ComingSoon";

export const metadata: Metadata = {
  title: "Roles & Permissions | Broker-Social Admin",
};

export default function PermissionsPage() {
  return (
    <ComingSoon
      title="Roles & Permissions"
      description="Manage permission grants and role assignments."
    />
  );
}
