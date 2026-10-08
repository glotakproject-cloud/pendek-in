import Link from "next/link";
import { Link2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  href?: string;
  size?: "sm" | "default" | "lg";
  className?: string;
  showText?: boolean;
}

export function BrandLogo({
  href = "/",
  size = "default",
  className,
  showText = true,
}: BrandLogoProps) {
  const boxSizes = {
    sm: "w-8 h-8 text-sm",
    default: "w-10 h-10 text-base",
    lg: "w-14 h-14 text-xl",
  }[size];

  const iconSizes = {
    sm: 16,
    default: 20,
    lg: 28,
  }[size];

  const textSizes = {
    sm: "text-lg",
    default: "text-2xl",
    lg: "text-3xl",
  }[size];

  const content = (
    <div className={cn("inline-flex items-center gap-2.5 font-heading font-black select-none group", className)}>
      <div
        className={cn(
          "bg-primary border-2 border-black flex items-center justify-center shadow-brutal-sm group-hover:bg-accent transition-colors",
          boxSizes
        )}
      >
        <Link2 size={iconSizes} strokeWidth={2.5} className="text-black transform -rotate-45" />
      </div>
      {showText && (
        <span className={cn("tracking-tight text-black flex items-center font-heading font-black", textSizes)}>
          Pendek<span className="bg-primary px-1 ml-0.5 border-2 border-black text-black text-[0.85em] shadow-brutal-sm">In</span>
        </span>
      )}
    </div>
  );

  if (!href) return content;

  return (
    <Link href={href} className="inline-block transition-transform active:translate-y-0.5">
      {content}
    </Link>
  );
}
