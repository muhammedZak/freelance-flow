import { useSearchParams } from 'react-router-dom';

const DEFAULT_FILTER_VALUES = {
  search: '',
  status: 'all',
  sort: 'new',
};

function useClientFilters(clients = []) {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchText = searchParams.get('search') || DEFAULT_FILTER_VALUES.search;

  const statusFilter =
    searchParams.get('status') || DEFAULT_FILTER_VALUES.status;

  const sortBy = searchParams.get('sort') || DEFAULT_FILTER_VALUES.sort;

  function updateFilter(parameterName, value) {
    const nextSearchParams = new URLSearchParams(searchParams);

    const defaultValue = DEFAULT_FILTER_VALUES[parameterName];

    if (!value || value === defaultValue) {
      nextSearchParams.delete(parameterName);
    } else {
      nextSearchParams.set(parameterName, value);
    }

    setSearchParams(nextSearchParams);
  }

  function updateSearchText(value) {
    updateFilter('search', value);
  }

  function updateStatusFilter(value) {
    updateFilter('status', value);
  }

  function updateSortBy(value) {
    updateFilter('sort', value);
  }

  function clearFilters() {
    const params = new URLSearchParams(searchParams);

    params.delete('search');
    params.delete('status');
    params.delete('sort');

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
      if (statusFilter === DEFAULT_FILTER_VALUES.status) {
        return true;
      }

      return client.status === statusFilter;
    })
    .sort((firstClient, secondClient) => {
      if (sortBy === 'name-asc') {
        return (firstClient.name || '').localeCompare(secondClient.name || '');
      }

      if (sortBy === 'name-desc') {
        return (secondClient.name || '').localeCompare(firstClient.name || '');
      }

      if (sortBy === 'oldest') {
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
    searchText !== DEFAULT_FILTER_VALUES.search ||
    statusFilter !== DEFAULT_FILTER_VALUES.status ||
    sortBy !== DEFAULT_FILTER_VALUES.sort;

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
