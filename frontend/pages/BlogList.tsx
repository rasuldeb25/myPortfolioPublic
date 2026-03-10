import React from 'react';

interface BlogPost {
  id: number;
  title: string;
  summary: string;
  banner_image_url?: string;
}

const cleanSummary = (text: string) => {
  return text
    .replace(/::.*?::/g, "") 
    .replace(/[#*_]/g, "") 
    .replace(/!\[.*?\]\(.*?\)/g, ""); 
};

const BlogList = ({ posts }: { posts: BlogPost[] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <div key={post.id} className="bg-gray-800 rounded-lg shadow-md p-4">
          {post.banner_image_url && (
            <img
              src={post.banner_image_url}
              alt="Banner"
              className="w-full h-48 object-cover rounded-t-lg mb-4"
            />
          )}
          <h2 className="text-xl font-bold text-white mb-2">{post.title}</h2>
          <p className="text-gray-400">{cleanSummary(post.summary).slice(0, 100)}...</p>
        </div>
      ))}
    </div>
  );
};

export default BlogList;