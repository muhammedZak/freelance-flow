import { useNavigate, useParams } from 'react-router-dom';

import Loading from '@components/common/Loading';
import ErrorMessage from '@components/common/ErrorMessage';
import PageHeader from '@components/common/PageHeader';
import BackLink from '@components/common/BackLink';
import EmptyState from '@/components/common/EmptyState';

import ClientContactCard from '../components/ClientContactCard';
import ClientDetailsActions from '../components/ClientDetailsActions';
import ClientMetadataCard from '../components/ClientMetadataCard';
import ClientOverviewCard from '../components/ClientOverviewCard';

import useClientDetails from '../hooks/useClientDetails';

function ClientDetailesPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const {
    client,
    error,

    isInitialLoading,
    isDeleting,
    hasLoadError,

    retry,
    deleteCurrentClient,
  } = useClientDetails(id);

  async function handleDelete() {
    const confirmed = window.confirm(
      'Are you sure you want to delete this client?',
    );

    if (!confirmed) {
      return;
    }

    const deleted = await deleteCurrentClient();

    if (deleted) {
      navigate('/clients');
    }
  }

  if (isInitialLoading) {
    return <Loading message='Loading client details.' />;
  }

  if (hasLoadError) {
    return (
      <ErrorMessage
        title='Unable to load client'
        message={error}
        onRetry={retry}
        retryText='Reload Client'
      />
    );
  }

  if (!client) {
    return <EmptyState message='Client not found.' />;
  }

  return (
    <div className='workspace-page'>
      <BackLink to='/clients'>Back to Clients</BackLink>

      <PageHeader
        title={client.name}
        description={client.company || 'View and manage this client.'}>
        <ClientDetailsActions
          clientId={client.id}
          deleting={isDeleting}
          onDelete={handleDelete}
        />
      </PageHeader>

      {error && (
        <div className='mb-4'>
          <MessageAlert type='error' message={error} />
        </div>
      )}

      <div className='grid gap-4 lg:grid-cols-2'>
        <ClientOverviewCard client={client} />

        <ClientContactCard client={client} />

        <div className='lg:col-span-2'>
          <ClientMetadataCard client={client} />
        </div>
      </div>
    </div>
  );
}

export default ClientDetailesPage;
