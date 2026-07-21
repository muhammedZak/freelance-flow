const variantClasses = {
  primary:
    'bg-slate-950 text-white shadow-sm hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500',

  secondary:
    'border border-slate-300 bg-white text-slate-700 shadow-sm hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800',

  success: 'bg-green-600 text-white shadow-sm hover:bg-green-700',

  danger: 'bg-red-600 text-white shadow-sm hover:bg-red-700',

  text: 'text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-500/10 dark:hover:text-blue-300',
};

const sizeClasses = {
  small: 'px-3 py-1.5 text-xs',
  medium: 'px-4 py-2.5 text-sm',
};

function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'medium',
  onClick,
  disabled = false,
  fullWidth = false,
  className = '',
  ...buttonProps
}) {
  const selectedVariant = variantClasses[variant] || variantClasses.primary;

  const selectedSize = sizeClasses[size] || sizeClasses.medium;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-xl font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus-visible:ring-offset-slate-950 ${selectedVariant} ${selectedSize} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      {...buttonProps}>
      {children}
    </button>
  );
}

export default Button;
