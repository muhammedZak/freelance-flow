import { useSearchParams } from 'react-router-dom';

import {
  INVOICE_FILTER_DEFAULTS,
  INVOICE_FILTER_PARAMS,
  INVOICE_SORT,
} from '../invoices.constants';

function useInvoiceFilters(invoices = [], clients = [], projects = []) {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchText =
    searchParams.get(INVOICE_FILTER_PARAMS.SEARCH) ||
    INVOICE_FILTER_DEFAULTS.search;

  const statusFilter =
    searchParams.get(INVOICE_FILTER_PARAMS.STATUS) ||
    INVOICE_FILTER_DEFAULTS.status;

  const sortBy =
    searchParams.get(INVOICE_FILTER_PARAMS.SORT) ||
    INVOICE_FILTER_DEFAULTS.sort;

  function updateFilter(parameterName, value) {
    const nextSearchParams = new URLSearchParams(searchParams);

    const defaultValue = INVOICE_FILTER_DEFAULTS[parameterName];

    if (!value || value === defaultValue) {
      nextSearchParams.delete(parameterName);
    } else {
      nextSearchParams.set(parameterName, value);
    }

    setSearchParams(nextSearchParams);
  }

  function updateSearchText(value) {
    updateFilter(INVOICE_FILTER_PARAMS.SEARCH, value);
  }

  function updateStatusFilter(value) {
    updateFilter(INVOICE_FILTER_PARAMS.STATUS, value);
  }

  function updateSortBy(value) {
    updateFilter(INVOICE_FILTER_PARAMS.SORT, value);
  }

  function clearFilters() {
    const nextSearchParams = new URLSearchParams(searchParams);

    nextSearchParams.delete(INVOICE_FILTER_PARAMS.SEARCH);
    nextSearchParams.delete(INVOICE_FILTER_PARAMS.STATUS);
    nextSearchParams.delete(INVOICE_FILTER_PARAMS.SORT);

    setSearchParams(nextSearchParams);
  }

  function getClientName(clientId) {
    const client = clients.find(
      (client) => String(client.id) === String(clientId),
    );

    return client ? client.name : 'Unknown Client';
  }

  function getProjectTitle(projectId) {
    const project = projects.find(
      (project) => String(project.id) === String(projectId),
    );

    return project ? project.title : 'Unknown Project';
  }

  const normalizedSearchText = searchText.trim().toLowerCase();

  const filteredInvoices = invoices
    .filter((invoice) => {
      if (!normalizedSearchText) {
        return true;
      }

      const invoiceNumber = invoice.invoiceNumber?.toLowerCase() || '';

      const clientName = getClientName(invoice.clientId).toLowerCase();

      const projectTitle = getProjectTitle(invoice.projectId).toLowerCase();

      return (
        invoiceNumber.includes(normalizedSearchText) ||
        clientName.includes(normalizedSearchText) ||
        projectTitle.includes(normalizedSearchText)
      );
    })
    .filter((invoice) => {
      if (statusFilter === INVOICE_FILTER_DEFAULTS.status) {
        return true;
      }

      return invoice.status === statusFilter;
    })
    .sort((firstInvoice, secondInvoice) => {
      if (sortBy === INVOICE_SORT.OLDEST) {
        return (
          new Date(firstInvoice.issueDate).getTime() -
          new Date(secondInvoice.issueDate).getTime()
        );
      }

      if (sortBy === INVOICE_SORT.DUE_DATE) {
        return (
          new Date(firstInvoice.dueDate).getTime() -
          new Date(secondInvoice.dueDate).getTime()
        );
      }

      if (sortBy === INVOICE_SORT.AMOUNT_HIGH) {
        return Number(secondInvoice.total) - Number(firstInvoice.total);
      }

      if (sortBy === INVOICE_SORT.AMOUNT_LOW) {
        return Number(firstInvoice.total) - Number(secondInvoice.total);
      }

      return (
        new Date(secondInvoice.issueDate).getTime() -
        new Date(firstInvoice.issueDate).getTime()
      );
    });

  const hasActiveFilters =
    searchText !== INVOICE_FILTER_DEFAULTS.search ||
    statusFilter !== INVOICE_FILTER_DEFAULTS.status ||
    sortBy !== INVOICE_FILTER_DEFAULTS.sort;

  const emptyMessage =
    invoices.length === 0
      ? 'No invoices have been added.'
      : 'No invoices match the selected filters.';

  return {
    searchText,
    statusFilter,
    sortBy,

    filteredInvoices,
    filteredCount: filteredInvoices.length,
    totalCount: invoices.length,

    hasActiveFilters,
    emptyMessage,

    getClientName,
    getProjectTitle,

    updateSearchText,
    updateStatusFilter,
    updateSortBy,
    clearFilters,
  };
}

export default useInvoiceFilters;
