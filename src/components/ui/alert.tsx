interface AlertProps {
  children: React.ReactNode;
  className?: string;
}

export function Alert({ children, className = '' }: AlertProps) {
  return (
    <div className={`rounded-lg border p-4 ${className}`} role="alert">
      {children}
    </div>
  );
}

export function AlertDescription({ children }: { children: React.ReactNode }) {
  return <div className="text-sm">{children}</div>;
}
