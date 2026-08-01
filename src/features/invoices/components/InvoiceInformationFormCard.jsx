import SectionCard from '@components/common/SectionCard';
import MessageAlert from '@components/common/MessageAlert';

import InputField from '@components/forms/InputField';
import SelectField from '@components/forms/SelectField';

import { INVOICE_STATUS_OPTIONS } from '../constants/invoices.constants';

function InvoiceInformationFormCard({ formData, clients, projects, onChange }) {
  const clientOptions = [
    {
      value: '',
      label: 'Select client',
    },
    ...clients.map((client) => ({
      value: String(client.id),
      label: client.company
        ? `${client.name} - ${client.company}`
        : client.name,
    })),
  ];

  const projectOptions = [
    {
      value: '',
      label: formData.clientId ? 'Select project' : 'Select a client first',
    },
    ...projects.map((project) => ({
      value: String(project.id),
      label: project.title,
    })),
  ];

  return (
    <SectionCard
      title='Invoice Information'
      description='Choose the client and project, then define the invoice dates and status.'>
      <div className='space-y-5'>
        <InputField
          id='invoiceNumber'
          name='invoiceNumber'
          label='Invoice Number'
          type='text'
          value={formData.invoiceNumber}
          onChange={onChange}
          placeholder='Example: INV-005'
        />

        <div className='grid gap-5 sm:grid-cols-2'>
          <SelectField
            id='clientId'
            name='clientId'
            label='Client'
            value={formData.clientId}
            onChange={onChange}
            options={clientOptions}
          />

          <SelectField
            id='projectId'
            name='projectId'
            label='Project'
            value={formData.projectId}
            onChange={onChange}
            options={projectOptions}
            disabled={!formData.clientId}
          />
        </div>

        {formData.clientId && projects.length === 0 && (
          <MessageAlert
            type='info'
            title='No projects available'
            message='This client has no projects.'
          />
        )}

        <div className='grid gap-5 sm:grid-cols-2'>
          <InputField
            id='issueDate'
            name='issueDate'
            label='Issue Date'
            type='date'
            value={formData.issueDate}
            onChange={onChange}
          />

          <InputField
            id='dueDate'
            name='dueDate'
            label='Due Date'
            type='date'
            value={formData.dueDate}
            onChange={onChange}
          />
        </div>

        <SelectField
          id='status'
          name='status'
          label='Status'
          value={formData.status}
          onChange={onChange}
          options={INVOICE_STATUS_OPTIONS}
        />
      </div>
    </SectionCard>
  );
}

export default InvoiceInformationFormCard;
