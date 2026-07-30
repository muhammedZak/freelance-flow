export { default as clientsReducer } from './clientsSlice';

export { default as ClientsPage } from './pages/ClientsPage';
export { default as ClientDetailesPage } from './pages/ClientDetailesPage';
export { default as ClientFormPage } from './pages/ClientFormPage';

export { fetchClients } from './clientsSlice';

export {
  selectAllClients,
  selectClientsLoading,
  selectClientsError,
} from './clientsSelectors';
