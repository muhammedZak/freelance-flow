// Redux reducer
export { default as clientsReducer } from './slices/clientsSlice';

// Route pages
export { default as ClientsPage } from './pages/ClientsPage';
export { default as ClientDetailesPage } from './pages/ClientDetailesPage';
export { default as ClientFormPage } from './pages/ClientFormPage';

// Redux async thunks
export {
  fetchClients,
  fetchClientById,
  addClient,
  editClient,
  removeClient,
} from './thunks/clientsThunks';

// Redux synchronous actions
export {
  clearClientMessages,
  clearSelectedClient,
  resetClientsState,
} from './slices/clientsSlice';

// Selectors
export {
  selectRawClientProfiles,
  selectCurrentClientProfile,
  selectVisibleClientProfiles,
  selectHydratedClients,
  selectAllClients,
  selectSelectedClientProfile,
  selectSelectedClient,
  selectClientProfileById,
  selectHydratedClientById,
  selectClientsLoading,
  selectClientsError,
  selectClientsSuccessMessage,
} from './selectors/clientsSelectors';
