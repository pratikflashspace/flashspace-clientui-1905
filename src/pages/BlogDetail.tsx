import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { format } from "date-fns";
import { ArrowLeft, User, Calendar, Tag } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/react/style.css";

const getImageUrl = (url?: string) => {
  if (!url) return "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";
  return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
};

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editor, setEditor] = useState<BlockNoteEditor | null>(null);

  useEffect(() => {
    fetchBlog();
  }, [slug]);

  const fetchBlog = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5001"}/api/blogs/${slug}`);
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

              // Transform category keywords into styled link objects based on blog.category
              const categoryLower = (data.data.category || "").toLowerCase();
              const isCoworking = categoryLower.includes("coworking");
              const isVirtualOffice = categoryLower.includes("virtual");

              const transformInlineContent = (inlineArray: any[]) => {
                if (!Array.isArray(inlineArray)) return inlineArray;
                const result: any[] = [];

                inlineArray.forEach((item) => {
                  if (item.type === "text" && item.text) {
                    const text = item.text;
                    let targetKeyword = "";
                    let targetRoute = "";

                    if (isCoworking) {
                      const match = text.match(/(coworking(?:\s+spaces?|\s+workspaces?)?)/i);
                      if (match) {
                        targetKeyword = match[0];
                        targetRoute = "/services/coworking-space";
                      }
                    } else if (isVirtualOffice) {
                      const match = text.match(/(virtual\s+office(?:s)?)/i);
                      if (match) {
                        targetKeyword = match[0];
                        targetRoute = "/services/virtual-office";
                      }
                    }

                    if (targetKeyword && targetRoute) {
                      const parts = text.split(new RegExp(`(${targetKeyword})`, "i"));
                      parts.forEach((part: string) => {
                        if (part.toLowerCase() === targetKeyword.toLowerCase()) {
                          result.push({
                            type: "link",
                            href: targetRoute,
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
                          result.push({ ...item, text: part });
                        }
                      });
                    } else {
                      result.push(item);
                    }
                  } else {
                    result.push(item);
                  }
                });

                return result;
              };

              const initialContent = parsed.map((b: any, idx: number) => {
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

                // 2. Detect FAQ Questions: "Q - ...", "Q: ...", "Q1 - ...", or ending with "?"
                const isFaqQuestion =
                  !isFaqMainHeader &&
                  (
                    /^(Q\s*[-:\.]|Q\d+\s*[-:\.]|\d+[\.\)]\s*Q)/i.test(textContent) ||
                    (textContent.endsWith("?") && textContent.length < 180)
                  );

                if (isFaqQuestion) {
                  blockType = "paragraph";
                  props = { ...props };
                  if (Array.isArray(content)) {
                    content = content.map((c: any) => ({
                      ...c,
                      styles: { bold: false }
                    }));
                  }
                }

                // 3. Detect Answers starting with "Ans - ", "Ans:", "A - ", "A:"
                const isFaqAnswer = /^(Ans\s*[-:\.]|A\s*[-:\.])/i.test(textContent);
                if (isFaqAnswer && Array.isArray(content)) {
                  blockType = "paragraph";
                  // Ensure "Ans - " part is styled bold
                  const fullText = textContent;
                  const match = fullText.match(/^(Ans\s*[-:\.]|A\s*[-:\.])\s*/i);
                  if (match) {
                    const prefix = match[0];
                    const restText = fullText.slice(prefix.length);
                    content = [
                      {
                        type: "text",
                        text: prefix,
                        styles: { bold: true, textColor: "#000000" },
                      },
                      {
                        type: "text",
                        text: restText,
                        styles: {},
                      },
                    ];
                  }
                }

                const isParagraph = blockType === "paragraph";
                return {
                  ...b,
                  type: blockType,
                  props,
                  id: b?.id || `block-${Date.now()}-${idx}`,
                  content: isParagraph && Array.isArray(content) ? transformInlineContent(content) : content,
                };
              });

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
      <Header forceWhiteBackground />
      <div className="min-h-screen bg-white pt-20 pb-20 font-['Inter']">
        {/* Container 1: Top Header (Breadcrumb, Title, Category, Date) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Header */}
          <div className="mb-8 mt-4">
            <nav className="text-sm font-normal text-gray-500 flex items-center gap-2">
              <Link to="/blogs" className="text-[#334d3d] font-semibold hover:underline transition-colors">
                Blogs
              </Link>
              <span>/</span>
              <span className="text-gray-600 font-normal line-clamp-1">{blog.title}</span>
            </nav>
          </div>

          {/* Header */}
          <div className="mb-10 text-left">
            <h1 className="text-2xl md:text-3xl font-extrabold text-black leading-tight mb-4 font-['Inter']">
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
        </div>

        {/* Container 2: Cover Image & Article Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Cover Image */}
          <div className="w-full mb-12">
            <div className="w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-lg">
              <img 
                src={getImageUrl(blog.bannerImage || blog.coverImage)} 
                alt={blog.title} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Content */}
          <div className="w-full font-['Inter',sans-serif]" style={{ fontFamily: "Inter, sans-serif" }}>
            <div 
              className="prose prose-lg prose-green max-w-none font-['Inter',sans-serif] [&_*]:!font-['Inter',sans-serif] [&_h1]:!text-black [&_h2]:!text-black [&_h3]:!text-black [&_h3]:!font-bold [&_h3]:!text-lg [&_h4]:!text-black [&_h5]:!text-black [&_h6]:!text-black [&_a]:!text-[#334d3d] [&_a]:!font-bold [&_a]:!no-underline [&_.bn-container]:!px-0 [&_.bn-editor]:!px-0 [&_.bn-block-group]:!px-0 [&_.bn-block-content]:!px-0"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {editor ? (
                <BlockNoteView editor={editor} editable={false} theme="light" />
              ) : (
                <p className="text-gray-500 italic">Loading content...</p>
              )}
            </div>

            {/* Tags */}
            {blog.tags && Array.isArray(blog.tags) && blog.tags.filter((t: string) => t && t.trim()).length > 0 && (
              <div className="mt-16 pt-8 border-t border-gray-100">
                <h3 className="text-lg font-bold text-[#1a2d1d] mb-4 flex items-center gap-2">
                  <Tag size={20} /> Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.filter((t: string) => t && t.trim()).map((tag: string) => (
                    <span key={tag} className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium border border-gray-100">
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BlogDetail;
