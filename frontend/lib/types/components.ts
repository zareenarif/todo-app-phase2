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

export interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

// Pagination Types
export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSizeOptions?: number[];
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
}

// StatsCard Types
export interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  iconGradient?: { from: string; to: string };
  trend?: { value: number; isPositive: boolean };
  footer?: ReactNode;
  className?: string;
}

// Navigation Types
export interface NavItem {
  label: string;
  href: string;
  icon?: ReactNode;
  badge?: string | number;
  children?: NavItem[];
}

// Landing Page Types
export interface HeroProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
}

export interface FeaturesProps {
  features?: Array<{
    title: string;
    description: string;
    icon?: ReactNode;
  }>;
}

export interface PricingProps {
  plans?: Array<{
    name: string;
    price: string;
    features: string[];
    highlighted?: boolean;
  }>;
}

export interface TestimonialsProps {
  testimonials?: Array<{
    content: string;
    author: string;
    role?: string;
    avatar?: string;
  }>;
}

export interface FooterProps {
  className?: string;
}

// Form Types
export interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export interface SelectProps {
  options: Array<{ value: string; label: string }>;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export interface TextareaProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  rows?: number;
  disabled?: boolean;
  className?: string;
}
