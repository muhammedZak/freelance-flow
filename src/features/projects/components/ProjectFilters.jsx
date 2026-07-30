import Button from '@components/common/Button';
import FilterSelect from '@components/forms/FilterSelect';
import SearchInput from '@components/forms/SearchInput';

const projectStatusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'planning', label: 'Planning' },
  { value: 'active', label: 'Active' },
  { value: 'on-hold', label: 'On Hold' },
  { value: 'completed', label: 'Completed' },
];

const projectSortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'deadline', label: 'Deadline' },
  { value: 'title-asc', label: 'Title: A to Z' },
  { value: 'budget-high', label: 'Highest Budget' },
];

function ProjectFilters({
  searchText,
  statusFilter,
  sortBy,
  filteredCount,
  totalCount,
  hasActiveFilters,
  onSearchChange,
  onStatusChange,
  onSortChange,
  onClear,
}) {
  return (
    <>
      <div className='grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 sm:grid-cols-2 lg:grid-cols-4'>
        <div className='sm:col-span-2'>
          <SearchInput
            value={searchText}
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
            placeholder='Search projects or clients'
            ariaLabel='Search projects'
          />
        </div>

        <FilterSelect
          value={statusFilter}
          onChange={(event) =>
            onStatusChange(event.target.value)
          }
          options={projectStatusOptions}
          ariaLabel='Filter projects by status'
        />

        <FilterSelect
          value={sortBy}
          onChange={(event) => onSortChange(event.target.value)}
          options={projectSortOptions}
          ariaLabel='Sort projects'
        />
      </div>

      <div className='mb-4 flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between'>
        <p className='text-slate-500 dark:text-slate-400'>
          Showing {filteredCount} of {totalCount} projects
        </p>

        {hasActiveFilters && (
          <Button
            variant='text'
            size='small'
            onClick={onClear}
            className='self-start sm:self-auto'>
            Clear Filters
          </Button>
        )}
      </div>
    </>
  );
}

export default ProjectFilters;
