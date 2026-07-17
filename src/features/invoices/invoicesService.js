import API_URL from '../../services/api';
import activitiesService from '../activities/activitiesService';

function getCurrentDate() {
  return new Date().toISOString().split('T')[0];
}

async function getInvoices() {
  const response = await fetch(`${API_URL}/invoices`);

  if (!response.ok) {
    throw new Error('Failed to fetch invoices');
  }

  return await response.json();
}

async function getInvoiceById(id) {
  const response = await fetch(`${API_URL}/invoices/${id}`);

  if (!response.ok) {
    throw new Error('Invoice not found');
  }

  return await response.json();
}

async function createInvoice(invoiceData) {
  const newInvoice = {
    ...invoiceData,
    id: Date.now().toString(),
    clientId: String(invoiceData.clientId),
    projectId: String(invoiceData.projectId),
    hoursWorked: Number(invoiceData.hoursWorked),
    hourlyRate: Number(invoiceData.hourlyRate),
    total: Number(invoiceData.total),
    createdAt: getCurrentDate(),
  };

  const response = await fetch(`${API_URL}/invoices`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newInvoice),
  });

  if (!response.ok) {
    throw new Error('Failed to create invoice');
  }

  const savedInvoice = await response.json();

  await activitiesService.addActivity({
    message: `Invoice created: ${savedInvoice.invoiceNumber}`,
    type: 'invoice',
    createdAt: getCurrentDate(),
  });

  return savedInvoice;
}

async function updateInvoice(id, invoiceData) {
  const updatedData = {
    ...invoiceData,
  };

  if (updatedData.clientId !== undefined) {
    updatedData.clientId = String(updatedData.clientId);
  }

  if (updatedData.projectId !== undefined) {
    updatedData.projectId = String(updatedData.projectId);
  }

  if (updatedData.hoursWorked !== undefined) {
    updatedData.hoursWorked = Number(updatedData.hoursWorked);
  }

  if (updatedData.hourlyRate !== undefined) {
    updatedData.hourlyRate = Number(updatedData.hourlyRate);
  }

  if (updatedData.total !== undefined) {
    updatedData.total = Number(updatedData.total);
  }

  const response = await fetch(`${API_URL}/invoices/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) {
    throw new Error('Failed to update invoice');
  }

  const updatedInvoice = await response.json();

  await activitiesService.addActivity({
    message: `Invoice updated: ${updatedInvoice.invoiceNumber}`,
    type: 'invoice',
    createdAt: getCurrentDate(),
  });

  return updatedInvoice;
}

async function deleteInvoice(id) {
  const invoice = await getInvoiceById(id);

  const response = await fetch(`${API_URL}/invoices/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete invoice');
  }

  await activitiesService.addActivity({
    message: `Invoice deleted: ${invoice.invoiceNumber}`,
    type: 'invoice',
    createdAt: getCurrentDate(),
  });

  return String(id);
}

const invoicesService = {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
};

export default invoicesService;
