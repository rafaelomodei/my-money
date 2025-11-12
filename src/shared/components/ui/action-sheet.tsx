'use client';

import { Button, type ButtonProps } from '@/shared/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface ActionSheetButtonConfig {
  label: string;
  onClick?: () => void;
  variant?: ButtonProps['variant'];
  disabled?: boolean;
  type?: ButtonProps['type'];
  closeOnClick?: boolean;
}

interface ActionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  primaryAction: ActionSheetButtonConfig;
  secondaryAction?: ActionSheetButtonConfig;
  className?: string;
}

const handleActionClick = (
  action: ActionSheetButtonConfig,
  onOpenChange: (open: boolean) => void
) => {
  action.onClick?.();

  if (action.closeOnClick !== false) {
    onOpenChange(false);
  }
};

export const ActionSheet = ({
  open,
  onOpenChange,
  title,
  description,
  primaryAction,
  secondaryAction,
  className,
}: ActionSheetProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side='bottom'
        className={cn(
          'rounded-t-3xl border-none pb-8 pt-4 shadow-lg [&>button]:hidden',
          className
        )}
      >
        <div className='mx-auto mb-4 h-1.5 w-12 rounded-full bg-muted' />
        <SheetHeader className='space-y-4 text-center'>
          <SheetTitle className='text-base font-semibold'>{title}</SheetTitle>
          {description ? (
            <SheetDescription className='text-sm text-muted-foreground'>
              {description}
            </SheetDescription>
          ) : null}
        </SheetHeader>
        <div className='mt-6 flex flex-col gap-3'>
          {secondaryAction ? (
            <Button
              variant={secondaryAction.variant}
              disabled={secondaryAction.disabled}
              type={secondaryAction.type}
              onClick={() => handleActionClick(secondaryAction, onOpenChange)}
            >
              {secondaryAction.label}
            </Button>
          ) : null}
          <Button
            variant={primaryAction.variant ?? 'default'}
            disabled={primaryAction.disabled}
            type={primaryAction.type}
            onClick={() => handleActionClick(primaryAction, onOpenChange)}
          >
            {primaryAction.label}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
