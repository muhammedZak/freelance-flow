import API_URL from '../../services/api';

async function getPayments() {
  const response = await fetch(`${API_URL}/payments`);

  if (!response.ok) {
    throw new Error('Failed to fetch payments.');
  }

  return response.json();
}

async function createPayment(paymentData) {
  const response = await fetch(`${API_URL}/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(paymentData),
  });

  if (!response.ok) {
    throw new Error('Failed to add payment.');
  }

  return response.json();
}

async function updatePayment(id, paymentData) {
  const response = await fetch(`${API_URL}/payments/${String(id)}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(paymentData),
  });

  if (!response.ok) {
    throw new Error('Failed to update payment.');
  }

  return response.json();
}

async function deletePayment(id) {
  const response = await fetch(`${API_URL}/payments/${String(id)}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete payment.');
  }

  return String(id);
}

async function updateRelatedInvoiceStatus(invoiceId, status) {
  const response = await fetch(`${API_URL}/invoices/${String(invoiceId)}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error('Failed to update the related invoice.');
  }

  return response.json();
}

async function createPaymentActivity(message) {
  const activityData = {
    message,
    type: 'payment',
    createdAt: new Date().toISOString(),
  };

  const response = await fetch(`${API_URL}/activities`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(activityData),
  });

  if (!response.ok) {
    throw new Error('Failed to create payment activity.');
  }

  return response.json();
}

const paymentService = {
  getPayments,
  createPayment,
  updatePayment,
  deletePayment,
  updateRelatedInvoiceStatus,
  createPaymentActivity,
};

export default paymentService;
