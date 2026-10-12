'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Icon } from './icons';
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
const buttonVariants = cva('button', {
  variants: {
    variant: {
      primary: 'button-primary',
      secondary: 'button-secondary',
      ghost: 'button-ghost',
      danger: 'button-danger'
    },
    size: {
      default: '',
      small: 'button-small',
      icon: 'button-icon'
    }
  },
  defaultVariants: {
    variant: 'primary',
    size: 'default'
  }
});
export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants> & {
  asChild?: boolean;
}) {
  const Component = asChild ? Slot : 'button';
  return <Component className={cn(buttonVariants({
    variant,
    size
  }), className)} {...props} />;
}
export function Badge({
  children,
  tone = 'neutral'
}: {
  children: ReactNode;
  tone?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
}) {
  return <span className={'badge badge-' + tone}>
    <span className="status-dot" />{children}</span>;
}
export function Panel({
  children,
  className = '',
  title,
  description,
  action
}: {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
  action?: ReactNode;
}) {
  return <section className={'panel ' + className}>{title && <header className="panel-heading">
      <div>
        <h2>{title}</h2>{description && <p>{description}</p>}</div>{action}</header>}{children}</section>;
}
export function Empty({
  title = 'Nada por aqui ainda',
  description = 'Novos registros aparecerão aqui.',
  action
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
}) {
  return <div className="empty">
    <Icon name="search" size={32} />
    <h3>{title}</h3>
    <p>{description}</p>{action}</div>;
}
export function Avatar({
  name,
  size = 'normal'
}: {
  name: string;
  size?: 'normal' | 'large';
}) {
  return <span className={'avatar avatar-' + size} aria-hidden="true">{name.split(' ').filter(Boolean).slice(0, 2).map(n => n[0]).join('')}</span>;
}
export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  title: string;
  description: string;
  children: ReactNode;
}) {
  const returnFocus = useRef<HTMLElement | null>(null);
  return <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Portal>
      <Dialog.Overlay className="dialog-overlay" />
      <Dialog.Content className="dialog-content" onOpenAutoFocus={() => {
        returnFocus.current = document.activeElement as HTMLElement;
      }} onCloseAutoFocus={event => {
        event.preventDefault();
        const origin = returnFocus.current;
        if (origin?.isConnected && origin !== document.body) origin.focus();else document.querySelector<HTMLElement>('main')?.focus();
      }}>
        <header className="dialog-heading">
          <div>
            <Dialog.Title>{title}</Dialog.Title>
            <Dialog.Description>{description}</Dialog.Description>
          </div>
          <Dialog.Close asChild>
            <Button variant="ghost" size="icon" aria-label="Fechar diálogo">
              <Icon name="close" />
            </Button>
          </Dialog.Close>
        </header>{children}</Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}
export function PageHeading({
  eyebrow,
  title,
  description,
  actions
}: {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return <div className="page-heading">
    <div>{eyebrow && <div className="eyebrow">{eyebrow}</div>}<h1>{title}</h1>
      <p>{description}</p>
    </div>
    <div className="heading-actions">{actions}</div>
  </div>;
}
export function Stat({
  label,
  value,
  detail,
  icon,
  tone = 'success',
  featured = false
}: {
  label: string;
  value: string;
  detail: string;
  icon: string;
  tone?: string;
  featured?: boolean;
}) {
  return <div className={'stat ' + (featured ? 'stat-featured' : '')}>
    <div className="stat-top">
      <span>{label}</span>
      <Icon name={icon} size={18} />
    </div>
    <div className="stat-value">{value}</div>
    <span className={'stat-detail text-' + tone}>{detail}</span>
    <svg className="sparkline" viewBox="0 0 100 25" aria-hidden="true">
      <path d={tone === 'danger' ? 'M0 5L15 9 25 5 40 15 55 11 70 19 85 17 100 22' : 'M0 22L12 18 25 20 39 12 55 16 68 7 82 9 100 1'} fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  </div>;
}
export function DemoNote({
  children = 'Ambiente demonstrativo · dados fictícios · sem conexão com backend'
}: {
  children?: ReactNode;
}) {
  return <div className="demo-note">
    <Icon name="shield" size={14} />{children}</div>;
}
