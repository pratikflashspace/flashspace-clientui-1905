import React, { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Clock, ChevronRight } from "lucide-react";

/*
  Blog_Full_Design.tsx
  - Contains:
    1) BlogPage (listing) with About-Us Option B hero style (already applied earlier)
    2) SinglePostPage (Option C: Full Banner Hero + Split Layout)
    3) HomepageBlogSection (3-card grid to include on homepage)
    4) FeaturedCategorySlider component
    5) SEO helper that injects meta tags + JSON-LD

  Drop-in single-file (copy / paste). Uses Tailwind, Framer Motion, existing Header/Footer and UI primitives.
*/

// ----------------------
// Theme constants
// ----------------------
const ACCENT = "#FFD400";
const ACCENT_DARK = "#FFB300";

// ----------------------
// Sample posts (shared)
// ----------------------
type Post = {
  id: string;
  title: string;
  category: string;
  region: string;
  excerpt: string;
  hero?: string;
  content?: string;
  author?: string;
  date?: string; // ISO
  readMinutes?: number;
  featured?: boolean;
  popularity?: number;
};

const SAMPLE_POSTS: Post[] = [
  {
    id: "1",
    title: "The Future of Flexible Workspaces",
    category: "Guides",
    region: "India",
    excerpt: "Exploring how modern businesses are adapting to hybrid-first strategies and flexible work models.",
    hero: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1600",
    content:
      `<p>Flexible workspaces are transforming how companies think about real estate, talent and culture. In this article we cover trends, pricing models and operational tips for scaling your hybrid program.</p>
      
      <h2>The Rise of Hybrid Work Models</h2>
      <p>The pandemic accelerated a shift that was already underway. Companies are now embracing flexible workspace solutions that allow employees to work from anywhere while maintaining productivity and collaboration. This new model offers significant cost savings on traditional office leases while providing employees with the flexibility they desire.</p>
      
      <h2>Key Benefits of Flexible Workspaces</h2>
      <p>Organizations adopting flexible workspace strategies report improved employee satisfaction, reduced overhead costs, and access to talent pools beyond their immediate geographic area. These spaces offer modern amenities, networking opportunities, and the ability to scale up or down based on business needs.</p>
      
      <h2>Choosing the Right Solution</h2>
      <p>When selecting a flexible workspace provider, consider factors such as location accessibility, available amenities, community culture, and pricing flexibility. The right choice can significantly impact your team's productivity and overall business success.</p>
      
      <h2>Future Trends</h2>
      <p>As we look ahead, expect to see more integration of technology, sustainability initiatives, and wellness-focused designs in flexible workspaces. The future of work is flexible, and businesses that adapt early will have a competitive advantage.</p>`,
    author: "Aditi Verma",
    date: "2025-10-25T08:00:00.000Z",
    readMinutes: 6,
    featured: true,
    popularity: 88,
  },
  {
    id: "2",
    title: "5 Tips for Choosing a Virtual Office",
    category: "Tips",
    region: "APAC",
    excerpt: "Key factors to consider when selecting a virtual office to build credibility and keep costs low.",
    hero: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1600",
    content: `<p>Virtual offices can be a powerful tool for businesses looking to establish a professional presence without the overhead of a physical office. Here are the key factors to consider.</p>
    
    <h2>1. Location and Address Prestige</h2>
    <p>Choose a virtual office in a prestigious business district to enhance your company's credibility. A premium address can make a significant difference in how clients perceive your business.</p>
    
    <h2>2. Mail Handling Services</h2>
    <p>Ensure your provider offers reliable mail forwarding and package handling. This is crucial for maintaining professional communication with clients and partners.</p>
    
    <h2>3. Call Answering and Routing</h2>
    <p>Professional call handling services ensure you never miss important business calls. Look for providers that offer personalized greetings and efficient call routing.</p>
    
    <h2>4. Meeting Room Access</h2>
    <p>Even with a virtual office, you'll occasionally need physical meeting spaces. Choose a provider that offers flexible access to professional meeting rooms.</p>
    
    <h2>5. Local Compliance and Registration</h2>
    <p>Verify that the virtual office address can be used for business registration and meets all local regulatory requirements for your industry.</p>`,
    author: "Rohit Nair",
    date: "2025-10-20T08:00:00.000Z",
    readMinutes: 4,
    popularity: 54,
  },
  {
    id: "3",
    title: "Coworking Culture: Building Community",
    category: "Case Studies",
    region: "EMEA",
    excerpt: "How shared workspaces are fostering collaboration and cross-pollination across teams.",
    hero: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1600",
    content: `<p>Community-first programming drives member retention and creates value beyond just desk space. Here are practical strategies and real-world examples.</p>
    
    <h2>The Power of Community</h2>
    <p>Successful coworking spaces understand that they're not just renting desks—they're building communities. Members stay longer and refer more business when they feel connected to their workspace community.</p>
    
    <h2>Event Programming That Works</h2>
    <p>Regular networking events, skill-sharing workshops, and social gatherings help members connect. The most successful spaces host 2-3 events per week, ranging from casual coffee meetups to professional development sessions.</p>
    
    <h2>Case Study: Tech Startup Hub</h2>
    <p>One coworking space in Berlin increased member retention by 40% after implementing a structured community program. They introduced weekly founder lunches, monthly pitch nights, and quarterly industry conferences.</p>
    
    <h2>Creating Collaboration Opportunities</h2>
    <p>Design your space to encourage spontaneous interactions. Common areas, shared kitchens, and collaborative zones naturally bring people together and spark conversations that lead to business opportunities.</p>
    
    <h2>Measuring Community Success</h2>
    <p>Track metrics like event attendance, member referrals, and collaboration projects to gauge the health of your community. Regular surveys help you understand what members value most.</p>`,
    author: "Priya Sharma",
    date: "2025-10-15T08:00:00.000Z",
    readMinutes: 5,
    popularity: 66,
  },
];

