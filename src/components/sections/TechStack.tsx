import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const fallbackTechnologies = [
  { name: "Python", category: "Core" },
  { name: "TensorFlow", category: "ML" },
  { name: "PyTorch", category: "ML" },
  { name: "OpenAI API", category: "AI" },
  { name: "LangChain", category: "AI" },
  { name: "n8n", category: "Automation" },
  { name: "Salesforce", category: "CRM" },
  { name: "HubSpot", category: "CRM" },
  { name: "Zapier", category: "Automation" },
  { name: "Make", category: "Automation" },
  { name: "PostgreSQL", category: "Data" },
  { name: "Snowflake", category: "Data" },
  { name: "dbt", category: "Data" },
];

export const TechStack = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const { data: techStack } = useQuery({
    queryKey: ['tech-stack'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tech_stack')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      if (error) throw error;
      return data;
    },
  });

  const technologies = techStack && techStack.length > 0 
    ? techStack.map(t => ({ name: t.name, category: t.category }))
    : fallbackTechnologies;

  return (
    <section id="tech" className="section-padding bg-card" ref={ref}>
      <div className="container-narrow">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="text-accent font-medium text-sm uppercase tracking-wider">Technology</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mt-4 mb-6">
            Our Tech Stack
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Best-in-class tools and frameworks that power our AI growth systems.
          </p>
        </motion.div>

        <motion.div
          className="flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {technologies.map((tech, index) => (
            <motion.div
              key={index}
              className="group px-6 py-4 rounded-xl bg-background border border-border hover:border-accent/30 hover:bg-accent/5 transition-all duration-300 cursor-default"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.1 + index * 0.03 }}
              whileHover={{ y: -4 }}
            >
              <div className="font-medium text-foreground">{tech.name}</div>
              <div className="text-xs text-muted-foreground mt-1">{tech.category}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Integration Partners */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-muted-foreground mb-8">We integrate with your existing tools</p>
          <div className="flex flex-wrap justify-center gap-8 opacity-60">
            {["Slack", "Google Workspace", "Microsoft 365", "Stripe", "Shopify", "AWS"].map((partner, index) => (
              <span key={index} className="font-display font-semibold text-lg text-foreground/50">{partner}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
