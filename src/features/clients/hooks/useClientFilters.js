import { useSearchParams } from 'react-router-dom';

import {
  CLIENT_FILTER_DEFAULTS,
  CLIENT_FILTER_PARAMS,
  CLIENT_SORT,
} from '../clients.constants';

function useClientFilters(clients = []) {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchText =
    searchParams.get(CLIENT_FILTER_PARAMS.SEARCH) ||
    CLIENT_FILTER_DEFAULTS.search;

  const statusFilter =
    searchParams.get(CLIENT_FILTER_PARAMS.STATUS) ||
    CLIENT_FILTER_DEFAULTS.status;

  const sortBy =
    searchParams.get(CLIENT_FILTER_PARAMS.SORT) || CLIENT_FILTER_DEFAULTS.sort;

  function updateFilter(parameterName, value) {
    const nextSearchParams = new URLSearchParams(searchParams);

    const defaultValue = CLIENT_FILTER_DEFAULTS[parameterName];

    if (!value || value === defaultValue) {
      nextSearchParams.delete(parameterName);
    } else {
      nextSearchParams.set(parameterName, value);
    }

    setSearchParams(nextSearchParams);
  }

  function updateSearchText(value) {
    updateFilter(CLIENT_FILTER_PARAMS.SEARCH, value);
  }

  function updateStatusFilter(value) {
    updateFilter(CLIENT_FILTER_PARAMS.STATUS, value);
  }

  function updateSortBy(value) {
    updateFilter(CLIENT_FILTER_PARAMS.SORT, value);
  }

  function clearFilters() {
    const params = new URLSearchParams(searchParams);

    params.delete(CLIENT_FILTER_PARAMS.SEARCH);
    params.delete(CLIENT_FILTER_PARAMS.STATUS);
    params.delete(CLIENT_FILTER_PARAMS.SORT);

    setSearchParams(params);
  }

  const noramalizedSearchText = searchText.trim().toLowerCase();

  const filteredClients = clients
    .filter((client) => {
      if (!noramalizedSearchText) {
        return true;
      }

      const clientName = client.name?.toLowerCase() || '';
      const clientEmail = client.email?.toLowerCase() || '';
      const clientCompany = client.company?.toLowerCase() || '';

      return (
        clientName.includes(noramalizedSearchText) ||
        clientEmail.includes(noramalizedSearchText) ||
        clientCompany.includes(noramalizedSearchText)
      );
    })
    .filter((client) => {
      if (statusFilter === CLIENT_FILTER_DEFAULTS.status) {
        return true;
      }

      return client.status === statusFilter;
    })
    .sort((firstClient, secondClient) => {
      if (sortBy === CLIENT_SORT.NAME_ASCENDING) {
        return (firstClient.name || '').localeCompare(secondClient.name || '');
      }

      if (sortBy === CLIENT_SORT.NAME_DESCENDING) {
        return (secondClient.name || '').localeCompare(firstClient.name || '');
      }

      if (sortBy === CLIENT_SORT.OLDEST) {
        return (
          new Date(firstClient.createdAt).getTime() -
          new Date(secondClient.createdAt).getTime()
        );
      }

      return (
        new Date(secondClient.createdAt).getTime() -
        new Date(firstClient.createdAt).getTime()
      );
    });

  const hasActiveFilters =
    searchText !== CLIENT_FILTER_DEFAULTS.search ||
    statusFilter !== CLIENT_FILTER_DEFAULTS.status ||
    sortBy !== CLIENT_FILTER_DEFAULTS.sort;

  const emptyMessage =
    clients.length === 0
      ? 'No clients have been added.'
      : 'No clients match the selected filters.';

  return {
    searchText,
    statusFilter,
    sortBy,

    filteredClients,
    filteredCount: filteredClients.length,
    totalCount: clients.length,

    hasActiveFilters,
    emptyMessage,

    updateSearchText,
    updateStatusFilter,
    updateSortBy,
    clearFilters,
  };
}

export default useClientFilters;
