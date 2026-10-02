export default function ATSScoreCard({ score = 88 }) {
  return (
    <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 rounded-lg p-8 border border-slate-200 dark:border-slate-700">
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-200 dark:text-slate-700" />
            <circle 
              cx="50" 
              cy="50" 
              r="45" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeDasharray={`${2.827 * score} 282.7`}
              className="text-green-500 transition-all"
              strokeLinecap="round"
            />
          </svg>
          <div className="flex flex-col items-center">
            <span className="text-4xl font-bold text-green-600">{score}%</span>
            <span className="text-xs text-slate-600 dark:text-slate-400">ATS Score</span>
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-slate-900 dark:text-white">Great! Your resume is optimized</p>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">Ready for ATS systems</p>
        </div>
      </div>
    </div>
  );
}