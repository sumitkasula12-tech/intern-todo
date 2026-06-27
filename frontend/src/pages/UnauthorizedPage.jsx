import PageContainer from '../components/PageContainer';

export default function UnauthorizedPage() {
  return (
    <PageContainer title="Unauthorized">
      <div className="text-slate-700">You do not have permission to access this page.</div>
    </PageContainer>
  );
}
