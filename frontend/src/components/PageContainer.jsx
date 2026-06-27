import Navbar from './Navbar';

export default function PageContainer({ title, children, banner }) {
  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <Navbar />
      <div className="mx-auto w-full max-w-5xl px-4 pt-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-950">{title}</h1>
        </div>
        {banner && <div className="mb-4">{banner}</div>}
        <div className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-100">{children}</div>
      </div>
    </div>
  );
}
