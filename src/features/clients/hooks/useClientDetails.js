import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  selectClientsError,
  selectClientsLoading,
  selectSelectedClient,
} from '../selectors/clientsSelectors';

import {
  clearClientMessages,
  clearSelectedClient,
  fetchClientById,
  removeClient,
} from '../clientsSlice';

function useClientDetails(clientId) {
  const dispatch = useDispatch();

  const selectedClient = useSelector(selectSelectedClient);
  const loading = useSelector(selectClientsLoading);
  const error = useSelector(selectClientsError);

  const client =
    selectedClient && String(selectedClient.id) === String(clientId)
      ? selectedClient
      : null;

  useEffect(() => {
    if (!clientId) {
      return undefined;
    }

    dispatch(clearClientMessages());
    dispatch(clearSelectedClient());
    dispatch(fetchClientById(String(clientId)));

    return () => dispatch(clearSelectedClient());
  }, [clientId, dispatch]);

  function retry() {
    if (!clientId) {
      return;
    }

    dispatch(clearClientMessages());
    dispatch(clearSelectedClient());
    dispatch(fetchClientById(String(clientId)));
  }

  async function deleteCurrentClient() {
    if (!clientId) {
      return false;
    }

    try {
      await dispatch(removeClient(String(clientId))).unwrap();

      return true;
    } catch (error) {
      return false;
    }
  }

  const isInitialLoading = loading && !client;

  const isDeleting = loading && Boolean(client);

  const hasLoadError = Boolean(error) && !client;

  return {
    client,
    error,

    isInitialLoading,
    isDeleting,
    hasLoadError,

    retry,
    deleteCurrentClient,
  };
}

export default useClientDetails;