// ----------------------
// SEO helper (sets title/meta and injects JSON-LD)
// ----------------------
function useSEO({ title, description, url, article }: { title: string; description: string; url?: string; article?: Post | null }) {
  useEffect(() => {
    if (title) document.title = title;

    // basic meta tags
    const metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (metaDesc) metaDesc.content = description;
    else {
      const m = document.createElement("meta");
      m.name = "description";
      m.content = description;
      document.head.appendChild(m);
    }

    // OpenGraph
    const ogTitle = setOrCreateMeta('property', 'og:title', title);
    const ogDesc = setOrCreateMeta('property', 'og:description', description);
    if (url) setOrCreateMeta('property', 'og:url', url);
    setOrCreateMeta('property', 'og:type', article ? 'article' : 'website');

    // Twitter
    setOrCreateMeta('name', 'twitter:card', 'summary_large_image');
    setOrCreateMeta('name', 'twitter:title', title);
    setOrCreateMeta('name', 'twitter:description', description);

    // JSON-LD article
    if (article) {
      const ld = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.title,
        description: article.excerpt,
        author: { "@type": "Person", name: article.author || "FlashSpace" },
        datePublished: article.date,
        publisher: { "@type": "Organization", name: "FlashSpace", logo: { "@type": "ImageObject", url: "https://flashspace.example/logo.png" } },
      };

      let script = document.getElementById("ld-json") as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement("script");
        script.id = "ld-json";
        script.type = "application/ld+json";
        document.head.appendChild(script);
      }
      script.text = JSON.stringify(ld);
    }

    function setOrCreateMeta(selectorType: 'name' | 'property', selector: string, value: string) {
      const sel = selectorType === 'name' ? `meta[name="${selector}"]` : `meta[property="${selector}"]`;
      let el = document.querySelector(sel) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        if (selectorType === 'name') el.setAttribute('name', selector); else el.setAttribute('property', selector);
        el.content = value;
        document.head.appendChild(el);
      } else {
        el.content = value;
      }
      return el;
    }

  }, [title, description, url, article]);
}

