import type { Metadata } from "next";
import UsersAdmin from "@/components/admin/UsersAdmin";

export const metadata: Metadata = {
  title: "Users | Broker-Social Admin",
};

export default function UsersPage() {
  return <UsersAdmin />;
}
