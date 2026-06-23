export default function PageContainer({ title, children, banner }) {
  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto w-full max-w-5xl px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-slate-900">{title}</h1>
        </div>
        {banner && <div className="mb-4">{banner}</div>}
        <div className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-200">{children}</div>
      </div>
    </div>
  );
}
