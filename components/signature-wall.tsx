"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  PenTool,
  Highlighter,
  Pencil,
  Hand,
  RotateCcw,
  Compass,
  Sparkles,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export type PenType = "fine" | "marker" | "pencil";
type ToolMode = PenType | "pan";

export interface SignatureStroke {
  id: string;
  d: string;
  color: string;
  width: number;
  pen: PenType;
  createdAt: number;
}

interface Point {
  x: number;
  y: number;
}

const PEN_OPTIONS: {
  id: PenType;
  label: string;
  width: number;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "fine", label: "Fine", width: 2.2, icon: PenTool },
  { id: "marker", label: "Marker", width: 4.5, icon: Highlighter },
  { id: "pencil", label: "Pencil", width: 2.5, icon: Pencil },
];

const INK_COLORS = [
  { id: "black", value: "#171717", label: "Charcoal" },
  { id: "blue", value: "#2563EB", label: "Cobalt" },
  { id: "red", value: "#DC2626", label: "Vermilion" },
  { id: "green", value: "#059669", label: "Emerald" },
  { id: "orange", value: "#D97706", label: "Amber" },
];

// Large movable canvas bounds (in canvas world pixels around origin 0,0)
const MAX_PAN_X = 1400;
const MAX_PAN_Y = 800;

function pointsToSmoothSvgPath(points: Point[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) {
    const p = points[0];
    return `M ${p.x.toFixed(1)} ${p.y.toFixed(1)} L ${(p.x + 0.5).toFixed(1)} ${(p.y + 0.5).toFixed(1)}`;
  }

  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 1; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];
    const midX = (curr.x + next.x) / 2;
    const midY = (curr.y + next.y) / 2;
    d += ` Q ${curr.x.toFixed(1)} ${curr.y.toFixed(1)}, ${midX.toFixed(1)} ${midY.toFixed(1)}`;
  }
  const last = points[points.length - 1];
  d += ` L ${last.x.toFixed(1)} ${last.y.toFixed(1)}`;
  return d;
}

