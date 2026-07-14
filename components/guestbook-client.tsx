'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { RiEditLine, RiChat3Line } from 'react-icons/ri';
import { addEntry } from '@/app/actions';

export default function GuestbookClient({ initialEntries }: { initialEntries: any[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.reveal-header',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );
      gsap.fromTo('.reveal-card',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.08, delay: 0.15 }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !name.trim()) return;
    
    setIsPending(true);
    await addEntry(name, message);
    setMessage('');
    setName('');
    setIsPending(false);
  };

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#09090b] text-[#f4f4f5] font-satoshi selection:bg-zinc-800 overflow-x-hidden">
      <main className="relative z-10 px-6 pt-28 pb-32 sm:px-12 md:px-16 max-w-[1400px] mx-auto flex flex-col gap-12 sm:gap-16">
        
        {/* UPPER STATUS BAR */}
        <div className="w-full flex justify-between items-baseline border-b border-zinc-800 pb-5 reveal-header">
          <div className="flex items-center gap-2 text-[13px] text-zinc-400 font-medium lowercase tracking-wide">
            <RiChat3Line className="text-zinc-500 text-sm" />
            <span>visitor log</span>
          </div>
          <span className="text-[12px] sm:text-[13px] text-zinc-500 font-mono tracking-tight">
            [{initialEntries.length.toString().padStart(2, '0')} messages]
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start w-full">
          
          {/* INPUT FIELD */}
          <div className="lg:col-span-5 flex flex-col gap-6 reveal-card">
            <div className="flex flex-col gap-1.5">
              <h1 className="text-3xl font-black tracking-tight text-zinc-100 lowercase">guestbook</h1>
              <p className="text-[13px] sm:text-[14px] text-zinc-400 font-medium leading-relaxed lowercase">
                say hello, leave a brief note, or just share your thoughts about my work.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="your name..."
                className="w-full bg-zinc-900/20 border border-zinc-800/80 rounded-xl p-3 text-[13px] text-zinc-200 outline-none focus:border-zinc-700 transition-all placeholder-zinc-600 lowercase"
              />
              
              <div className="relative w-full rounded-xl bg-zinc-900/20 border border-zinc-800/80 focus-within:border-zinc-700 transition-all p-3">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="write a message..."
                  maxLength={180}
                  className="w-full h-24 bg-transparent outline-none resize-none text-[13px] text-zinc-200 placeholder-zinc-600 lowercase font-medium"
                />
                <div className="w-full flex justify-end text-[11px] font-mono text-zinc-600 pt-2">
                  {message.length}/180
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending || !message.trim() || !name.trim()}
                className="w-full h-10 rounded-xl bg-zinc-100 hover:bg-white disabled:bg-zinc-900 disabled:text-zinc-600 text-zinc-950 font-semibold text-[13px] transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed border disabled:border-zinc-800/60"
              >
                <RiEditLine className="text-sm" />
                <span>{isPending ? 'sending...' : 'send message'}</span>
              </button>
            </form>
          </div>

          {/* MESSAGES TIMELINE */}
          <div className="lg:col-span-7 flex flex-col w-full divide-y divide-zinc-900">
            {initialEntries.map((entry) => (
              <div key={entry.id} className="reveal-card group py-6 first:pt-0 last:pb-0 flex flex-col gap-1.5 transition-all duration-300">
                <div className="flex justify-between items-baseline w-full font-mono text-[11px] sm:text-[12px]">
                  <span className="text-zinc-300 font-bold lowercase tracking-tight group-hover:text-white transition-colors">
                    {entry.name}
                  </span>
                  <span className="text-zinc-600">
                    {entry.createdAt ? new Date(entry.createdAt).toLocaleDateString() : ''}
                  </span>
                </div>
                <p className="text-[13px] sm:text-[14px] text-zinc-400 group-hover:text-zinc-300 font-medium lowercase leading-relaxed transition-colors">
                  {entry.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}