import apiClient from '../../../api/apiClient';
import activitiesService from '../../activities/activitiesService';

function getCurrentDate() {
  return new Date().toISOString().split('T')[0];
}

async function getInvoices() {
  const { data } = await apiClient.get('/invoices');

  return data;
}

async function getInvoiceById(id) {
  const { data } = await apiClient.get(`/invoices/${id}`);

  return data;
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

  const { data: savedInvoice } = await apiClient.post('/invoices', newInvoice);

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

  const { data: updatedInvoice } = await apiClient.patch(
    `/invoices/${id}`,
    updatedData,
  );

  await activitiesService.addActivity({
    message: `Invoice updated: ${updatedInvoice.invoiceNumber}`,
    type: 'invoice',
    createdAt: getCurrentDate(),
  });

  return updatedInvoice;
}

async function deleteInvoice(id) {
  const invoice = await getInvoiceById(id);

  await apiClient.delete(`/invoices/${id}`);

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
