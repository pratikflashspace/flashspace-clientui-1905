import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { format } from "date-fns";
import { ArrowLeft, User, Calendar, Tag } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { API_BASE_URL } from "@/config/api.config";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/react/style.css";

const getImageUrl = (url?: string) => {
  if (!url) return "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const baseUrl = API_BASE_URL.replace(/\/api$/, "").replace(/\/$/, "");
  return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
};

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editor, setEditor] = useState<BlockNoteEditor | null>(null);

  // Sidebar Contact Form State
  const [contactState, setContactState] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    message: "",
  });
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactError, setContactError] = useState("");

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactLoading(true);
    setContactError("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/leads`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-flashspace-csrf": "true"
        },
        body: JSON.stringify({
          name: contactState.fullName,
          email: contactState.email,
          phone: contactState.phone,
          message: contactState.message,
          source: "Blog Contact Form",
          page: "Blog Page",
          businessType: "Blog Enquiry"
        }),
      });
      const data = await res.json();
      if (res.ok && data) {
        setContactSuccess(true);
        setContactState({ fullName: "", email: "", phone: "", city: "", message: "" });
      } else {
        setContactError(data?.message || "Submission failed. Please try again.");
      }
    } catch (err) {
      setContactError("Something went wrong. Please try again.");
    } finally {
      setContactLoading(false);
    }
  };

  const [recentBlogs, setRecentBlogs] = useState<any[]>([]);

  useEffect(() => {
    fetchBlog();
    fetchRecentBlogs();
  }, [slug]);

  const fetchRecentBlogs = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/blogs`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        const filtered = data.data.filter((b: any) => b.slug !== slug).slice(0, 5);
        setRecentBlogs(filtered);
      }
    } catch (err) {
      console.error("Failed to fetch recent blogs", err);
    }
  };

  const fetchBlog = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/blogs/${slug}`);
      const data = await response.json();
      if (data.success) {
        setBlog(data.data);
        
        // Initialize read-only editor with blog content
        if (data.data.content) {
          try {
            let parsed = JSON.parse(data.data.content);
            if (Array.isArray(parsed) && parsed.length > 0) {
              // Filter out duplicate title block at the top if present
              if (
                parsed[0]?.type === "heading" &&
                (parsed[0]?.props?.level === 1 ||
                  parsed[0]?.content?.[0]?.text?.trim()?.toLowerCase() === data.data.title?.trim()?.toLowerCase())
              ) {
                parsed = parsed.slice(1);
              }

              // Unconditionally apply links to all keywords in the text
              const keywordReplacements = [
                {
                  regex: /(coworking(?:\s+spaces?|\s+workspaces?)?)/i,
                  route: "/services/coworking-space",
                },
                {
                  regex: /(virtual\s+office(?:s)?)/i,
                  route: "/services/virtual-office",
                },
                {
                  regex: /(gst\s+registration|company\s+registration|msme\s+registration|startup\s+india\s+registration|gst\s+filing|llp\s+compliance|mca\s+compliance|fssai\s+registration|section\s+8\s+registration)/i,
                  route: "/services/business-setup",
                }
              ];

              const transformInlineContent = (initialArray: any[]) => {
                if (!Array.isArray(initialArray)) return initialArray;
                
                let currentArray = [...initialArray];

                keywordReplacements.forEach(({ regex, route }) => {
                  const nextArray: any[] = [];
                  const strictRegex = new RegExp(`^${regex.source}$`, "i");

                  currentArray.forEach((item) => {
                    if (item.type === "text" && item.text) {
                      const text = item.text;
                      if (regex.test(text)) {
                        const parts = text.split(regex);
                        parts.forEach((part: string) => {
                          if (strictRegex.test(part)) {
                            nextArray.push({
                              type: "link",
                              href: route,
                              content: [
                                {
                                  type: "text",
                                  text: part,
                                  styles: {
                                    ...item.styles,
                                    textColor: "#334d3d",
                                    bold: true,
                                  },
                                },
                              ],
                            });
                          } else if (part) {
                            nextArray.push({ ...item, text: part });
                          }
                        });
                      } else {
                        nextArray.push(item);
                      }
                    } else {
                      nextArray.push(item);
                    }
                  });
                  currentArray = nextArray;
                });

                return currentArray;
              };

              const initialContent: any[] = [];
              let sectionHeaderCount = 0;
              let coverImageInserted = false;
              const coverImgUrl = getImageUrl(data.data.bannerImage || data.data.coverImage);

              parsed.forEach((b: any, idx: number) => {
                let blockType = b.type;
                let props = b.props || {};
                let content = b.content;

                // Get combined text of block
                const textContent = Array.isArray(b.content)
                  ? b.content.map((c: any) => c.text || "").join("").trim()
                  : "";

                // 1. Detect "Frequently Asked Questions" main section heading
                const isFaqMainHeader = /^frequently\s+asked\s+questions/i.test(textContent);
                if (isFaqMainHeader) {
                  blockType = "heading";
                  props = { ...props, level: 2 };
                }

                const isHeadingBlock = (blockType === "heading" || isFaqMainHeader) && (props.level === 2 || !props.level);

                if (isHeadingBlock) {
                  sectionHeaderCount++;
                  // Insert cover image after Section 1 content (right before Section 2 heading)
                  if (sectionHeaderCount === 2 && !coverImageInserted && coverImgUrl) {
                    initialContent.push({
                      id: `cover-img-${Date.now()}`,
                      type: "image",
                      props: {
                        url: coverImgUrl,
                        name: data.data.title,
                      },
                    });
                    coverImageInserted = true;
                  }

                  if (initialContent.length > 0) {
                    initialContent.push({
                      id: `divider-${Date.now()}-${idx}`,
                      type: "divider",
                      props: {},
                    });
                  }
                }

                // 2. Detect FAQ Questions: "Q - ...", "Q: ...", "Q1 - ...", or ending with "?"
                const isFaqQuestion =
                  !isFaqMainHeader &&
                  (
                    /^(Q\s*[-:\.]|Q\d+\s*[-:\.]|\d+[\.\)]\s*Q)/i.test(textContent) ||
                    (textContent.endsWith("?") && textContent.length < 180)
                  );

                if (isFaqQuestion) {
                  // Insert a blank spacer before a new question for breathing room (if not the first block)
                  if (initialContent.length > 0) {
                    initialContent.push({
                      id: `spacer-${Date.now()}-${idx}`,
                      type: "paragraph",
                      props: {},
                      content: [],
                    });
                  }
                  blockType = "paragraph";
                  props = { ...props };
                  const match = textContent.match(/^(Q\d*\s*[-:\.]|\d+[\.\)]\s*Q\s*[-:\.]?)\s*/i);
                  if (match && Array.isArray(content)) {
                    const prefix = match[0].trim();
                    const restText = textContent.slice(match[0].length).trim();
                    content = [
                      {
                        type: "text",
                        text: `${prefix} `,
                        styles: { bold: true, textColor: "#000000" },
                      },
                      {
                        type: "text",
                        text: restText,
                        styles: { bold: true, textColor: "#000000" },
                      },
                    ];
                  } else if (Array.isArray(content)) {
                    content = content.map((c: any) => ({
                      ...c,
                      styles: { ...c.styles, bold: true, textColor: "#000000" }
                    }));
                  }
                }

                // 3. Detect Answers starting with "Ans - ", "Ans:", "A - ", "A:"
                const isFaqAnswer = /^(Ans\s*[-:\.]|A\s*[-:\.]|\d+[\.\)]\s*Ans)/i.test(textContent);
                if (isFaqAnswer && Array.isArray(content)) {
                  blockType = "paragraph";
                  props = { ...props };
                  const fullText = textContent;
                  const match = fullText.match(/^(Ans\s*[-:\.]|A\s*[-:\.]|\d+[\.\)]\s*Ans\s*[-:\.]?)\s*/i);
                  if (match) {
                    const prefix = match[0].trim();
                    const restText = fullText.slice(match[0].length).trim();
                    content = [
                      {
                        type: "text",
                        text: `${prefix} `,
                        styles: { bold: true, textColor: "#000000" },
                      },
                      {
                        type: "text",
                        text: restText,
                        styles: { bold: false },
                      },
                    ];
                  }
                }

                const isParagraph = blockType === "paragraph";
                const isHeading = blockType === "heading";
                initialContent.push({
                  ...b,
                  type: blockType,
                  props,
                  id: b?.id || `block-${Date.now()}-${idx}`,
                  content: (isParagraph || isHeading) && Array.isArray(content) ? transformInlineContent(content) : content,
                });
              });

              // Fallback: If cover image wasn't inserted, insert it after 3rd block
              if (!coverImageInserted && coverImgUrl && initialContent.length > 0) {
                const insertIdx = Math.min(3, initialContent.length);
                initialContent.splice(insertIdx, 0, {
                  id: `cover-img-${Date.now()}`,
                  type: "image",
                  props: {
                    url: coverImgUrl,
                    name: data.data.title,
                  },
                });
              }

              const newEditor = BlockNoteEditor.create({ initialContent });
              setEditor(newEditor);
            }
          } catch (e) {
            console.error("Failed to parse blog content blocks", e);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching blog:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#334d3d]"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen pt-24 flex flex-col justify-center items-center px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Blog Post Not Found</h2>
        <p className="text-gray-600 mb-8">The article you're looking for doesn't exist or has been removed.</p>
        <Link to="/blogs" className="px-6 py-3 bg-[#334d3d] text-[#FEF8C3] rounded-lg font-semibold hover:bg-[#1a2d1d] transition-colors">
          Back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="print:hidden">
        <Header forceWhiteBackground />
      </div>
      <div className="min-h-screen bg-white pt-20 pb-20 font-['Inter'] print:pt-0 print:pb-0">
        {/* Top Header Info Banner (Light thin double border lines design) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2 mb-6 print:hidden">
          <div className="border-t-2 border-b-2 border-double border-gray-200/90 py-5 text-left">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 font-['Inter'] leading-relaxed">
              Flashspace Blog: Virtual Offices, Business Addresses &amp; Compliance in India
            </h2>
          </div>
        </div>

        {/* 2-Column Grid Container: Article on Left, Contact Form on Right of Vertical Divider */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 print:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 print:block">
            {/* Left Column: Article content bounded by thin vertical right divider */}
            <div className="lg:col-span-8 border-r-0 lg:border-r border-gray-200 lg:pr-8 -mt-6 pt-4 print:border-none print:w-full print:pr-0 print:mt-0">
              {/* Breadcrumb Header */}
              <div className="mb-6 mt-2">
                <nav className="text-sm font-normal text-gray-500 flex items-center gap-2">
                  <Link to="/blogs" className="text-[#334d3d] font-semibold hover:underline transition-colors">
                    Blogs
                  </Link>
                  <span>/</span>
                  <span className="text-gray-600 font-normal line-clamp-1">{blog.title}</span>
                </nav>
              </div>

              {/* Header (Title, Category, Date) */}
              <div className="mb-8 text-left">
                <h1 className="text-2xl md:text-3xl font-semibold text-black leading-tight mb-4 font-['Inter']">
                  {blog.title}
                </h1>
                
                <div className="flex items-center gap-3 text-sm font-medium">
                  <span className="inline-block bg-[#334d3d] text-[#FEF8C3] font-bold px-4 py-1.5 rounded-full text-xs sm:text-sm">
                    {blog.category}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-500">
                    {format(new Date(blog.createdAt), "MMMM dd, yyyy")}
                  </span>
                </div>
              </div>

              {/* Content (with Cover Image rendered after first section) */}

              {/* Content */}
              <div className="w-full font-['Inter',sans-serif]" style={{ fontFamily: "Inter, sans-serif" }}>
                <div 
                  className="prose prose-lg prose-green max-w-none font-['Inter',sans-serif] [&_*]:!font-['Inter',sans-serif] [&_h1]:!text-black [&_h1]:!font-semibold [&_h2]:!text-black [&_h2]:!font-semibold [&_h2]:!text-xl md:[&_h2]:!text-2xl [&_h2]:!mt-3 [&_h2]:!mb-3 [&_h3]:!text-black [&_h3]:!font-semibold [&_h3]:!text-lg [&_h4]:!text-black [&_h4]:!font-semibold [&_h5]:!text-black [&_h5]:!font-semibold [&_h6]:!text-black [&_h6]:!font-semibold [&_a]:!text-[#334d3d] [&_a]:!font-bold [&_a]:!underline [&_a]:!decoration-gray-300 [&_a]:!underline-offset-4 hover:[&_a]:!decoration-[#334d3d] [&_hr]:!my-4 [&_hr]:!border-gray-200/80 [&_.bn-block-outer[data-content-type=divider]]:!my-4 [&_.bn-block-outer[data-content-type=divider]_div]:!border-gray-200/80 [&_.bn-block-outer[data-content-type=divider]_hr]:!border-gray-200/80 [&_.bn-block-outer[data-content-type=image]]:!mt-4 [&_[data-content-type=image]]:!mt-4 [&_.bn-visual-media-wrapper]:!mt-4 [&_.bn-file-block-content-wrapper]:!mt-4 [&_img]:!mt-4 [&_img]:!mb-6 [&_img]:!rounded-2xl [&_img]:!shadow-md [&_img]:!pointer-events-none [&_.bn-block-content[data-content-type=paragraph]]:has(span):!pl-[3.5rem] [&_.bn-block-content[data-content-type=paragraph]]:has(span):!-indent-[3.5rem] [&_.bn-container]:!px-0 [&_.bn-editor]:!px-0 [&_.bn-block-group]:!px-0 [&_.bn-block-content]:!px-0"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {editor ? (
                    <BlockNoteView editor={editor} editable={false} theme="light" />
                  ) : (
                    <p className="text-gray-500 italic">Loading content...</p>
                  )}
                </div>

                {/* Download Blog Button */}
                <div className="mt-12 pt-8 border-t border-gray-100 print:hidden">
                  <button
                    onClick={() => {
                      document.title = `${blog.title} - Flashspace`;
                      window.print();
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-[#334d3d] text-[#FEF8C3] rounded-lg font-bold hover:bg-[#1a2d1d] transition-colors shadow-sm"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Download Blog
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Sidebar Contact Form, More Blogs For You & Categories */}
            <div className="lg:col-span-4 -mt-6 pt-4 print:hidden">
              {/* Contact Form */}
              <div className="bg-white p-2">
                <h3 className="text-xl font-bold text-[#1a2d1d] mb-4 font-['Inter']">Get Expert Advice</h3>

                {contactSuccess ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm text-center">
                    <p className="font-semibold text-emerald-900 mb-1">Enquiry Submitted!</p>
                    <p className="text-xs">Our experts will get back to you shortly.</p>
                    <button
                      onClick={() => setContactSuccess(false)}
                      className="mt-3 text-xs font-semibold text-[#334d3d] underline hover:text-[#1a2d1d]"
                    >
                      Submit Another Request
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div>
                      <input
                        type="text"
                        required
                        placeholder="Your Name"
                        value={contactState.fullName}
                        onChange={(e) => setContactState({ ...contactState, fullName: e.target.value })}
                        className="w-full px-4 py-3.5 bg-[#f4f4f4] border border-gray-200/80 rounded-md text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:bg-white focus:border-gray-400 transition-all font-['Inter']"
                      />
                    </div>

                    <div>
                      <input
                        type="email"
                        required
                        placeholder="Email"
                        value={contactState.email}
                        onChange={(e) => setContactState({ ...contactState, email: e.target.value })}
                        className="w-full px-4 py-3.5 bg-[#f4f4f4] border border-gray-200/80 rounded-md text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:bg-white focus:border-gray-400 transition-all font-['Inter']"
                      />
                    </div>

                    <div>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        pattern="[0-9]{10}"
                        title="Please enter a valid 10-digit mobile number"
                        placeholder="Phone"
                        value={contactState.phone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          setContactState({ ...contactState, phone: val });
                        }}
                        className="w-full px-4 py-3.5 bg-[#f4f4f4] border border-gray-200/80 rounded-md text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:bg-white focus:border-gray-400 transition-all font-['Inter']"
                      />
                    </div>

                    <div>
                      <textarea
                        rows={3}
                        placeholder="Additional Details"
                        value={contactState.message}
                        onChange={(e) => setContactState({ ...contactState, message: e.target.value })}
                        className="w-full px-4 py-3.5 bg-[#f4f4f4] border border-gray-200/80 rounded-md text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:bg-white focus:border-gray-400 transition-all font-['Inter']"
                      />
                    </div>

                    {contactError && (
                      <p className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">{contactError}</p>
                    )}

                    <button
                      type="submit"
                      disabled={contactLoading}
                      className="w-full py-3.5 px-4 bg-[#334d3d] hover:bg-[#1a2d1d] text-[#FEF8C3] font-bold text-sm rounded-md transition-colors shadow-sm disabled:opacity-50"
                    >
                      {contactLoading ? "Sending..." : "Submit Enquiry"}
                    </button>
                  </form>
                )}
              </div>

              {/* More Blogs For You Section */}
              {recentBlogs.length > 0 && (
                <div className="mt-10 pt-8 border-t border-gray-200">
                  <h3 className="text-xl font-bold text-[#1a2d1d] mb-4 font-['Inter']">
                    More Blogs For You
                  </h3>
                  <div className="space-y-4">
                    {recentBlogs.map((rBlog) => (
                      <Link
                        key={rBlog._id || rBlog.slug}
                        to={`/blogs/${rBlog.slug}`}
                        className="group block p-4 bg-gray-50 hover:bg-[#334d3d]/5 rounded-xl border border-gray-200/70 hover:border-[#334d3d]/30 transition-all shadow-2xs"
                      >
                        <span className="inline-block text-[11px] font-bold text-[#334d3d] uppercase tracking-wider mb-1">
                          {rBlog.category || "Insight"}
                        </span>
                        <h4 className="text-sm font-semibold text-gray-900 group-hover:text-[#334d3d] transition-colors line-clamp-2 leading-snug font-['Inter']">
                          {rBlog.title}
                        </h4>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Sticky Category Quick Links Section */}
              <div className="sticky top-24 mt-10 pt-8 border-t border-gray-200 bg-white space-y-8">
                {/* 1. Virtual Offices Section */}
                <div>
                  <h3 className="text-xl font-bold text-[#1a2d1d] mb-4 font-['Inter']">
                    Virtual Offices
                  </h3>
                  <div className="space-y-3 font-['Inter']">
                    <Link
                      to="/services/virtual-office/delhi"
                      className="group block p-3.5 bg-gray-50 hover:bg-[#334d3d]/5 rounded-xl border border-gray-200/70 hover:border-[#334d3d]/30 transition-all"
                    >
                      <span className="inline-block text-[11px] font-bold text-[#334d3d] uppercase tracking-wider mb-0.5">
                        Delhi
                      </span>
                      <h4 className="text-sm font-semibold text-gray-900 group-hover:text-[#334d3d] transition-colors leading-snug">
                        Delhi Virtual Office
                      </h4>
                    </Link>

                    <Link
                      to="/services/virtual-office/gurgaon"
                      className="group block p-3.5 bg-gray-50 hover:bg-[#334d3d]/5 rounded-xl border border-gray-200/70 hover:border-[#334d3d]/30 transition-all"
                    >
                      <span className="inline-block text-[11px] font-bold text-[#334d3d] uppercase tracking-wider mb-0.5">
                        Haryana
                      </span>
                      <h4 className="text-sm font-semibold text-gray-900 group-hover:text-[#334d3d] transition-colors leading-snug">
                        Gurgaon Virtual Office
                      </h4>
                    </Link>

                    <Link
                      to="/services/virtual-office/noida"
                      className="group block p-3.5 bg-gray-50 hover:bg-[#334d3d]/5 rounded-xl border border-gray-200/70 hover:border-[#334d3d]/30 transition-all"
                    >
                      <span className="inline-block text-[11px] font-bold text-[#334d3d] uppercase tracking-wider mb-0.5">
                        Uttar Pradesh
                      </span>
                      <h4 className="text-sm font-semibold text-gray-900 group-hover:text-[#334d3d] transition-colors leading-snug">
                        Noida Virtual Office
                      </h4>
                    </Link>

                    <Link
                      to="/services/virtual-office/mumbai"
                      className="group block p-3.5 bg-gray-50 hover:bg-[#334d3d]/5 rounded-xl border border-gray-200/70 hover:border-[#334d3d]/30 transition-all"
                    >
                      <span className="inline-block text-[11px] font-bold text-[#334d3d] uppercase tracking-wider mb-0.5">
                        Maharashtra
                      </span>
                      <h4 className="text-sm font-semibold text-gray-900 group-hover:text-[#334d3d] transition-colors leading-snug">
                        Mumbai Virtual Office
                      </h4>
                    </Link>

                    <Link
                      to="/services/virtual-office/bangalore"
                      className="group block p-3.5 bg-gray-50 hover:bg-[#334d3d]/5 rounded-xl border border-gray-200/70 hover:border-[#334d3d]/30 transition-all"
                    >
                      <span className="inline-block text-[11px] font-bold text-[#334d3d] uppercase tracking-wider mb-0.5">
                        Karnataka
                      </span>
                      <h4 className="text-sm font-semibold text-gray-900 group-hover:text-[#334d3d] transition-colors leading-snug">
                        Bangalore Virtual Office
                      </h4>
                    </Link>

                    <Link
                      to="/services/virtual-office/chennai"
                      className="group block p-3.5 bg-gray-50 hover:bg-[#334d3d]/5 rounded-xl border border-gray-200/70 hover:border-[#334d3d]/30 transition-all"
                    >
                      <span className="inline-block text-[11px] font-bold text-[#334d3d] uppercase tracking-wider mb-0.5">
                        Tamil Nadu
                      </span>
                      <h4 className="text-sm font-semibold text-gray-900 group-hover:text-[#334d3d] transition-colors leading-snug">
                        Chennai Virtual Office
                      </h4>
                    </Link>
                  </div>
                </div>

                {/* 2. Business Setup & Registration Section */}
                <div>
                  <h3 className="text-xl font-bold text-[#1a2d1d] mb-4 font-['Inter']">
                    Business Setup &amp; Registration
                  </h3>
                  <div className="space-y-3 font-['Inter']">
                    <Link
                      to="/services/business-setup"
                      className="group block p-3.5 bg-gray-50 hover:bg-[#334d3d]/5 rounded-xl border border-gray-200/70 hover:border-[#334d3d]/30 transition-all"
                    >
                      <span className="inline-block text-[11px] font-bold text-[#334d3d] uppercase tracking-wider mb-0.5">
                        Compliance
                      </span>
                      <h4 className="text-sm font-semibold text-gray-900 group-hover:text-[#334d3d] transition-colors leading-snug">
                        GST Registration Address
                      </h4>
                    </Link>

                    <Link
                      to="/services/business-setup"
                      className="group block p-3.5 bg-gray-50 hover:bg-[#334d3d]/5 rounded-xl border border-gray-200/70 hover:border-[#334d3d]/30 transition-all"
                    >
                      <span className="inline-block text-[11px] font-bold text-[#334d3d] uppercase tracking-wider mb-0.5">
                        Registration
                      </span>
                      <h4 className="text-sm font-semibold text-gray-900 group-hover:text-[#334d3d] transition-colors leading-snug">
                        Company &amp; Business Registration
                      </h4>
                    </Link>

                    <Link
                      to="/services/business-setup"
                      className="group block p-3.5 bg-gray-50 hover:bg-[#334d3d]/5 rounded-xl border border-gray-200/70 hover:border-[#334d3d]/30 transition-all"
                    >
                      <span className="inline-block text-[11px] font-bold text-[#334d3d] uppercase tracking-wider mb-0.5">
                        Mailing Address
                      </span>
                      <h4 className="text-sm font-semibold text-gray-900 group-hover:text-[#334d3d] transition-colors leading-snug">
                        Mailing &amp; Courier Handling Address
                      </h4>
                    </Link>
                  </div>
                </div>

                  {/* 3. Co-Working Spaces Section */}
                  <div>
                    <h3 className="text-xl font-bold text-[#1a2d1d] mb-4 font-['Inter']">
                      Co-Working Spaces
                    </h3>
                    <div className="space-y-3 font-['Inter']">
                      <Link
                        to="/services/coworking-space/gurgaon"
                        className="group block p-3.5 bg-gray-50 hover:bg-[#334d3d]/5 rounded-xl border border-gray-200/70 hover:border-[#334d3d]/30 transition-all"
                      >
                        <span className="inline-block text-[11px] font-bold text-[#334d3d] uppercase tracking-wider mb-0.5">
                          Gurgaon
                        </span>
                        <h4 className="text-sm font-semibold text-gray-900 group-hover:text-[#334d3d] transition-colors leading-snug">
                          Gurgaon Coworking Spaces
                        </h4>
                      </Link>

                      <Link
                        to="/services/coworking-space/delhi"
                        className="group block p-3.5 bg-gray-50 hover:bg-[#334d3d]/5 rounded-xl border border-gray-200/70 hover:border-[#334d3d]/30 transition-all"
                      >
                        <span className="inline-block text-[11px] font-bold text-[#334d3d] uppercase tracking-wider mb-0.5">
                          Delhi
                        </span>
                        <h4 className="text-sm font-semibold text-gray-900 group-hover:text-[#334d3d] transition-colors leading-snug">
                          Delhi Coworking Spaces
                        </h4>
                      </Link>

                      <Link
                        to="/services/coworking-space/noida"
                        className="group block p-3.5 bg-gray-50 hover:bg-[#334d3d]/5 rounded-xl border border-gray-200/70 hover:border-[#334d3d]/30 transition-all"
                      >
                        <span className="inline-block text-[11px] font-bold text-[#334d3d] uppercase tracking-wider mb-0.5">
                          Noida
                        </span>
                        <h4 className="text-sm font-semibold text-gray-900 group-hover:text-[#334d3d] transition-colors leading-snug">
                          Noida Coworking Spaces
                        </h4>
                      </Link>

                      <Link
                        to="/services/coworking-space/mumbai"
                        className="group block p-3.5 bg-gray-50 hover:bg-[#334d3d]/5 rounded-xl border border-gray-200/70 hover:border-[#334d3d]/30 transition-all"
                      >
                        <span className="inline-block text-[11px] font-bold text-[#334d3d] uppercase tracking-wider mb-0.5">
                          Mumbai
                        </span>
                        <h4 className="text-sm font-semibold text-gray-900 group-hover:text-[#334d3d] transition-colors leading-snug">
                          Mumbai Coworking Spaces
                        </h4>
                      </Link>

                      <Link
                        to="/services/coworking-space/bangalore"
                        className="group block p-3.5 bg-gray-50 hover:bg-[#334d3d]/5 rounded-xl border border-gray-200/70 hover:border-[#334d3d]/30 transition-all"
                      >
                        <span className="inline-block text-[11px] font-bold text-[#334d3d] uppercase tracking-wider mb-0.5">
                          Bangalore
                        </span>
                        <h4 className="text-sm font-semibold text-gray-900 group-hover:text-[#334d3d] transition-colors leading-snug">
                          Bangalore Coworking Spaces
                        </h4>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
      <div className="print:hidden">
        <Footer />
      </div>
    </>
  );
};

export default BlogDetail;
