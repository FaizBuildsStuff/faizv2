'use client';

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { 
  RiRadarLine, 
  RiUserSharedLine, 
  RiDiscordLine, 
  RiSpotifyLine,
  RiTimeLine,
  RiGamepadLine,
  RiCodeSSlashLine
} from 'react-icons/ri';
import HeroBackground from '@/components/hero-background';

// Lanyard API TypeScript Interfaces
interface LanyardSpotify {
  track_id: string;
  timestamps: { start: number; end: number };
  song: string;
  artist: string;
  album_art_url: string;
  album: string;
}

interface LanyardActivity {
  type: number; // 0: Game, 1: Streaming, 2: Listening, 3: Watching, 4: Custom status, 5: Competing
  state?: string;
  name: string;
  id: string;
  emoji?: { name: string; id?: string; animated?: boolean };
  details?: string;
  timestamps?: { start?: number; end?: number };
  assets?: {
    large_image?: string;
    large_text?: string;
    small_image?: string;
    small_text?: string;
  };
  application_id?: string;
}

interface LanyardData {
  discord_user: {
    id: string;
    username: string;
    avatar: string | null;
    discriminator: string;
    display_name?: string;
    global_name?: string;
  };
  discord_status: 'online' | 'idle' | 'dnd' | 'offline';
  activities: LanyardActivity[];
  listening_to_spotify: boolean;
  spotify?: LanyardSpotify | null;
  active_on_discord_desktop?: boolean;
  active_on_discord_mobile?: boolean;
  active_on_discord_web?: boolean;
}

