"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionContextType {
  openItems: string[];
  toggleItem: (value: string) => void;
  type?: "single" | "multiple";
}

const AccordionContext = React.createContext<AccordionContextType | undefined>(undefined);

interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "single" | "multiple";
  defaultValue?: string | string[];
}

export function Accordion({
  type = "single",
  defaultValue,
  className,
  children,
  ...props
}: AccordionProps) {
  const [openItems, setOpenItems] = React.useState<string[]>(() => {
    if (!defaultValue) return [];
    return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
  });

  const toggleItem = (value: string) => {
    if (type === "single") {
      setOpenItems((prev) => (prev.includes(value) ? [] : [value]));
    } else {
      setOpenItems((prev) =>
        prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
      );
    }
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, type }}>
      <div className={cn("space-y-4", className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export function AccordionItem({ value, className, children, ...props }: AccordionItemProps) {
  const context = React.useContext(AccordionContext);
  if (!context) throw new Error("AccordionItem must be used within an Accordion");

  const isOpen = context.openItems.includes(value);

  return (
    <div
      data-state={isOpen ? "open" : "closed"}
      className={cn(
        "border-2 border-black bg-white transition-all shadow-brutal",
        isOpen && "bg-cream",
        className
      )}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<{ value?: string; isOpen?: boolean }>, {
            value,
            isOpen,
          });
        }
        return child;
      })}
    </div>
  );
}

interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value?: string;
  isOpen?: boolean;
}

export function AccordionTrigger({
  className,
  children,
  value,
  isOpen,
  ...props
}: AccordionTriggerProps) {
  const context = React.useContext(AccordionContext);
  if (!context) throw new Error("AccordionTrigger must be used within an Accordion");

  const open = isOpen ?? (value ? context.openItems.includes(value) : false);

  return (
    <button
      type="button"
      onClick={() => value && context.toggleItem(value)}
      aria-expanded={open}
      className={cn(
        "flex w-full items-center justify-between p-5 text-left font-heading text-base md:text-lg font-bold text-black transition-all hover:bg-cream/80 select-none",
        open && "bg-primary/20 border-b-2 border-black",
        className
      )}
      {...props}
    >
      <span>{children}</span>
      <div
        className={cn(
          "w-8 h-8 border-2 border-black flex items-center justify-center shrink-0 ml-4 transition-transform duration-200 shadow-brutal-sm",
          open ? "bg-primary rotate-180" : "bg-white"
        )}
      >
        <ChevronDown className="h-4 w-4" strokeWidth={2.5} />
      </div>
    </button>
  );
}

interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean;
}

export function AccordionContent({ className, children, isOpen, ...props }: AccordionContentProps) {
  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "p-5 text-sm md:text-base font-medium text-neutral-800 leading-relaxed bg-white border-t-0 animate-in fade-in-50 duration-150",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
