import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { 
  SiPython, 
  SiTensorflow, 
  SiPytorch, 
  SiOpenai, 
  SiLangchain,
  SiSalesforce, 
  SiHubspot, 
  SiZapier, 
  SiPostgresql, 
  SiSnowflake,
  SiSlack,
  SiGooglecloud,
  SiStripe,
  SiShopify,
  SiAmazon
} from "react-icons/si";
import { FaMicrosoft } from "react-icons/fa";
import LogoLoop from "@/components/LogoLoop";

const techLogos = [
  { node: <SiPython />, title: "Python" },
  { node: <SiTensorflow />, title: "TensorFlow" },
  { node: <SiPytorch />, title: "PyTorch" },
  { node: <SiOpenai />, title: "OpenAI" },
  { node: <SiLangchain />, title: "LangChain" },
  { node: <SiSalesforce />, title: "Salesforce" },
  { node: <SiHubspot />, title: "HubSpot" },
  { node: <SiZapier />, title: "Zapier" },
  { node: <SiPostgresql />, title: "PostgreSQL" },
  { node: <SiSnowflake />, title: "Snowflake" },
];

const integrationLogos = [
  { node: <SiSlack />, title: "Slack" },
  { node: <SiGooglecloud />, title: "Google Cloud" },
  { node: <FaMicrosoft />, title: "Microsoft 365" },
  { node: <SiStripe />, title: "Stripe" },
  { node: <SiShopify />, title: "Shopify" },
  { node: <SiAmazon />, title: "AWS" },
];

export const TechStack = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="tech" className="section-padding bg-card" ref={ref}>
      <div className="container-narrow">
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="text-accent font-medium text-sm uppercase tracking-wider">Technology</span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-4 sm:mb-6">
            Our Tech Stack
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg">
            Best-in-class tools and frameworks that power our AI growth systems.
          </p>
        </motion.div>

        {/* Tech Stack Logo Loop */}
        <motion.div
          className="h-20 sm:h-24 mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <LogoLoop
            logos={techLogos}
            speed={80}
            direction="left"
            logoHeight={40}
            gap={60}
            hoverSpeed={20}
            scaleOnHover
            fadeOut
            fadeOutColor="hsl(var(--card))"
            ariaLabel="Technology stack logos"
          />
        </motion.div>

        {/* Integration Partners */}
        <motion.div
          className="mt-10 sm:mt-12 md:mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-base">We integrate with your existing tools</p>
          <div className="h-16 sm:h-20">
            <LogoLoop
              logos={integrationLogos}
              speed={60}
              direction="right"
              logoHeight={32}
              gap={50}
              hoverSpeed={15}
              scaleOnHover
              fadeOut
              fadeOutColor="hsl(var(--card))"
              ariaLabel="Integration partner logos"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
