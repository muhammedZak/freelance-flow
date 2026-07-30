import SectionCard from '@/components/common/SectionCard';

function ClientContactCard({ client }) {
  return (
    <SectionCard title='Contact Information'>
      <dl className='space-y-4'>
        <div>
          <dt className='text-sm font-medium text-slate-500 dark:text-slate-400'>
            Email
          </dt>

          <dd className='mt-1 wrap-break-word text-slate-800 dark:text-slate-200'>
            {client.email || 'Not provided'}
          </dd>
        </div>

        <div>
          <dt className='text-sm font-medium text-slate-500 dark:text-slate-400'>
            Phone
          </dt>

          <dd className='mt-1 text-slate-800 dark:text-slate-200'>
            {client.phone || 'Not provided'}
          </dd>
        </div>

        <div>
          <dt className='text-sm font-medium text-slate-500 dark:text-slate-400'>
            Address
          </dt>

          <dd className='mt-1 whitespace-pre-line text-slate-800 dark:text-slate-200'>
            {client.address || 'Not provided'}
          </dd>
        </div>
      </dl>
    </SectionCard>
  );
}

export default ClientContactCard;
