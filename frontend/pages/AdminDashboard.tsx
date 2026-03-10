import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { API_URL } from '../src/config';


// --- ICONS ---
const SaveIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-4 4m0 0l-4-4m4 4V4" /></svg>;
const TrashIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const PlusIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;
const ImageIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;

interface Post {
    id: number;
    title: string;
    content: string;
    tags: string;
    created_at: string;
    banner_image_url?: string;
  }

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [token, setToken] = useState("");
  const [notification, setNotification] = useState<{msg: string, type: 'success'|'error'} | null>(null);
  const [bannerImageUrl, setBannerImageUrl] = useState<string>("");

  useEffect(() => {
    const savedToken = localStorage.getItem("access_token");
    if (!savedToken) { navigate("/admin"); return; }
    setToken(savedToken);
    fetchPosts();
  }, [navigate]);

  const showToast = (msg: string, type: 'success'|'error' = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${API_URL}/posts`);
      setPosts(await response.json());
    } catch (error) { console.error(error); }
  };

  const handleSave = async () => {
    if (!title || !content) { alert("Please write something first!"); return; }
    const payload = { title, content, tags, summary: content.substring(0, 150) + "...", banner_image_url: bannerImageUrl };
    const headers = { "Content-Type": "application/json", "Authorization": `Bearer ${token}` };
    try {
      const url = selectedPostId ? `${API_URL}/posts/${selectedPostId}` : `${API_URL}/posts`;
      const method = selectedPostId ? "PUT" : "POST";
      const response = await fetch(url, { method, headers, body: JSON.stringify(payload) });
      if (response.ok) { showToast(selectedPostId ? "Updated!" : "Published!"); fetchPosts(); if (!selectedPostId) resetForm(); }
    } catch (error) { showToast("Save failed", "error"); }
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!window.confirm("Delete?")) return;
    await fetch(`${API_URL}/posts/${id}`, { method: "DELETE", headers: { "Authorization": `Bearer ${token}` } });
    showToast("Deleted", "error"); fetchPosts(); if (selectedPostId === id) resetForm();
  };

  const resetForm = () => { setSelectedPostId(null); setTitle(""); setContent(""); setTags(""); setBannerImageUrl(""); };
  const handleSelectPost = (post: Post) => { setSelectedPostId(post.id); setTitle(post.title); setContent(post.content); setTags(post.tags || ""); setBannerImageUrl(post.banner_image_url || ""); };
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const el = textareaRef.current;
    if (!el) return;

    const cursorPosition = el.selectionStart;
    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    try {
      setNotification({ msg: "Uploading...", type: "success" });
      const res = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
        headers: { "Authorization": `Bearer ${token}` },
      });
      const data = await res.json();

      const imageMarkdown = `![Image](${data.url})`;
      setContent(
        content.substring(0, cursorPosition) +
          imageMarkdown +
          content.substring(cursorPosition)
      );
      setNotification(null);
    } catch (error) {
      console.error("Image upload failed", error);
      setNotification({ msg: "Upload failed", type: "error" });
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    try {
      setNotification({ msg: "Uploading banner...", type: "success" });
      const res = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
        headers: { "Authorization": `Bearer ${token}` },
      });
      const data = await res.json();

      setBannerImageUrl(data.url);
      showToast("Banner Uploaded!", "success");
      setNotification(null);
    } catch (error) {
      console.error("Banner upload failed", error);
      setNotification({ msg: "Banner upload failed", type: "error" });
    }
  };

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const wrapSelection = (prefix: string, suffix: string, type?: 'size' | 'color' | 'highlight') => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    let selectedText = content.substring(start, end);

    // Remove existing tags of the same type
    if (type === 'size') {
      selectedText = selectedText.replace(/::size=\d+::([\s\S]*?)::\/size::/g, '$1');
    } else if (type === 'color') {
      selectedText = selectedText.replace(/::color=[^:]+::([\s\S]*?)::\/color::/g, '$1');
    } else if (type === 'highlight') {
      selectedText = selectedText.replace(/::highlight::([\s\S]*?)::\/highlight::/g, '$1');
    }

    const wrappedText = `${prefix}${selectedText}${suffix}`;
    setContent(
      content.substring(0, start) + wrappedText + content.substring(end)
    );

    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = start;
      el.selectionEnd = start + wrappedText.length;
    });
  };
  const applyLink = () => {
    const el = textareaRef.current; if (!el) return;
    const url = window.prompt("URL:"); if (!url) return;
    const text = content.substring(el.selectionStart, el.selectionEnd) || "link";
    setContent(content.substring(0, el.selectionStart) + `[${text}](${url})` + content.substring(el.selectionEnd));
  };
  const convertToHtml = (src: string) => {
    if (!src) return '<p class="text-slate-500">Preview...</p>';
    let out = src
      .replace(/<script/gi, "&lt;script")
      .replace(
        /!\[([^\]]*)\]\(([^)]+)\)/g,
        '<img src="$2" class="w-full max-h-[500px] mx-auto rounded-lg my-2" style="filter: none;" />'
      )
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" class="text-cyan-400">$1</a>'
      );
    out = out
      .replace(/^# (.*$)/gim, "<h1>$1</h1>")
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-cyan-400 mt-6 mb-4">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold text-slate-200 mt-4 mb-2">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>");
    return out
      .replace(
        /::size=(\d+)::([\s\S]*?)::\/size::/g,
        '<span style="font-size: $1px; display: inline-block;">$2</span>'
      )
      .replace(
        /::color=([^:]+)::([\s\S]*?)::\/color::/g,
        '<span style="color: $1;">$2</span>'
      )
      .replace(
        /::highlight::([\s\S]*?)::\/highlight::/g,
        '<mark style="background-color: #3b82f6; color: white; border-radius: 4px; padding: 0 4px;">$1</mark>'
      )
      .replace(/\n/g, "<br/>");
  };

  const applyHeadline = (level: 2 | 3) => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const lineStart = content.lastIndexOf('\n', start - 1) + 1;
    
    const prefix = `${'#'.repeat(level)} `;

    setContent(
        content.substring(0, lineStart) +
        prefix +
        content.substring(lineStart)
    );

    requestAnimationFrame(() => {
        el.focus();
        el.selectionStart = start + prefix.length;
        el.selectionEnd = end + prefix.length;
    });
  };

  const applyTextSize = (size: number) => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    let selectedText = content.substring(start, end) || "Text";
    selectedText = selectedText.replace(/::size=\d+::([\s\S]*?)::\/size::/g, '$1');

    const wrappedText = `::size=${size}::${selectedText}::/size::`;
    setContent(
      content.substring(0, start) + wrappedText + content.substring(end)
    );

    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = start;
      el.selectionEnd = start + wrappedText.length;
    });
  };

  const previewBanner = bannerImageUrl ? (
    <img
      src={bannerImageUrl}
      className="w-full h-64 object-cover rounded-t-xl mb-6"
      alt="Banner Preview"
    />
  ) : null;

  return (
    <div className="h-screen flex bg-[#0B1120] text-slate-300 overflow-hidden font-sans">
      <div className="w-72 bg-[#0f172a] border-r border-slate-800 flex flex-col">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <span className="text-xs font-bold text-cyan-500 tracking-widest uppercase">Database</span>
          <button onClick={resetForm} className="p-1 hover:bg-cyan-500/10 rounded text-cyan-400 transition"><PlusIcon /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {posts.map((post) => (
            <div key={post.id} onClick={() => handleSelectPost(post)} className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer text-sm ${selectedPostId === post.id ? "bg-cyan-900/20 text-cyan-400 border border-cyan-500/30" : "hover:bg-slate-800 border border-transparent"}`}>
              <div className="truncate pr-2"><div className="font-medium truncate">{post.title}</div><div className="text-[10px] text-slate-500 mt-0.5">{new Date(post.created_at).toLocaleDateString()}</div></div>
              <button onClick={(e) => handleDelete(e, post.id)} className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition"><TrashIcon /></button>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col bg-[#0B1120]">
        <div className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/30 backdrop-blur-md">
          <div className="flex items-center space-x-4 w-full mr-4">
             <input type="text" placeholder="Untitled Post..." className="bg-transparent text-xl font-bold text-white placeholder-slate-600 outline-none flex-1" value={title} onChange={(e) => setTitle(e.target.value)} />
             <input type="text" placeholder="#tags" className="bg-slate-800/50 border border-slate-700 rounded px-3 py-1 text-xs text-cyan-400 outline-none w-48" value={tags} onChange={(e) => setTags(e.target.value)} />
          </div>
          <div className="flex items-center space-x-3">
             <label className="p-2 text-slate-400 hover:text-white cursor-pointer"><ImageIcon /><input type="file" className="hidden" onChange={handleImageUpload} /></label>
             <label className="p-2 text-slate-400 hover:text-white cursor-pointer">
              Upload Banner
              <input
                type="file"
                className="hidden"
                onChange={handleBannerUpload}
              />
            </label>
             <button onClick={handleSave} className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 text-white px-5 py-2 rounded-full shadow-lg text-sm font-semibold transition-all"><SaveIcon /><span>Publish</span></button>
          </div>
        </div>
        <div className="flex-1 flex overflow-hidden">
          <div className="w-1/2 border-r border-slate-800 p-6 bg-[#0f172a]/30 flex flex-col">
            {previewBanner}
            <div className="flex gap-2 mb-2">
              <button onClick={() => wrapSelection('**','**')} className="px-2 py-1 bg-slate-800 rounded hover:bg-slate-700 text-xs">Bold</button>
              <button onClick={() => wrapSelection('*','*')} className="px-2 py-1 bg-slate-800 rounded hover:bg-slate-700 text-xs">Italic</button>
              <button onClick={() => applyHeadline(2)} className="px-2 py-1 bg-slate-800 rounded hover:bg-slate-700 text-xs">H2</button>
              <button onClick={() => applyHeadline(3)} className="px-2 py-1 bg-slate-800 rounded hover:bg-slate-700 text-xs">H3</button>
              <input
                type="number"
                placeholder="Text Size"
                className="w-16 bg-slate-800 rounded px-2 py-1 text-xs text-cyan-400 outline-none"
                onChange={(e) => applyTextSize(Number(e.target.value))}
              />
              <input type="color" onChange={(e) => wrapSelection(`::color=${e.target.value}::`, `::/color::`, 'color')} className="w-6 h-6 bg-transparent cursor-pointer" title="Text Color"/>
              <button onClick={() => wrapSelection('::highlight::','::/highlight::', 'highlight')} className="px-2 py-1 bg-yellow-600/50 text-yellow-200 rounded hover:bg-yellow-600 text-xs">Highlight</button>
              <button onClick={applyLink} className="px-2 py-1 bg-slate-800 rounded hover:bg-slate-700 text-xs">Link</button>
            </div>
            <textarea ref={textareaRef} className="w-full h-full bg-transparent resize-none outline-none font-mono text-sm leading-relaxed text-slate-300 placeholder-slate-700" placeholder="Type here..." value={content} onChange={(e) => setContent(e.target.value)} spellCheck={false} />
          </div>
          <div className="w-1/2 p-8 overflow-y-auto bg-[#0B1120]">
               <div className="prose prose-invert prose-cyan max-w-none" dangerouslySetInnerHTML={{ __html: convertToHtml(content) }} />
          </div>
        </div>
      </div>
      {notification && (
        <div className={`fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-2xl border flex items-center gap-3 animate-bounce-in z-50 ${notification.type === 'success' ? 'bg-cyan-900/90 border-cyan-500 text-cyan-100' : 'bg-red-900/90 border-red-500 text-red-100'}`}>
          <span className="font-semibold">{notification.msg}</span>
        </div>
      )}
    </div>
  );
}