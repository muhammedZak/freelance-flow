import Button from '@components/common/Button';
import SectionCard from '@components/common/SectionCard';

import SearchInput from '@components/forms/SearchInput';
import FilterSelect from '@components/forms/FilterSelect';

import {
  INVOICE_FILTER_STATUS_OPTIONS,
  INVOICE_SORT_OPTIONS,
} from '../constants/invoices.constants';

function InvoiceFilters({
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
    <SectionCard className='mb-6'>
      <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
        <div className='sm:col-span-2'>
          <SearchInput
            value={searchText}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder='Search invoice number or client'
            ariaLabel='Search invoices'
          />
        </div>

        <FilterSelect
          value={statusFilter}
          onChange={(event) => onStatusChange(event.target.value)}
          options={INVOICE_FILTER_STATUS_OPTIONS}
          ariaLabel='Filter invoices by status'
        />

        <FilterSelect
          value={sortBy}
          onChange={(event) => onSortChange(event.target.value)}
          options={INVOICE_SORT_OPTIONS}
          ariaLabel='Sort invoices'
        />
      </div>

      <div className='mt-4 flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between'>
        <p className='text-slate-500 dark:text-slate-400'>
          Showing {filteredCount} of {totalCount} invoices
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
    </SectionCard>
  );
}

export default InvoiceFilters;