// ----------------------
// FeaturedCategorySlider
// ----------------------
function FeaturedCategorySlider({ categories }: { categories: { title: string; desc: string; img?: string }[] }) {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Featured Categories</h2>
        <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
          {categories.map((c, i) => (
            <div key={i} className="min-w-[260px] bg-white dark:bg-[#1f1f1f] rounded-2xl p-4 shadow-md border border-gray-100 dark:border-white/10 hover:shadow-xl transition-all duration-300">
              <div className="h-40 rounded-lg overflow-hidden mb-3 bg-gray-100 dark:bg-gray-800">
                {c.img ? <img src={c.img} alt={c.title} className="w-full h-full object-cover" /> : null}
              </div>
              <h3 className="font-semibold mb-1 text-gray-900 dark:text-white">{c.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ----------------------
// HomepageBlogSection (3-card grid)
// ----------------------
// ----------------------
// HomepageBlogSection (Premium Grid)
// ----------------------
function HomepageBlogSection({ posts }: { posts: Post[] }) {
  return (
    <section className="bg-slate-50 dark:bg-[#050505] py-24 transition-colors duration-300 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-400/5 rounded-full blur-[100px]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-yellow-500 font-bold tracking-widest uppercase text-sm mb-2 block">Our Analysis</span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">From the <span className="italic text-slate-500 dark:text-slate-400">Blog</span></h2>
          </div>
          <NavLink to="/blog" className="px-8 py-3 rounded-full border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-semibold hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
            View all articles
          </NavLink>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.slice(0, 3).map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10 }}
              className="group flex flex-col bg-white dark:bg-[#111] rounded-[2rem] overflow-hidden border border-slate-200 dark:border-white/5 hover:border-yellow-400 dark:hover:border-yellow-400 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                <img src={p.hero} alt={p.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute top-4 left-4 z-20">
                  <span className="px-3 py-1 rounded-full bg-white/90 dark:bg-black/60 backdrop-blur text-xs font-bold text-slate-900 dark:text-white shadow-sm">
                    {p.category}
                  </span>
                </div>
              </div>
              <div className="p-8 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {new Date(p.date || '').toLocaleDateString()}
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-3 text-slate-900 dark:text-white leading-tight group-hover:text-yellow-500 transition-colors">
                  {p.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-3 leading-relaxed flex-1">{p.excerpt}</p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5 mt-auto">
                  <div className="text-xs font-semibold text-slate-500">By {p.author}</div>
                  <NavLink to={`/blog/${p.id}`} className="text-sm font-bold text-yellow-600 dark:text-yellow-400 flex items-center gap-1 group/link">
                    Read Story <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </NavLink>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ----------------------
// SinglePostPage (Option C) - Full banner hero + split layout
// ----------------------
function SinglePostPageInternal({ posts }: { posts: Post[] }) {
  const params = useParams();
  const id = params['id'] || '';
  const navigate = useNavigate();

  const post = posts.find(p => p.id === id) ?? posts[0];

  // SEO
  useSEO({ title: `${post.title} — FlashBlog`, description: post.excerpt, url: window.location.href, article: post });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 font-sans antialiased">
      <Header />

      {/* HERO BANNER (Immersive) */}
      <header className="relative w-full h-[60vh] min-h-[500px] flex items-end">
        <div className="absolute inset-0 z-0">
          <img src={post.hero} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90" />
        </div>

        <div className="relative z-10 container mx-auto px-6 pb-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm font-bold tracking-wider uppercase text-slate-300">
              <span className="bg-yellow-400 text-black px-3 py-1 rounded-sm">{post.category}</span>
              <span>{new Date(post.date || '').toLocaleDateString()}</span>
              <span className="w-1 h-1 bg-slate-300 rounded-full" />
              <span>{post.readMinutes} min read</span>
            </div>

            <h1 className="text-4xl md:text-6xl md:leading-tight font-bold text-white mb-6 drop-shadow-lg">{post.title}</h1>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-white font-bold text-lg">
                {post.author?.charAt(0)}
              </div>
              <div>
                <div className="text-white font-semibold text-lg">{post.author}</div>
                <div className="text-white/60 text-sm">Author at FlashSpace</div>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* ARTICLE + SIDEBAR */}
      <main className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Article */}
        <article className="lg:col-span-2">
          <div className="bg-white dark:bg-[#1f1f1f] rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 p-8 md:p-12 transition-colors duration-300">
            <style dangerouslySetInnerHTML={{
              __html: `
              .article-content h2 {
                font-size: 1.75rem;
                font-weight: 700;
                margin-top: 2.5rem;
                margin-bottom: 1rem;
                color: #1f2937;
                padding-bottom: 0.5rem;
                border-bottom: 2px solid #ffd400;
              }
              .dark .article-content h2 {
                color: #f3f4f6;
              }
              .article-content p {
                font-size: 1.125rem;
                line-height: 1.8;
                color: #4b5563;
                margin-bottom: 1.5rem;
              }
              .dark .article-content p {
                color: #d1d5db;
              }
              .article-content p:first-of-type {
                font-size: 1.25rem;
                color: #374151;
                font-weight: 500;
              }
              .dark .article-content p:first-of-type {
                color: #e5e7eb;
              }
            ` }} />
            <div className="article-content" dangerouslySetInnerHTML={{ __html: post.content || '<p>No content</p>' }} />
          </div>

          {/* Author card & share CTA */}
          <div className="mt-12 p-6 rounded-2xl bg-white dark:bg-[#1f1f1f] shadow-md border border-gray-100 dark:border-white/10 flex items-center gap-4 text-gray-900 dark:text-gray-100 transition-colors duration-300">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">👤</div>
            <div>
              <div className="font-semibold">{post.author}</div>
              <div className="text-sm text-gray-500">Writer at FlashBlog</div>
            </div>
            <div className="ml-auto flex gap-2">
              <Button className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400">Share</Button>
              <Button variant="outline" className="bg-white dark:bg-transparent dark:border-white/20 dark:text-white dark:hover:bg-white/10">Subscribe</Button>
            </div>
          </div>

        </article>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#1f1f1f] shadow-md border border-gray-100 dark:border-white/10 transition-colors duration-300">
            <h4 className="font-semibold mb-3">Latest Posts</h4>
            <div className="space-y-3">
              {posts.slice(0, 4).map(p => (
                <NavLink key={p.id} to={`/blog/${p.id}`} className="block py-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded text-gray-900 dark:text-gray-100 transition-colors">
                  <div className="text-sm font-medium">{p.title}</div>
                  <div className="text-xs text-gray-500">{p.author} • {new Date(p.date || '').toLocaleDateString()}</div>
                </NavLink>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#1f1f1f] shadow-md border border-gray-100 dark:border-white/10 transition-colors duration-300">
            <h4 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">Table of contents</h4>
            <div className="text-sm text-gray-600">Auto-generated TOC would appear here for long guides.</div>
          </div>

          <div className="p-6 rounded-2xl bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-500/20 transition-colors duration-300">
            <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Need help selecting a workspace?</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">Talk to our experts and get a tailor-made recommendation.</p>
            <NavLink to="/contact"><Button className="bg-black dark:bg-white text-white dark:text-black hover:opacity-90">Contact sales</Button></NavLink>
          </div>

        </aside>
      </main>

      <Footer />
    </div>
  );
}

// ----------------------
// Blog Listing Page (Redesigned Premium)
// ----------------------
export function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 9;

  const categories = useMemo(() => ["All", "Guides", "Case Studies", "News", "Pricing", "Tips"], []);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let list = SAMPLE_POSTS.slice();
    if (selectedCategory !== "All") list = list.filter(p => p.category === selectedCategory);
    if (q) list = list.filter(p => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q));
    // Default newest first
    list.sort((a, b) => +new Date(b.date || 0) - +new Date(a.date || 0));
    return list;
  }, [selectedCategory, searchQuery]);

  const featuredPost = filtered[0];
  const remainingPosts = filtered.slice(1);

  // SEO
  useSEO({ title: "Insights & Stories — FlashSpace", description: "Expert articles on coworking, virtual offices and hybrid strategies.", url: window.location.href, article: null });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white font-sans antialiased transition-colors duration-300">
      <Header />

      {/* PREMIUM HERO (Consistent with Career/About Us) */}
      <section className="relative pt-40 pb-20 overflow-hidden bg-gradient-to-br from-[#FFFBEB] via-white to-[#F0F9FF] dark:from-[#0a0a0a] dark:via-[#111] dark:to-[#1a1a1a]">

        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-yellow-300/10 rounded-full blur-3xl filter -translate-y-1/2 translate-x-1/2 opacity-70 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-blue-500/5 rounded-full blur-3xl filter translate-y-1/2 -translate-x-1/2 opacity-70 pointer-events-none" />

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-block py-1 px-4 rounded-full bg-yellow-400/20 text-yellow-600 dark:text-yellow-400 font-bold tracking-wider text-sm mb-4 border border-yellow-400/20 backdrop-blur-md">
              THE FLASHSPACE BLOG
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-6 leading-tight tracking-tight">
              Insights that <span className="text-yellow-500 dark:text-yellow-400 italic">Inspire.</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              Discover the latest trends in flexible workspaces, productivity hacks, and success stories from our community.
            </p>

            {/* Floating Search Bar */}
            <div className="max-w-2xl mx-auto relative group">
              <div className="absolute inset-0 bg-yellow-400/30 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center bg-white dark:bg-white/10 backdrop-blur-xl border border-slate-200 dark:border-white/20 rounded-full p-2 shadow-2xl">
                <Search className="ml-4 text-slate-400 dark:text-white/50 w-6 h-6" />
                <input
                  type="text"
                  placeholder="Search for articles, guides, or news..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/50 text-lg px-4"
                />
                <Button className="rounded-full bg-yellow-400 text-black hover:bg-yellow-500 font-bold px-8">Search</Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CATEGORY PILLS */}
      <section className="sticky top-20 z-40 py-6 bg-slate-50/80 dark:bg-[#050505]/80 backdrop-blur-md border-b border-slate-200 dark:border-white/5">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2 justify-center">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap ${selectedCategory === cat
                  ? "bg-black dark:bg-white text-white dark:text-black shadow-lg scale-105"
                  : "bg-white dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* BLOG CONTENT */}
      <main className="container mx-auto px-6 py-16">

        {/* Featured Post (Landscape) */}
        {featuredPost && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-16 group relative rounded-[2.5rem] overflow-hidden shadow-2xl bg-white dark:bg-[#111] grid md:grid-cols-2 gap-0 border border-slate-200 dark:border-white/10"
          >
            <div className="relative h-[300px] md:h-[500px] overflow-hidden">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
              <img src={featuredPost.hero} alt={featuredPost.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute top-6 left-6 z-20">
                <span className="px-4 py-1.5 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-black dark:text-white border border-white/20">
                  Featured
                </span>
              </div>
            </div>
            <div className="p-8 md:p-12 flex flex-col justify-center relative">
              <div className="mb-4 flex items-center gap-3 text-sm font-medium text-slate-500 dark:text-slate-400">
                <span className="text-yellow-500 font-bold">{featuredPost.category}</span>
                <span>•</span>
                <span>{new Date(featuredPost.date || '').toLocaleDateString()}</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white leading-tight group-hover:text-yellow-500 transition-colors">
                <NavLink to={`/blog/${featuredPost.id}`}>{featuredPost.title}</NavLink>
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 line-clamp-3 leading-relaxed">
                {featuredPost.excerpt}
              </p>
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-lg font-bold text-slate-700 dark:text-white">
                    {featuredPost.author?.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{featuredPost.author}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{featuredPost.readMinutes} min read</div>
                  </div>
                </div>

                <NavLink to={`/blog/${featuredPost.id}`} className="px-6 py-3 rounded-full bg-yellow-400 text-black font-bold hover:bg-yellow-500 transition-colors shadow-lg hover:shadow-yellow-400/40 flex items-center gap-2">
                  Read Full Story <ChevronRight className="w-4 h-4" />
                </NavLink>
              </div>
            </div>
          </motion.div>
        )}

        {/* Standard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {remainingPosts.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group flex flex-col bg-white dark:bg-[#111] rounded-[2rem] overflow-hidden border border-slate-200 dark:border-white/5 hover:border-yellow-400 dark:hover:border-yellow-400 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="h-64 overflow-hidden relative">
                <img src={post.hero} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-white/90 dark:bg-black/60 backdrop-blur text-xs font-bold text-slate-900 dark:text-white shadow-sm">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-8 flex flex-col flex-1">
                <div className="mb-3 text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-3 h-3" /> {new Date(post.date || '').toLocaleDateString()}
                </div>
                <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white leading-tight group-hover:text-yellow-500 transition-colors">
                  <NavLink to={`/blog/${post.id}`}>{post.title}</NavLink>
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6 line-clamp-3 flex-1">{post.excerpt}</p>

                <div className="border-t border-slate-100 dark:border-white/5 pt-4 flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 flex items-center justify-center text-xs font-bold">
                      {post.author?.charAt(0)}
                    </div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{post.author}</span>
                  </div>
                  <NavLink to={`/blog/${post.id}`} className="text-sm font-bold text-yellow-600 dark:text-yellow-400 hover:underline">Read →</NavLink>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-slate-400">No articles found.</h3>
            <p className="text-slate-500">Try adjusting your search or category.</p>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}

// ----------------------
// Router-friendly exports
// ----------------------
// Export components for your router to mount
export function SinglePostPage(props: { posts?: Post[] }) {
  const posts = props.posts ?? SAMPLE_POSTS;
  return <SinglePostPageInternal posts={posts} />;
}

export default BlogPage;
