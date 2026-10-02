export default function Input({ 
  label, 
  type = 'text', 
  placeholder,
  error,
  ...props 
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        className={`
          w-full px-4 py-2
          border rounded-lg
          bg-white dark:bg-slate-800
          text-slate-900 dark:text-white
          placeholder-slate-500 dark:placeholder-slate-400
          ${error 
            ? 'border-red-500' 
            : 'border-slate-300 dark:border-slate-600'
          }
          focus:outline-none focus:ring-2 focus:ring-indigo-500
          transition
        `}
        {...props}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}