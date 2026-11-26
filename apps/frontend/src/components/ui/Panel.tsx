import type { ReactNode } from 'react';

export function Panel({
  eyebrow,
  title,
  action,
  children,
  className = '',
}: {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <article className={`panel ${className}`}>
      <div className="panel-head">
        <div>{eyebrow && <p>{eyebrow}</p>}<h3>{title}</h3></div>
        {action}
      </div>
      {children}
    </article>
  );
}
