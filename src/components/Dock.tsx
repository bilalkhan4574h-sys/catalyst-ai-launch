import { useRef, useState, ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface DockItem {
  icon: ReactNode;
  label: string;
  onClick: () => void;
}

interface DockProps {
  items: DockItem[];
  panelHeight?: number;
  baseItemSize?: number;
  magnification?: number;
}

const DockIcon = ({
  icon,
  label,
  onClick,
  mouseX,
  baseItemSize,
  magnification,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  mouseX: ReturnType<typeof useMotionValue<number>>;
  baseItemSize: number;
  magnification: number;
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(
    distance,
    [-150, 0, 150],
    [baseItemSize, magnification, baseItemSize]
  );

  const width = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  return (
    <motion.button
      ref={ref}
      style={{ width, height: width }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex items-center justify-center rounded-xl bg-background/50 backdrop-blur-sm border border-border/50 hover:bg-accent/10 hover:border-accent/30 transition-colors cursor-pointer"
      whileTap={{ scale: 0.95 }}
    >
      <div className="flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
        {icon}
      </div>
      
      {/* Tooltip */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, y: 10, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 10, x: '-50%' }}
          className="absolute -bottom-8 left-1/2 px-2 py-1 bg-foreground text-background text-xs font-medium rounded whitespace-nowrap z-50"
        >
          {label}
        </motion.div>
      )}
    </motion.button>
  );
};

const Dock = ({
  items,
  panelHeight = 68,
  baseItemSize = 50,
  magnification = 70,
}: DockProps) => {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className="flex items-end gap-2 px-3 py-2 rounded-2xl bg-background/60 backdrop-blur-xl border border-border/50 shadow-lg"
      style={{ height: panelHeight }}
    >
      {items.map((item, index) => (
        <DockIcon
          key={index}
          icon={item.icon}
          label={item.label}
          onClick={item.onClick}
          mouseX={mouseX}
          baseItemSize={baseItemSize}
          magnification={magnification}
        />
      ))}
    </motion.div>
  );
};

export default Dock;
