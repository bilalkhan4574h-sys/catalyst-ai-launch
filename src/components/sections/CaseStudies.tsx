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
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {caseStudies.map((study, index) => (
            <motion.div
              key={index}
              className="relative p-8 rounded-2xl bg-card border border-border overflow-hidden group"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl transform translate-x-16 -translate-y-16 group-hover:bg-accent/10 transition-colors" />
              <study.icon className="w-8 h-8 text-accent mb-4" />
              <div className="font-display text-5xl font-bold text-foreground mb-2">{study.metric}</div>
              <div className="text-accent font-semibold mb-3">{study.label}</div>
              <p className="text-muted-foreground text-sm mb-4">{study.description}</p>
              <span className="text-xs text-muted-foreground/70">{study.client}</span>
            </motion.div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="p-8 rounded-2xl bg-primary text-primary-foreground"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
            >
              <blockquote className="text-xl font-medium mb-6 leading-relaxed">
                "{testimonial.quote}"
              </blockquote>
              <div>
                <div className="font-semibold">{testimonial.author}</div>
                <div className="text-primary-foreground/70 text-sm">{testimonial.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
