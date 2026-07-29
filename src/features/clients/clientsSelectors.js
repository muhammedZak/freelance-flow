const selectClientsState = (state) => state.clients;

export const selectAllClients = (state) =>
  selectClientsState(state).clients ?? [];

export const selectSelectedClient = (state) =>
  selectClientsState(state).selectedClient ?? null;

export const selectClientsLoading = (state) =>
  selectClientsState(state).loading;

export const selectClientsError = (state) => selectClientsState(state).error;

export const selectClientsSuccessMessage = (state) =>
  selectClientsState(state).successMessage;
