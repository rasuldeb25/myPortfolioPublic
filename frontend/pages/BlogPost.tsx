import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { API_URL } from '../src/config';

interface Post {
  id: number;
  title: string;
  content: string;
  tags: string;
  created_at: string;
  banner_image_url?: string; 
}

export default function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/posts/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Post not found");
        return res.json();
      })
      .then(data => {
        setPost(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  
  const convertToHtml = (src: string) => {
    if (!src) return '';
    let out = src;
    out = out.replace(/<script/gi, '&lt;script');
    out = out.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="w-full rounded-lg shadow-lg my-6 border border-gray-700" />');
    out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-cyan-400 hover:text-cyan-300 underline">$1</a>');
    out = out.replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-white mt-6 mb-3">$1</h3>');
    out = out.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-white mt-8 mb-4 border-b border-gray-700 pb-2">$1</h2>');
    out = out.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-white mt-10 mb-6">$1</h1>');
    out = out.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>');
    out = out.replace(/\*(.*?)\*/g, '<em class="italic text-gray-300">$1</em>');
    out = out.replace(/::size=(\d+)::([\s\S]*?)::\/size::/g, '<span style="font-size:$1px">$2</span>');
    out = out.replace(/::color=([^:]+)::([\s\S]*?)::\/color::/g, '<span style="color:$1">$2</span>');
    out = out.replace(/::highlight::([\s\S]*?)::\/highlight::/g, '<span class="bg-yellow-500/20 text-yellow-200 px-1 rounded">$1</span>');
    out = out.replace(/^\- (.*$)/gim, '<li class="ml-4 list-disc text-gray-300">$1</li>');
    out = out.replace(/(<li.*<\/li>)/gms, '<ul class="space-y-1 my-4">$1</ul>');
    out = out.replace(/\n\n+/g, '</p><p class="mb-4 leading-relaxed text-gray-300">');
    out = '<p class="mb-4 leading-relaxed text-gray-300">' + out.replace(/\n/g, '<br/>') + '</p>';
    return out;
  };

  if (loading) return <div className="text-center text-white p-20 animate-pulse">Loading Article...</div>;
  if (!post) return <div className="text-center text-white p-20">Post not found.</div>;

  const bannerStyle = post.banner_image_url
    ? {
        backgroundImage: `url('${post.banner_image_url}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '400px',
      }
    : {};

  return (
    <div className="pb-20 font-sans">
      <div className="bg-[#0B1120]/85 backdrop-blur-md border border-white/10 rounded-2xl p-10 shadow-xl max-w-4xl mx-auto mt-8 text-white">
        <header style={bannerStyle} className="w-full rounded-t-xl mb-6"></header>
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-sm text-cyan-400 mb-4 font-mono uppercase tracking-widest">
            {new Date(post.created_at).toLocaleDateString()} — {post.tags}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{post.title}</h1>
          <Link to="/blog" className="text-gray-400 hover:text-white transition border-b border-transparent hover:border-white pb-1">
            ← Back to Research Log
          </Link>
        </div>
        <article className="max-w-3xl mx-auto mt-12 px-6">
          <div className="prose prose-invert prose-cyan max-w-none" dangerouslySetInnerHTML={{ __html: convertToHtml(post.content) }} />
        </article>
      </div>
    </div>
  );
}