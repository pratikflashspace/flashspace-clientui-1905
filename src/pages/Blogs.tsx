import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Blogs = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Coworking", "Coliving", "Virtual Office", "Office Space"];

  useEffect(() => {
    fetchBlogs();
  }, [activeCategory]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const categoryQuery = activeCategory !== "All" ? `?category=${activeCategory}` : "";
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/blogs${categoryQuery}`);
      const data = await response.json();
      if (data.success) {
        setBlogs(data.data);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header forceWhiteBackground />
      <div className="min-h-screen bg-gray-50 pt-20 pb-16 font-['Inter']">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-10 mt-4 text-left bg-[#334d3d] p-8 md:p-12 rounded-3xl shadow-lg relative overflow-hidden"
        >
          {/* Background animated blob */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
            className="absolute -top-24 -right-12 w-64 h-64 bg-[#FEF8C3]/10 rounded-full blur-3xl pointer-events-none"
          />
          
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#FEF8C3] mb-3 font-['Inter'] relative z-10">
            Insights, Tips & Trends
          </h1>
          <p className="text-base text-gray-200 max-w-2xl relative z-10">
            Explore the latest news and guides about coworking, coliving, and office spaces across India.
          </p>
        </motion.div>

        {/* Categories */}
        <div className="flex flex-wrap justify-start gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeCategory === category
                  ? "bg-[#334d3d] text-[#FEF8C3] shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#334d3d]"></div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            No blogs found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                key={blog._id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col h-full group"
              >
                <Link to={`/blogs/${blog.slug}`} className="block relative overflow-hidden h-56">
                  <img
                    src={blog.coverImage || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80"}
                    alt={blog.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-[#334d3d] text-[#FEF8C3] text-xs font-bold px-3 py-1.5 rounded-full">
                      {blog.category}
                    </span>
                    <span className="text-sm text-gray-500 font-medium">
                      {format(new Date(blog.createdAt), "MMM dd, yyyy")}
                    </span>
                  </div>
                  
                  <Link to={`/blogs/${blog.slug}`}>
                    <h3 className="text-xl font-bold text-[#1a2d1d] mb-3 line-clamp-2 hover:text-[#334d3d] transition-colors">
                      {blog.title}
                    </h3>
                  </Link>
                  
                  <p className="text-gray-600 text-sm line-clamp-3 mb-6 flex-grow">
                    {blog.excerpt || blog.content.substring(0, 150) + "..."}
                  </p>
                  
                  <div className="mt-auto border-t border-gray-100 pt-4 flex items-center justify-end">
                    <Link 
                      to={`/blogs/${blog.slug}`}
                      className="text-sm font-bold text-[#334d3d] hover:underline"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
    <Footer />
    </>
  );
};

export default Blogs;
