const ASYNC_STATUS = Object.freeze({
  LOADING: 'loading',
});

const selectInvoicesState = (state) => state.invoices;

export const selectAllInvoices = (state) => selectInvoicesState(state).items;

export const selectSelectedInvoice = (state) =>
  selectInvoicesState(state).selectedInvoice;

export const selectInvoicesSuccessMessage = (state) =>
  selectInvoicesState(state).successMessage;

export const selectInvoicesListStatus = (state) =>
  selectInvoicesState(state).list.status;

export const selectInvoicesListError = (state) =>
  selectInvoicesState(state).list.error;

export const selectInvoiceDetailsStatus = (state) =>
  selectInvoicesState(state).details.status;

export const selectInvoiceDetailsError = (state) =>
  selectInvoicesState(state).details.error;

export const selectInvoiceCreateStatus = (state) =>
  selectInvoicesState(state).create.status;

export const selectInvoiceCreateError = (state) =>
  selectInvoicesState(state).create.error;

export const selectInvoiceUpdateStatus = (state) =>
  selectInvoicesState(state).update.status;

export const selectInvoiceUpdateError = (state) =>
  selectInvoicesState(state).update.error;

export const selectInvoiceDeleteStatus = (state) =>
  selectInvoicesState(state).delete.status;

export const selectInvoiceDeleteError = (state) =>
  selectInvoicesState(state).delete.error;

export const selectIsInvoicesListLoading = (state) =>
  selectInvoicesListStatus(state) === ASYNC_STATUS.LOADING;

export const selectIsInvoiceDetailsLoading = (state) =>
  selectInvoiceDetailsStatus(state) === ASYNC_STATUS.LOADING;

export const selectIsInvoiceCreating = (state) =>
  selectInvoiceCreateStatus(state) === ASYNC_STATUS.LOADING;

export const selectIsInvoiceUpdating = (state) =>
  selectInvoiceUpdateStatus(state) === ASYNC_STATUS.LOADING;

export const selectIsInvoiceDeleting = (state) =>
  selectInvoiceDeleteStatus(state) === ASYNC_STATUS.LOADING;
