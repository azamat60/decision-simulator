import type { ReactNode } from "react";
import { cn } from "../styles/utils";

type Props = {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
};

export const Card = ({
  children,
  className,
  title,
  subtitle,
  action,
}: Props) => (
  <div className={cn("glass-card p-5", className)}>
    {(title || action) && (
      <header className="mb-4 flex items-center justify-between">
        <div>
          {title && <h3 className="font-semibold text-text">{title}</h3>}
          {subtitle && (
            <p className="mt-0.5 text-sm text-text-tertiary">{subtitle}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </header>
    )}
    {children}
  </div>
);
