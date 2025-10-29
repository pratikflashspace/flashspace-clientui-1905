import React, { useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";

// Minimal scaffolded Blog page: preserves look & feel but simplified structure.

type Post = {
  id: string;
  title: string;
  category: string;
  region: string;
  cities: string[];
  country: string;
  excerpt: string;
  authorName: string;
  date: string; // ISO
  readMinutes: number;
  popularity?: number;
  featured?: boolean;
};

// Sample posts (kept short & similar to previous content)
const SAMPLE_POSTS: Post[] = [
  { id: "1", title: "The Future of Flexible Workspaces", category: "Guides", region: "India", cities: ["Mumbai"], country: "India", excerpt: "Exploring how modern businesses are adapting...", authorName: "Aditi Verma", date: "2025-10-25T08:00:00.000Z", readMinutes: 6, popularity: 80, featured: true },
  { id: "2", title: "5 Tips for Choosing a Virtual Office", category: "Tips", region: "APAC", cities: ["Singapore"], country: "Singapore", excerpt: "Key factors to consider when selecting a virtual office...", authorName: "Rohit Nair", date: "2025-10-20T08:00:00.000Z", readMinutes: 4, popularity: 54 },
  { id: "3", title: "Coworking Culture: Building Community", category: "Case Studies", region: "EMEA", cities: ["London"], country: "UK", excerpt: "How shared workspaces are fostering collaboration...", authorName: "Priya Sharma", date: "2025-10-15T08:00:00.000Z", readMinutes: 5, popularity: 66 },
  { id: "4", title: "Business Setup Guide: Dubai Edition", category: "Guides", region: "EMEA", cities: ["Dubai"], country: "UAE", excerpt: "A guide to establishing presence in Dubai...", authorName: "Nandita Rao", date: "2025-10-10T08:00:00.000Z", readMinutes: 7, popularity: 72 },
  { id: "5", title: "Event Space Trends in 2025", category: "News", region: "APAC", cities: ["Bengaluru"], country: "India", excerpt: "Latest trends shaping event spaces...", authorName: "Rhea Das", date: "2025-10-05T08:00:00.000Z", readMinutes: 3, popularity: 30 },
  { id: "6", title: "Remote Work: The New Normal", category: "Tips", region: "Americas", cities: ["New York"], country: "USA", excerpt: "Understanding the lasting impact of remote work...", authorName: "Laura Kim", date: "2025-10-01T08:00:00.000Z", readMinutes: 5, popularity: 50 },
  // add a few more posts to populate grid
  { id: "7", title: "Warehouse Space Guide: Navi Mumbai vs. Bhiwandi", category: "Guides", region: "India", cities: ["Navi Mumbai","Bhiwandi"], country: "India", excerpt: "Compare logistics access and costs...", authorName: "Karan Mehta", date: "2025-09-18T08:00:00.000Z", readMinutes: 7, popularity: 82 },
  { id: "8", title: "How We Helped a D2C Brand Scale in Delhi NCR", category: "Case Studies", region: "India", cities: ["Gurgaon","Noida"], country: "India", excerpt: "A case study covering inventory placement...", authorName: "Meera Iyer", date: "2025-08-18T08:00:00.000Z", readMinutes: 6, popularity: 71 },
  { id: "9", title: "2025 Pricing Trends: Co-working in APAC", category: "Pricing", region: "APAC", cities: ["Singapore","Bengaluru"], country: "Singapore", excerpt: "An analysis of pricing pressure...", authorName: "Sahil Gupta", date: "2025-07-04T08:00:00.000Z", readMinutes: 8, popularity: 64 },
];

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function formatDate(iso: string) {
  try { return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }); }
  catch { return iso; }
}

