import { useEffect } from 'react';
import { Link } from 'react-router-dom';
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

  const assignedProjectIds =
    user?.assignedProjectIds?.map((id) => String(id)) || [];

  const visibleProjects = isClient
    ? projects.filter((project) =>
        assignedProjectIds.includes(String(project.id)),
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

  const activeProjects = visibleProjects.filter(
    (project) => project.status === 'active',
  );

  const completedProjects = visibleProjects.filter(
    (project) => project.status === 'completed',
  );

  const pendingTasks = visibleTasks.filter(
    (task) => task.status !== 'completed',
  );

  const completedTasks = visibleTasks.filter(
    (task) => task.status === 'completed',
  );

  const unpaidInvoices = visibleInvoices.filter(
    (invoice) => invoice.status !== 'paid',
  );

  const unpaidAmount = unpaidInvoices.reduce(
    (total, invoice) => total + Number(invoice.total || 0),
    0,
  );

  const taskCompletionPercentage =
    visibleTasks.length > 0
      ? Math.round((completedTasks.length / visibleTasks.length) * 100)
      : 0;

  const projectStatusData = [
    {
      label: 'Planning',
      count: visibleProjects.filter((project) => project.status === 'planning')
        .length,
    },
    {
      label: 'Active',
      count: activeProjects.length,
    },
    {
      label: 'Completed',
      count: completedProjects.length,
    },
    {
      label: 'On hold',
      count: visibleProjects.filter((project) => project.status === 'on-hold')
        .length,
    },
  ];

  const recentActivities = [...activities]
    .sort(
      (firstActivity, secondActivity) =>
        new Date(secondActivity.createdAt) - new Date(firstActivity.createdAt),
    )
    .slice(0, 5);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className='min-h-full text-slate-900 dark:text-slate-100'>
      <div className='space-y-6'>
        {/* Header */}
        <section className='relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white px-5 py-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 sm:px-7 sm:py-7'>
          <div className='pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/10' />

          <div className='relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between'>
            <div>
              <div className='mb-3 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300'>
                <span className='h-1.5 w-1.5 rounded-full bg-blue-500' />
                Workspace overview
              </div>

              <h1 className='text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl dark:text-white'>
                Welcome back, {user?.name}
              </h1>

              <p className='mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400'>
                Review your projects, pending work and invoice activity from one
                place.
              </p>
            </div>

            <div className='flex flex-wrap gap-2'>
              <Link
                to={isClient ? '/projects' : '/clients/new'}
                className='inline-flex items-center justify-center rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-600 dark:hover:bg-blue-500 dark:focus:ring-offset-slate-900'>
                {isClient ? 'View projects' : 'Add client'}
              </Link>

              <Link
                to={isClient ? '/invoices' : '/projects/new'}
                className='inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:hover:text-white dark:focus:ring-offset-slate-900'>
                {isClient ? 'View invoices' : 'New project'}
              </Link>
            </div>
          </div>
        </section>

        {/* Summary cards */}
        <section
          className={`grid gap-4 sm:grid-cols-2 ${
            isClient ? 'xl:grid-cols-3' : 'xl:grid-cols-4'
          }`}>
          {!isClient && (
            <SummaryCard
              title='Total clients'
              value={clients.length}
              description='Clients in your workspace'
              iconType='clients'
              iconClasses='bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400'
            />
          )}

          <SummaryCard
            title={isClient ? 'My projects' : 'Total projects'}
            value={visibleProjects.length}
            description={`${activeProjects.length} currently active`}
            iconType='projects'
            iconClasses='bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
          />

          <SummaryCard
            title='Pending tasks'
            value={pendingTasks.length}
            description={`${taskCompletionPercentage}% tasks completed`}
            iconType='tasks'
            iconClasses='bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400'
          />

          <SummaryCard
            title='Unpaid invoices'
            value={unpaidInvoices.length}
            description={formatCurrency(unpaidAmount)}
            iconType='invoices'
            iconClasses='bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
          />
        </section>

        {/* Main dashboard content */}
        <section className='grid gap-6 xl:grid-cols-[1.05fr_0.95fr]'>
          {/* Project status */}
          <article className='rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 sm:p-6'>
            <div className='flex items-start justify-between gap-4'>
              <div>
                <h2 className='text-lg font-semibold text-slate-950 dark:text-white'>
                  Project overview
                </h2>

                <p className='mt-1 text-sm text-slate-500 dark:text-slate-400'>
                  Distribution of projects by current status
                </p>
              </div>

              <div className='rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-center dark:border-slate-700 dark:bg-slate-800/70'>
                <p className='text-xl font-bold text-slate-950 dark:text-white'>
                  {visibleProjects.length}
                </p>

                <p className='text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400'>
                  Projects
                </p>
              </div>
            </div>

            {visibleProjects.length === 0 ? (
              <div className='mt-6'>
                <EmptyState message='No projects available.' />
              </div>
            ) : (
              <div className='mt-8 space-y-6'>
                {projectStatusData.map((status) => (
                  <StatusProgress
                    key={status.label}
                    label={status.label}
                    count={status.count}
                    total={visibleProjects.length}
                  />
                ))}
              </div>
            )}

            <div className='mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50'>
              <div className='flex items-center justify-between gap-4'>
                <div>
                  <p className='text-sm font-semibold text-slate-900 dark:text-white'>
                    Overall task progress
                  </p>

                  <p className='mt-1 text-xs text-slate-500 dark:text-slate-400'>
                    {completedTasks.length} of {visibleTasks.length} tasks
                    completed
                  </p>
                </div>

                <span className='text-xl font-bold text-slate-950 dark:text-white'>
                  {taskCompletionPercentage}%
                </span>
              </div>

              <div className='mt-4 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700'>
                <div
                  className='h-full rounded-full bg-blue-600 transition-all duration-500 dark:bg-blue-500'
                  style={{ width: `${taskCompletionPercentage}%` }}
                />
              </div>
            </div>
          </article>

          {/* Recent activity */}
          <article className='rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 sm:p-6'>
            <div className='flex items-start justify-between gap-4'>
              <div>
                <h2 className='text-lg font-semibold text-slate-950 dark:text-white'>
                  Recent activity
                </h2>

                <p className='mt-1 text-sm text-slate-500 dark:text-slate-400'>
                  Latest updates from your workspace
                </p>
              </div>

              <span className='rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300'>
                Latest 5
              </span>
            </div>

            {recentActivities.length === 0 ? (
              <div className='mt-6'>
                <EmptyState message='No recent activities found.' />
              </div>
            ) : (
              <div className='mt-6 divide-y divide-slate-100 dark:divide-slate-800'>
                {recentActivities.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            )}
          </article>
        </section>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, description, iconType, iconClasses }) {
  return (
    <article className='group rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/70 dark:hover:border-slate-700'>
      <div className='flex items-start justify-between gap-4'>
        <div>
          <p className='text-sm font-medium text-slate-500 dark:text-slate-400'>
            {title}
          </p>

          <p className='mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white'>
            {value}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${iconClasses}`}>
          <DashboardIcon type={iconType} />
        </div>
      </div>

      <div className='mt-5 border-t border-slate-100 pt-4 dark:border-slate-800'>
        <p className='text-sm text-slate-500 dark:text-slate-400'>
          {description}
        </p>
      </div>
    </article>
  );
}

function StatusProgress({ label, count, total }) {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <div>
      <div className='mb-2.5 flex items-center justify-between gap-4'>
        <div className='flex items-center gap-2'>
          <span className='h-2 w-2 rounded-full bg-blue-500' />

          <span className='text-sm font-medium text-slate-700 dark:text-slate-300'>
            {label}
          </span>
        </div>

        <div className='flex items-center gap-2'>
          <span className='text-sm font-semibold text-slate-950 dark:text-white'>
            {count}
          </span>

          <span className='text-xs text-slate-400 dark:text-slate-500'>
            {percentage}%
          </span>
        </div>
      </div>

      <div className='h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800'>
        <div
          className='h-full rounded-full bg-blue-600 transition-all duration-500 dark:bg-blue-500'
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function ActivityItem({ activity }) {
  return (
    <div className='group flex gap-4 py-4 first:pt-0 last:pb-0'>
      <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800'>
        <span className='h-2 w-2 rounded-full bg-blue-500' />
      </div>

      <div className='min-w-0 flex-1'>
        <p className='text-sm font-medium leading-6 text-slate-800 dark:text-slate-200'>
          {activity.message}
        </p>

        <div className='mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400'>
          <span className='rounded-md bg-slate-100 px-2 py-0.5 capitalize dark:bg-slate-800'>
            {activity.type}
          </span>

          <span>{formatDate(activity.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}

function DashboardIcon({ type }) {
  const classes = 'h-5 w-5';

  if (type === 'clients') {
    return (
      <svg
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.8'
        className={classes}
        aria-hidden='true'>
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'
        />
        <circle cx='9' cy='7' r='4' />
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M22 21v-2a4 4 0 0 0-3-3.87'
        />
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M16 3.13a4 4 0 0 1 0 7.75'
        />
      </svg>
    );
  }

  if (type === 'projects') {
    return (
      <svg
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.8'
        className={classes}
        aria-hidden='true'>
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z'
        />
      </svg>
    );
  }

  if (type === 'tasks') {
    return (
      <svg
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.8'
        className={classes}
        aria-hidden='true'>
        <path strokeLinecap='round' strokeLinejoin='round' d='m9 11 3 3L22 4' />
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11'
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.8'
      className={classes}
      aria-hidden='true'>
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M6 2h9l5 5v15H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z'
      />
      <path strokeLinecap='round' strokeLinejoin='round' d='M14 2v6h6' />
      <path strokeLinecap='round' strokeLinejoin='round' d='M8 13h8M8 17h6' />
    </svg>
  );
}

export default DashboardPage;
