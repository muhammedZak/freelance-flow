import { INVOICE_STATUS } from '../constants/invoices.constants';

const STATUS_CLASSES = Object.freeze({
  [INVOICE_STATUS.PAID]:
    'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300',

  [INVOICE_STATUS.OVERDUE]:
    'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300',

  [INVOICE_STATUS.UNPAID]:
    'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-300',
});

function InvoiceStatusBadge({ status }) {
  const statusClasses =
    STATUS_CLASSES[status] || STATUS_CLASSES[INVOICE_STATUS.UNPAID];

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusClasses}`}>
      {status}
    </span>
  );
}

export default InvoiceStatusBadge;