export default function NowPage() {
  const [liveVisitors, setLiveVisitors] = useState(1);
  const [lanyard, setLanyard] = useState<LanyardData | null>(null);
  const [nowTime, setNowTime] = useState<number>(Date.now());
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  const USER_ID = "1071193261579976784";

  // 1. LIVE TELEMETRY PRESENCE FETCHING
  useEffect(() => {
    const fetchPresence = async () => {
      try {
        const res = await fetch('/api/presence', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setLiveVisitors(data.count || 1);
        }
      } catch (err) {
        setLiveVisitors(1);
      }
    };
    fetchPresence();
    const interval = setInterval(fetchPresence, 5000);
    return () => clearInterval(interval);
  }, []);

  // 2. LANYARD LIVE DISCORD & SPOTIFY API FETCHING + WEBSOCKET POLLING
  useEffect(() => {
    let isMounted = true;

    // Initial HTTP fetch for instant data
    const fetchLanyard = async () => {
      try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${USER_ID}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && isMounted) {
            setLanyard(json.data);
          }
        }
      } catch (e) {
        console.error("Failed to fetch Lanyard data:", e);
      }
    };

    fetchLanyard();
    const pollInterval = setInterval(fetchLanyard, 5000); // Live poll sync every 5s

    // Real-time time ticker for elapsed times & spotify progress
    const ticker = setInterval(() => {
      if (isMounted) setNowTime(Date.now());
    }, 1000);

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
      clearInterval(ticker);
    };
  }, []);

  // 3. GSAP ELEVATED STAGGER REVEAL
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.reveal-meta', 
        { opacity: 0, y: 10 },
        { opacity: 0.6, y: 0, duration: 0.6, ease: 'power2.out' }
      );
      
      gsap.fromTo('.reveal-heading', 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power4.out', delay: 0.1 }
      );

      if (cardsContainerRef.current) {
        gsap.fromTo(cardsContainerRef.current.children,
          { opacity: 0, y: 30, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out', stagger: 0.08, delay: 0.2 }
        );
      }
    }, containerRef);
    return () => ctx.revert();
  }, []);

  // Helper to format timestamps into elapsed MM:SS or HH:MM:SS
  const formatElapsedTime = (startTimestamp?: number) => {
    if (!startTimestamp) return null;
    const elapsedSeconds = Math.max(0, Math.floor((nowTime - startTimestamp) / 1000));
    const hrs = Math.floor(elapsedSeconds / 3600);
    const mins = Math.floor((elapsedSeconds % 3600) / 60);
    const secs = elapsedSeconds % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')} elapsed`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')} elapsed`;
  };

  // Helper to resolve Discord activity CDN image URL
  const getAssetUrl = (asset?: string, appId?: string): string | null => {
    if (!asset) return null;
    if (asset.startsWith("mp:external/")) {
      return `https://media.discordapp.net/external/${asset.replace("mp:external/", "")}`;
    }
    if (asset.startsWith("spotify:")) {
      return `https://i.scdn.co/image/${asset.replace("spotify:", "")}`;
    }
    if (asset.startsWith("http://") || asset.startsWith("https://")) {
      return asset;
    }
    if (appId) {
      return `https://cdn.discordapp.com/app-assets/${appId}/${asset}.png`;
    }
    return null;
  };

  // Extract primary non-Spotify, non-Custom activity
  const mainActivity = lanyard?.activities?.find(
    (a) => a.type !== 4 && a.name !== "Spotify"
  );
  
  // Extract custom status activity
  const customStatus = lanyard?.activities?.find((a) => a.type === 4);

  // Derive status details
  const status = lanyard?.discord_status || 'offline';
  const statusMap = {
    online: { label: 'online', color: 'bg-[#10b981] shadow-[0_0_14px_rgba(16,185,129,0.9)]' },
    idle: { label: 'idle', color: 'bg-[#f59e0b] shadow-[0_0_14px_rgba(245,158,11,0.9)]' },
    dnd: { label: 'do not disturb', color: 'bg-[#ef5350] shadow-[0_0_14px_rgba(239,83,80,0.9)]' },
    offline: { label: 'offline', color: 'bg-zinc-500 shadow-none' },
  };
  const activeDevice = lanyard?.active_on_discord_desktop ? 'desktop' 
    : lanyard?.active_on_discord_mobile ? 'mobile' 
    : lanyard?.active_on_discord_web ? 'web' 
    : 'offline';

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#111112] overflow-x-hidden select-none antialiased font-satoshi font-normal">
      
      {/* BACKGROUND GLOW COMPONENT */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <HeroBackground />
      </div>

      {/* FOREGROUND LAYOUT PIPELINE - PUSHED TO MAX-W-7XL FOR MAXIMUM SCALE */}
      <main className="relative z-10 text-[#fafafa] px-6 pt-44 pb-32 sm:px-12 max-w-7xl mx-auto flex flex-col gap-16">
        
        {/* HERO HEADER SECTION - SCALE BOOSTED FOR BOTH DESKTOP AND MOBILE */}
        <div className="flex flex-col text-left select-none max-w-2xl pl-1">
          <span className="reveal-meta text-[13px] text-zinc-500 tracking-normal lowercase mb-4 opacity-60 font-satoshi">
            now
          </span>
          <h1 className="reveal-heading text-[64px] sm:text-[110px] md:text-[124px] font-black tracking-[-0.05em] text-[#fafafa] lowercase leading-[0.82] font-sans antialiased">
            live room
          </h1>
          <p className="reveal-meta text-[14px] text-zinc-500 lowercase tracking-tight mt-8 opacity-80 font-satoshi">
            what the room knows right now • synced directly with discord & spotify
          </p>
        </div>

        {/* 4-CARD BENTO GRID - INCREASED GAP AND CARD HIGHER RESOLUTION HEIGHTS */}
        <div ref={cardsContainerRef} className="grid grid-cols-1 md:grid-cols-12 gap-5 w-full">
          
          {/* CARD 1: CURRENT STATUS */}
          <div className="md:col-span-7 bg-[#161619]/20 hover:bg-[#161619]/40 border border-zinc-900/60 hover:border-zinc-800 rounded-2xl p-7 flex flex-col justify-between min-h-[230px] transition-all duration-300 relative group overflow-hidden backdrop-blur-xl">
            <div className="flex items-center gap-2.5 text-[12px] text-zinc-500 lowercase tracking-wide font-satoshi opacity-60">
              <RiRadarLine className="text-base text-zinc-400" />
              <span>current status</span>
            </div>
            
            <div className="flex flex-col gap-2 justify-center my-auto py-2">
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`size-2.5 rounded-full ${statusMap[status].color} animate-pulse shrink-0`} />
                <h2 className="text-2xl sm:text-3xl tracking-tight text-white font-bold antialiased font-satoshi lowercase">
                  {statusMap[status].label}
                </h2>
                <span className="text-[11px] text-zinc-400 border border-zinc-800 px-2.5 py-0.5 rounded-full bg-zinc-900/60 font-mono lowercase">
                  {activeDevice}
                </span>
              </div>
              <p className="text-[13px] text-zinc-400 pl-5 lowercase tracking-tight font-satoshi">
                {customStatus?.state ? (
                  <span>
                    {customStatus.emoji?.name && `${customStatus.emoji.name} `}
                    {customStatus.state}
                  </span>
                ) : (
                  "chilling in the void"
                )}
              </p>
            </div>
          </div>

          {/* CARD 2: REAL-TIME ROOM TELEMETRY */}
          <div className="md:col-span-5 bg-[#161619]/20 hover:bg-[#161619]/40 border border-zinc-900/60 hover:border-zinc-800 rounded-2xl p-7 flex flex-col justify-between min-h-[230px] transition-all duration-300 relative group backdrop-blur-xl">
            <div className="flex items-center gap-2.5 text-[12px] text-zinc-500 lowercase tracking-wide font-satoshi opacity-60">
              <RiUserSharedLine className="text-base text-zinc-400" />
              <span>room count</span>
            </div>
            
            <div className="flex flex-col gap-0.5 my-auto justify-center py-2">
              <span className="text-5xl sm:text-[58px] font-black tracking-tight text-white antialiased font-satoshi leading-none">
                {liveVisitors}
              </span>
              <span className="text-[12px] text-zinc-400 lowercase font-satoshi tracking-tight mt-1">
                live visitors
              </span>
            </div>
            
            <p className="text-[12px] text-zinc-500 lowercase tracking-tight font-satoshi">
              how many people are currently watching this room
            </p>
          </div>

          {/* CARD 3: DISCORD ACTIVITY INTEGRATION */}
          <div className="md:col-span-7 bg-[#161619]/20 hover:bg-[#161619]/40 border border-zinc-900/60 hover:border-zinc-800 rounded-2xl p-7 flex flex-col justify-between min-h-[230px] transition-all duration-300 relative group backdrop-blur-xl">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2.5 text-[12px] text-zinc-500 lowercase tracking-wide font-satoshi opacity-60">
                <RiDiscordLine className="text-base text-indigo-400" />
                <span>discord activity</span>
              </div>
              {mainActivity && (
                <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full lowercase animate-pulse">
                  live
                </span>
              )}
            </div>

            <div className="my-auto py-3">
              {mainActivity ? (
                <div className="flex items-start sm:items-center gap-4">
                  {/* Activity Asset Icon */}
                  <div className="relative size-14 sm:size-16 rounded-2xl bg-zinc-900/80 border border-white/10 shrink-0 overflow-hidden shadow-xl flex items-center justify-center">
                    {getAssetUrl(mainActivity.assets?.large_image, mainActivity.application_id) ? (
                      <img 
                        src={getAssetUrl(mainActivity.assets?.large_image, mainActivity.application_id)!} 
                        alt={mainActivity.name} 
                        className="size-full object-cover"
                      />
                    ) : (
                      <RiGamepadLine className="text-2xl text-indigo-400" />
                    )}
                    {mainActivity.assets?.small_image && (
                      <div className="absolute -bottom-1 -right-1 size-6 rounded-full border-2 border-[#161619] bg-zinc-900 overflow-hidden">
                        <img 
                          src={getAssetUrl(mainActivity.assets?.small_image, mainActivity.application_id)!} 
                          alt="badge" 
                          className="size-full object-cover" 
                        />
                      </div>
                    )}
                  </div>

                  {/* Activity Details */}
                  <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-tight truncate">
                      {mainActivity.name}
                    </h3>
                    {mainActivity.details && (
                      <p className="text-xs sm:text-[13px] text-zinc-300 font-medium truncate lowercase">
                        {mainActivity.details}
                      </p>
                    )}
                    {mainActivity.state && (
                      <p className="text-xs text-zinc-400 truncate lowercase">
                        {mainActivity.state}
                      </p>
                    )}
                    {mainActivity.timestamps?.start && (
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-indigo-300/80 mt-0.5">
                        <RiTimeLine className="text-xs" />
                        <span>{formatElapsedTime(mainActivity.timestamps.start)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 text-zinc-500 font-satoshi pl-0.5">
                  <div className="size-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-zinc-600">
                    <RiCodeSSlashLine className="text-lg" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-zinc-400 font-medium lowercase">no activity running rn</span>
                    <span className="text-xs text-zinc-600 lowercase">open vs code or a game to broadcast here</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CARD 4: SPOTIFY FEED LOG */}
          <div className="md:col-span-5 bg-[#161619]/20 hover:bg-[#161619]/40 border border-zinc-900/60 hover:border-zinc-800 rounded-2xl p-7 flex flex-col justify-between min-h-[230px] transition-all duration-300 relative group backdrop-blur-xl overflow-hidden">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2.5 text-[12px] text-zinc-500 lowercase tracking-wide font-satoshi opacity-60">
                <RiSpotifyLine className="text-base text-[#1ed760]" />
                <span>spotify</span>
              </div>
              {lanyard?.listening_to_spotify && (
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#1ed760] bg-[#1ed760]/10 border border-[#1ed760]/20 px-2 py-0.5 rounded-full lowercase">
                  <span className="size-1.5 rounded-full bg-[#1ed760] animate-ping" />
                  <span>listening</span>
                </div>
              )}
            </div>

            <div className="my-auto py-3">
              {lanyard?.listening_to_spotify && lanyard.spotify ? (
                <div className="flex items-center gap-4">
                  {/* Album Cover Art */}
                  <div className="relative size-14 sm:size-16 rounded-2xl bg-zinc-900 border border-white/10 shrink-0 overflow-hidden shadow-xl group/art">
                    <img 
                      src={lanyard.spotify.album_art_url} 
                      alt={lanyard.spotify.album} 
                      className="size-full object-cover transition-transform duration-500 group-hover/art:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover/art:opacity-100 transition-opacity">
                      <RiSpotifyLine className="text-xl text-[#1ed760]" />
                    </div>
                  </div>

                  {/* Song Metadata */}
                  <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                    <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-tight truncate">
                      {lanyard.spotify.song}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-zinc-300 font-medium truncate">
                      {lanyard.spotify.artist}
                    </p>
                    <p className="text-[11px] text-zinc-500 truncate">
                      {lanyard.spotify.album}
                    </p>

                    {/* Progress Bar */}
                    {lanyard.spotify.timestamps?.start && lanyard.spotify.timestamps?.end && (
                      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-2">
                        <div 
                          className="h-full bg-[#1ed760] rounded-full transition-all duration-1000 ease-linear"
                          style={{
                            width: `${Math.min(100, Math.max(0, ((nowTime - lanyard.spotify.timestamps.start) / (lanyard.spotify.timestamps.end - lanyard.spotify.timestamps.start)) * 100))}%`
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 text-zinc-500 font-satoshi pl-0.5">
                  <div className="size-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-zinc-600">
                    <RiSpotifyLine className="text-lg" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-zinc-400 font-medium lowercase">nothing playing rn</span>
                    <span className="text-xs text-zinc-600 lowercase">open spotify to stream live track info</span>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}