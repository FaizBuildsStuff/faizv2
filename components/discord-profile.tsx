'use client';

import React, { useState, useEffect } from 'react';

interface LanyardActivity {
  type: number;
  name: string;
  details?: string;
  state?: string;
  application_id?: string;
  assets?: {
    large_image?: string;
    large_text?: string;
    small_image?: string;
    small_text?: string;
  };
  timestamps?: {
    start?: number;
    end?: number;
  };
}

interface LanyardSpotify {
  song: string;
  artist: string;
  album_art_url?: string;
  track_id?: string;
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
}

interface DiscordProfileProps {
  userId?: string;
}

// Helper component to render Discord Rich Presence Cover Assets with CDN support
function ActivityThumbnail({ activity }: { activity: LanyardActivity }) {
  const [imgError, setImgError] = useState(false);

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

  const largeImageUrl = !imgError ? getAssetUrl(activity.assets?.large_image, activity.application_id) : null;
  const smallImageUrl = !imgError ? getAssetUrl(activity.assets?.small_image, activity.application_id) : null;

  if (!largeImageUrl) {
    return (
      <div className="size-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/10 border border-indigo-500/30 flex items-center justify-center shrink-0 text-indigo-400 font-mono text-xs shadow-inner">
        ⚡
      </div>
    );
  }

  return (
    <div className="relative size-10 rounded-xl shrink-0 overflow-visible bg-white/5 border border-white/15 shadow-lg">
      <img 
        src={largeImageUrl} 
        alt={activity.assets?.large_text || activity.name} 
        title={activity.assets?.large_text || activity.name}
        onError={() => setImgError(true)}
        className="size-full rounded-xl object-cover" 
      />
      {smallImageUrl && (
        <div 
          title={activity.assets?.small_text}
          className="absolute -bottom-1 -right-1 size-4.5 rounded-full border-2 border-[#0e0e11] bg-zinc-900 overflow-hidden shadow-md"
        >
          <img 
            src={smallImageUrl} 
            alt={activity.assets?.small_text || "badge"} 
            className="size-full object-cover" 
          />
        </div>
      )}
    </div>
  );
}

