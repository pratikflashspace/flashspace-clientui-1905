import React, { useState, useEffect, useMemo } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Eye } from "lucide-react";

import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

const DRAFT_KEY = "postBlogDraft";

const ReadOnlyPreview = ({ content }: { content: string }) => {
  const previewEditor = useMemo(() => {
    let initialContent: PartialBlock[] | undefined;
    try {
      if (content && content !== "[]") {
        initialContent = JSON.parse(content);
      }
    } catch (e) {
      console.error("Error parsing content for preview", e);
    }
    return BlockNoteEditor.create({ initialContent });
  }, [content]);

  return <BlockNoteView editor={previewEditor} editable={false} theme="light" />;
};

const PostBlog = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    category: "Coworking",
    excerpt: "",
    content: "[]", // Will store JSON string of blocks
    tags: "",
  });
  
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Initialize BlockNote Editor
  const editor = useMemo(() => {
    // Load initial content from draft if it exists
    let initialContent: PartialBlock[] | undefined;
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        if (parsed.content && parsed.content !== "[]") {
          initialContent = JSON.parse(parsed.content);
        }
      } catch (e) {
        console.error("Error parsing draft content", e);
      }
    }

    return BlockNoteEditor.create({
      initialContent,
      uploadFile: async (file: File) => {
        try {
          const body = new FormData();
          body.append("file", file);
          const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/blogs/editor-upload`, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("token") || ""}`,
              "x-flashspace-csrf": "true",
            },
            credentials: "include",
            body,
          });
          
          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.message || `HTTP ${res.status}`);
          }
          
          const data = await res.json();
          if (!data.success || !data.url) {
            throw new Error(data.message || "Failed to upload image");
          }
          
          console.log("Uploaded image URL:", data.url);
          return data.url;
        } catch (error: any) {
          console.error("Image upload failed:", error);
          toast({
            title: "Upload Error",
            description: error.message || "Failed to upload image",
            variant: "destructive",
          });
          return "";
        }
      }
    });
  }, []);

  const categories = ["Coworking", "Coliving", "Virtual Office", "Office Space", "Enterprise"];

  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        setFormData({
          title: parsed.title || "",
          category: parsed.category || "Coworking",
          excerpt: parsed.excerpt || "",
          content: parsed.content || "[]",
          tags: parsed.tags || ""
        });
      } catch (e) {
        console.error("Failed to parse blog draft", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
  }, [formData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setCoverImageFile(null);
    setPreviewUrl(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!coverImageFile) {
      toast({
        title: "Error",
        description: "Please select a cover image.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("category", formData.category);
      submitData.append("excerpt", formData.excerpt);
      submitData.append("content", formData.content);
      
      const tagsArray = formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag);
      tagsArray.forEach(tag => submitData.append("tags[]", tag));
      submitData.append("tags", tagsArray.join(","));
      
      submitData.append("coverImage", coverImageFile);

      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/blogs`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token") || ""}`,
          "x-flashspace-csrf": "true",
        },
        credentials: "include",
        body: submitData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: "Success",
          description: "Blog posted successfully!",
          variant: "default",
        });
        
        setFormData({ title: "", category: "Coworking", excerpt: "", content: "[]", tags: "" });
        editor.replaceBlocks(editor.document, []); // Clear editor
        removeImage();
        localStorage.removeItem(DRAFT_KEY);
        setShowPreviewModal(false);
      } else {
        throw new Error(data.message || "Failed to post blog");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto font-['Inter'] relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#1a2d1d]">Create a New Blog Post</h2>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => setShowPreviewModal(true)}
          className="flex items-center gap-2"
        >
          <Eye size={16} /> Live Preview
        </Button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Blog Title *</label>
          <Input 
            name="title" 
            value={formData.title} 
            onChange={handleChange} 
            placeholder="Enter blog title" 
            required 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#334d3d]"
              required
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Cover Image *</label>
            
            {previewUrl ? (
              <div className="relative w-full h-32 rounded-lg border overflow-hidden">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-md transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <Input 
                type="file"
                name="coverImage" 
                onChange={handleFileChange} 
                accept="image/*"
                required 
              />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Excerpt (Short Description)</label>
          <Textarea 
            name="excerpt" 
            value={formData.excerpt} 
            onChange={handleChange} 
            placeholder="Brief summary of the blog..." 
            rows={2} 
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Tags (comma separated)</label>
          <Input 
            name="tags" 
            value={formData.tags} 
            onChange={handleChange} 
            placeholder="workspace, tips, productivity" 
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex justify-between">
            <span>Main Content *</span>
            <span className="text-xs font-normal text-gray-400">Type '/' for commands, use drag handles to reorder</span>
          </label>
          <div className="border border-gray-200 rounded-md p-2 min-h-[400px]">
            <BlockNoteView 
              editor={editor} 
              theme="light" 
              onChange={() => {
                setFormData(prev => ({ ...prev, content: JSON.stringify(editor.document) }));
              }}
            />
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={loading}
          className="w-full md:w-auto px-8 bg-[#334d3d] hover:bg-[#1a2d1d] text-[#FEF8C3]"
        >
          {loading ? "Publishing..." : "Publish Blog Post"}
        </Button>
      </form>

      {/* Preview Modal Overlay */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 md:p-10">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col">
            
            <div className="sticky top-0 bg-white/95 backdrop-blur-md z-10 px-6 py-4 border-b flex justify-between items-center rounded-t-2xl">
              <h3 className="font-bold text-lg text-[#1a2d1d] flex items-center gap-2">
                <Eye size={18} /> Blog Preview
              </h3>
              <div className="flex items-center gap-3">
                <Button 
                  onClick={handleSubmit} 
                  disabled={loading || !coverImageFile || !formData.title || formData.content === "[]"}
                  className="bg-[#334d3d] hover:bg-[#1a2d1d] text-[#FEF8C3] h-9"
                >
                  {loading ? "Publishing..." : "Publish Now"}
                </Button>
                <button 
                  onClick={() => setShowPreviewModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 md:p-10">
              <div className="mb-10 text-center md:text-left">
                <div className="inline-block bg-[#f1f5f9] text-[#334d3d] font-bold px-4 py-1.5 rounded-full text-sm mb-6">
                  {formData.category || "Category"}
                </div>
                <h1 className="text-3xl md:text-5xl font-extrabold text-[#1a2d1d] leading-tight mb-6">
                  {formData.title || "Your Blog Title Will Appear Here"}
                </h1>
                <p className="text-gray-500 mb-6 italic">
                  {formData.excerpt || "Excerpt summary..."}
                </p>
              </div>

              <div className="w-full h-[300px] md:h-[450px] rounded-2xl overflow-hidden shadow-lg mb-12 bg-gray-100 flex items-center justify-center">
                {previewUrl ? (
                  <img src={previewUrl} alt="Cover Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-400 font-medium">No Cover Image Selected</span>
                )}
              </div>

              <div className="prose prose-lg prose-green max-w-none">
                <ReadOnlyPreview content={formData.content} />
              </div>
              
              {formData.tags && (
                <div className="mt-12 pt-8 border-t border-gray-100 flex flex-wrap gap-2">
                  {formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag).map(tag => (
                    <span key={tag} className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium border border-gray-100">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default PostBlog;
