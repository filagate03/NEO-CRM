'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown, MoreHorizontal } from 'lucide-react';

// Типы для таблицы
interface Column<T> {
  key: string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: unknown, row: T, index: number) => React.ReactNode;
  sortable?: boolean;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  onRowClick?: (row: T) => void;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
  rowClassName?: (row: T, index: number) => string;
  stickyHeader?: boolean;
}

// Компонент Table
function Table<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  onSort,
  sortKey,
  sortDirection,
  isLoading = false,
  emptyMessage = 'Нет данных',
  className,
  rowClassName,
  stickyHeader = true,
}: TableProps<T>) {
  const renderSortIcon = (key: string) => {
    if (sortKey !== key) return null;
    return sortDirection === 'asc' ? (
      <ChevronUp className="w-4 h-4 text-secondary" />
    ) : (
      <ChevronDown className="w-4 h-4 text-secondary" />
    );
  };

  const handleHeaderClick = (key: string) => {
    if (onSort) {
      const column = columns.find((c) => c.key === key);
      if (column?.sortable) {
        if (sortKey === key) {
          onSort(key, sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
          onSort(key, 'asc');
        }
      }
    }
  };

  if (isLoading) {
    return <TableSkeleton columns={columns.length} rows={5} />;
  }

  if (data.length === 0) {
    return (
      <div className={cn('py-12 text-center', className)}>
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn('overflow-hidden rounded-lg border border-white/10', className)}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead
            className={cn(
              'bg-white/5',
              stickyHeader && 'sticky top-0 z-10'
            )}
          >
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider',
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right',
                    column.sortable && 'cursor-pointer hover:bg-gray-100 transition-colors select-none',
                    column.width && `w-${column.width}`
                  )}
                  style={{ width: column.width }}
                  onClick={() => handleHeaderClick(column.key)}
                >
                  <div className="flex items-center gap-1">
                    <span>{column.header}</span>
                    {column.sortable && renderSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 bg-card">
            {data.map((row, index) => (
              <motion.tr
                key={keyExtractor(row)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                className={cn(
                  'transition-colors',
                  onRowClick && 'cursor-pointer hover:bg-gray-50',
                  rowClassName && rowClassName(row, index)
                )}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn(
                      'px-4 py-3 text-sm text-gray-300',
                      column.align === 'center' && 'text-center',
                      column.align === 'right' && 'text-right'
                    )}
                  >
                    {column.render
                      ? column.render((row as Record<string, unknown>)[column.key], row, index)
                      : String((row as Record<string, unknown>)[column.key] ?? '')}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Skeleton для таблицы
interface TableSkeletonProps {
  columns: number;
  rows: number;
  className?: string;
}

const TableSkeleton = ({ columns, rows, className }: TableSkeletonProps) => {
  return (
    <div className={cn('overflow-hidden rounded-lg border border-white/10', className)}>
      <div className="bg-white/5 border-b border-white/10">
        <div className="flex">
          {Array.from({ length: columns }).map((_, i) => (
            <div
              key={i}
              className="px-4 py-3 flex-1"
              style={{ minWidth: 100 }}
            >
              <div className="h-4 w-20 skeleton rounded" />
            </div>
          ))}
        </div>
      </div>
      <div className="divide-y divide-white/5 bg-card">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex">
            {Array.from({ length: columns }).map((_, j) => (
              <div
                key={j}
                className="px-4 py-3 flex-1"
                style={{ minWidth: 100 }}
              >
                <div className="h-4 w-full skeleton rounded" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// Pagination компонент
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  showPageSize?: boolean;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  totalItems?: number;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
  showPageSize = false,
  pageSize = 10,
  onPageSizeChange,
  totalItems,
}: PaginationProps) => {
  const pages = React.useMemo(() => {
    const result: (number | string)[] = [];
    const delta = 2;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        result.push(i);
      }
    } else {
      result.push(1);

      for (let i = currentPage - delta; i <= currentPage + delta; i++) {
        if (i > 1 && i < totalPages) {
          result.push(i);
        }
      }

      result.push(totalPages);
    }

    return [...new Set(result)].sort((a, b) => (a === '...' ? 1 : Number(a)) - (b === '...' ? -1 : Number(b)));
  }, [currentPage, totalPages]);

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onPageSizeChange?.(Number(e.target.value));
  };

  return (
    <div className={cn('flex items-center justify-between py-4', className)}>
      <div className="flex items-center gap-4">
        {showPageSize && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Показывать по:</span>
            <select
              value={pageSize}
              onChange={handlePageSizeChange}
              className="h-8 px-2 text-sm border border-white/10 rounded-md bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        )}
        {totalItems !== undefined && (
          <span className="text-sm text-gray-400">
            Всего {totalItems} записей
          </span>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 text-sm font-medium text-gray-400 rounded-lg hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          ←
        </button>

        {pages.map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className="px-3 py-2 text-sm text-gray-400">...</span>
            ) : (
              <button
                onClick={() => onPageChange(Number(page))}
                className={cn(
                  'px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  currentPage === Number(page)
                    ? 'bg-secondary text-white'
                    : 'text-gray-400 hover:bg-white/5'
                )}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          →
        </button>
      </div>
    </div>
  );
};

// DataTable с встроенной пагинацией
interface DataTableProps<T> extends TableProps<T> {
  pageSize?: number;
}

function DataTable<T>({
  pageSize: initialPageSize = 10,
  ...props
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(initialPageSize);

  const totalPages = Math.ceil(props.data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = props.data.slice(startIndex, startIndex + pageSize);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [pageSize]);

  return (
    <div>
      <Table {...props} data={paginatedData} />
      {props.data.length > pageSize && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          showPageSize
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          totalItems={props.data.length}
        />
      )}
    </div>
  );
}

export { Table, TableSkeleton, Pagination, DataTable };
