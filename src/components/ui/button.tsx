import * as React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
          {
            "bg-amber-600 text-white shadow-sm hover:bg-amber-700 hover:shadow-md": variant === "default",
            "border border-neutral-200 bg-white text-neutral-700 shadow-sm hover:bg-neutral-50 hover:border-neutral-300 hover:text-neutral-900": variant === "outline",
            "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900": variant === "ghost",
            "bg-red-600 text-white shadow-sm hover:bg-red-700 hover:shadow-md": variant === "destructive",
            "text-neutral-900 underline-offset-4 hover:underline": variant === "link",
          },
          {
            "h-10 px-5 py-2": size === "default",
            "h-9 px-3.5 text-xs": size === "sm",
            "h-12 px-8 text-base": size === "lg",
            "h-10 w-10": size === "icon",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
