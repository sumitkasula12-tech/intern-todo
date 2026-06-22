import PageContainer from '../components/PageContainer';

export default function DashboardPage() {
  return (
    <PageContainer title="Dashboard">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl bg-slate-100 p-6">Total Tasks</div>
        <div className="rounded-2xl bg-slate-100 p-6">Pending Tasks</div>
        <div className="rounded-2xl bg-slate-100 p-6">In Progress</div>
        <div className="rounded-2xl bg-slate-100 p-6">Overdue Tasks</div>
      </div>
    </PageContainer>
  );
}
