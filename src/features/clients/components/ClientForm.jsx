import Button from '@/components/common/Button';
import InputField from '@/components/forms/InputField';
import SelectField from '@/components/forms/SelectField';
import TextareaField from '@/components/forms/TextareaField';

import { CLIENT_STATUS_OPTIONS } from '../clients.constants';

function ClientForm({
  formData,
  formError,
  loading,
  isEditMode,
  onChange,
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit} className='space-y-4'>
      {formError && (
        <p className='rounded bg-red-100 p-3 text-sm text-red-700'>
          {formError}
        </p>
      )}

      <InputField
        label='Client Name'
        id='client-name'
        name='name'
        type='text'
        value={formData.name}
        onChange={onChange}
        placeholder='Enter client name'
        autoComplete='name'
      />

      <InputField
        label='Email'
        id='client-email'
        type='email'
        name='email'
        value={formData.email}
        onChange={onChange}
        placeholder='client@example.com'
        autoComplete='email'
      />

      <InputField
        label='Phone'
        id='client-phone'
        type='text'
        name='phone'
        value={formData.phone}
        onChange={onChange}
        placeholder='9876543210'
        autoComplete='phone'
      />

      <InputField
        label='Company'
        id='client-company'
        type='text'
        name='company'
        value={formData.company}
        onChange={onChange}
        placeholder='Company name'
        autoComplete='company name'
      />

      <TextareaField
        label='Address'
        id='client-address'
        placeholder='Client address'
        name='address'
        value={formData.address}
        onChange={onChange}
        rows='3'
      />

      <SelectField
        id='client-status'
        label='Status'
        name='status'
        value={formData.status}
        onChange={onChange}
        options={CLIENT_STATUS_OPTIONS}
      />

      <Button type='submit' disabled={loading}>
        {loading ? 'Saving...' : isEditMode ? 'Update Client' : 'Add Client'}
      </Button>
    </form>
  );
}

export default ClientForm;
