import { Link } from 'react-router-dom';

const sizeClasses = {
  small: {
    icon: 'h-8 w-8 rounded-lg text-xs',
    text: 'text-base',
    gap: 'gap-2',
  },

  medium: {
    icon: 'h-10 w-10 rounded-xl text-sm',
    text: 'text-lg',
    gap: 'gap-3',
  },
};

function AppLogo({
  to = '/',
  showName = true,
  size = 'medium',
  onClick,
  className = '',
}) {
  const selectedSize = sizeClasses[size] || sizeClasses.medium;

  return (
    <Link
      to={to}
      onClick={onClick}
      aria-label='Go to FreelanceFlow home page'
      className={`inline-flex items-center rounded-lg text-slate-950 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:text-white dark:focus-visible:ring-offset-slate-950 ${selectedSize.gap} ${className}`}>
      <span
        aria-hidden='true'
        className={`flex shrink-0 items-center justify-center bg-slate-950 font-bold text-white dark:bg-blue-600 ${selectedSize.icon}`}>
        FF
      </span>

      {showName && (
        <span className={`font-bold tracking-tight ${selectedSize.text}`}>
          Freelance
          <span className='text-blue-600 dark:text-blue-400'>Flow</span>
        </span>
      )}
    </Link>
  );
}

export default AppLogo;
