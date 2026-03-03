import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { blogPosts, BlogPost as BlogPostType } from "@/data/blogData";
import {
  Share2,
  Clock,
  Check,
  ChevronLeft,
  ChevronRight,
  Twitter,
  Linkedin,
  Facebook,
  Copy,
  Calendar as CalendarIcon,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import MeetingBookingModal from "@/components/ui/MeetingBookingModal";

export const SinglePostPage = () => {
  const { id } = useParams<{ id: string }>();
  const post = blogPosts.find((p) => p.slug === id);
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    setIsSubmitting(false);
    setIsSubscribeOpen(false);
    setEmail("");
    toast({
      title: "Subscribed Successfully!",
      description:
        "You'll now receive our latest articles right in your inbox.",
    });
  };

  const handleShare = async (platform: string) => {
    const url = window.location.href;
    const text = `Check out this article: ${post?.title}`;

    try {
      if (platform === "copy") {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast({
          title: "Link copied!",
          description: "The article link has been copied to your clipboard.",
        });
      } else if (platform === "twitter") {
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
          "_blank",
        );
      } else if (platform === "linkedin") {
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
          "_blank",
        );
      } else if (platform === "facebook") {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          "_blank",
        );
      }
    } catch (err) {
      toast({
        title: "Failed to share",
        description: "Please try sharing the URL manually.",
        variant: "destructive",
      });
    }
  };

  if (!post) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-20 lg:pt-24">
          <div className="container mx-auto px-4 py-24 text-center">
            <h1 className="text-3xl font-medium text-foreground mb-4">
              Post not found
            </h1>
            <Link to="/blog" className="text-primary hover:underline">
              ΓåÉ Back to Blog
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const otherPosts = blogPosts.filter((p) => p.slug !== id);

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Banner */}
        <section className="relative h-[45vh] min-h-[320px] sm:min-h-[380px] lg:min-h-[480px] lg:h-[55vh] overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
          <div className="relative z-10 h-full flex flex-col justify-end pb-6 sm:pb-10 lg:pb-14">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <span className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium uppercase tracking-wide">
                  {post.category}
                </span>
                <span className="text-white/80 text-xs sm:text-sm">
                  {post.date}
                </span>
                <span className="text-white/60 text-xs sm:text-sm">ΓÇó</span>
                <span className="text-white/80 text-xs sm:text-sm">
                  {post.readTime}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-white tracking-tight max-w-3xl mb-4 sm:mb-6">
                {post.title}
              </h1>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-primary backdrop-blur-sm border border-white/20 flex items-center justify-center text-xs sm:text-sm font-medium text-primary-foreground">
                  {post.authorInitial}
                </div>
                <div>
                  <p className="text-white font-medium text-xs sm:text-sm">
                    {post.author}
                  </p>
                  <p className="text-white/60 text-xs">Author at FlashSpace</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content + Sidebar */}
        <section className="py-8 sm:py-12 lg:py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-[1fr_320px] gap-8 lg:gap-14">
              {/* Article Content */}
              <article className="bg-card rounded-lg border border-border p-5 sm:p-8 lg:p-10">
                <p className="text-base lg:text-lg text-muted-foreground leading-relaxed mb-8 sm:mb-10">
                  {post.content.intro}
                </p>
                {post.content.sections.map((section, idx) => (
                  <div key={idx} className="mb-8 sm:mb-10 last:mb-0">
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-medium text-foreground mb-1">
                      {idx + 1}. {section.heading}
                    </h2>
                    <div className="h-0.5 w-full max-w-md bg-transparent mb-3 sm:mb-4" />
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {section.body}
                    </p>
                  </div>
                ))}
              </article>

              {/* Sidebar */}
              <aside className="space-y-5 sm:space-y-6">
                {/* Latest Posts */}
                <div className="bg-card rounded-lg border border-border p-5 sm:p-6">
                  <h3 className="text-base font-medium text-foreground mb-4">
                    Latest Posts
                  </h3>
                  <div className="space-y-4">
                    {blogPosts.map((p) => (
                      <Link
                        key={p.slug}
                        to={`/blog/${p.slug}`}
                        className={`block group ${p.slug === id ? "opacity-60 pointer-events-none" : ""}`}
                      >
                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors leading-snug">
                          {p.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {p.author} ΓÇó {p.date}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Table of Contents */}
                <div className="bg-secondary/40 rounded-lg border border-border p-5 sm:p-6">
                  <h3 className="text-base font-medium text-foreground mb-3">
                    Table of contents
                  </h3>
                  <ul className="space-y-2">
                    {post.content.sections.map((section, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground">
                        {idx + 1}. {section.heading}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Card */}
                <div className="bg-secondary/60 rounded-lg border border-border p-5 sm:p-6">
                  <h3 className="text-base font-medium text-foreground mb-2">
                    Need help selecting a workspace?
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Talk to our experts and get a tailor-made recommendation.
                  </p>
                  <div className="flex flex-col gap-2">
                    <Link to="/start-chatting">
                      <Button variant="hero" size="sm" className="w-full">
                        Start chatting
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-2 border-primary/20 text-foreground hover:bg-primary hover:text-primary-foreground transition-all"
                      onClick={() => setIsMeetingModalOpen(true)}
                    >
                      <CalendarIcon className="w-4 h-4" /> Schedule a meeting
                    </Button>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* Meeting Booking Modal */}
        <MeetingBookingModal
          isOpen={isMeetingModalOpen}
          onClose={() => setIsMeetingModalOpen(false)}
          item={
            { name: "Sales Consultation", address: "Online Meeting" } as any
          }
        />

        {/* Author Footer */}
        <section className="pb-8 sm:pb-12 lg:pb-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="bg-card rounded-lg border border-border p-5 sm:p-6 lg:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-muted flex items-center justify-center text-sm sm:text-base font-medium text-foreground">
                  {post.authorInitial}
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm sm:text-base">
                    {post.author}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Writer at FlashBlog
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="relative inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-secondary to-secondary/80 text-primary text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 active:translate-y-0">
                      <Share2 className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
                      Share
                    </button>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-md bg-card/80 backdrop-blur-xl border border-border/60 shadow-2xl rounded-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-semibold tracking-tight text-center">
                        Share this article
                      </DialogTitle>
                      <DialogDescription className="text-center text-muted-foreground text-sm pt-1">
                        Spread the word or copy the link below.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col gap-6 py-4">
                      {/* Social Buttons */}
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          {
                            name: "Twitter (X)",
                            icon: <Twitter className="w-5 h-5 text-sky-500" />,
                            action: "twitter",
                            hover:
                              "hover:bg-sky-500/10 hover:border-sky-500/30",
                          },
                          {
                            name: "LinkedIn",
                            icon: (
                              <Linkedin className="w-5 h-5 text-blue-600" />
                            ),
                            action: "linkedin",
                            hover:
                              "hover:bg-blue-600/10 hover:border-blue-600/30",
                          },
                          {
                            name: "Facebook",
                            icon: (
                              <Facebook className="w-5 h-5 text-blue-500" />
                            ),
                            action: "facebook",
                            hover:
                              "hover:bg-blue-500/10 hover:border-blue-500/30",
                          },
                        ].map((item) => (
                          <button
                            key={item.name}
                            onClick={() => handleShare(item.action)}
                            className={`group flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border border-border bg-muted/30 backdrop-blur-sm transition-all duration-300 hover:scale-[1.03] ${item.hover}`}
                          >
                            <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-110">
                              {item.icon}
                            </div>
                            <span className="text-xs font-medium text-foreground">
                              {item.name}
                            </span>
                          </button>
                        ))}
                      </div>

                      {/* Copy Link Section */}
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground px-1">
                          Or copy link
                        </label>

                        <div className="flex items-center gap-2 p-2 rounded-xl border border-border bg-muted/40 backdrop-blur-sm transition-all focus-within:ring-2 focus-within:ring-primary/40">
                          <input
                            type="text"
                            readOnly
                            value={window.location.href}
                            className="flex-1 bg-transparent border-none outline-none text-sm text-foreground px-3 font-mono truncate"
                          />

                          <Button
                            size="sm"
                            variant={copied ? "secondary" : "default"}
                            className="h-8 px-4 rounded-lg transition-all duration-300"
                            onClick={() => handleShare("copy")}
                          >
                            {copied ? (
                              <>
                                <Check className="w-3.5 h-3.5 mr-1" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 mr-1" />
                                Copy
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Subscribe Button */}
                {isSubscribeOpen ? (
                  <form
                    onSubmit={handleSubscribe}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="email"
                      required
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-10 px-4 rounded-full border border-border bg-background text-sm text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all w-48"
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center h-10 px-6 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all shadow-sm disabled:opacity-70"
                    >
                      {isSubmitting ? "Wait..." : "Submit"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsSubscribeOpen(false)}
                      className="text-muted-foreground hover:text-foreground text-sm px-2 font-medium"
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setIsSubscribeOpen(true)}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all duration-300 hover:-translate-y-0.5 shadow-sm hover:shadow"
                  >
                    Subscribe
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Back to blog */}
        <section className="pb-8 sm:pb-12">
          <div className="container mx-auto px-4 lg:px-8">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              <ChevronLeft className="w-4 h-4" /> Back to all posts
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

const categories = ["All", "Guides", "Case Studies", "News", "Tips"];

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = blogPosts.filter((post) => {
    const matchesCategory =
      activeCategory === "All" || post.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = filtered.find((p) => p.featured);
  const regularPosts = filtered.filter((p) => !p.featured);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20 lg:pt-24">
        {/* Hero Section */}
        <section className="relative py-16 lg:py-24 bg-background overflow-hidden">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium text-foreground tracking-tight mb-5">
              Insights that{" "}
              <span className="italic" style={{ color: "hsl(var(--chart-4))" }}>
                Inspire.
              </span>
            </h1>
            <p className="text-muted-foreground text-base lg:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              Discover the latest trends in flexible workspaces, productivity
              hacks, and success stories from our community.
            </p>
            <div className="max-w-lg mx-auto">
              <div className="flex items-center bg-card rounded-xl border border-border px-5 py-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for articles, guides, or news..."
                  className="flex-1 bg-transparent border-none outline-none px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
                />
                <Search className="w-5 h-5 text-muted-foreground shrink-0" />
              </div>
            </div>
          </div>
        </section>

        {/* Category Filters */}
        <section className="py-8 border-b border-border">
          <div className="container mx-auto px-4 lg:px-8 flex justify-center gap-3 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Featured Blog Post */}
        {featuredPost && (
          <section className="py-8 lg:py-10">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-0 bg-card rounded-md border border-border overflow-hidden shadow-sm">
                <div className="relative aspect-[4/3] lg:aspect-auto lg:max-h-[420px] overflow-hidden">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-4 left-4 px-4 py-1.5 rounded-full bg-foreground text-background text-xs font-medium uppercase tracking-wide">
                    Featured
                  </span>
                </div>
                <div className="flex flex-col justify-center p-8 lg:p-12">
                  <div className="flex items-center gap-2 text-sm mb-4">
                    <span
                      className="font-medium"
                      style={{ color: "hsl(var(--chart-4))" }}
                    >
                      {featuredPost.category}
                    </span>
                    <span className="text-muted-foreground">ΓÇó</span>
                    <span className="text-muted-foreground">
                      {featuredPost.date}
                    </span>
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-medium text-foreground tracking-tight mb-4">
                    {featuredPost.title}
                  </h2>
                  <p className="text-muted-foreground text-base leading-relaxed mb-8">
                    {featuredPost.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-foreground">
                        {featuredPost.authorInitial}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {featuredPost.author}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {featuredPost.readTime}
                        </p>
                      </div>
                    </div>
                    <Link
                      to={`/blog/${featuredPost.slug}`}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-secondary text-primary text-sm font-medium hover:bg-secondary/80 transition-colors"
                    >
                      Read Full Story
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Blog Post Cards */}
        <section className="py-6 lg:py-8 bg-muted/30">
          <div className="container mx-auto px-4 lg:px-8">
            {regularPosts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularPosts.map((post) => (
                  <div
                    key={post.slug}
                    className="bg-card rounded-md border border-border overflow-hidden shadow-sm flex flex-col h-full hover:shadow-md transition-shadow"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-foreground text-background text-xs font-medium">
                        {post.category}
                      </span>
                    </div>
                    <div className="flex flex-col flex-1 p-6">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                        <span>{post.date}</span>
                      </div>
                      <h3 className="text-lg font-medium text-foreground tracking-tight mb-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
                        {post.description}
                      </p>
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-medium text-primary">
                            {post.authorInitial}
                          </div>
                          <span className="text-sm font-medium text-foreground">
                            {post.author}
                          </span>
                        </div>
                        <Link
                          to={`/blog/${post.slug}`}
                          className="text-sm font-medium hover:underline"
                          style={{ color: "hsl(var(--chart-4))" }}
                        >
                          Read ΓåÆ
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No posts found for this category.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
