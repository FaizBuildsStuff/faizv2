import { NextResponse } from 'next/server';

// Temporary global in-memory footprint store for rapid serverless runtime tracking
// For full multi-region edge safety, hook this store directly into a Redis/Upstash instance
const activeSockets = new Map<string, number>();

export async function GET(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'anonymous-peer';
  const now = Date.now();
  
  // Register or refresh this peer footprint inside our local track map
  activeSockets.set(ip, now);
  
  // Prune any stale connections older than 15 seconds
  for (const [peerIp, lastSeen] of activeSockets.entries()) {
    if (now - lastSeen > 15000) {
      activeSockets.delete(peerIp);
    }
  }
  
  return NextResponse.json(
    { count: Math.max(1, activeSockets.size) },
    { headers: { 'Cache-Control': 'no-store, max-age=0' } }
  );
}