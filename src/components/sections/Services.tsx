import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Target, BarChart3, Workflow, LineChart } from "lucide-react";

const services = [
  {
    icon: Target,
    title: "AI-Powered Prospecting",
    description: "Smart lead generation that identifies and engages your ideal customers using advanced machine learning algorithms.",
  },
  {
    icon: BarChart3,
    title: "Intelligent Ad Optimization",
    description: "Real-time campaign optimization that maximizes ROI through predictive analytics and automated bid management.",
  },
  {
    icon: Workflow,
    title: "Automated Workflow Systems",
    description: "End-to-end automation that eliminates manual tasks and streamlines your entire sales and marketing pipeline.",
  },
  {
    icon: LineChart,
    title: "Data-Driven Insights",
    description: "Comprehensive reporting and analytics that turn complex data into actionable growth strategies.",
  },
];

export const Services = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="services" className="section-padding bg-card" ref={ref}>
      <div className="container-narrow">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="text-accent font-medium text-sm uppercase tracking-wider">Our Services</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mt-4 mb-6">
            Growth Solutions That Scale
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Leverage the power of AI to transform your business operations and accelerate growth.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="group p-8 rounded-2xl bg-background border border-border hover:border-accent/30 transition-all duration-300 hover:shadow-lg"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <service.icon className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">{service.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
