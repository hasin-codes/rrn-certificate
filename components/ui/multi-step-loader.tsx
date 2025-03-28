"use client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useState, useEffect } from "react";

export const MultiStepLoader = ({
  loadingStates,
  loading,
  duration = 2000,
  loop = false,
  className,
}: {
  loadingStates: { text: string }[];
  loading: boolean;
  duration?: number;
  loop?: boolean;
  className?: string;
}) => {
  const [currentState, setCurrentState] = useState(0);

  useEffect(() => {
    if (!loading) {
      setCurrentState(0);
      return;
    }
    const timeout = setTimeout(() => {
      setCurrentState((prevState) =>
        loop
          ? prevState === loadingStates.length - 1
            ? 0
            : prevState + 1
          : Math.min(prevState + 1, loadingStates.length - 1)
      );
    }, duration);

    return () => clearTimeout(timeout);
  }, [currentState, loading, loop, loadingStates.length, duration]);

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          className="w-full h-full fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-2xl"
        >
          <div className={cn("relative px-4 text-center", className)}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentState}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-white text-lg sm:text-xl font-medium leading-relaxed"
              >
                {loadingStates[currentState].text}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="bg-gradient-to-t inset-x-0 z-20 bottom-0 bg-black h-full absolute [mask-image:radial-gradient(900px_at_center,transparent_30%,black)]" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
