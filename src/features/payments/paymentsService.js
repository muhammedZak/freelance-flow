import apiClient from '../../api/apiClient';

async function getPayments() {
  const { data } = await apiClient.get('/payments');

  return data;
}

async function createPayment(paymentData) {
  const { data } = await apiClient.post('/payments', paymentData);

  return data;
}

async function updatePayment(id, paymentData) {
  const { data } = await apiClient.patch(
    `/payments/${String(id)}`,
    paymentData,
  );

  return data;
}

async function deletePayment(id) {
  await apiClient.delete(`/payments/${String(id)}`);

  return String(id);
}

async function createPaymentActivity(message) {
  const activityData = {
    message,
    type: 'payment',
    createdAt: new Date().toISOString(),
  };

  const { data } = await apiClient.post('/activities', activityData);

  return data;
}

const paymentService = {
  getPayments,
  createPayment,
  updatePayment,
  deletePayment,
  createPaymentActivity,
};

export default paymentService;
