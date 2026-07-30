import { CLIENT_STATUS } from '../clients.constants';

function ClientStatusBadge({ status }) {
  const statusClasses =
    status === CLIENT_STATUS.ACTIVE
      ? 'rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700 dark:bg-green-500/10 dark:text-green-300'
      : 'rounded-full bg-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300';

  return <span className={statusClasses}>{status}</span>;
}

export default ClientStatusBadge;
