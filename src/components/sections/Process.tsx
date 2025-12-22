import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Target, Rocket, TrendingUp, FileText } from "lucide-react";

const phases = [
  {
    week: "Weeks 1–2",
    title: "Foundation & Setup",
    description: "Define your Ideal Customer Profile (ICP), set up AI systems, and configure integrations.",
    icon: Target,
  },
  {
    week: "Weeks 3–4",
    title: "Launch & Test",
    description: "Deploy campaigns, test automations, and gather initial performance data.",
    icon: Rocket,
  },
  {
    week: "Month 2",
    title: "Scale Winners",
    description: "Double down on what's working. Scale winning strategies and optimize underperformers.",
    icon: TrendingUp,
  },
  {
    week: "Month 3",
    title: "Document & Optimize",
    description: "Create playbooks, establish repeatable processes, and hand off to your team.",
    icon: FileText,
  },
];

export const Process = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="process" className="section-padding bg-primary text-primary-foreground" ref={ref}>
      <div className="container-narrow">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="text-accent font-medium text-sm uppercase tracking-wider">Our Process</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mt-4 mb-6">
            90-Day AI Growth Framework
          </h2>
          <p className="text-primary-foreground/70 max-w-2xl mx-auto text-lg">
            A proven methodology that transforms your growth engine in just 90 days.
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-primary-foreground/20 -translate-x-1/2" />

          <div className="space-y-12 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-16 md:gap-y-12">
            {phases.map((phase, index) => (
              <motion.div
                key={index}
                className={`relative ${index % 2 === 1 ? 'md:translate-y-24' : ''}`}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
              >
                {/* Timeline Dot */}
                <div className="hidden md:block absolute top-8 w-4 h-4 rounded-full bg-accent glow-accent-sm" 
                     style={{ [index % 2 === 0 ? 'right' : 'left']: '-2.5rem' }} />
                
                <div className="p-8 rounded-2xl bg-primary-foreground/5 border border-primary-foreground/10 backdrop-blur-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                      <phase.icon className="w-6 h-6 text-accent" />
                    </div>
                    <span className="text-accent font-semibold">{phase.week}</span>
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-3">{phase.title}</h3>
                  <p className="text-primary-foreground/70 leading-relaxed">{phase.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
