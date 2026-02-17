
import React from 'react';

export default function AudioPlayer() {
    return (
        <div className="fixed bottom-0 w-full h-20 bg-neutral-900/90 backdrop-blur-xl border-t border-white/10 z-[100] px-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-neutral-800 rounded-md overflow-hidden relative">
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] text-neutral-500 uppercase font-bold text-center">
                        No Track
                    </div>
                </div>
                <div>
                    <h4 className="text-sm font-bold text-white truncate max-w-[150px]">Select a track</h4>
                    <p className="text-xs text-neutral-400 truncate max-w-[150px]">Artist name</p>
                </div>
            </div>

            <div className="flex flex-col items-center gap-2 flex-1 max-w-xl">
                <div className="flex items-center gap-6">
                    <button className="text-neutral-400 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                    </button>
                    <button className="text-white hover:scale-110 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
                    </button>
                    <button className="text-neutral-400 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 4 7 7 7-7"></path><path d="m5 20 7-7 7 7"></path></svg>
                    </button>
                </div>
                <div className="w-full h-1 bg-neutral-800 rounded-full relative overflow-hidden">
                    <div className="absolute left-0 top-0 h-full w-[30%] bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
                </div>
            </div>

            <div className="hidden md:flex items-center gap-4 w-[200px] justify-end">
                <button className="text-xs font-bold text-neutral-500 hover:text-white transition-colors uppercase tracking-widest">
                    Queue
                </button>
                <div className="w-20 h-1 bg-neutral-800 rounded-full relative">
                    <div className="absolute left-0 top-0 h-full w-1/2 bg-white"></div>
                </div>
            </div>
        </div>
    );
}
