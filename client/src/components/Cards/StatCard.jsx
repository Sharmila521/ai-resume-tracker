export default function StatCard({ 
  title, 
  value, 
  change = '+12%',
  icon: Icon,
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{title}</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-3">{change}</p>
        </div>
        {Icon && (
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
            <Icon size={24} className="text-indigo-600 dark:text-indigo-400" />
          </div>
        )}
      </div>
    </div>
  );
}