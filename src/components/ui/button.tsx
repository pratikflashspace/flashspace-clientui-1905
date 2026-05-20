import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-normal ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[#36503F] text-[#FEF8C5] hover:bg-[#1F2E26] shadow-md hover:shadow-lg",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border-2 border-[#36503F] bg-[#36503F] text-[#FEF8C5] hover:bg-[#1F2E26] hover:text-[#FEF8C5] hover:border-[#1F2E26]",
        secondary:
          "bg-[#36503F] text-[#FEF8C5] hover:bg-[#1F2E26]",
        ghost: "text-[#36503F] hover:bg-[#36503F] hover:text-[#FEF8C5]",
        link: "text-[#36503F] underline-offset-4 hover:underline",
        // Hero variants for landing page
        hero: "bg-[#36503F] text-[#FEF8C5] hover:bg-[#1F2E26] shadow-lg hover:shadow-xl",
        heroOutline:
          "border-2 border-[#36503F] bg-[#36503F] text-[#FEF8C5] hover:bg-[#1F2E26] hover:border-[#1F2E26]",
        // White variants for dark backgrounds
        white:
          "bg-white text-foreground hover:bg-white/90 shadow-lg hover:shadow-xl",
        whiteOutline:
          "border-2 border-white/30 bg-transparent text-white hover:bg-white/10 hover:border-white/60",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
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
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