function getStrokeCenter(d: string): Point | null {
  const m = d.match(/M\s*(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/);
  if (!m) return null;
  return { x: parseFloat(m[1]), y: parseFloat(m[2]) };
}

export default function SignatureWall() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const [strokes, setStrokes] = useState<SignatureStroke[]>([]);
  const [myStrokeIds, setMyStrokeIds] = useState<string[]>([]);
  const [activeTool, setActiveTool] = useState<ToolMode>("fine");
  const [lastPen, setLastPen] = useState<PenType>("fine");
  const [activeColor, setActiveColor] = useState<string>("#171717");
  const [isSaving, setIsSaving] = useState(false);

  // Panning state (world offset in px)
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 });
  const panRef = useRef<Point>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const isPanningRef = useRef(false);
  const [isSpaceDown, setIsSpaceDown] = useState(false);
  const panStartRef = useRef<{
    clientX: number;
    clientY: number;
    panX: number;
    panY: number;
  } | null>(null);

  // Drawing state + synchronous refs so fast strokes never drop points
  const [currentPoints, setCurrentPoints] = useState<Point[]>([]);
  const currentPointsRef = useRef<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const isDrawingRef = useRef(false);

  const deletedIdsRef = useRef<Set<string>>(new Set());
  const locateIndexRef = useRef<number>(0);

  useEffect(() => {
    panRef.current = pan;
  }, [pan]);

  const mergeServerStrokes = useCallback((incoming: SignatureStroke[]) => {
    setStrokes((prev) => {
      const map = new Map<string, SignatureStroke>();
      for (const s of prev) {
        if (!deletedIdsRef.current.has(s.id)) map.set(s.id, s);
      }
      for (const s of incoming) {
        if (!deletedIdsRef.current.has(s.id)) map.set(s.id, s);
      }
      return Array.from(map.values()).sort(
        (a, b) => a.createdAt - b.createdAt
      );
    });
  }, []);

  const fetchSignatures = useCallback(async () => {
    try {
      const res = await fetch(`/api/signatures?t=${Date.now()}`, {
        cache: "no-store",
        headers: { Pragma: "no-cache", "Cache-Control": "no-cache" },
      });
      if (!res.ok) return;
      const data = (await res.json()) as { strokes?: SignatureStroke[] };
      if (!Array.isArray(data?.strokes)) return;
      mergeServerStrokes(data.strokes);
    } catch {}
  }, [mergeServerStrokes]);

  // Initial fetch + live polling every 2.5s + instant sync on tab focus
  useEffect(() => {
    fetchSignatures();
    const interval = setInterval(fetchSignatures, 2500);
    const onFocus = () => fetchSignatures();
    const onVisibility = () => {
      if (document.visibilityState === "visible") fetchSignatures();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [fetchSignatures]);

  // Spacebar shortcut to temporarily pan while drawing
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.code === "Space" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        setIsSpaceDown(true);
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setIsSpaceDown(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  useGSAP(
    () => {
      gsap.fromTo(
        ".sig-wall-reveal",
        { y: 12, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.06,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 88%",
          },
        }
      );
    },
    { scope: sectionRef }
  );

  const clampPan = (x: number, y: number): Point => ({
    x: Math.max(-MAX_PAN_X, Math.min(MAX_PAN_X, x)),
    y: Math.max(-MAX_PAN_Y, Math.min(MAX_PAN_Y, y)),
  });

  const getWorldPoint = (
    e: React.PointerEvent<HTMLDivElement>
  ): Point | null => {
    if (!stageRef.current) return null;
    const rect = stageRef.current.getBoundingClientRect();
    const localX = e.clientX - rect.left;
    const localY = e.clientY - rect.top;
    return {
      x: localX - panRef.current.x,
      y: localY - panRef.current.y,
    };
  };

  const persistStrokeWithRetry = useCallback(
    async (stroke: SignatureStroke) => {
      setIsSaving(true);
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const res = await fetch("/api/signatures", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ stroke }),
            keepalive: true,
          });
          if (res.ok) {
            const data = (await res.json()) as { strokes?: SignatureStroke[] };
            if (Array.isArray(data?.strokes)) {
              mergeServerStrokes(data.strokes);
            }
            setIsSaving(false);
            return;
          }
        } catch {}
        await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
      }
      setIsSaving(false);
    },
    [mergeServerStrokes]
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const shouldPan =
      activeTool === "pan" ||
      isSpaceDown ||
      e.button === 1 ||
      e.button === 2;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}

    if (shouldPan) {
      isPanningRef.current = true;
      setIsPanning(true);
      panStartRef.current = {
        clientX: e.clientX,
        clientY: e.clientY,
        panX: panRef.current.x,
        panY: panRef.current.y,
      };
      return;
    }

    if (e.button !== 0 && e.pointerType === "mouse") return;
    const pt = getWorldPoint(e);
    if (!pt) return;

    isDrawingRef.current = true;
    currentPointsRef.current = [pt];
    setIsDrawing(true);
    setCurrentPoints([pt]);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isPanningRef.current && panStartRef.current) {
      const dx = e.clientX - panStartRef.current.clientX;
      const dy = e.clientY - panStartRef.current.clientY;
      const nextPan = clampPan(
        panStartRef.current.panX + dx,
        panStartRef.current.panY + dy
      );
      panRef.current = nextPan;
      setPan(nextPan);
      return;
    }

    if (!isDrawingRef.current) return;
    const pt = getWorldPoint(e);
    if (!pt) return;

    const prev = currentPointsRef.current;
    if (prev.length > 0) {
      const last = prev[prev.length - 1];
      const dist = Math.hypot(pt.x - last.x, pt.y - last.y);
      if (dist < 1.5) return;
    }

    const updated = [...prev, pt];
    currentPointsRef.current = updated;
    setCurrentPoints(updated);
  };

  const finishStroke = () => {
    if (isPanningRef.current) {
      isPanningRef.current = false;
      setIsPanning(false);
      panStartRef.current = null;
      return;
    }

    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    setIsDrawing(false);

    const pts = currentPointsRef.current;
    currentPointsRef.current = [];
    setCurrentPoints([]);

    if (pts.length === 0) return;

    const penType: PenType = activeTool === "pan" ? lastPen : activeTool;
    const penConfig =
      PEN_OPTIONS.find((p) => p.id === penType) || PEN_OPTIONS[0];
    const d = pointsToSmoothSvgPath(pts);

    const newStroke: SignatureStroke = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      d,
      color: activeColor,
      width: penConfig.width,
      pen: penType,
      createdAt: Date.now(),
    };

    setMyStrokeIds((prev) => [...prev, newStroke.id]);
    setStrokes((prev) => [...prev, newStroke]);
    persistStrokeWithRetry(newStroke);
  };

  const handleUndoMyLastStroke = () => {
    if (myStrokeIds.length === 0) return;
    const lastId = myStrokeIds[myStrokeIds.length - 1];
    deletedIdsRef.current.add(lastId);
    setMyStrokeIds((prev) => prev.slice(0, -1));
    setStrokes((prev) => prev.filter((s) => s.id !== lastId));

    fetch(`/api/signatures?id=${encodeURIComponent(lastId)}`, {
      method: "DELETE",
      keepalive: true,
    }).catch(() => {});
  };

  const handleLocateLatestSignature = () => {
    if (strokes.length === 0 || !stageRef.current) {
      setPan({ x: 0, y: 0 });
      return;
    }
    // Group strokes that are far apart into clusters so clicking Locate cycles through signatures across the wall
    const clusters: Point[] = [];
    for (let i = strokes.length - 1; i >= 0; i--) {
      const pt = getStrokeCenter(strokes[i].d);
      if (!pt) continue;
      const existsNearby = clusters.some(
        (c) => Math.hypot(c.x - pt.x, c.y - pt.y) < 180
      );
      if (!existsNearby) clusters.push(pt);
    }

    if (clusters.length === 0) {
      setPan({ x: 0, y: 0 });
      return;
    }

    const idx = locateIndexRef.current % clusters.length;
    locateIndexRef.current = idx + 1;
    const target = clusters[idx];
    const rect = stageRef.current.getBoundingClientRect();
    const desiredPan = clampPan(
      rect.width / 2 - target.x,
      rect.height / 2 - target.y
    );
    panRef.current = desiredPan;
    setPan(desiredPan);
  };

  const selectPen = (pen: PenType) => {
    setLastPen(pen);
    setActiveTool(pen);
  };

  const currentPenType: PenType = activeTool === "pan" ? lastPen : activeTool;
  const activePenWidth =
    PEN_OPTIONS.find((p) => p.id === currentPenType)?.width || 2.2;
  const livePathD = pointsToSmoothSvgPath(currentPoints);
  const isMoveCursor = activeTool === "pan" || isSpaceDown;

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#FAFAF9] text-black py-1 sm:py-2 px-4 sm:px-6 lg:px-8 flex flex-col items-center"
    >
      <div className="w-full max-w-[680px] mx-auto px-1 sm:px-2">
        {/* SECTION HEADER */}
        <div className="mb-3.5 sm:mb-4 flex items-baseline justify-between gap-2">
          <h2 className="sig-wall-reveal text-foreground/40 font-mono text-xs sm:text-sm uppercase tracking-wide shrink-0">
            Sign the wall
          </h2>
          <div className="sig-wall-reveal flex items-center gap-1.5 font-mono text-[11px] sm:text-xs text-neutral-400 truncate">
            <span
              className={`size-1.5 rounded-full shrink-0 ${
                isSaving
                  ? "bg-amber-500 animate-pulse"
                  : "bg-emerald-500"
              }`}
            />
            <span className="truncate">
              {isSaving
                ? "saving signature..."
                : `live · ${strokes.length} ${strokes.length === 1 ? "stroke" : "strokes"} · pan & sign`}
            </span>
          </div>
        </div>

        {/* BOUNDED MOVABLE SIGNATURE CANVAS CARD */}
        <div className="sig-wall-reveal rounded-[20px] border border-neutral-200/80 bg-white p-2 shadow-[0_2px_10px_rgba(0,0,0,0.02)] select-none">
          {/* Interactive Viewport Window */}
          <div
            ref={stageRef}
            onContextMenu={(e) => e.preventDefault()}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={finishStroke}
            onPointerCancel={finishStroke}
            onLostPointerCapture={finishStroke}
            className={`relative w-full h-[220px] sm:h-[280px] overflow-hidden rounded-[14px] border border-neutral-200/60 bg-[#FAFAF9]/70 touch-none ${
              isPanning
                ? "cursor-grabbing"
                : isMoveCursor
                  ? "cursor-grab"
                  : "cursor-crosshair"
            }`}
            style={{
              backgroundImage:
                "radial-gradient(rgba(0,0,0,0.085) 1px, transparent 1px)",
              backgroundSize: "18px 18px",
              backgroundPosition: `${pan.x}px ${pan.y}px`,
            }}
          >
            {/* Subtle Coordinate, Locate Signatures & Recenter Controls in Top-Right */}
            <div
              onPointerDown={(e) => e.stopPropagation()}
              className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5"
            >
              {strokes.length > 0 && (
                <button
                  type="button"
                  onClick={handleLocateLatestSignature}
                  title="Jump to signatures on the wall"
                  className="inline-flex items-center gap-1 rounded-full border border-neutral-200/80 bg-white/90 px-2 py-0.5 font-mono text-[10px] text-neutral-600 hover:border-neutral-300 hover:text-black backdrop-blur-xs transition-colors cursor-pointer"
                >
                  <Sparkles className="size-2.5" />
                  <span>Locate</span>
                </button>
              )}
              <span className="rounded-full border border-neutral-200/80 bg-white/90 px-2.5 py-0.5 font-mono text-[10px] text-neutral-500 backdrop-blur-xs tabular-nums">
                {Math.round(-pan.x)}, {Math.round(-pan.y)}
              </span>
              {(pan.x !== 0 || pan.y !== 0) && (
                <button
                  type="button"
                  onClick={() => {
                    panRef.current = { x: 0, y: 0 };
                    setPan({ x: 0, y: 0 });
                  }}
                  className="inline-flex items-center gap-1 rounded-full border border-neutral-200/80 bg-white/90 px-2 py-0.5 font-mono text-[10px] text-neutral-700 hover:border-neutral-300 hover:text-black backdrop-blur-xs transition-colors cursor-pointer"
                >
                  <Compass className="size-2.5" />
                  <span>Center</span>
                </button>
              )}
            </div>

            {strokes.length === 0 && !isDrawing && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-4 text-center">
                <span className="font-mono text-[11px] sm:text-xs text-neutral-400/80">
                  Draw your signature · Use Move to pan around the wall
                </span>
              </div>
            )}

            <svg className="pointer-events-none h-full w-full overflow-visible">
              <defs>
                <filter
                  id="wall-pencil-texture"
                  filterUnits="userSpaceOnUse"
                  x="-2000"
                  y="-2000"
                  width="5000"
                  height="5000"
                >
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.85"
                    numOctaves="3"
                    result="noise"
                  />
                  <feDisplacementMap
                    in="SourceGraphic"
                    in2="noise"
                    scale="1.4"
                    xChannelSelector="R"
                    yChannelSelector="G"
                  />
                </filter>
              </defs>
              <g transform={`translate(${pan.x}, ${pan.y})`}>
                {/* Permanently saved strokes from Neon DB */}
                {strokes.map((stroke) => (
                  <path
                    key={stroke.id}
                    d={stroke.d}
                    fill="none"
                    stroke={stroke.color}
                    strokeWidth={stroke.width}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity={stroke.pen === "marker" ? 0.82 : 0.95}
                    style={
                      stroke.pen === "pencil"
                        ? { filter: "url(#wall-pencil-texture)" }
                        : undefined
                    }
                  />
                ))}

                {/* Active stroke currently being drawn */}
                {isDrawing && livePathD && (
                  <path
                    d={livePathD}
                    fill="none"
                    stroke={activeColor}
                    strokeWidth={activePenWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity={currentPenType === "marker" ? 0.82 : 0.95}
                    style={
                      currentPenType === "pencil"
                        ? { filter: "url(#wall-pencil-texture)" }
                        : undefined
                    }
                  />
                )}
              </g>
            </svg>
          </div>

          {/* MINIMALIST PEN, MOVE & INK TOOLBAR */}
          <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-2 px-1 sm:px-1.5 py-1">
            {/* Pen Type + Move Mode Selector */}
            <div className="flex items-center justify-between sm:justify-start gap-0.5 sm:gap-1 rounded-full border border-neutral-200/80 bg-[#FAFAF9] p-0.5 w-full sm:w-auto">
              {PEN_OPTIONS.map((pen) => {
                const Icon = pen.icon;
                const isSelected = activeTool === pen.id;
                return (
                  <button
                    key={pen.id}
                    type="button"
                    onClick={() => selectPen(pen.id)}
                    className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 sm:gap-1.5 rounded-full px-2 sm:px-2.5 py-1 text-[11.5px] sm:text-xs font-medium transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-neutral-900 text-white shadow-2xs"
                        : "text-neutral-600 hover:text-neutral-950"
                    }`}
                  >
                    <Icon className="size-3 shrink-0" />
                    <span>{pen.label}</span>
                  </button>
                );
              })}

              <span className="h-3.5 w-[1px] bg-neutral-200 mx-0.5 shrink-0" />

              <button
                type="button"
                onClick={() =>
                  setActiveTool(activeTool === "pan" ? lastPen : "pan")
                }
                className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 sm:gap-1.5 rounded-full px-2 sm:px-2.5 py-1 text-[11.5px] sm:text-xs font-medium transition-colors cursor-pointer ${
                  activeTool === "pan"
                    ? "bg-neutral-900 text-white shadow-2xs"
                    : "text-neutral-600 hover:text-neutral-950"
                }`}
              >
                <Hand className="size-3 shrink-0" />
                <span>Move</span>
              </button>
            </div>

            {/* Ink Swatches + Undo */}
            <div className="flex items-center justify-between sm:justify-end gap-3 px-1 sm:px-0">
              <div className="flex items-center gap-2 sm:gap-1.5">
                {INK_COLORS.map((ink) => {
                  const isSelected = activeColor === ink.value;
                  return (
                    <button
                      key={ink.id}
                      type="button"
                      aria-label={ink.label}
                      onClick={() => {
                        setActiveColor(ink.value);
                        if (activeTool === "pan") setActiveTool(lastPen);
                      }}
                      className={`size-4.5 sm:size-4 rounded-full transition-transform cursor-pointer ${
                        isSelected
                          ? "scale-115 ring-2 ring-neutral-900 ring-offset-2 ring-offset-white"
                          : "opacity-75 hover:opacity-100 hover:scale-105"
                      }`}
                      style={{ backgroundColor: ink.value }}
                    />
                  );
                })}
              </div>

              {myStrokeIds.length > 0 && (
                <button
                  type="button"
                  onClick={handleUndoMyLastStroke}
                  className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-white px-2.5 py-1 font-mono text-[11px] text-neutral-600 hover:border-neutral-300 hover:text-neutral-950 transition-colors cursor-pointer"
                >
                  <RotateCcw className="size-3" />
                  <span>Undo</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
