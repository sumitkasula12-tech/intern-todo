export default function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div className="rounded border border-red-300 bg-red-50 px-4 py-3 text-red-700">
      {message}
    </div>
  );
}
