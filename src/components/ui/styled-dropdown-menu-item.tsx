import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import type { PropsWithChildren } from 'react';

type StyledDropdownMenuItemProps = {
  onClick?: () => void;
  className?: string;
};

const StyledDropdownMenuItem = ({
  onClick,
  children,
  className = '',
}: PropsWithChildren<StyledDropdownMenuItemProps>) => {
  return (
    <DropdownMenuItem
      onClick={onClick}
      className={`text-base
        data-[highlighted]:text-neutral 
        data-[highlighted]:bg-neutral-600 
        [&:focus-visible:not(:hover)]:bg-neutral-800 
        [&:focus-visible:not(:hover)]:ring-2 
        [&:focus-visible:not(:hover)]:ring-neutral 
        [&:focus-visible:not(:hover)]:ring-offset-3 
        [&:focus-visible:not(:hover)]:ring-offset-neutral-800 
        ${className}`}>
      {children}
    </DropdownMenuItem>
  );
};

export default StyledDropdownMenuItem;
