export default function FormInput({ label, name, type = 'text', register, errors, ...rest }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor={name}>{label}</label>
      <input
        id={name}
        type={type}
        {...register(name)}
        {...rest}
        className="w-full rounded border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
      />
      {errors?.[name] && <p className="mt-1 text-sm text-red-600">{errors[name].message}</p>}
    </div>
  );
}
