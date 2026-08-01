import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

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

import {
  clearInvoiceMessages,
  clearSelectedInvoice,
} from '../slices/invoicesSlice';

import {
  editInvoice,
  fetchInvoiceById,
  removeInvoice,
} from '../thunks/invoicesThunks';

import {
  selectSelectedInvoice,
  selectInvoicesSuccessMessage,
  selectInvoiceDetailsError,
  selectInvoiceUpdateError,
  selectInvoiceDeleteError,
  selectIsInvoiceDetailsLoading,
  selectIsInvoiceUpdating,
  selectIsInvoiceDeleting,
} from '../selectors/invoicesSelectors';

import { INVOICE_STATUS } from '../invoices.constants';

const VALID_INVOICE_STATUSES = Object.freeze(Object.values(INVOICE_STATUS));

function useInvoiceDetails() {
  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const clients = useSelector(selectAllClients);
  const clientsLoading = useSelector(selectClientsLoading);
  const clientsError = useSelector(selectClientsError);

  const projects = useSelector(selectAllProjects);
  const projectsLoading = useSelector(selectIsProjectsListLoading);
  const projectsError = useSelector(selectProjectsListError);

  const selectedInvoice = useSelector(selectSelectedInvoice);

  const detailsLoading = useSelector(selectIsInvoiceDetailsLoading);

  const updating = useSelector(selectIsInvoiceUpdating);

  const deleting = useSelector(selectIsInvoiceDeleting);

  const detailsError = useSelector(selectInvoiceDetailsError);

  const updateError = useSelector(selectInvoiceUpdateError);

  const deleteError = useSelector(selectInvoiceDeleteError);

  const successMessage = useSelector(selectInvoicesSuccessMessage);

  const invoiceId = id ? String(id).trim() : '';

  const hasValidInvoiceId = Boolean(invoiceId);

  useEffect(() => {
    dispatch(clearInvoiceMessages());

    if (hasValidInvoiceId) {
      dispatch(fetchInvoiceById(invoiceId));
      dispatch(fetchClients());
      dispatch(fetchProjects());
    }

    return () => {
      dispatch(clearInvoiceMessages());
      dispatch(clearSelectedInvoice());
    };
  }, [dispatch, invoiceId, hasValidInvoiceId]);

  const canManageInvoices =
    user?.role === 'freelancer' || user?.role === 'admin';

  const assignedProjectIds =
    user?.assignedProjectIds?.map((projectId) => String(projectId)) || [];

  const clientHasAccess =
    !selectedInvoice ||
    user?.role !== 'client' ||
    assignedProjectIds.includes(String(selectedInvoice.projectId));

  const client = selectedInvoice
    ? clients.find(
        (clientItem) =>
          String(clientItem.id) === String(selectedInvoice.clientId),
      )
    : null;

  const project = selectedInvoice
    ? projects.find(
        (projectItem) =>
          String(projectItem.id) === String(selectedInvoice.projectId),
      )
    : null;

  const clientName = client?.name || 'Unknown Client';

  const projectTitle = project?.title || 'Unknown Project';

  const relatedDataLoading =
    (clientsLoading && clients.length === 0) ||
    (projectsLoading && projects.length === 0);

  const initialLoading =
    hasValidInvoiceId &&
    ((!selectedInvoice && detailsLoading) || relatedDataLoading);

  const invoiceError = detailsError || updateError || deleteError;

  const relatedDataError = clientsError || projectsError;

  const error = invoiceError || relatedDataError;

  const blockingError = !hasValidInvoiceId
    ? 'Invalid invoice id.'
    : !selectedInvoice
      ? error
      : null;

  const operationError = selectedInvoice ? error : null;

  const notFound =
    hasValidInvoiceId && !initialLoading && !blockingError && !selectedInvoice;

  const accessDenied = Boolean(selectedInvoice) && !clientHasAccess;

  const operationLoading = updating || deleting;

  async function handleStatusChange(newStatus) {
    if (!selectedInvoice) {
      return;
    }

    if (!VALID_INVOICE_STATUSES.includes(newStatus)) {
      return;
    }

    if (newStatus === selectedInvoice.status) {
      return;
    }

    try {
      await dispatch(
        editInvoice({
          id: String(selectedInvoice.id),
          invoiceData: {
            status: newStatus,
          },
        }),
      ).unwrap();
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDelete() {
    if (!selectedInvoice) {
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedInvoice.invoiceNumber}?`,
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await dispatch(removeInvoice(String(selectedInvoice.id))).unwrap();

      navigate('/invoices');
    } catch (error) {
      console.log(error);
    }
  }

  return {
    selectedInvoice,

    clientName,
    projectTitle,

    canManageInvoices,
    clientHasAccess,
    accessDenied,

    initialLoading,
    operationLoading,

    blockingError,
    operationError,
    notFound,

    successMessage,

    handleStatusChange,
    handleDelete,
  };
}

export default useInvoiceDetails;
