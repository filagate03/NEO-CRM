'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
  badge?: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  className?: string;
  fullWidth?: boolean;
}

const Tabs = ({
  tabs,
  activeTab,
  onChange,
  variant = 'default',
  className,
  fullWidth = false,
}: TabsProps) => {
  const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);
  const [indicatorStyle, setIndicatorStyle] = React.useState({ left: 0, width: 0 });

  React.useEffect(() => {
    const activeTabElement = document.getElementById(`tab-${activeTab}`);
    if (activeTabElement) {
      setIndicatorStyle({
        left: activeTabElement.offsetLeft,
        width: activeTabElement.offsetWidth,
      });
    }
  }, [activeTab, tabs]);

  const tabStyles = {
    default: {
      container: 'bg-gray-100 p-1 rounded-lg',
      tab: 'px-4 py-2 text-sm font-medium rounded-md transition-colors',
      active: 'bg-white text-gray-900 shadow-sm',
      inactive: 'text-gray-600 hover:text-gray-900',
    },
    pills: {
      container: '',
      tab: 'px-4 py-2 text-sm font-medium rounded-full transition-all',
      active: 'bg-secondary text-white',
      inactive: 'text-gray-600 hover:bg-gray-100',
    },
    underline: {
      container: 'border-b border-gray-200',
      tab: 'px-4 py-3 text-sm font-medium transition-all relative',
      active: 'text-secondary',
      inactive: 'text-gray-500 hover:text-gray-700',
    },
  };

  const styles = tabStyles[variant];

  if (variant === 'underline') {
    return (
      <div className={className}>
        <div className="flex gap-4 relative">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              onClick={() => onChange(tab.id)}
              className={cn(
                styles.tab,
                activeTab === tab.id ? styles.active : styles.inactive,
                'flex items-center gap-2'
              )}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={cn(
                    'px-2 py-0.5 text-xs rounded-full',
                    activeTab === tab.id
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-100 text-gray-600'
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
          <motion.div
            className="absolute bottom-0 h-0.5 bg-secondary"
            initial={false}
            animate={{
              left: indicatorStyle.left,
              width: indicatorStyle.width,
            }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={cn(styles.container, className)}>
      <div
        className={cn(
          'flex',
          fullWidth && 'w-full',
          !fullWidth && 'gap-1'
        )}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            onClick={() => onChange(tab.id)}
            className={cn(
              styles.tab,
              activeTab === tab.id ? styles.active : styles.inactive,
              fullWidth && 'flex-1 justify-center',
              'flex items-center gap-2 whitespace-nowrap'
            )}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={cn(
                  'px-2 py-0.5 text-xs rounded-full',
                  activeTab === tab.id
                    ? 'bg-black/10'
                    : 'bg-gray-200 text-gray-600'
                )}
              >
                {tab.count}
              </span>
            )}
            {tab.badge && (
              <span className="px-1.5 py-0.5 text-xs bg-red-500 text-white rounded">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

Tabs.displayName = 'Tabs';

// TabPanel компонент
interface TabPanelProps {
  children: React.ReactNode;
  value: string;
  activeValue: string;
  className?: string;
}

const TabPanel = ({ children, value, activeValue, className }: TabPanelProps) => {
  if (value !== activeValue) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

TabPanel.displayName = 'TabPanel';

// VerticalTabs для боковой навигации
interface VerticalTabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

const VerticalTabs = ({
  tabs,
  activeTab,
  onChange,
  className,
}: VerticalTabsProps) => {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-all',
            activeTab === tab.id
              ? 'bg-primary text-white'
              : 'text-gray-600 hover:bg-gray-100'
          )}
        >
          {tab.icon}
          <span className="flex-1 text-left">{tab.label}</span>
          {tab.count !== undefined && (
            <span
              className={cn(
                'px-2 py-0.5 text-xs rounded-full',
                activeTab === tab.id
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-100 text-gray-600'
              )}
            >
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

VerticalTabs.displayName = 'VerticalTabs';

export { Tabs, TabPanel, VerticalTabs };
