import SectionCard from '@/components/common/SectionCard';

import { formatDate } from '@/utils/formatDate';

function ClientMetadataCard({ client }) {
  return (
    <SectionCard title='Record Information'>
      <dl className='space-y-4'>
        <div>
          <dt className='text-sm font-medium text-slate-500 dark:text-slate-400'>
            Client ID
          </dt>

          <dd className='mt-1 wrap-break-word font-mono text-sm text-slate-800 dark:text-slate-200'>
            {client.id}
          </dd>
        </div>

        <div>
          <dt className='text-sm font-medium text-slate-500 dark:text-slate-400'>
            Created
          </dt>

          <dd className='mt-1 text-slate-800 dark:text-slate-200'>
            {client.createdAt ? formatDate(client.createdAt) : 'Not available'}
          </dd>
        </div>
      </dl>
    </SectionCard>
  );
}

export default ClientMetadataCard;
