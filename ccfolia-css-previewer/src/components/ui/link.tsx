import { cn } from "@/lib/utils";

interface LinkProps {
  href: string;
  className?: string;
  children: React.ReactNode;
}

export function Link({ href, className, children }: LinkProps) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cn("text-destructive underline-offset-4 underline hover:text-destructive/80", className)}>
      {children}
    </a>
  );
}
