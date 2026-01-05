'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Search, Phone, Mail, Calendar, User, MapPin } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: 'search' | 'phone' | 'email' | 'calendar' | 'user' | 'map' | React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, hint, leftIcon, rightIcon, ...props }, ref) => {
    const getIconComponent = (icon: string | React.ReactNode) => {
      if (typeof icon === 'string') {
        const icons: Record<string, React.ReactNode> = {
          search: <Search className="h-4 w-4 text-gray-400" />,
          phone: <Phone className="h-4 w-4 text-gray-400" />,
          email: <Mail className="h-4 w-4 text-gray-400" />,
          calendar: <Calendar className="h-4 w-4 text-gray-400" />,
          user: <User className="h-4 w-4 text-gray-400" />,
          map: <MapPin className="h-4 w-4 text-gray-400" />,
        };
        return icons[icon] || null;
      }
      return icon;
    };

    return (
      <div className="w-full">
        {label && (
          <label className="mb-1.5 block text-sm font-medium text-gray-300">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
              {getIconComponent(leftIcon)}
            </div>
          )}
          <input
            type={type}
            className={cn(
              'flex h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm transition-all duration-200',
              'placeholder:text-gray-500',
              'focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent',
              'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-white/5',
              error && 'border-red-500 focus:ring-red-500',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-red-400">{error}</p>
        )}
        {hint && !error && (
          <p className="mt-1.5 text-sm text-gray-400">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Textarea компонент
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="mb-1.5 block text-sm font-medium text-gray-300">
            {label}
          </label>
        )}
        <textarea
          className={cn(
            'flex min-h-[100px] w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm transition-all duration-200',
            'placeholder:text-gray-500 resize-none',
            'focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-white/5',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-red-500">{error}</p>
        )}
        {hint && !error && (
          <p className="mt-1.5 text-sm text-gray-500">{hint}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

// Select компонент
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="mb-1.5 block text-sm font-medium text-gray-300">
            {label}
          </label>
        )}
        <select
          className={cn(
            'flex h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-white/5',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          ref={ref}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1.5 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

// SearchInput компонент для поиска
interface SearchInputProps extends Omit<InputProps, 'leftIcon' | 'type'> {
  onSearch?: (value: string) => void;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onSearch, placeholder = 'Поиск...', ...props }, ref) => {
    const [value, setValue] = React.useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
      onSearch?.(e.target.value);
    };

    return (
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={cn(
            'flex h-10 w-full rounded-lg border border-white/10 bg-white/5 pl-10 pr-4 py-2 text-sm transition-all duration-200',
            'placeholder:text-gray-500',
            'focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-white/5',
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';

export { Input, Textarea, Select, SearchInput };
