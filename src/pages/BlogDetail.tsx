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
            const initialContent: PartialBlock[] = JSON.parse(data.data.content);
            const newEditor = BlockNoteEditor.create({ initialContent });
            setEditor(newEditor);
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link to="/blogs" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-[#334d3d] mb-6 transition-colors mt-4">
          <ArrowLeft size={16} className="mr-2" />
          Back to all blogs
        </Link>

        {/* Header */}
        <div className="mb-10 text-left max-w-4xl">
          <div className="inline-block bg-[#f1f5f9] text-[#334d3d] font-bold px-4 py-1.5 rounded-full text-sm mb-6">
            {blog.category}
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1a2d1d] leading-tight mb-6 font-['Inter']">
            {blog.title}
          </h1>
          
          <div className="flex flex-wrap items-center justify-start gap-6 text-sm text-gray-500 font-medium">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              {format(new Date(blog.createdAt), "MMMM dd, yyyy")}
            </div>
          </div>
        </div>

        {/* Cover Image */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-lg">
            <img 
              src={blog.coverImage || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80"} 
              alt={blog.title} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg prose-green max-w-none">
            {editor ? (
              <BlockNoteView editor={editor} editable={false} theme="light" />
            ) : (
              <p className="text-gray-500 italic">Loading content...</p>
            )}
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-16 pt-8 border-t border-gray-100">
              <h3 className="text-lg font-bold text-[#1a2d1d] mb-4 flex items-center gap-2">
                <Tag size={20} /> Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag: string) => (
                  <span key={tag} className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium border border-gray-100">
                    #{tag}
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
