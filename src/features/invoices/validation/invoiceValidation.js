import { INVOICE_STATUS } from '../invoices.constants';

const VALID_INVOICE_STATUSES = Object.freeze(Object.values(INVOICE_STATUS));

export function validateInvoiceForm(formData, projects = []) {
  const invoiceNumber = String(formData?.invoiceNumber ?? '').trim();

  if (!invoiceNumber) {
    return 'Invoice number is required';
  }

  if (!formData?.clientId) {
    return 'Please select a client';
  }

  if (!formData?.projectId) {
    return 'Please select a project';
  }

  const selectedProject = projects.find(
    (project) => String(project.id) === String(formData.projectId),
  );

  if (
    !selectedProject ||
    String(selectedProject.clientId) !== String(formData.clientId)
  ) {
    return 'The selected project does not belong to this client';
  }

  if (
    formData.hoursWorked === '' ||
    formData.hoursWorked === null ||
    formData.hoursWorked === undefined
  ) {
    return 'Hours worked is required';
  }

  const hoursWorked = Number(formData.hoursWorked);

  if (!Number.isFinite(hoursWorked) || hoursWorked <= 0) {
    return 'Hours worked must be greater than 0';
  }

  if (
    formData.hourlyRate === '' ||
    formData.hourlyRate === null ||
    formData.hourlyRate === undefined
  ) {
    return 'Hourly rate is required';
  }

  const hourlyRate = Number(formData.hourlyRate);

  if (!Number.isFinite(hourlyRate) || hourlyRate <= 0) {
    return 'Hourly rate must be greater than 0';
  }

  if (!formData.issueDate) {
    return 'Issue date is required';
  }

  if (!formData.dueDate) {
    return 'Due date is required';
  }

  const issueDate = new Date(formData.issueDate);
  const dueDate = new Date(formData.dueDate);

  if (Number.isNaN(issueDate.getTime())) {
    return 'Please enter a valid issue date';
  }

  if (Number.isNaN(dueDate.getTime())) {
    return 'Please enter a valid due date';
  }

  if (dueDate < issueDate) {
    return 'Due date cannot be before issue date';
  }

  if (!VALID_INVOICE_STATUSES.includes(formData.status)) {
    return 'Please select a valid invoice status';
  }

  return '';
}
