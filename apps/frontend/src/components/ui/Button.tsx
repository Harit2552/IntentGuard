import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
  icon?: ReactNode;
  fullWidth?: boolean;
};

export function Button({
  variant = 'secondary',
  icon,
  fullWidth = false,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`button button-${variant}${fullWidth ? ' button-full' : ''}${className ? ` ${className}` : ''}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
