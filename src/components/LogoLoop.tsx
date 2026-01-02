import React, { useRef, useEffect, useState, ReactNode } from "react";
import { motion, useAnimationControls } from "framer-motion";

interface Logo {
  node?: ReactNode;
  src?: string;
  alt?: string;
  title?: string;
  href?: string;
}

interface LogoLoopProps {
  logos: Logo[];
  speed?: number;
  direction?: "left" | "right" | "up" | "down";
  logoHeight?: number;
  gap?: number;
  hoverSpeed?: number;
  scaleOnHover?: boolean;
  fadeOut?: boolean;
  fadeOutColor?: string;
  ariaLabel?: string;
}

const LogoLoop: React.FC<LogoLoopProps> = ({
  logos,
  speed = 100,
  direction = "left",
  logoHeight = 48,
  gap = 40,
  hoverSpeed = 0,
  scaleOnHover = false,
  fadeOut = false,
  fadeOutColor = "hsl(var(--card))",
  ariaLabel = "Logo carousel",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const isHorizontal = direction === "left" || direction === "right";

  // Duplicate logos for seamless loop
  const duplicatedLogos = [...logos, ...logos, ...logos];

  const currentSpeed = isHovered && hoverSpeed !== undefined ? hoverSpeed : speed;
  const duration = duplicatedLogos.length * (100 / Math.max(currentSpeed, 1));

  const getAnimationProps = () => {
    const distance = isHorizontal ? "-33.333%" : "-33.333%";
    const axis = isHorizontal ? "x" : "y";
    const reverse = direction === "right" || direction === "down";

    return {
      [axis]: reverse ? ["0%", distance] : [distance, "0%"],
    };
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden w-full ${isHorizontal ? "h-auto" : "h-full"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="region"
      aria-label={ariaLabel}
    >
      {/* Fade overlays */}
      {fadeOut && (
        <>
          <div
            className={`absolute z-10 pointer-events-none ${
              isHorizontal
                ? "left-0 top-0 bottom-0 w-16 sm:w-24"
                : "top-0 left-0 right-0 h-16 sm:h-24"
            }`}
            style={{
              background: isHorizontal
                ? `linear-gradient(to right, ${fadeOutColor}, transparent)`
                : `linear-gradient(to bottom, ${fadeOutColor}, transparent)`,
            }}
          />
          <div
            className={`absolute z-10 pointer-events-none ${
              isHorizontal
                ? "right-0 top-0 bottom-0 w-16 sm:w-24"
                : "bottom-0 left-0 right-0 h-16 sm:h-24"
            }`}
            style={{
              background: isHorizontal
                ? `linear-gradient(to left, ${fadeOutColor}, transparent)`
                : `linear-gradient(to top, ${fadeOutColor}, transparent)`,
            }}
          />
        </>
      )}

      <motion.div
        className={`flex ${isHorizontal ? "flex-row" : "flex-col"}`}
        style={{ gap }}
        animate={getAnimationProps()}
        transition={{
          duration,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        }}
      >
        {duplicatedLogos.map((logo, index) => (
          <LogoItem
            key={index}
            logo={logo}
            logoHeight={logoHeight}
            scaleOnHover={scaleOnHover}
          />
        ))}
      </motion.div>
    </div>
  );
};

interface LogoItemProps {
  logo: Logo;
  logoHeight: number;
  scaleOnHover: boolean;
}

const LogoItem: React.FC<LogoItemProps> = ({ logo, logoHeight, scaleOnHover }) => {
  const content = logo.node ? (
    <span
      className="flex items-center justify-center text-muted-foreground hover:text-accent transition-colors"
      style={{ fontSize: logoHeight }}
    >
      {logo.node}
    </span>
  ) : logo.src ? (
    <img
      src={logo.src}
      alt={logo.alt || ""}
      style={{ height: logoHeight }}
      className="object-contain"
    />
  ) : null;

  const wrapper = (
    <motion.div
      className="flex-shrink-0 flex items-center justify-center cursor-pointer"
      whileHover={scaleOnHover ? { scale: 1.15 } : undefined}
      transition={{ duration: 0.2 }}
      title={logo.title}
    >
      {content}
    </motion.div>
  );

  if (logo.href) {
    return (
      <a
        href={logo.href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-shrink-0"
        aria-label={logo.title || logo.alt}
      >
        {wrapper}
      </a>
    );
  }

  return wrapper;
};

export default LogoLoop;