// Minimalist Premium Live Synced Lyrics Ticker for Spotify
function SpotifyLyricsBox({ spotify }: { spotify: LanyardSpotify }) {
  const [lyrics, setLyrics] = useState<string[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!spotify?.song || !spotify?.artist) {
      setLyrics([]);
      return;
    }
    let active = true;
    setLoading(true);

    const cleanSong = spotify.song.replace(/\s*\(.*?\)\s*/g, '').replace(/\s*\[.*?\]\s*/g, '').trim();
    const cleanArtist = spotify.artist.split(',')[0].trim();

    fetch(`https://lrclib.net/api/get?artist_name=${encodeURIComponent(cleanArtist)}&track_name=${encodeURIComponent(cleanSong)}`)
      .then(res => res.json())
      .then(data => {
        if (!active) return;
        if (data && data.plainLyrics) {
          const lines = data.plainLyrics
            .split('\n')
            .map((l: string) => l.trim())
            .filter((l: string) => l && !l.startsWith('[') && l.length > 2);
          setLyrics(lines.length > 0 ? lines : ["♪ lost in the frequency ♪", "♪ vibes on repeat ♪"]);
        } else {
          setLyrics(["♪ listening on repeat ♪", "♪ soundtrack of the void ♪"]);
        }
        setLoading(false);
      })
      .catch(() => {
        if (active) {
          setLyrics(["♪ listening on repeat ♪"]);
          setLoading(false);
        }
      });

    return () => { active = false; };
  }, [spotify?.song, spotify?.artist]);

  useEffect(() => {
    if (lyrics.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIdx(prev => (prev + 1) % lyrics.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [lyrics]);

  if (loading || lyrics.length === 0) return null;

  return (
    <div className="mt-2.5 pt-2 border-t border-emerald-500/15 w-full flex items-center justify-between gap-2">
      <span className="text-[9px] font-mono uppercase bg-emerald-500/15 border border-emerald-500/25 text-emerald-300 px-1.5 py-0.5 rounded-md shrink-0 font-bold flex items-center gap-1 shadow-2xs">
        <span className="size-1 rounded-full bg-emerald-400 animate-pulse" />
        lyrics
      </span>
      <p className="font-sans text-[11px] text-emerald-300/95 italic truncate flex-1 text-right font-normal transition-all duration-500">
        "{lyrics[currentIdx]}"
      </p>
    </div>
  );
}

export default function DiscordProfile({ userId = "1071193261579976784" }: DiscordProfileProps) {
  const [data, setData] = useState<LanyardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchLanyard = async () => {
      try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
        const json = await res.json();
        if (json.success && json.data && isMounted) {
          setData(json.data);
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to fetch Lanyard data:", err);
        if (isMounted) setLoading(false);
      }
    };

    fetchLanyard();
    const interval = setInterval(fetchLanyard, 10000); // Live poll every 10 seconds

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [userId]);

  const handleOpenDiscord = () => {
    window.open(`https://discord.com/users/${userId}`, '_blank', 'noopener,noreferrer');
  };

  // Fallback loading state with aesthetic luxury skeleton
  if (loading || !data) {
    return (
      <div className="w-full max-w-[280px] sm:max-w-[300px] rounded-2xl p-[1px] bg-gradient-to-b from-white/[0.1] to-transparent">
        <div className="bg-[#0e0e11]/90 rounded-2xl p-4 backdrop-blur-2xl animate-pulse flex items-center gap-3 select-none">
          <div className="size-11 rounded-full bg-white/[0.06] shrink-0" />
          <div className="flex flex-col gap-2 flex-1">
            <div className="h-3 w-24 rounded bg-white/[0.08]" />
            <div className="h-2 w-16 rounded bg-white/[0.04]" />
          </div>
        </div>
      </div>
    );
  }

  const { discord_user, discord_status, activities, listening_to_spotify, spotify } = data;
  
  const displayName = discord_user.display_name || discord_user.global_name || discord_user.username;
  const username = discord_user.username;
  
  // Construct Discord CDN Avatar URL
  const avatarUrl = discord_user.avatar 
    ? `https://cdn.discordapp.com/avatars/${discord_user.id}/${discord_user.avatar}.${discord_user.avatar.startsWith('a_') ? 'gif' : 'png'}?size=256`
    : `https://cdn.discordapp.com/embed/avatars/0.png`;

  // Status mapping
  const statusColors: Record<string, string> = {
    online: "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.9)]",
    idle: "bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.9)]",
    dnd: "bg-[#ef5350] shadow-[0_0_12px_rgba(239,83,80,0.9)] animate-pulse",
    offline: "bg-zinc-500",
  };

  const statusLabels: Record<string, string> = {
    online: "online",
    idle: "idle",
    dnd: "dnd",
    offline: "offline",
  };

  const statusColorClass = statusColors[discord_status] || statusColors.offline;
  const statusText = statusLabels[discord_status] || "offline";

  // Filter out custom status (type 4) and spotify from general activities
  const primaryActivity = activities?.find(a => a.type !== 4 && a.name !== "Spotify");
  const customStatus = activities?.find(a => a.type === 4);

  return (
    /* OUTER LUXURY GRADIENT BORDER WRAPPER */
    <div 
      onClick={handleOpenDiscord}
      title="Click to view Discord Profile"
      className="group relative w-full max-w-[280px] sm:max-w-[300px] rounded-2xl p-[1px] bg-gradient-to-b from-white/[0.15] via-white/[0.05] to-transparent shadow-[0_20px_45px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.1)] transition-all duration-500 hover:from-white/[0.25] hover:via-white/[0.1] hover:to-white/[0.05] hover:shadow-[0_25px_50px_rgba(0,0,0,0.8)] cursor-pointer select-none"
    >
      {/* DEEP OBSIDIAN INNER GLASS CARD */}
      <div className="relative rounded-2xl bg-[#0c0c0e]/95 p-4 backdrop-blur-3xl overflow-hidden text-left">
        
        {/* Ambient Reactive Spotlight Glow */}
        <div className="absolute -top-16 -right-16 size-32 rounded-full bg-gradient-to-br from-indigo-500/15 via-purple-500/10 to-transparent blur-2xl group-hover:from-indigo-500/25 group-hover:via-purple-500/15 transition-all duration-700 pointer-events-none" />
        {listening_to_spotify && (
          <div className="absolute -bottom-16 -left-16 size-32 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
        )}

        {/* 1. TOP PROFILE HEADER */}
        <div className="flex items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3 min-w-0">
            {/* Avatar in Gradient Ring with Status Badge */}
            <div className="relative shrink-0 p-[2px] rounded-full bg-gradient-to-tr from-white/20 via-white/5 to-transparent group-hover:from-indigo-500/50 group-hover:via-purple-500/30 group-hover:to-transparent transition-all duration-500 shadow-md">
              <div className="relative size-10 sm:size-11 rounded-full overflow-hidden bg-zinc-900">
                <img 
                  src={avatarUrl} 
                  alt={displayName} 
                  onError={() => setImgError(true)}
                  className="size-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
              </div>
              <span className={`absolute bottom-0 right-0 size-3 rounded-full border-[2.5px] border-[#0c0c0e] ${statusColorClass} z-20`} />
            </div>

            {/* Names & Verified Badge */}
            <div className="flex flex-col justify-center min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-sans font-extrabold text-sm text-white truncate tracking-normal lowercase group-hover:text-indigo-200 transition-colors">
                  {displayName}
                </span>
                <svg className="size-3.5 text-[#5865F2] shrink-0 fill-current" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028z" />
                </svg>
              </div>
              <span className="font-mono text-[10px] text-zinc-400 tracking-wider truncate lowercase mt-0.5">
                @{username}
              </span>
            </div>
          </div>

          {/* Luxury Floating Status Pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[9px] font-mono tracking-wider lowercase shadow-inner shrink-0">
            <span className={`size-1.5 rounded-full ${statusColorClass}`} />
            <span className="text-zinc-300 font-medium">{statusText}</span>
          </div>
        </div>

        {/* 2. RICH PRESENCE / SPOTIFY MODULE */}
        {listening_to_spotify && spotify ? (
          <div className="mt-3.5 relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500/[0.1] via-emerald-500/[0.04] to-transparent border border-emerald-500/25 p-3 shadow-[inset_0_1px_0_rgba(16,185,129,0.2)] transition-all duration-300 group-hover:border-emerald-500/35 z-10">
            {/* Ambient emerald backglow */}
            <div className="absolute -left-4 -top-4 size-20 rounded-full bg-emerald-500/15 blur-xl pointer-events-none" />
            
            <div className="flex items-center gap-3 relative z-10">
              {/* STATIC ALBUM ART (No Spin!) */}
              {spotify.album_art_url ? (
                <img 
                  src={spotify.album_art_url} 
                  alt="Spotify Album Art" 
                  className="size-10 sm:size-11 rounded-lg object-cover shadow-lg shrink-0 border border-emerald-500/30" 
                />
              ) : (
                <div className="size-10 sm:size-11 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400 font-mono text-xs shadow-inner">
                  ♫
                </div>
              )}
              <div className="flex flex-col min-w-0 flex-1 justify-center">
                <span className="font-sans font-bold text-xs text-emerald-400 truncate leading-tight tracking-normal">
                  {spotify.song}
                </span>
                <span className="font-mono text-[10px] text-zinc-300 truncate mt-0.5 tracking-wide">
                  by {spotify.artist}
                </span>
              </div>
              {/* Animated Green Music Equalizer Bars */}
              <div className="flex items-end gap-0.5 h-4 shrink-0 px-0.5">
                <span className="w-0.5 bg-emerald-400 rounded-full animate-[bounce_0.8s_infinite_ease-in-out]" style={{ height: '60%' }} />
                <span className="w-0.5 bg-emerald-400 rounded-full animate-[bounce_0.8s_infinite_0.2s_ease-in-out]" style={{ height: '100%' }} />
                <span className="w-0.5 bg-emerald-400 rounded-full animate-[bounce_0.8s_infinite_0.4s_ease-in-out]" style={{ height: '40%' }} />
              </div>
            </div>

            {/* Premium Synced Lyrics Ticker */}
            <SpotifyLyricsBox spotify={spotify} />
          </div>
        ) : primaryActivity ? (
          <div className="mt-3.5 relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500/[0.08] via-purple-500/[0.03] to-transparent border border-white/10 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-all duration-300 hover:border-white/20 z-10">
            <div className="flex items-center gap-3 relative z-10">
              <ActivityThumbnail activity={primaryActivity} />

              <div className="flex flex-col min-w-0 flex-1 justify-center">
                <span className="font-sans font-bold text-xs text-white truncate leading-tight tracking-normal">
                  {primaryActivity.name}
                </span>
                {primaryActivity.details && (
                  <span className="font-mono text-[10px] text-zinc-300 truncate mt-0.5 tracking-wide">
                    {primaryActivity.details}
                  </span>
                )}
                {primaryActivity.state && (
                  <span className="font-mono text-[9px] text-zinc-400 truncate mt-0.5 tracking-wide">
                    {primaryActivity.state}
                  </span>
                )}
              </div>
            </div>
          </div>
        ) : customStatus?.state ? (
          <div className="mt-3.5 text-xs font-mono text-zinc-300 italic truncate bg-white/[0.03] p-2.5 rounded-xl border border-white/[0.06] shadow-inner relative z-10">
            "{customStatus.state}"
          </div>
        ) : null}

        {/* 3. SLEEK MINIMALIST INTERACTIVE FOOTER */}
        <div className="mt-3.5 pt-2.5 border-t border-white/[0.06] flex items-center justify-between font-mono text-[9px] text-zinc-500 group-hover:text-zinc-400 transition-colors relative z-10">
          <span className="flex items-center gap-1.5 uppercase tracking-widest font-semibold">
            <span className="size-1.5 rounded-full bg-[#5865F2] animate-pulse" />
            discord • {username}
          </span>
          <span className="text-zinc-400 group-hover:text-white transition-colors flex items-center gap-0.5 font-medium">
            open profile ↗
          </span>
        </div>

      </div>
    </div>
  );
}
