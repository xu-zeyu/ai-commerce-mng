"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import {
  EMPTY_AUTHORITIES,
  hasPermission,
  type PermissionCode,
  type PermissionMatchMode,
} from "@/permissions/rbac";
import { useAuthStore } from "@/stores/use-auth-store";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-muted hover:text-foreground",
        outline:
          "border border-border bg-card hover:bg-muted",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-6",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  permission?: PermissionCode;
  permissionMode?: PermissionMatchMode;
  unauthorizedMode?: "hide" | "disable";
  unauthorizedReason?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      permission,
      permissionMode = "any",
      unauthorizedMode = "hide",
      unauthorizedReason = "暂无操作权限",
      disabled,
      onClick,
      title,
      ...props
    },
    ref,
  ) => {
    const authorities = useAuthStore((s) => s.user?.authorities ?? EMPTY_AUTHORITIES);
    const allowed = !permission || hasPermission(authorities, permission, permissionMode);

    if (!allowed && unauthorizedMode === "hide") return null;

    const Comp = asChild ? Slot : "button";
    const isDisabled = disabled || !allowed;
    const disabledProps = asChild ? {} : { disabled: isDisabled };
    const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
      if (isDisabled) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      onClick?.(event);
    };

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        aria-disabled={isDisabled || undefined}
        data-permission-state={allowed ? "allowed" : "denied"}
        title={!allowed ? unauthorizedReason : title}
        onClick={handleClick}
        {...props}
        {...disabledProps}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
