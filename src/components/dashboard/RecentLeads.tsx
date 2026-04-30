import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";

type Lead = {
  _id: string;
  status: "new" | "contacted" | "converted" | "closed";
  broker_user_id: string;
  client_user_id: string;
  post_id?: string;
  createdAt?: string;
};

function statusColor(status: Lead["status"]) {
  switch (status) {
    case "converted":
      return "success";
    case "new":
    case "contacted":
      return "warning";
    case "closed":
    default:
      return "error";
  }
}

function formatDate(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function RecentLeads({
  leads,
  loading,
}: {
  leads: Lead[];
  loading?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/3 sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Recent leads
        </h3>
        <Link
          href="/leads"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-theme-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
        >
          View all
        </Link>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Lead
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Broker
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Client
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Created
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {(loading ? [] : leads).map((lead) => (
              <TableRow key={lead._id}>
                <TableCell className="py-3">
                  <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    #{lead._id.slice(0, 8)}
                  </p>
                  <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                    {lead.post_id
                      ? `Post: ${lead.post_id.slice(0, 8)}`
                      : "Direct enquiry"}
                  </span>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {lead.broker_user_id.slice(0, 8)}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {lead.client_user_id.slice(0, 8)}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {formatDate(lead.createdAt)}
                </TableCell>
                <TableCell className="py-3">
                  <Badge size="sm" color={statusColor(lead.status)}>
                    {lead.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {!loading && leads.length === 0 ? (
              <TableRow>
                <TableCell className="py-6 text-gray-500 text-theme-sm">
                  No leads yet.
                </TableCell>
                <TableCell className="py-6">&nbsp;</TableCell>
                <TableCell className="py-6">&nbsp;</TableCell>
                <TableCell className="py-6">&nbsp;</TableCell>
                <TableCell className="py-6">&nbsp;</TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
