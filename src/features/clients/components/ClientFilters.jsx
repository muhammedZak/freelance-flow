import Button from '@components/common/Button';
import FilterSelect from '@/components/forms/FilterSelect';
import SearchInput from '@/components/forms/SearchInput';

import {
  CLIENT_SORT_OPTIONS,
  CLIENT_FILTER_STATUS_OPTIONS,
} from '../clients.constants';

function ClientFilters({
  searchText,
  statusFilter,
  sortBy,
  filteredCount,
  totalCount,
  hasActiveFilters,
  onSearchChange,
  onStatusChange,
  onSortChange,
  onClearFilters,
}) {
  return (
    <>
      <div className='grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 sm:grid-cols-2 lg:grid-cols-4'>
        <div className='sm:col-span-2'>
          <SearchInput
            value={searchText}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder='Search clients by name, email or company'
            ariaLabel='Search clients'
          />
        </div>

        <FilterSelect
          value={statusFilter}
          onChange={(event) => onStatusChange(event.target.value)}
          options={CLIENT_FILTER_STATUS_OPTIONS}
          ariaLabel='Filter clients by status'
        />

        <FilterSelect
          value={sortBy}
          onChange={(event) => onSortChange(event.target.value)}
          options={CLIENT_SORT_OPTIONS}
          ariaLabel='Sort clients'
        />
      </div>

      <div className='mb-4 flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between'>
        <p className='text-slate-500 dark:text-slate-400'>
          Showing {filteredCount} of {totalCount} clients
        </p>

        {hasActiveFilters && (
          <Button
            type='button'
            variant='text'
            size='small'
            onClick={onClearFilters}
            className='self-start sm:self-auto'>
            Clear Filters
          </Button>
        )}
      </div>
    </>
  );
}

export default ClientFilters;
