import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  fetchClients,
  selectAllClients,
  selectClientsLoading,
  selectClientsError,
} from '@features/clients';

import {
  fetchProjects,
  selectAllProjects,
  selectIsProjectsListLoading,
  selectProjectsListError,
} from '@features/projects';

import { clearInvoiceMessages } from '../slices/invoicesSlice';

import { fetchInvoices, removeInvoice } from '../thunks/invoicesThunks';

import {
  selectAllInvoices,
  selectInvoiceDeleteError,
  selectInvoicesListError,
  selectInvoicesSuccessMessage,
  selectIsInvoiceDeleting,
  selectIsInvoicesListLoading,
} from '../selectors/invoicesSelectors';

import { selectAuthUser } from '@/features/auth';

import { INVOICE_STATUS } from '../constants/invoices.constants';

function useInvoicesList() {
  const dispatch = useDispatch();

  const user = useSelector(selectAuthUser);

  const invoices = useSelector(selectAllInvoices);
  const invoicesLoading = useSelector(selectIsInvoicesListLoading);
  const invoicesError = useSelector(selectInvoicesListError);
  const successMessage = useSelector(selectInvoicesSuccessMessage);

  const invoiceDeleting = useSelector(selectIsInvoiceDeleting);
  const invoiceDeleteError = useSelector(selectInvoiceDeleteError);

  const clients = useSelector(selectAllClients);
  const clientsLoading = useSelector(selectClientsLoading);
  const clientsError = useSelector(selectClientsError);

  const projects = useSelector(selectAllProjects);
  const projectsLoading = useSelector(selectIsProjectsListLoading);
  const projectsError = useSelector(selectProjectsListError);

  useEffect(() => {
    dispatch(clearInvoiceMessages());
    dispatch(fetchInvoices());
    dispatch(fetchClients());
    dispatch(fetchProjects());

    return () => {
      dispatch(clearInvoiceMessages());
    };
  }, [dispatch]);

  const isClient = user?.role === 'client';

  const canManageInvoices =
    user?.role === 'freelancer' || user?.role === 'admin';

  const assignedProjectIds =
    user?.assignedProjectIds?.map((projectId) => String(projectId)) || [];

  const visibleInvoices = isClient
    ? invoices.filter((invoice) =>
        assignedProjectIds.includes(String(invoice.projectId)),
      )
    : invoices;

  const paidAmount = visibleInvoices
    .filter((invoice) => invoice.status === INVOICE_STATUS.PAID)
    .reduce((total, invoice) => total + Number(invoice.total), 0);

  const outstandingAmount = visibleInvoices
    .filter((invoice) => invoice.status !== INVOICE_STATUS.PAID)
    .reduce((total, invoice) => total + Number(invoice.total), 0);

  const loading =
    invoicesLoading || invoiceDeleting || clientsLoading || projectsLoading;

  const error =
    invoicesError || invoiceDeleteError || clientsError || projectsError;

  const initialLoading = invoicesLoading && invoices.length === 0;

  async function handleDelete(invoice) {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${invoice.invoiceNumber}?`,
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await dispatch(removeInvoice(String(invoice.id))).unwrap();
    } catch (error) {
      console.log(error);
    }
  }

  return {
    clients,
    projects,
    visibleInvoices,

    isClient,
    canManageInvoices,

    paidAmount,
    outstandingAmount,

    loading,
    initialLoading,
    error,
    successMessage,

    handleDelete,
  };
}

export default useInvoicesList;
