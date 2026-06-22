import PageContainer from '../components/PageContainer';

export default function TaskListPage() {
  return (
    <PageContainer title="Tasks">
      <div className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-3">
            <input type="text" placeholder="Search by title" className="rounded border px-3 py-2" />
            <select className="rounded border px-3 py-2">
              <option value="">All status</option>
            </select>
            <select className="rounded border px-3 py-2">
              <option value="">All priority</option>
            </select>
          </div>
          <button className="rounded bg-indigo-600 px-4 py-2 text-white">New Task</button>
        </div>
        <div className="overflow-x-auto rounded-lg border bg-white p-4 shadow-sm">
          <table className="min-w-full text-left text-sm text-slate-700">
            <thead className="border-b bg-slate-50 text-slate-900">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Due Date</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b last:border-none">
                <td className="px-4 py-3">No tasks found</td>
                <td className="px-4 py-3">-</td>
                <td className="px-4 py-3">-</td>
                <td className="px-4 py-3">-</td>
                <td className="px-4 py-3">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </PageContainer>
  );
}
