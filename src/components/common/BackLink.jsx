import { Link } from 'react-router-dom';

function BackLink({ to, children = 'Back' }) {
  return (
    <Link
      to={to}
      className='inline-flex items-center gap-2 rounded-lg py-1 text-sm font-semibold text-slate-600 transition hover:text-blue-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/10 dark:text-slate-400 dark:hover:text-blue-400'>
      <span aria-hidden='true'>←</span>
      <span>{children}</span>
    </Link>
  );
}

export default BackLink;
