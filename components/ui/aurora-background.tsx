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
          "transition-bg relative flex h-[100vh] flex-col items-center justify-center bg-[#2c0c0c]",
          className,
        )}
        {...props}
      >
        <div
          className="absolute inset-0 overflow-hidden"
          style={
            {
              "--aurora":
                "repeating-linear-gradient(100deg,#9f1239_0%,#be123c_12%,#e11d48_24%,#be123c_36%,#9f1239_48%)",
              "--dark-gradient":
                "repeating-linear-gradient(100deg,#2c0c0c_0%,#2c0c0c_10%,transparent_15%,transparent_20%,#2c0c0c_25%)",
              "--red-500": "#e11d48",
              "--red-600": "#be123c",
              "--red-700": "#9f1239",
              "--black": "#2c0c0c",
              "--transparent": "transparent",
            } as React.CSSProperties
          }
        >
          <div
            className={cn(
              `animate-aurora pointer-events-none absolute -inset-[10px] [background-image:var(--dark-gradient),var(--aurora)] [background-size:250%,_200%] [background-position:50%_50%,50%_50%] opacity-75 blur-[10px] will-change-transform [--aurora:repeating-linear-gradient(100deg,var(--red-700)_0%,var(--red-600)_12%,var(--red-500)_24%,var(--red-600)_36%,var(--red-700)_48%)] [--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_10%,var(--transparent)_15%,var(--transparent)_20%,var(--black)_25%)] after:absolute after:inset-0 after:[background-image:var(--dark-gradient),var(--aurora)] after:[background-size:200%,_100%] after:[background-attachment:fixed] after:mix-blend-difference after:content-[""]`,
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
