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
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97] cursor-pointer",
          {
            "bg-amber-600 text-white shadow-md shadow-amber-600/20 hover:bg-amber-500 hover:shadow-lg hover:shadow-amber-500/25 hover:-translate-y-0.5":
              variant === "default",
            "border border-neutral-200 bg-white text-neutral-600 shadow-sm hover:border-amber-200 hover:bg-amber-50/50 hover:text-amber-700 hover:shadow-md hover:-translate-y-0.5":
              variant === "outline",
            "text-neutral-500 hover:bg-amber-50 hover:text-amber-700":
              variant === "ghost",
            "bg-red-600 text-white shadow-md shadow-red-600/20 hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/25 hover:-translate-y-0.5":
              variant === "destructive",
            "text-amber-600 underline-offset-4 hover:underline hover:text-amber-700":
              variant === "link",
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
