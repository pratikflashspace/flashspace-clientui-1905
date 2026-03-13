import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const blogPosts = [
    {
        title: "How TechStart scaled to 15 locations with FlashSpace",
    },
    {
        title: "Webinar: Hybrid workspace best practices for 2025",
    },
    {
        title: "How AI is transforming workspace booking efficiency",
    },
    {
        title: "FlashSpace: The platform designed for modern hybrid teams",
    },
];

export const BlogSection = () => {
    return (
        <section className="py-10 lg:py-14 bg-background border-t border-border">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="grid lg:grid-cols-[180px_1fr] gap-8 lg:gap-12">
                    {/* Left Label */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="text-muted-foreground text-xs uppercase tracking-widest font-semibold">
                            From the Blog
                        </span>
                    </motion.div>

                    {/* Blog Links */}
                    <div className="space-y-0">
                        {blogPosts.map((post, index) => (
                            <motion.a
                                key={post.title}
                                href="#"
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center justify-between py-5 px-6 border-b border-border group cursor-pointer transition-all duration-200 hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
                            >
                                <h3 className="text-base lg:text-lg font-medium text-foreground tracking-tight">
                                    {post.title}
                                </h3>
                                <ArrowUpRight className="w-5 h-5 text-foreground/60 group-hover:text-foreground transition-all group-hover:translate-x-1 group-hover:-translate-y-1 shrink-0 ml-6" />
                            </motion.a>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};