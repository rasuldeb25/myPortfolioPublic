import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { API_URL } from '../src/config';

// Define what a Post looks like (matching your Python Model)
interface BlogPost {
  id: number;
  title: string;
  summary: string;
  tags: string;
  created_at: string;
}

const stripMarkdown = (text: string): string => {
  if (!text) return "";
  let newText = text;
  // Markdown
  newText = newText.replace(/(\*\*|__)(.*?)\1/g, '$2'); // Bold/Italic
  newText = newText.replace(/!\[(.*?)\]\((.*?)\)/g, '$1'); // Images
  newText = newText.replace(/\[(.*?)\]\((.*?)\)/g, '$1'); // Links
  newText = newText.replace(/#{1,6}\s/g, ''); // Headers

  // Custom tags
  newText = newText.replace(/::size=\d+::([\s\S]*?)::\/size::/g, '$1');
  newText = newText.replace(/::highlight::([\s\S]*?)::\/highlight::/g, '$1');
  newText = newText.replace(/::color=[^:]+::([\s\S]*?)::\/color::/g, '$1');
  return newText;
};

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  

  // --- 1. Fetch Real Posts from Backend ---
  useEffect(() => {
    fetch(`${API_URL}/posts`)
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching posts:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-[#0B1120]/85 backdrop-blur-md border border-white/10 rounded-2xl p-10 shadow-xl max-w-4xl mx-auto mt-8">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-12 border-b border-gray-700 pb-4">
        <div>
          <h1 className="text-4xl font-bold text-cyan-400 mb-2">Research Log</h1>
          <p className="text-gray-400">Thoughts on algorithms, physics, and code.</p>
        </div>
        
        {/* Button to go to Admin Dashboard */}
      </div>

      {/* Blog List */}
      <div className="space-y-6">
        
        {loading && <div className="text-center text-gray-500">Loading research...</div>}

        {!loading && posts.length === 0 && (
          <div className="text-center text-gray-500">No posts found. Go write some!</div>
        )}

        {posts.map((post) => (
          <div key={post.id} className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-cyan-500 transition shadow-lg">
            
            {/* Tags & Date */}
            <div className="flex items-center space-x-3 text-xs text-gray-400 mb-3">
              <span className="bg-cyan-900 text-cyan-200 px-2 py-1 rounded">
                {new Date(post.created_at).toLocaleDateString()}
              </span>
              <span>{post.tags ? post.tags.split(',').map(tag => `#${tag.trim()} `) : ''}</span>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold mb-3 text-white">
              {post.title}
            </h2>

            {/* Summary */}
            <p className="text-gray-300 leading-relaxed mb-4">
              {stripMarkdown(post.summary)}
            </p>

            {/* Read More */}
            <Link to={`/blog/${post.id}`} className="text-cyan-400 hover:text-cyan-300 font-semibold text-sm uppercase tracking-wide">
              Read Article →
            </Link>
          </div>
        ))}

      </div>
    </div>
  );
}