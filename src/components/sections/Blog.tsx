import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Clock } from "lucide-react";

const posts = [
  {
    title: "The Future of AI-Powered Lead Generation",
    excerpt: "How machine learning is transforming the way businesses identify and engage prospects.",
    category: "AI Strategy",
    readTime: "5 min read",
  },
  {
    title: "Automating Your Sales Pipeline in 2024",
    excerpt: "A comprehensive guide to building automated workflows that convert leads faster.",
    category: "Automation",
    readTime: "7 min read",
  },
  {
    title: "Measuring ROI on AI Marketing Investments",
    excerpt: "Key metrics and frameworks for evaluating the success of your AI initiatives.",
    category: "Analytics",
    readTime: "4 min read",
  },
];

export const Blog = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="blog" className="section-padding" ref={ref}>
      <div className="container-narrow">
        <motion.div
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div>
            <span className="text-accent font-medium text-sm uppercase tracking-wider">Insights</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold mt-4">
              Latest Thinking
            </h2>
          </div>
          <a href="#" className="inline-flex items-center gap-2 text-accent font-medium mt-4 md:mt-0 hover:gap-3 transition-all">
            View All Articles <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <motion.article
              key={index}
              className="group cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-muted to-muted/50 mb-6 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-accent/10 to-transparent group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                <span className="text-accent font-medium">{post.category}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {post.readTime}
                </span>
              </div>
              <h3 className="font-display text-xl font-semibold mb-3 group-hover:text-accent transition-colors">
                {post.title}
              </h3>
              <p className="text-muted-foreground">{post.excerpt}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
