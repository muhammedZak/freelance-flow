import API_URL from '../../services/api';

async function getInvoices() {
  const res = await fetch(`${API_URL}/invoices`);

  if (!res.ok) {
    throw new Error('Failed to fetch invoices');
  }

  return await res.json();
}

const invoicesService = {
  getInvoices,
};

export default invoicesService;
