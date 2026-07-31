import Button from '@components/common/Button';
import InputField from '@components/forms/InputField';
import SelectField from '@components/forms/SelectField';
import TextareaField from '@components/forms/TextareaField';

import { PROJECT_STATUS_OPTIONS } from '../projects.constants';

const SUBMISSION_ERROR_ID = 'project-form-submission-error';

function ProjectForm({
  formData,
  fieldErrors = {},
  submissionError = '',
  isSubmitting = false,
  clients = [],
  isEditMode,
  onChange,
  onSubmit,
}) {
  const clientOptions = [
    {
      value: '',
      label: 'Select client',
      disabled: true,
    },
    ...clients.map((client) => ({
      value: String(client.id),
      label: client.company
        ? `${client.name} - ${client.company}`
        : client.name,
    })),
  ];

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      aria-busy={isSubmitting}
      aria-describedby={submissionError ? SUBMISSION_ERROR_ID : undefined}
      className='space-y-5'>
      {submissionError && (
        <p
          id={SUBMISSION_ERROR_ID}
          role='alert'
          aria-live='assertive'
          className='rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300'>
          {submissionError}
        </p>
      )}

      <InputField
        label='Project Title'
        id='project-title'
        name='title'
        value={formData.title}
        onChange={onChange}
        placeholder='Enter project title'
        required
        disabled={isSubmitting}
        error={fieldErrors.title}
      />

      <SelectField
        label='Client'
        id='project-client'
        name='clientId'
        value={formData.clientId}
        onChange={onChange}
        options={clientOptions}
        required
        disabled={isSubmitting}
        error={fieldErrors.clientId}
      />

      <TextareaField
        label='Description'
        id='project-description'
        name='description'
        value={formData.description}
        onChange={onChange}
        rows={3}
        placeholder='Project description'
        required
        disabled={isSubmitting}
        error={fieldErrors.description}
      />

      <div className='grid gap-4 sm:grid-cols-2'>
        <InputField
          label='Start Date'
          id='project-start-date'
          name='startDate'
          type='date'
          value={formData.startDate}
          onChange={onChange}
          required
          disabled={isSubmitting}
          error={fieldErrors.startDate}
        />

        <InputField
          label='Deadline'
          id='project-deadline'
          name='deadline'
          type='date'
          value={formData.deadline}
          onChange={onChange}
          min={formData.startDate || undefined}
          required
          disabled={isSubmitting}
          error={fieldErrors.deadline}
        />
      </div>

      <div className='grid gap-4 sm:grid-cols-2'>
        <InputField
          label='Budget'
          id='project-budget'
          name='budget'
          type='number'
          value={formData.budget}
          onChange={onChange}
          placeholder='25000'
          min='0.01'
          step='0.01'
          inputMode='decimal'
          required
          disabled={isSubmitting}
          error={fieldErrors.budget}
        />

        <SelectField
          label='Status'
          id='project-status'
          name='status'
          value={formData.status}
          onChange={onChange}
          options={PROJECT_STATUS_OPTIONS}
          required
          disabled={isSubmitting}
          error={fieldErrors.status}
        />
      </div>

      <Button
        type='submit'
        disabled={isSubmitting}
        aria-disabled={isSubmitting}>
        {isSubmitting
          ? 'Saving...'
          : isEditMode
            ? 'Update Project'
            : 'Add Project'}
      </Button>
    </form>
  );
}

export default ProjectForm;