export default function Blog(): JSX.Element {
  // minimal state
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  // removed city chips per request
  const [sortBy, setSortBy] = useState<string>('Newest');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const pageSize = 6;

  const categories = useMemo(() => ['All', 'Guides', 'Case Studies', 'News', 'Pricing', 'Tips'], []);
  const regions = useMemo(() => ['All', 'India', 'APAC', 'EMEA', 'Americas'], []);
  // cityOptions removed

  // derived posts
  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let list = SAMPLE_POSTS.slice();
    if (selectedCategory !== 'All') list = list.filter(p => p.category === selectedCategory);
    if (selectedRegion !== 'All') list = list.filter(p => p.region === selectedRegion);
  // city filters removed
    if (q) list = list.filter(p => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q));
    if (sortBy === 'Newest') list.sort((a,b) => +new Date(b.date) - +new Date(a.date));
    if (sortBy === 'Popular') list.sort((a,b) => (b.popularity||0) - (a.popularity||0));
    return list;
  }, [selectedCategory, selectedRegion, searchQuery, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page-1)*pageSize, page*pageSize);

  // city chips removed per request

  // Simple stub components (kept inside file per instructions)
  function Hero() {
    return (
      <section className="pt-32 pb-8 px-4 md:px-6 bg-gradient-to-br bg-[#FFD400] relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-extrabold text-black">FlashBlog: Workspace Insights & Industry Trends</h1>
              <p className="mt-4 text-lg text-gray-800">Expert insights on flexible workspaces, warehousing solutions, and the future of work. Stay updated with the latest trends and practical guides.</p>
              <div className="mt-6 flex gap-3">
                <NavLink to="/spaces"><Button className="bg-black text-white hover:bg-[#b27e02]">Find Your Space</Button></NavLink>
                <NavLink to="/contact"><Button className="bg-black text-white hover:bg-[#b27e02]" variant="outline">Get Updates</Button></NavLink>
              </div>
              
              {/* Newsletter signup in hero */}
              <div className="mt-12 p-6 bg-white rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-2">Subscribe to Our Newsletter</h3>
                <p className="text-sm text-gray-600 mb-4">Get monthly insights on workspace trends and exclusive offers.</p>
                <form onSubmit={(e)=>{ e.preventDefault(); alert('Thank you for subscribing!'); }} className="flex gap-2">
                  <Input aria-label="email" placeholder="Enter your email" className="flex-1 border-[#FFB300]" />
                  <Button type="submit" className="bg-[#FFD400] text-black hover:bg-[#FFB300]">Subscribe</Button>
                </form>
              </div>
            </div>
            
            {/* Featured article preview */}
            {filtered.find(p => p.featured) && (
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute -top-2 -right-2 z-10">
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-[#FFF4CC] text-[#8a4b00]">Featured</span>
                  </div>
                  <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="aspect-[16/10] overflow-hidden">
                      <img src="https://i0.wp.com/microflexspace.com/wp-content/uploads/free-coworking-space-birmingham-ultimate-guide-image.jpg?fit=1536%2C1024&ssl=1" alt="Featured" className="w-full h-full object-cover" />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs px-2 py-1 rounded-full bg-[#FFF4CC] text-[#8a4b00]">
                          {filtered.find(p => p.featured)?.category}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatDate(filtered.find(p => p.featured)?.date || '')}
                        </span>
                      </div>
                      <h2 className="text-xl font-semibold mb-2">{filtered.find(p => p.featured)?.title}</h2>
                      <p className="text-gray-600 text-sm mb-4">{filtered.find(p => p.featured)?.excerpt}</p>
                        <NavLink to={slugify(filtered.find(p => p.featured)?.title || '')}>
                        <Button variant="outline" className="w-full bg-[#FFD400] text-black hover:bg-[#FFB300]">Read Article</Button>
                      </NavLink>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  function FiltersBar() {
    return (
      <section className="px-4 md:px-6 sticky top-16 bg-white z-20 border-b">
        <div className="max-w-7xl mx-auto py-4 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
            <div className="relative w-full sm:w-64">
                <Input 
                value={searchQuery} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setSearchQuery(e.target.value)} 
                placeholder="Search articles..." 
                aria-label="Search articles"
                className="pl-10 bg-[#FFF9E6] border-[#FFB300]" 
              />
              <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            {/* Sort control next to search */}
            <div className="w-full sm:w-48">
              <label className="sr-only">Sort articles</label>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="w-full px-3 py-2 rounded border text-sm bg-[#FFF9E6] border-[#FFB300]"
              >
                <option value="Newest">Sort: Newest First</option>
                <option value="Popular">Sort: Most Popular</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{filtered.length} article{filtered.length !== 1 ? 's' : ''}</span>
              {(selectedCategory !== 'All' || selectedRegion !== 'All' || searchQuery) && (
                <span>• Filtered results</span>
              )}
            </div>

            <div className="flex items-center">
              <Button 
                variant="ghost" 
                onClick={()=>{ 
                  setSelectedCategory('All'); 
                  setSelectedRegion('All'); 
                  setSortBy('Newest'); 
                  setSearchQuery(''); 
                }}
                className="text-sm bg-[#FFD400] text-black hover:bg-[#FFB300]"
              >
                Reset All
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  function FeaturedPost({ post }: { post: Post }) {
    return (
      <section className="px-4 md:px-6">
        <div className="max-w-7xl mx-auto mb-6">
          <article className="rounded-2xl overflow-hidden shadow-sm">
            <div className="aspect-[16/7] bg-gray-100 flex items-center justify-center">Image placeholder</div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs px-2 py-1 rounded-full bg-[#FFF4CC] text-[#8a4b00]">{post.category}</span>
                <span className="text-sm text-gray-500">{formatDate(post.date)}</span>
              </div>
              <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">{post.authorName} · {post.readMinutes} min read</div>
                <NavLink to={slugify(post.title)}><Button className="bg-[#FFD400] text-black hover:bg-[#FFB300]">Read more</Button></NavLink>
              </div>
            </div>
          </article>
        </div>
      </section>
    );
  }

  function PostCard({ post }: { post: Post }) {
    return (
      <article 
        className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200" 
        aria-labelledby={`post-${post.id}`}
      >
        <NavLink to={slugify(post.title)} className="block">
          <div className="aspect-[16/9] rounded-t-xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,212,0,0.06)] to-[rgba(255,179,0,0.06)] group-hover:from-[rgba(255,212,0,0.08)] group-hover:to-[rgba(255,179,0,0.08)] transition-colors duration-200" />
          </div>
          <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#FFF4CC] text-[#8a4b00] font-medium">
                {post.category}
              </span>
              {post.popularity && post.popularity > 70 && (
                <span className="inline-flex items-center text-xs text-[#8a4b00] font-medium">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                  </svg>
                  Trending
                </span>
              )}
            </div>
            <h3 
              id={`post-${post.id}`} 
              className="font-semibold text-lg mb-2 text-gray-900 group-hover:text-[#FFB300] transition-colors line-clamp-2"
            >
              {post.title}
            </h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">
              {post.excerpt}
            </p>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-gray-500">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {post.authorName}
              </div>
              <div className="flex items-center text-gray-500">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(post.date)}
              </div>
            </div>
          </div>
        </NavLink>
      </article>
    );
  }

  function PostsGrid() {
    return (
      <section className="px-4 md:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="w-full lg:w-64 flex-shrink-0">
              <div className="sticky top-32">
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                  <h3 className="font-semibold mb-4">Categories</h3>
                  <div className="space-y-2">
                    {/* Render 'All' first, then the rest of categories */}
                    {categories.includes('All') ? (
                      <>
                        <button
                          key="All"
                          onClick={() => setSelectedCategory('All')}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                              selectedCategory === 'All' ? 'bg-[#FFF4CC] text-[#8a4b00]' : 'hover:bg-gray-50'
                            }`}
                        >
                          All
                        </button>

                        {categories.filter(c => c !== 'All').map(cat => (
                          <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                selectedCategory === cat ? 'bg-[#FFF4CC] text-[#8a4b00]' : 'hover:bg-gray-50'
                              }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </>
                    ) : (
                      categories.map(cat => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            selectedCategory === cat ? 'bg-[#FFF4CC] text-[#8a4b00]' : 'hover:bg-gray-50'
                          }`}
                        >
                          {cat}
                        </button>
                      ))
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                  <h3 className="font-semibold mb-4">Regions</h3>
                  <div className="space-y-2">
                    {regions.map(reg => (
                      <button
                        key={reg}
                        onClick={() => setSelectedRegion(reg)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedRegion === reg 
                            ? 'bg-[#FFF4CC] text-[#8a4b00]' 
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        {reg}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#FFF9E6] to-[#FFF2CC] rounded-xl p-6">
                  <h3 className="font-semibold mb-2">Need Help?</h3>
                  <p className="text-sm text-gray-600 mb-4">Get personalized workspace recommendations from our experts.</p>
                  <NavLink to="/contact">
                    <Button variant="outline" className="w-full bg-[#FFD400] text-black hover:bg-[#FFB300]">Contact Sales</Button>
                  </NavLink>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {visible.map(p => <PostCard key={p.id} post={p} />)}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center gap-2">
                  <button 
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-2 rounded bg-[#FFD400] text-black border"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={p === page ? 'px-3 py-2 rounded bg-[#FFB300] text-black border' : 'px-3 py-2 rounded bg-[#FFD400] text-black border'}
                    >
                      {p}
                    </button>
                  ))}
                  <button 
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-2 rounded bg-[#FFD400] text-black border"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  function Sidebar() {
    return (
      <aside className="px-4 md:px-6 mt-6">
        <div className="max-w-7xl mx-auto">
        </div>
      </aside>
    );
  }

  function Pagination() {
    return (
      <div className="px-4 md:px-6">
        <div className="max-w-7xl mx-auto my-8 flex items-center justify-center gap-3">
            <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="px-3 py-2 rounded bg-white border border-black">Previous</button>
          <div className="text-sm text-gray-600">Page {page} of {totalPages}</div>
          <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} className="px-3 py-2 rounded bg-white border border-black">Next</button>
        </div>
      </div>
    );
  }

  function FooterCTA() {
    return (
      <section className="bg-[#FFD400] text-black py-8 mt-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold">Need space in a new city?</h3>
            <p className="text-sm">Talk to an expert to source offices, warehouses and coworking space.</p>
          </div>
          <div className="flex gap-3">
            <NavLink to="/contact"><Button className="bg-[#FFD400] text-black hover:bg-[#FFB300]">Talk to an Expert</Button></NavLink>
            <NavLink to="/cities"><Button className="bg-[#FFD400] text-black hover:bg-[#FFB300]" variant="outline">Browse Cities</Button></NavLink>
          </div>
        </div>
      </section>
    );
  }

  // featured pick: first featured or newest
  const featured = useMemo(() => SAMPLE_POSTS.find(p=>p.featured) ?? SAMPLE_POSTS[0], []);

  return (
    <div className="min-h-screen bg-white text-foreground">
      <Header />
      <main>
        <Hero />
  <FiltersBar />
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <PostsGrid />
          <Pagination />
        </div>
        <FooterCTA />
      </main>
      <Footer />
    </div>
  );
}
