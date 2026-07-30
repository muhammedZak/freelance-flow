import ActionLink from "@/components/common/ActionLink";
import Button from "@/components/common/Button";

function ClientDetailsActions({ clientId, deleting = false, onDelete }) {
  return (
    <div className='flex flex-wrap gap-2'>
      <ActionLink to={`/clients/${clientId}/edit`} variant='success'>
        Edit Client
      </ActionLink>

      <Button
        type='button'
        variant='danger'
        disabled={deleting}
        onClick={onDelete}>
        {deleting ? 'Deleting...' : 'Delete Client'}
      </Button>
    </div>
  );
}

export default ClientDetailsActions;
