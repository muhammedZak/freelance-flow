import { CLIENT_STATUS } from './clients.constants';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PHONE_PATTERN = /^[0-9+\-()\s]{7,20}$/;

const VALID_CLIENT_STATUSES = Object.values(CLIENT_STATUS);

export function validateClientForm(formData) {
  const errors = {};

  const name = formData.name?.trim() ?? '';
  const email = formData.email?.trim() ?? '';
  const phone = formData.phone?.trim() ?? '';
  const company = formData.company?.trim() ?? '';
  const address = formData.address?.trim() ?? '';
  const status = formData.status ?? '';

  if (!name) {
    errors.name = 'Client name is required.';
  } else if (name.length < 2) {
    errors.name = 'Client name must contain at least 2 characters.';
  } else if (name.length > 80) {
    errors.name = 'Client name must not exceed 80 characters.';
  }

  if (!email) {
    errors.email = 'Email address is required.';
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (phone && !PHONE_PATTERN.test(phone)) {
    errors.phone = 'Enter a valid phone number using 7 to 20 characters.';
  }

  if (!company) {
    errors.company = 'Company name is required.';
  } else if (company.length > 100) {
    errors.company = 'Company name must not exceed 100 characters.';
  }

  if (address.length > 250) {
    errors.address = 'Address must not exceed 250 characters.';
  }

  if (!VALID_CLIENT_STATUSES.includes(status)) {
    errors.status = 'Select a valid client status.';
  }

  return errors;
}

export function getFirstValidationError(errors) {
  return Object.values(errors)[0] ?? '';
}

export function hasValidationErrors(errors) {
  return Object.keys(errors).length > 0;
}
