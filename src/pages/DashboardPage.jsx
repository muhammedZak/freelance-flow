import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';

import { fetchClients } from '../features/clients/clientsSlice';
import { fetchProjects } from '../features/projects/projectsSlice';
import { fetchTasks } from '../features/tasks/tasksSlice';
import { fetchInvoices } from '../features/invoices/invoicesSlice';
import { fetchActivities } from '../features/activities/activitiesSlice';

import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';

function DashboardPage() {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const {
    clients,
    loading: clientsLoading,
    error: clientsError,
  } = useSelector((state) => state.clients);
  const {
    projects,
    loading: projectsLoading,
    error: projectsError,
  } = useSelector((state) => state.projects);
  const {
    tasks,
    loading: tasksLoading,
    error: tasksError,
  } = useSelector((state) => state.tasks);
  const {
    invoices,
    loading: invoicesLoading,
    error: invoicesError,
  } = useSelector((state) => state.invoices);
  const {
    activities,
    loading: activitiesLoading,
    error: activitiesError,
  } = useSelector((state) => state.activities);

  useEffect(() => {
    dispatch(fetchClients());
    dispatch(fetchProjects());
    dispatch(fetchTasks());
    dispatch(fetchInvoices());
    dispatch(fetchActivities());
  }, [dispatch]);

  const isLoading =
    clientsLoading ||
    projectsLoading ||
    tasksLoading ||
    invoicesLoading ||
    activitiesLoading;

  const error =
    clientsError ||
    projectsError ||
    tasksError ||
    invoicesError ||
    activitiesError;

  const isClient = user?.role === 'client';

  const assignedProjectIds = user?.assignedProjectIds?.map((id) => String(id));

  const visibleProjects = isClient
    ? projects.filter((project) =>
        assignedProjectIds?.includes(String(project.id)),
      )
    : projects;

  const visibleProjectIds = visibleProjects.map((project) =>
    String(project.id),
  );

  const visibleTasks = isClient
    ? tasks.filter((task) => visibleProjectIds.includes(String(task.projectId)))
    : tasks;

  const visibleInvoices = isClient
    ? invoices.filter((invoice) =>
        visibleProjectIds.includes(String(invoice.projectId)),
      )
    : invoices;

  const pendingTasks = visibleTasks.filter(
    (task) => task.status !== 'completed',
  );

  const unpaidInvoices = visibleInvoices.filter(
    (invoice) => invoice.status !== 'paid',
  );

  const unpaidAmount = unpaidInvoices.reduce(
    (total, invoice) => total + Number(invoice.total),
    0,
  );

  const activeProjects = visibleProjects.filter(
    (project) => project.status === 'active',
  );

  const recentActivities = [...activities]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-slate-900'>Dashboard</h1>
        <p className='text-slate-600'>
          Welcome back, {user?.name}. Here is your project summary.
        </p>
      </div>

      <div className='mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {!isClient && (
          <div className='rounded-lg border border-slate-200 bg-white p-5 shadow-sm'>
            <p className='text-sm text-slate-500'>Total Clients</p>
            <h2 className='mt-2 text-3xl font-bold text-slate-900'>
              {clients.length}
            </h2>
          </div>
        )}

        <div className='rounded-lg border border-slate-200 bg-white p-5 shadow-sm'>
          <p className='text-sm text-slate-500'>
            {isClient ? 'My Projects' : 'Total Projects'}
          </p>
          <h2 className='mt-2 text-3xl font-bold text-slate-900'>
            {visibleProjects.length}
          </h2>
          <p className='mt-2 text-sm text-slate-500'>
            Active: {activeProjects.length}
          </p>
        </div>

        <div className='rounded-lg border border-slate-200 bg-white p-5 shadow-sm'>
          <p className='text-sm text-slate-500'>Pending Tasks</p>
          <h2 className='mt-2 text-3xl font-bold text-slate-900'>
            {pendingTasks.length}
          </h2>
          <p className='mt-2 text-sm text-slate-500'>
            Total tasks: {visibleTasks.length}
          </p>
        </div>

        <div className='rounded-lg border border-slate-200 bg-white p-5 shadow-sm'>
          <p className='text-sm text-slate-500'>Unpaid Invoices</p>
          <h2 className='mt-2 text-3xl font-bold text-slate-900'>
            {unpaidInvoices.length}
          </h2>
          <p className='mt-2 text-sm text-slate-500'>
            {formatCurrency(unpaidAmount)}
          </p>
        </div>
      </div>

      <div className='grid gap-6 lg:grid-cols-2'>
        <section className='rounded-lg border border-slate-200 bg-white p-5 shadow-sm'>
          <h2 className='mb-4 text-lg font-bold text-slate-900'>
            Project Status
          </h2>

          <div className='space-y-3'>
            <StatusRow
              label='Planning'
              count={
                visibleProjects.filter(
                  (project) => project.status === 'planning',
                ).length
              }
            />

            <StatusRow
              label='Active'
              count={
                visibleProjects.filter((project) => project.status === 'active')
                  .length
              }
            />

            <StatusRow
              label='Completed'
              count={
                visibleProjects.filter(
                  (project) => project.status === 'completed',
                ).length
              }
            />

            <StatusRow
              label='On Hold'
              count={
                visibleProjects.filter(
                  (project) => project.status === 'on-hold',
                ).length
              }
            />
          </div>
        </section>

        <section className='rounded-lg border border-slate-200 bg-white p-5 shadow-sm'>
          <h2 className='mb-4 text-lg font-bold text-slate-900'>
            Recent Activities
          </h2>

          {recentActivities.length === 0 ? (
            <EmptyState message='No recent activities found.' />
          ) : (
            <div className='space-y-3'>
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className='rounded border border-slate-200 p-3'>
                  <p className='font-medium text-slate-800'>
                    {activity.message}
                  </p>
                  <p className='mt-1 text-sm text-slate-500'>
                    {activity.type} • {formatDate(activity.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function StatusRow({ label, count }) {
  return (
    <div className='flex items-center justify-between rounded bg-slate-100 px-3 py-2'>
      <span className='text-sm text-slate-700'>{label}</span>
      <span className='font-bold text-slate-900'>{count}</span>
    </div>
  );
}

export default DashboardPage;
