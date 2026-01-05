'use client';

import React from 'react';
import { cn, getInitials } from '@/lib/utils';

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'busy' | 'on_break';
  className?: string;
}

const sizeConfig = {
  xs: { container: 'w-6 h-6', text: 'text-[10px]' },
  sm: { container: 'w-8 h-8', text: 'text-xs' },
  md: { container: 'w-10 h-10', text: 'text-sm' },
  lg: { container: 'w-12 h-12', text: 'base' },
  xl: { container: 'w-16 h-16', text: 'lg' },
};

const statusColors = {
  online: 'bg-emerald-500',
  offline: 'bg-gray-400',
  busy: 'bg-amber-500',
  on_break: 'bg-blue-500',
};

const Avatar = ({
  src,
  alt,
  name,
  size = 'md',
  status,
  className,
}: AvatarProps) => {
  const config = sizeConfig[size];
  const initials = name ? getInitials(name.split(' ')[0] || '', name.split(' ')[1] || '') : '';

  return (
    <div className={cn('relative inline-block', className)}>
      {src ? (
        <img
          src={src}
          alt={alt || name || 'Avatar'}
          className={cn(
            'rounded-full object-cover ring-2 ring-white/10',
            config.container
          )}
        />
      ) : (
        <div
          className={cn(
            'rounded-full bg-secondary/20 flex items-center justify-center font-medium text-secondary ring-2 ring-white/10',
            config.container,
            config.text
          )}
        >
          {initials || '?'}
        </div>
      )}
      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 block rounded-full ring-2 ring-white',
            statusColors[status],
            size === 'xs' && 'w-2 h-2',
            size === 'sm' && 'w-2.5 h-2.5',
            size === 'md' && 'w-3 h-3',
            size === 'lg' && 'w-3.5 h-3.5',
            size === 'xl' && 'w-4 h-4'
          )}
        />
      )}
    </div>
  );
};

Avatar.displayName = 'Avatar';

// AvatarGroup для отображения нескольких аватаров
interface AvatarGroupProps {
  avatars: Array<{ src?: string; name?: string }>;
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

const AvatarGroup = ({
  avatars,
  max = 4,
  size = 'sm',
  className,
}: AvatarGroupProps) => {
  const displayed = avatars.slice(0, max);
  const remaining = avatars.length - max;

  const sizeConfigGroup = {
    xs: { container: 'w-5 h-5', text: 'text-[8px]', overlap: '-ml-2' },
    sm: { container: 'w-7 h-7', text: 'text-[10px]', overlap: '-ml-2.5' },
    md: { container: 'w-9 h-9', text: 'text-xs', overlap: '-ml-3' },
    lg: { container: 'w-11 h-11', text: 'text-sm', overlap: '-ml-4' },
  };

  const config = sizeConfigGroup[size];

  return (
    <div className={cn('flex items-center', className)}>
      {displayed.map((avatar, index) => (
        <div
          key={index}
          className={cn(
            'relative ring-2 ring-white/10 rounded-full',
            index > 0 && config.overlap
          )}
        >
          <Avatar src={avatar.src} name={avatar.name} size={size} />
        </div>
      ))}
      {remaining > 0 && (
        <div
          className={cn(
            'relative rounded-full bg-white/10 flex items-center justify-center font-medium text-gray-400 ring-2 ring-white/10',
            config.container,
            config.text,
            displayed.length > 0 && sizeConfigGroup[size].overlap
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
};

AvatarGroup.displayName = 'AvatarGroup';

export { Avatar, AvatarGroup };
