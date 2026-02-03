import { ReactNode } from 'react';

// DataTable Types
export interface Column<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  render?: (value: unknown, row: T, index: number) => ReactNode;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  rowKey: keyof T | ((row: T) => string);
  loading?: boolean;
  emptyState?: ReactNode;
  sort?: { key: string; direction: 'asc' | 'desc' };
  onSortChange?: (key: string, direction: 'asc' | 'desc') => void;
  onRowClick?: (row: T, index: number) => void;
  selectable?: boolean;
  selectedKeys?: string[];
  onSelectionChange?: (keys: string[]) => void;
}

// Modal Types
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  children: ReactNode;
  footer?: ReactNode;
}

// Button Types
export interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

// Input Types
export interface InputProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

// Card Types
export interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}
