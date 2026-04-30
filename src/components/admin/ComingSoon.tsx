import PageHeader from "./PageHeader";

export default function ComingSoon({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} />
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center dark:border-gray-700 dark:bg-white/3">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          This admin section is scaffolded but not yet implemented.
        </p>
      </div>
    </div>
  );
}
