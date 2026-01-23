"use client";

import React, { ReactNode, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

type AOSAnimation =
  | "fade" | "fade-up" | "fade-down" | "fade-left" | "fade-right"
  | "fade-up-right" | "fade-up-left" | "fade-down-right" | "fade-down-left"
  | "flip-up" | "flip-down" | "flip-left" | "flip-right"
  | "slide-up" | "slide-down" | "slide-left" | "slide-right"
  | "zoom-in" | "zoom-in-up" | "zoom-in-down" | "zoom-in-left" | "zoom-in-right"
  | "zoom-out" | "zoom-out-up" | "zoom-out-down" | "zoom-out-left" | "zoom-out-right";

interface AnimatedSectionProps {
  children: ReactNode;
  animation?: AOSAnimation;
  duration?: number;
  delay?: number;
  once?: boolean;
  offset?: number;
  easing?: string;
  className?: string;
}

let isAOSInitialized = false;

export default function AnimatedSection({
  children,
  animation = "fade-up",
  duration = 800,
  delay = 0,
  once = true,
  offset = 50,
  easing = "ease-out",
  className = "",
}: AnimatedSectionProps) {
  useEffect(() => {
    if (!isAOSInitialized) {
      AOS.init({
        once: true,
        duration: 800,
        offset: 50,
        easing: "ease-out",
      });
      isAOSInitialized = true;
    }
  }, []);

  return (
    <div
      data-aos={animation}
      data-aos-duration={duration}
      data-aos-delay={delay}
      data-aos-once={once}
      data-aos-offset={offset}
      data-aos-easing={easing}
      className={className}
    >
      {children}
    </div>
  );
}
