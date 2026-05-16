import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "outline" | "ghost" | "destructive";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
        variant === "primary" && "bg-primary text-primary-foreground hover:bg-blue-700",
        variant === "outline" && "border border-border bg-transparent hover:bg-gray-50",
        variant === "ghost" && "bg-transparent hover:bg-gray-100",
        variant === "destructive" && "bg-destructive text-white hover:bg-red-600",
        className
      )}
      {...props}
    />
  );
}
