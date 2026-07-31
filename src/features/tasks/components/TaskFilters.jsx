import FilterSelect from '@components/forms/FilterSelect';
import SearchInput from '@components/forms/SearchInput';

import {
  TASK_PRIORITY_OPTIONS,
  TASK_SORT_OPTIONS,
  TASK_STATUS_OPTIONS,
} from '../tasks.constants';

const taskStatusFilterOptions = [
  {
    value: 'all',
    label: 'All Statuses',
  },
  ...TASK_STATUS_OPTIONS,
];

const taskPriorityFilterOptions = [
  {
    value: 'all',
    label: 'All Priorities',
  },
  ...TASK_PRIORITY_OPTIONS,
];

function TaskFilters({
  searchText,
  statusFilter,
  priorityFilter,
  sortBy,
  filteredCount,
  totalCount,
  hasActiveFilters,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onSortChange,
  onClear,
}) {
  return (
    <div className='mb-4'>
      <div className='mb-3'>
        <h2 className='text-xl font-bold text-slate-900'>Task List</h2>

        <p className='text-sm text-slate-500'>
          Search, filter, and sort project tasks.
        </p>
      </div>

      <div className='grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 sm:grid-cols-2 lg:grid-cols-2 xl:grid'>
        <SearchInput
          value={searchText}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder='Search tasks'
          ariaLabel='Search project tasks'
        />

        <FilterSelect
          value={statusFilter}
          onChange={(event) => onStatusChange(event.target.value)}
          options={taskStatusFilterOptions}
          ariaLabel='Filter tasks by status'
        />

        <FilterSelect
          value={priorityFilter}
          onChange={(event) => onPriorityChange(event.target.value)}
          options={taskPriorityFilterOptions}
          ariaLabel='Filter tasks by priority'
        />

        <FilterSelect
          value={sortBy}
          onChange={(event) => onSortChange(event.target.value)}
          options={TASK_SORT_OPTIONS}
          ariaLabel='Sort tasks'
        />
      </div>

      <div className='mt-3 flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between'>
        <p className='text-slate-500'>
          Showing {filteredCount} of {totalCount} tasks
        </p>

        {hasActiveFilters && (
          <button
            type='button'
            onClick={onClear}
            className='self-start text-blue-600 sm:self-auto'>
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}

export default TaskFilters;
