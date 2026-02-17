
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    name: string | null;
    image: string | null;
}

interface Post {
    id: string;
    content: string;
    type: string;
    createdAt: string | Date;
    user: User;
}

interface SocialFeedProps {
    initialPosts: Post[];
    currentUser?: any;
}

export default function SocialFeed({ initialPosts, currentUser }: SocialFeedProps) {
    const [posts, setPosts] = useState<Post[]>(initialPosts);
    const [newPostContent, setNewPostContent] = useState('');
    const [isPosting, setIsPosting] = useState(false);
    const router = useRouter();

    const handlePost = async () => {
        if (!newPostContent.trim() || isPosting) return;

        setIsPosting(true);
        try {
            const res = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newPostContent }),
            });

            if (res.ok) {
                const newPost = await res.json();
                setPosts([newPost, ...posts]);
                setNewPostContent('');
                router.refresh();
            }
        } catch (error) {
            console.error('Failed to post:', error);
        } finally {
            setIsPosting(false);
        }
    };

    const formatTimestamp = (date: string | Date) => {
        const d = new Date(date);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + d.toLocaleDateString();
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto py-10 px-4">
            {currentUser && (
                <div className="bg-neutral-900/50 border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
                    <textarea
                        placeholder="Share your latest creation..."
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-neutral-500 resize-none h-20"
                    />
                    <div className="flex justify-between items-center pt-4 border-t border-white/5">
                        <div className="flex gap-4">
                            <button className="text-neutral-500 hover:text-purple-400 transition-colors" title="Upload Media">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                            </button>
                            <button className="text-neutral-500 hover:text-blue-400 transition-colors" title="Post Video">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
                            </button>
                        </div>
                        <button
                            onClick={handlePost}
                            disabled={isPosting || !newPostContent.trim()}
                            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-full text-sm hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all disabled:opacity-50"
                        >
                            {isPosting ? '...' : 'Post'}
                        </button>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {posts.map(post => (
                    <div key={post.id} className="bg-neutral-900 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center overflow-hidden">
                                    {post.user.image ? (
                                        <img src={post.user.image} alt={post.user.name || ''} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="font-bold text-xs">{(post.user.name || 'U').slice(0, 2).toUpperCase()}</div>
                                    )}
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white">{post.user.name || 'Anonymous'}</h4>
                                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest">{formatTimestamp(post.createdAt)}</p>
                                </div>
                            </div>
                            <button className="text-neutral-600 hover:text-white transition-colors" title="Post Options">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                            </button>
                        </div>
                        <p className="text-neutral-300 leading-relaxed">
                            {post.content}
                        </p>
                        <div className="flex gap-6 mt-6 pt-4 border-t border-white/5">
                            <button className="flex items-center gap-2 text-xs text-neutral-500 hover:text-purple-400 transition-colors uppercase tracking-widest font-bold">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                                Vibe
                            </button>
                            <button className="flex items-center gap-2 text-xs text-neutral-500 hover:text-blue-400 transition-colors uppercase tracking-widest font-bold">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                                Comment
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
