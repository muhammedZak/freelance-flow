import ActionLink from '@/components/common/ActionLink';
import Button from '@components/common/Button';

import { formatDate } from '@/utils/formatDate';

import ClientStatusBadge from './ClientStatusBadge';

function ClientTableRow({ client, onDelete }) {
  return (
    <tr className='border-b border-slate-200 last:border-b-0 dark:border-slate-800'>
      <td className='p-3 font-medium text-slate-900 dark:text-white'>
        {client.name}
      </td>

      <td className='p-3 text-slate-600 dark:text-slate-400'>
        {client.companyName}
      </td>

      <td className='p-3 text-slate-600 dark:text-slate-400'>{client.email}</td>

      <td className='p-3'>
        <ClientStatusBadge status={client.status} />
      </td>

      <td className='p-3 text-slate-600 dark:text-slate-400'>
        {formatDate(client.createdAt)}
      </td>

      <td className='p-3'>
        <div className='flex flex-wrap gap-1'>
          <ActionLink to={`/clients/${client.id}`} variant='text' size='small'>
            View
          </ActionLink>

          <ActionLink
            to={`/clients/${client.id}/edit`}
            variant='success'
            size='small'>
            Edit
          </ActionLink>

          <Button
            type='button'
            variant='danger'
            size='small'
            onClick={() => onDelete(client.id)}>
            Delete
          </Button>
        </div>
      </td>
    </tr>
  );
}

export default ClientTableRow;
