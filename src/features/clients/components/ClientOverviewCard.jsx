import SectionCard from '@/components/common/SectionCard';

import ClientStatusBadge from './ClientStatusBadge';

function ClientOverviewCard({ client }) {
  return (
    <SectionCard title='Overview'>
      <dl className='space-y-4'>
        <div>
          <dt className='text-sm font-medium text-slate-500 dark:text-slate-400'>
            Client name
          </dt>

          <dd className='mt-1 text-base font-semibold text-slate-900 dark:text-white'>
            {client.name || 'Not provided'}
          </dd>
        </div>

        <div>
          <dt className='text-sm font-medium text-slate-500 dark:text-slate-400'>
            Company
          </dt>

          <dd className='mt-1 text-slate-800 dark:text-slate-200'>
            {client.company || 'Not provided'}
          </dd>
        </div>

        <div>
          <dt className='text-sm font-medium text-slate-500 dark:text-slate-400'>
            Status
          </dt>

          <dd className='mt-2'>
            <ClientStatusBadge status={client.status} />
          </dd>
        </div>
      </dl>
    </SectionCard>
  );
}

export default ClientOverviewCard;
