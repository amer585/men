interface LogoProps {
  size?: number;
  className?: string;
  glow?: boolean;
}

/**
 * Brand logo mark — the generated premium crest. Renders the same PNG at any
 * size; used in the header, hero, and avatar slots.
 */
export function Logo({ size = 40, className = '', glow = false }: LogoProps) {
  return (
    <span className={`relative inline-flex shrink-0 ${className}`} style={{ width: size, height: size }}>
      {glow && (
        <span
          className="animate-sheen absolute inset-0 rounded-[28%] blur-md"
          style={{ background: 'radial-gradient(circle, rgba(201,169,106,0.55), transparent 70%)' }}
        />
      )}
      <img
        src="/logo.png"
        alt="إدارتنا الشاملة"
        width={size}
        height={size}
        className="relative h-full w-full object-contain"
        draggable={false}
      />
    </span>
  );
}
