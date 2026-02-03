'use client';

import { useState } from 'react';
import { DataTableProps, Column } from '@/lib/types/components';

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  rowKey,
  loading = false,
  emptyState,
  sort,
  onSortChange,
  onRowClick,
  selectable = false,
  selectedKeys = [],
  onSelectionChange,
}: DataTableProps<T>) {
  const [localSort, setLocalSort] = useState(sort);

  const getRowKey = (row: T, index: number): string => {
    if (typeof rowKey === 'function') {
      return rowKey(row);
    }
    return String(row[rowKey] ?? index);
  };

  const handleSort = (column: Column<T>) => {
    if (!column.sortable) return;

    const key = String(column.key);
    const currentDirection = (sort || localSort)?.key === key ? (sort || localSort)?.direction : undefined;
    const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';

    if (onSortChange) {
      onSortChange(key, newDirection);
    } else {
      setLocalSort({ key, direction: newDirection });
    }
  };

  const handleSelectAll = () => {
    if (!onSelectionChange) return;

    if (selectedKeys.length === data.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(data.map((row, index) => getRowKey(row, index)));
    }
  };

  const handleSelectRow = (key: string) => {
    if (!onSelectionChange) return;

    if (selectedKeys.includes(key)) {
      onSelectionChange(selectedKeys.filter((k) => k !== key));
    } else {
      onSelectionChange([...selectedKeys, key]);
    }
  };

  const currentSort = sort || localSort;

  if (loading) {
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 dark:border-gray-700/50 overflow-hidden">
        <div className="p-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 dark:border-gray-700/50 overflow-hidden">
        <div className="p-8 text-center">
          {emptyState || (
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">No data available</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                There are no items to display at this time.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 dark:border-gray-700/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
              {selectable && (
                <th className="px-4 py-3 w-12">
                  <input
                    type="checkbox"
                    checked={selectedKeys.length === data.length && data.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  scope="col"
                  className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 select-none' : ''
                  }`}
                  style={{ width: column.width }}
                  onClick={() => handleSort(column)}
                  aria-sort={currentSort?.key === String(column.key) ? (currentSort.direction === 'asc' ? 'ascending' : 'descending') : undefined}
                >
                  <div className={`flex items-center gap-2 ${column.align === 'center' ? 'justify-center' : column.align === 'right' ? 'justify-end' : ''}`}>
                    {column.header}
                    {column.sortable && currentSort?.key === String(column.key) && (
                      <span className="text-indigo-600 dark:text-indigo-400">
                        {currentSort.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {data.map((row, rowIndex) => {
              const key = getRowKey(row, rowIndex);
              const isSelected = selectedKeys.includes(key);

              return (
                <tr
                  key={key}
                  className={`transition-colors ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-900/20'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  } ${onRowClick ? 'cursor-pointer' : ''}`}
                  onClick={() => onRowClick?.(row, rowIndex)}
                >
                  {selectable && (
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectRow(key)}
                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </td>
                  )}
                  {columns.map((column) => {
                    const value = row[column.key as keyof T];
                    return (
                      <td
                        key={String(column.key)}
                        className={`px-4 py-3 text-sm text-gray-900 dark:text-gray-100 ${
                          column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : ''
                        }`}
                      >
                        {column.render ? column.render(value, row, rowIndex) : String(value ?? '')}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;
