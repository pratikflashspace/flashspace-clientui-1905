import React, { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

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
function HomepageBlogSection({ posts }: { posts: Post[] }) {
  return (
    <section className="bg-white dark:bg-[#0a0a0a] py-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">From the Blog</h2>
          <NavLink to="/blog" className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">View all articles →</NavLink>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.slice(0, 3).map(p => (
            <motion.article key={p.id} whileHover={{ translateY: -6 }} className="rounded-2xl overflow-hidden shadow-md border border-gray-100 dark:border-white/10 bg-white dark:bg-[#1f1f1f] transition-all duration-300">
              <div className="aspect-[16/9] bg-gray-200 dark:bg-gray-800 overflow-hidden">
                {p.hero ? <img src={p.hero} alt={p.title} className="w-full h-full object-cover" /> : null}
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">{p.category}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{new Date(p.date || '').toLocaleDateString()}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{p.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">{p.excerpt}</p>
                <div className="flex items-center justify-between">
                  <NavLink to={`/blog/${p.id}`} className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline" >Read more →</NavLink>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{p.readMinutes} min read</div>
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

      {/* HERO BANNER */}
      <header className="relative">
        <div className="absolute inset-0">
          <div className="w-full h-[420px] overflow-hidden">
            <img src={post.hero} alt={post.title} className="w-full h-full object-cover brightness-90" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
          </div>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-24">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4" style={{ backgroundColor: ACCENT }}>
              {post.category}
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-white drop-shadow-lg">{post.title}</h1>

            <div className="mt-4 flex items-center gap-4 text-sm text-gray-200">
              <div>{post.author}</div>
              <div>•</div>
              <div>{new Date(post.date || '').toLocaleDateString()}</div>
              <div>•</div>
              <div>{post.readMinutes} min read</div>
            </div>

            <div className="mt-6">
              <Button onClick={() => navigate('/blog')} className="bg-white text-black rounded-xl hover:bg-gray-200 transition-colors">Back to articles</Button>
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
// Blog Listing Page (redesigned, Option B hero already applied earlier but adapted)
// ----------------------
export function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Newest");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const categories = useMemo(() => ["All", "Guides", "Case Studies", "News", "Pricing", "Tips"], []);
  const regions = useMemo(() => ["All", "India", "APAC", "EMEA", "Americas"], []);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let list = SAMPLE_POSTS.slice();
    if (selectedCategory !== "All") list = list.filter(p => p.category === selectedCategory);
    if (selectedRegion !== "All") list = list.filter(p => p.region === selectedRegion);
    if (q) list = list.filter(p => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q));
    if (sortBy === "Newest") list.sort((a, b) => +new Date(b.date || 0) - +new Date(a.date || 0));
    if (sortBy === "Popular") list.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    return list;
  }, [selectedCategory, selectedRegion, searchQuery, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

  // SEO for listing
  useSEO({ title: "Blog — FlashBlog", description: "Insights on flexible workspaces, virtual offices and hybrid strategies.", url: window.location.href, article: null });

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 font-sans antialiased transition-colors duration-300">
      <Header />

      {/* HERO */}
      <section className="relative bg-gradient-to-b from-white to-gray-50 dark:from-[#0a0a0a] dark:to-[#1a1a1a] pt-32 pb-20 transition-colors duration-300">
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-100 dark:bg-yellow-700/10 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-200 dark:bg-yellow-600/10 rounded-full blur-3xl opacity-20" />

        <div className="relative max-w-4xl mx-auto text-center px-6">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-block px-4 py-2 mb-5 rounded-full text-sm font-semibold" style={{ backgroundColor: ACCENT }}>
              📚 FlashBlog
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 dark:text-white leading-tight">Insights, Stories & Guides</h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Explore expert articles on coworking, virtual offices, hybrid work, leasing & more.</p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-16 bg-white dark:bg-[#0a0a0a]/95 backdrop-blur-sm z-30 shadow-sm border-b dark:border-white/10 py-4 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap gap-4 items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search articles..." className="pl-10 bg-white dark:bg-black/50 border-gray-300 dark:border-white/20 rounded-xl dark:text-white dark:placeholder:text-gray-500 focus:border-yellow-400 dark:focus:border-yellow-400" />
            <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="px-4 py-2 rounded-xl border bg-white dark:bg-black/80 border-gray-300 dark:border-white/20 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400">
            <option value="Newest">Newest First</option>
            <option value="Popular">Most Popular</option>
          </select>

          <Button onClick={() => { setSelectedCategory("All"); setSelectedRegion("All"); setSortBy("Newest"); setSearchQuery(""); }} className="bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">Reset</Button>
        </div>
      </section>

      {/* Main grid */}
      <main className="py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-[#1f1f1f] shadow-md border border-gray-100 dark:border-white/10 transition-colors duration-300">
              <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Categories</h3>
              <div className="space-y-2">
                {categories.map(cat => (
                  <button key={cat} className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedCategory === cat ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" : "hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300"}`} onClick={() => setSelectedCategory(cat)}>{cat}</button>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#1f1f1f] shadow-md border border-gray-100 dark:border-white/10 transition-colors duration-300">
              <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Regions</h3>
              <div className="space-y-2">
                {regions.map(r => (
                  <button key={r} className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedRegion === r ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" : "hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300"}`} onClick={() => setSelectedRegion(r)}>{r}</button>
                ))}
              </div>
            </div>

          </aside>

          {/* Posts grid */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.slice(0, 12).map(p => (
              <motion.article key={p.id} whileHover={{ translateY: -6 }} className="rounded-2xl overflow-hidden shadow-md border border-gray-100 dark:border-white/10 bg-white dark:bg-[#1f1f1f] flex flex-col transition-colors duration-300">
                <div className="aspect-[16/9] bg-gray-200 dark:bg-gray-800 overflow-hidden">
                  {p.hero ? <img src={p.hero} alt={p.title} className="w-full h-full object-cover" /> : null}
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">{p.category}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{new Date(p.date || '').toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{p.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">{p.excerpt}</p>
                  <div className="mt-auto pt-4 border-t border-gray-100 dark:border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-sm font-semibold text-yellow-800">{p.author?.charAt(0) || 'F'}</div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{p.author || 'FlashSpace Team'}</span>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{p.readMinutes} min read</div>
                    </div>
                    <NavLink to={`/blog/${p.id}`} className="block w-full text-center py-2 px-4 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg text-sm font-semibold transition-colors text-gray-900 dark:text-white">Read Article →</NavLink>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </main>

      {/* Featured Category Slider */}
      <FeaturedCategorySlider categories={[
        { title: 'Guides', desc: 'Practical how-to guides for workspace managers.', img: SAMPLE_POSTS[0].hero },
        { title: 'Tips', desc: 'Quick operational tips and checklists.', img: SAMPLE_POSTS[1].hero },
        { title: 'Case Studies', desc: 'Real stories from businesses using flexible spaces.', img: SAMPLE_POSTS[2].hero },
      ]} />

      {/* Homepage small blog section */}
      <HomepageBlogSection posts={SAMPLE_POSTS} />

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
