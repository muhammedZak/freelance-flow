import Button from '@components/common/Button';
import SectionCard from '@components/common/SectionCard';
import FilterSelect from '@components/forms/FilterSelect';
import SearchInput from '@components/forms/SearchInput';

import {
  TASK_PRIORITY_FILTER_OPTIONS,
  TASK_SORT_OPTIONS,
  TASK_STATUS_FILTER_OPTIONS,
} from '../tasks.constants';

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
    <SectionCard
      title='Task List'
      description='Search, filter, and sort project tasks.'
      className='mb-4'>
      <div className='grid gap-3 sm:grid-cols-2'>
        <SearchInput
          value={searchText}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder='Search tasks'
          ariaLabel='Search project tasks'
        />

        <FilterSelect
          value={statusFilter}
          onChange={(event) => onStatusChange(event.target.value)}
          options={TASK_STATUS_FILTER_OPTIONS}
          ariaLabel='Filter tasks by status'
        />

        <FilterSelect
          value={priorityFilter}
          onChange={(event) => onPriorityChange(event.target.value)}
          options={TASK_PRIORITY_FILTER_OPTIONS}
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
          <Button
            type='button'
            variant='text'
            size='small'
            onClick={onClear}
            className='self-start sm:self-auto'>
            Clear Filters
          </Button>
        )}
      </div>
    </SectionCard>
  );
}

export default TaskFilters;
