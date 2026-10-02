export default function Button({ 
  children, 
  variant = 'primary', 
  className = '',
  ...props 
}) {
 const variants = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
  secondary: 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-300',
  danger: 'bg-red-600 text-white hover:bg-red-700',
};

  return (
    <button 
      className={`
        px-6 py-2 rounded-lg font-medium transition-colors
        ${variants[variant]} ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}