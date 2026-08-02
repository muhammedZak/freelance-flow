import { createSelector } from '@reduxjs/toolkit';

import { selectCurrentUser } from '@features/auth';

const EMPTY_INVOICES = Object.freeze([]);
const EMPTY_CLIENTS = Object.freeze([]);

const IDLE_OPERATION = Object.freeze({
  status: 'idle',
  error: null,
});

const ASYNC_STATUS = Object.freeze({
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
});

const USER_ROLE = Object.freeze({
  FREELANCER: 'freelancer',
  CLIENT: 'client',
});

function normalizeId(value) {
  if (value === null || value === undefined) {
    return null;
  }

  const normalizedId = String(value).trim();

  return normalizedId || null;
}

function idsMatch(firstId, secondId) {
  const normalizedFirstId = normalizeId(firstId);
  const normalizedSecondId = normalizeId(secondId);

  if (!normalizedFirstId || !normalizedSecondId) {
    return false;
  }

  return normalizedFirstId === normalizedSecondId;
}

const selectInvoicesState = (state) => state.invoices ?? {};

const selectRawInvoices = (state) =>
  selectInvoicesState(state).items ?? EMPTY_INVOICES;

const selectRawSelectedInvoice = (state) =>
  selectInvoicesState(state).selectedInvoice ?? null;

const selectClientProfiles = (state) => state.clients?.clients ?? EMPTY_CLIENTS;

function selectInvoiceOperation(state, operationName) {
  return selectInvoicesState(state)?.[operationName] ?? IDLE_OPERATION;
}

const selectCurrentClientProfile = createSelector(
  [selectClientProfiles, selectCurrentUser],
  (clientProfiles, currentUser) => {
    if (!currentUser || currentUser.role !== USER_ROLE.CLIENT) {
      return null;
    }

    return (
      clientProfiles.find((clientProfile) =>
        idsMatch(clientProfile.userId, currentUser.id),
      ) ?? null
    );
  },
);

function canUserAccessInvoice(invoice, currentUser, currentClientProfile) {
  if (!invoice || !currentUser) {
    return false;
  }

  if (currentUser.role === USER_ROLE.FREELANCER) {
    return idsMatch(invoice.freelancerId, currentUser.id);
  }

  if (currentUser.role === USER_ROLE.CLIENT) {
    if (!currentClientProfile) {
      return false;
    }

    return idsMatch(invoice.clientId, currentClientProfile.id);
  }

  /*
   * Unknown or unsupported roles fail closed.
   */
  return false;
}

export const selectAllInvoices = createSelector(
  [selectRawInvoices, selectCurrentUser, selectCurrentClientProfile],
  (invoices, currentUser, currentClientProfile) => {
    if (!currentUser) {
      return EMPTY_INVOICES;
    }

    return invoices.filter((invoice) =>
      canUserAccessInvoice(invoice, currentUser, currentClientProfile),
    );
  },
);

export const selectSelectedInvoice = createSelector(
  [selectRawSelectedInvoice, selectCurrentUser, selectCurrentClientProfile],
  (selectedInvoice, currentUser, currentClientProfile) => {
    if (!selectedInvoice || !currentUser) {
      return null;
    }

    return canUserAccessInvoice(
      selectedInvoice,
      currentUser,
      currentClientProfile,
    )
      ? selectedInvoice
      : null;
  },
);

export const selectInvoiceById = (state, invoiceId) => {
  const invoices = selectAllInvoices(state);

  return invoices.find((invoice) => idsMatch(invoice.id, invoiceId)) ?? null;
};

export const selectInvoicesSuccessMessage = (state) =>
  selectInvoicesState(state).successMessage ?? '';

export const selectInvoicesListStatus = (state) =>
  selectInvoiceOperation(state, 'list').status;

export const selectInvoicesListError = (state) =>
  selectInvoiceOperation(state, 'list').error;

export const selectInvoiceDetailsStatus = (state) =>
  selectInvoiceOperation(state, 'details').status;

export const selectInvoiceDetailsError = (state) =>
  selectInvoiceOperation(state, 'details').error;

export const selectInvoiceCreateStatus = (state) =>
  selectInvoiceOperation(state, 'create').status;

export const selectInvoiceCreateError = (state) =>
  selectInvoiceOperation(state, 'create').error;

export const selectInvoiceUpdateStatus = (state) =>
  selectInvoiceOperation(state, 'update').status;

export const selectInvoiceUpdateError = (state) =>
  selectInvoiceOperation(state, 'update').error;

export const selectInvoiceDeleteStatus = (state) =>
  selectInvoiceOperation(state, 'delete').status;

export const selectInvoiceDeleteError = (state) =>
  selectInvoiceOperation(state, 'delete').error;

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

export const selectIsInvoiceSaving = (state) =>
  selectIsInvoiceCreating(state) || selectIsInvoiceUpdating(state);

/*
 * Generic compatibility selector.
 *
 * Returns true when any Invoice domain
 * async operation is active.
 */
export const selectInvoicesLoading = (state) =>
  selectIsInvoicesListLoading(state) ||
  selectIsInvoiceDetailsLoading(state) ||
  selectIsInvoiceCreating(state) ||
  selectIsInvoiceUpdating(state) ||
  selectIsInvoiceDeleting(state);

/*
 * Generic compatibility error.
 *
 * Pages that know which operation they are
 * rendering should prefer the operation-specific
 * selectors above.
 */
export const selectInvoicesError = (state) =>
  selectInvoicesListError(state) ??
  selectInvoiceDetailsError(state) ??
  selectInvoiceCreateError(state) ??
  selectInvoiceUpdateError(state) ??
  selectInvoiceDeleteError(state) ??
  null;
