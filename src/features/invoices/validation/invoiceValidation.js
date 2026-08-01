import { INVOICE_STATUS } from '../constants/invoices.constants';

const VALID_INVOICE_STATUSES = Object.freeze(Object.values(INVOICE_STATUS));

function isEmptyValue(value) {
  return value === '' || value === null || value === undefined;
}

export function validateInvoiceForm(formData, projects = []) {
  const errors = {};

  const invoiceNumber = String(formData?.invoiceNumber ?? '').trim();

  if (!invoiceNumber) {
    errors.invoiceNumber = 'Invoice number is required';
  }

  if (!formData?.clientId) {
    errors.clientId = 'Please select a client';
  }

  if (!formData?.projectId) {
    errors.projectId = 'Please select a project';
  }

  if (formData?.clientId && formData?.projectId) {
    const selectedProject = projects.find(
      (project) => String(project.id) === String(formData.projectId),
    );

    if (
      !selectedProject ||
      String(selectedProject.clientId) !== String(formData.clientId)
    ) {
      errors.projectId = 'The selected project does not belong to this client';
    }
  }

  if (isEmptyValue(formData?.hoursWorked)) {
    errors.hoursWorked = 'Hours worked is required';
  } else {
    const hoursWorked = Number(formData.hoursWorked);

    if (!Number.isFinite(hoursWorked) || hoursWorked <= 0) {
      errors.hoursWorked = 'Hours worked must be greater than 0';
    }
  }

  if (isEmptyValue(formData?.hourlyRate)) {
    errors.hourlyRate = 'Hourly rate is required';
  } else {
    const hourlyRate = Number(formData.hourlyRate);

    if (!Number.isFinite(hourlyRate) || hourlyRate <= 0) {
      errors.hourlyRate = 'Hourly rate must be greater than 0';
    }
  }

  let issueDate = null;
  let dueDate = null;

  if (!formData?.issueDate) {
    errors.issueDate = 'Issue date is required';
  } else {
    issueDate = new Date(formData.issueDate);

    if (Number.isNaN(issueDate.getTime())) {
      errors.issueDate = 'Please enter a valid issue date';
    }
  }

  if (!formData?.dueDate) {
    errors.dueDate = 'Due date is required';
  } else {
    dueDate = new Date(formData.dueDate);

    if (Number.isNaN(dueDate.getTime())) {
      errors.dueDate = 'Please enter a valid due date';
    }
  }

  const hasValidIssueDate = issueDate && !Number.isNaN(issueDate.getTime());

  const hasValidDueDate = dueDate && !Number.isNaN(dueDate.getTime());

  if (hasValidIssueDate && hasValidDueDate && dueDate < issueDate) {
    errors.dueDate = 'Due date cannot be before issue date';
  }

  if (!formData?.status || !VALID_INVOICE_STATUSES.includes(formData.status)) {
    errors.status = 'Please select a valid invoice status';
  }

  return errors;
}
