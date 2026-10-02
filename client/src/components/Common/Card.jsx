export default function Card({ children, className = '' }) {
  return (
    <div className={`
      bg-white dark:bg-slate-800 
      rounded-lg p-6 
      shadow-sm border border-slate-200 dark:border-slate-700
      ${className}
    `}>
      {children}
    </div>
  );
}