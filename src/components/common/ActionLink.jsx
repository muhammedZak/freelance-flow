import { Link } from 'react-router-dom';

const variantClasses = {
  primary:
    'bg-slate-950 text-white shadow-sm hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500',

  secondary:
    'border border-slate-300 bg-white text-slate-700 shadow-sm hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800',

  success:
    'text-green-700 hover:bg-green-50 hover:text-green-800 dark:text-green-400 dark:hover:bg-green-500/10 dark:hover:text-green-300',

  danger:
    'text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-500/10 dark:hover:text-red-300',

  text: 'text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-500/10 dark:hover:text-blue-300',
};

const sizeClasses = {
  small: 'px-3 py-1.5 text-xs',
  medium: 'px-4 py-2.5 text-sm',
};

function ActionLink({
  children,
  to,
  variant = 'primary',
  size = 'medium',
  onClick,
  className = '',
  ...linkProps
}) {
  const selectedVariant = variantClasses[variant] || variantClasses.primary;

  const selectedSize = sizeClasses[size] || sizeClasses.medium;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-xl font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 ${selectedVariant} ${selectedSize} ${className}`}
      {...linkProps}>
      {children}
    </Link>
  );
}

export default ActionLink;
