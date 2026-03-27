import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full cursor-pointer items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = "SelectTrigger"

const SelectScrollUpButton = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex cursor-pointer items-center justify-center py-2 hover:bg-accent hover:text-accent-foreground transition-colors bg-white/95 backdrop-blur-sm border-b border-border shadow-sm z-20 sticky top-0",
      className
    )}
    onClick={(e) => {
      const viewport = e.currentTarget.parentElement?.querySelector("[data-radix-select-viewport]");
      if (viewport) {
        viewport.scrollBy({ top: -140, behavior: "smooth" });
      }
    }}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </div>
))
SelectScrollUpButton.displayName = "SelectScrollUpButton"

const SelectScrollDownButton = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex cursor-pointer items-center justify-center py-2 hover:bg-accent hover:text-accent-foreground transition-colors bg-white/95 backdrop-blur-sm border-t border-border shadow-sm z-20 sticky bottom-0",
      className
    )}
    onClick={(e) => {
      const viewport = e.currentTarget.parentElement?.querySelector("[data-radix-select-viewport]");
      if (viewport) {
        viewport.scrollBy({ top: 140, behavior: "smooth" });
      }
    }}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </div>
))
SelectScrollDownButton.displayName = "SelectScrollDownButton"

const SelectContent = React.forwardRef(({ className, children, position = "popper", ...props }, ref) => {
  const [showUp, setShowUp] = React.useState(false);
  const [showDown, setShowDown] = React.useState(false);
  const viewportRef = React.useRef(null);
  const topRef = React.useRef(null);
  const bottomRef = React.useRef(null);

  React.useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === topRef.current) {
            setShowUp(!entry.isIntersecting);
          }
          if (entry.target === bottomRef.current) {
            setShowDown(!entry.isIntersecting);
          }
        });
      },
      { root: viewport, threshold: 0 }
    );

    if (topRef.current) observer.observe(topRef.current);
    if (bottomRef.current) observer.observe(bottomRef.current);

    // Initial check and scroll tracking
    const check = () => {
      if (!viewport) return;
      setShowUp(viewport.scrollTop > 5);
      setShowDown(viewport.scrollTop < viewport.scrollHeight - viewport.clientHeight - 5);
    };
    
    viewport.addEventListener("scroll", check);
    check();

    return () => {
      observer.disconnect();
      viewport.removeEventListener("scroll", check);
    };
  }, []);

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        style={{ zIndex: 2000, backgroundColor: 'white', color: 'black' }}
        className={cn(
          "relative !z-[2000] max-h-96 min-w-[8rem] overflow-hidden rounded-md border !bg-white text-popover-foreground shadow-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className
        )}
        position={position}
        {...props}
      >
        {showUp && <SelectScrollUpButton />}
        <SelectPrimitive.Viewport
          ref={viewportRef}
          className={cn(
            "p-1",
            position === "popper" &&
            "h-full w-full min-w-[var(--radix-select-trigger-width)]"
          )}
          style={{ overflowY: "auto" }}
        >
          <div ref={topRef} className="h-px w-full" />
          {children}
          <div ref={bottomRef} className="h-px w-full" />
        </SelectPrimitive.Viewport>
        {showDown && <SelectScrollDownButton />}
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
})
SelectContent.displayName = "SelectContent"

const SelectLabel = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
    {...props}
  />
))
SelectLabel.displayName = "SelectLabel"

const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-pointer select-none items-center rounded-xl py-2 px-3 text-sm outline-none transition-all duration-200 focus:bg-accent focus:text-accent-foreground focus:shadow-[0_8px_30px_rgba(45,63,51,0.12)] data-[state=checked]:shadow-[0_8px_30px_rgba(45,63,51,0.08)] data-[state=checked]:bg-accent/30 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = "SelectItem"

const SelectSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
SelectSeparator.displayName = "SelectSeparator"

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
