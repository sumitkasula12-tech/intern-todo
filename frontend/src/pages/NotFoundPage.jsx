import { Link } from 'react-router-dom';
import PageContainer from '../components/PageContainer';

export default function NotFoundPage() {
  return (
    <PageContainer title="Page Not Found">
      <div className="space-y-4 text-slate-700">
        <p>The page you are looking for does not exist.</p>
        <Link to="/dashboard" className="inline-block rounded bg-indigo-600 px-4 py-2 text-white">Go to Dashboard</Link>
      </div>
    </PageContainer>
  );
}
