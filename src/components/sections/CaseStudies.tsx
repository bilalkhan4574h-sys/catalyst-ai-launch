import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { TrendingUp, Users, DollarSign } from "lucide-react";

const caseStudies = [
  {
    icon: TrendingUp,
    metric: "312%",
    label: "Lead Increase",
    description: "B2B SaaS company achieved record pipeline growth in 60 days through AI-powered prospecting.",
    client: "TechScale Inc.",
  },
  {
    icon: DollarSign,
    metric: "4.2x",
    label: "ROAS Improvement",
    description: "E-commerce brand optimized ad spend and dramatically improved return on ad spend.",
    client: "ModernRetail Co.",
  },
  {
    icon: Users,
    metric: "85%",
    label: "Time Saved",
    description: "Enterprise client automated manual workflows, freeing their team for strategic initiatives.",
    client: "GlobalTech Solutions",
  },
];

const testimonials = [
  {
    quote: "Catalyst AI transformed our entire go-to-market strategy. The results speak for themselves.",
    author: "Sarah Chen",
    role: "VP of Growth, TechScale Inc.",
  },
  {
    quote: "Their AI systems found opportunities we didn't even know existed. Game-changing partnership.",
    author: "Marcus Johnson",
    role: "CEO, ModernRetail Co.",
  },
];

export const CaseStudies = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="results" className="section-padding" ref={ref}>
      <div className="container-narrow">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="text-accent font-medium text-sm uppercase tracking-wider">Case Studies</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mt-4 mb-6">
            Measurable Results
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Real outcomes from real clients. See how AI-powered growth translates to business impact.
          </p>
        </motion.div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
          {caseStudies.map((study, index) => (
            <motion.div
              key={index}
              className="relative p-6 sm:p-8 rounded-2xl bg-card border border-border overflow-hidden group"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-accent/5 rounded-full blur-2xl transform translate-x-12 sm:translate-x-16 -translate-y-12 sm:-translate-y-16 group-hover:bg-accent/10 transition-colors" />
              <study.icon className="w-6 h-6 sm:w-8 sm:h-8 text-accent mb-3 sm:mb-4" />
              <div className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-2">{study.metric}</div>
              <div className="text-accent font-semibold mb-2 sm:mb-3 text-sm sm:text-base">{study.label}</div>
              <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4">{study.description}</p>
              <span className="text-xs text-muted-foreground/70">{study.client}</span>
            </motion.div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="p-6 sm:p-8 rounded-2xl bg-primary text-primary-foreground"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
            >
              <blockquote className="text-base sm:text-lg lg:text-xl font-medium mb-4 sm:mb-6 leading-relaxed">
                "{testimonial.quote}"
              </blockquote>
              <div>
                <div className="font-semibold text-sm sm:text-base">{testimonial.author}</div>
                <div className="text-primary-foreground/70 text-xs sm:text-sm">{testimonial.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
