"use client";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
}

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <main>
      <style jsx global>{`
        @keyframes aurora {
          from {
            background-position: 50% 50%, 50% 50%;
          }
          to {
            background-position: 350% 50%, 350% 50%;
          }
        }
        .animate-aurora {
          animation: aurora 60s linear infinite;
        }
      `}</style>
      <div
        className={cn(
          "transition-bg relative flex h-[100vh] flex-col items-center justify-center bg-black",
          className,
        )}
        {...props}
      >
        <div
          className="absolute inset-0 overflow-hidden"
          style={
            {
              "--aurora":
                "repeating-linear-gradient(100deg,#0e7490_0%,#06b6d4_12%,#22d3ee_24%,#67e8f9_36%,#155e75_48%)",
              "--dark-gradient":
                "repeating-linear-gradient(100deg,#000_0%,#000_10%,transparent_15%,transparent_20%,#000_25%)",
              "--cyan-100": "#67e8f9",
              "--cyan-300": "#22d3ee",
              "--cyan-400": "#06b6d4",
              "--cyan-600": "#0e7490",
              "--cyan-700": "#155e75",
              "--black": "#000",
              "--transparent": "transparent",
            } as React.CSSProperties
          }
        >
          <div
            className={cn(
              `animate-aurora pointer-events-none absolute -inset-[10px] [background-image:var(--dark-gradient),var(--aurora)] [background-size:250%,_200%] [background-position:50%_50%,50%_50%] opacity-60 blur-[10px] will-change-transform [--aurora:repeating-linear-gradient(100deg,var(--cyan-600)_0%,var(--cyan-400)_12%,var(--cyan-300)_24%,var(--cyan-100)_36%,var(--cyan-700)_48%)] [--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_10%,var(--transparent)_15%,var(--transparent)_20%,var(--black)_25%)] after:absolute after:inset-0 after:[background-image:var(--dark-gradient),var(--aurora)] after:[background-size:200%,_100%] after:[background-attachment:fixed] after:mix-blend-difference after:content-[""]`,
              showRadialGradient &&
                `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]`,
            )}
          ></div>
        </div>
        {children}
      </div>
    </main>
  );
};
