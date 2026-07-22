'use client';

import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { cn } from '@/lib/utils';

/** Punto arrastrable sobre la foto, en coordenadas normalizadas 0 a 1. */
export interface CanvasPoint {
  id: string;
  x: number;
  y: number;
  /** Eje en el que puede moverse. */
  axis: 'x' | 'y' | 'both';
  /** Descripción para lector de pantalla. */
  label: string;
}

interface PhotoCanvasProps {
  src: string;
  points: CanvasPoint[];
  onMove: (id: string, x: number, y: number) => void;
  /** Recibe ancho ÷ alto de la imagen cuando termina de cargar. */
  onImageLoad: (aspectRatio: number) => void;
  /** Segmentos dibujados entre dos puntos. */
  connections?: Array<[string, string]>;
  /** Líneas horizontales de ancho completo a la altura de estos puntos. */
  rulers?: string[];
}

const STEP = 0.01;
const BIG_STEP = 0.05;

function clamp(value: number): number {
  return Math.min(Math.max(value, 0), 1);
}

/**
 * Foto con marcadores arrastrables.
 *
 * Los puntos se guardan en coordenadas normalizadas respecto a la imagen, así
 * que el resultado no depende del tamaño de la pantalla. Funciona con dedo,
 * ratón y teclado (flechas).
 */
export function PhotoCanvas({
  src,
  points,
  onMove,
  onImageLoad,
  connections = [],
  rulers = [],
}: PhotoCanvasProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<string | null>(null);

  function updateFromPointer(point: CanvasPoint, clientX: number, clientY: number) {
    const frame = frameRef.current;
    if (!frame) return;

    const rect = frame.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const nextX = point.axis === 'y' ? point.x : clamp((clientX - rect.left) / rect.width);
    const nextY = point.axis === 'x' ? point.y : clamp((clientY - rect.top) / rect.height);

    onMove(point.id, nextX, nextY);
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLButtonElement>, point: CanvasPoint) {
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Algunos navegadores rechazan la captura si el puntero ya no está activo.
    }
    setDragging(point.id);
    updateFromPointer(point, event.clientX, event.clientY);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLButtonElement>, point: CanvasPoint) {
    if (dragging !== point.id) return;
    event.preventDefault();
    updateFromPointer(point, event.clientX, event.clientY);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, point: CanvasPoint) {
    const amount = event.shiftKey ? BIG_STEP : STEP;
    let { x, y } = point;

    switch (event.key) {
      case 'ArrowLeft':
        if (point.axis === 'y') return;
        x = clamp(x - amount);
        break;
      case 'ArrowRight':
        if (point.axis === 'y') return;
        x = clamp(x + amount);
        break;
      case 'ArrowUp':
        if (point.axis === 'x') return;
        y = clamp(y - amount);
        break;
      case 'ArrowDown':
        if (point.axis === 'x') return;
        y = clamp(y + amount);
        break;
      default:
        return;
    }

    event.preventDefault();
    onMove(point.id, x, y);
  }

  const byId = new Map(points.map((point) => [point.id, point]));

  return (
    <div className="flex justify-center">
      <div
        ref={frameRef}
        className="relative inline-block touch-none select-none overflow-hidden rounded-card border border-line bg-ink/5"
      >
        {/* La foto nunca sale del dispositivo: es una URL temporal en memoria. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt="Tu fotografía con las marcas de medición"
          draggable={false}
          onLoad={(event) => {
            const image = event.currentTarget;
            if (image.naturalHeight > 0) {
              onImageLoad(image.naturalWidth / image.naturalHeight);
            }
          }}
          className="block max-h-[54dvh] w-auto max-w-full"
        />

        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 h-full w-full"
        >
          {rulers.map((id) => {
            const point = byId.get(id);
            if (!point) return null;
            return (
              <line
                key={`ruler-${id}`}
                x1={0}
                x2={100}
                y1={point.y * 100}
                y2={point.y * 100}
                stroke="#ED2A8C"
                strokeWidth={0.5}
                strokeDasharray="2 1.5"
                vectorEffect="non-scaling-stroke"
              />
            );
          })}

          {connections.map(([fromId, toId]) => {
            const from = byId.get(fromId);
            const to = byId.get(toId);
            if (!from || !to) return null;
            return (
              <line
                key={`link-${fromId}-${toId}`}
                x1={from.x * 100}
                y1={from.y * 100}
                x2={to.x * 100}
                y2={to.y * 100}
                stroke="#ED2A8C"
                strokeWidth={2}
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
              />
            );
          })}
        </svg>

        {points.map((point) => (
          <button
            key={point.id}
            type="button"
            aria-label={point.label}
            onPointerDown={(event) => handlePointerDown(event, point)}
            onPointerMove={(event) => handlePointerMove(event, point)}
            onPointerUp={() => setDragging(null)}
            onPointerCancel={() => setDragging(null)}
            onKeyDown={(event) => handleKeyDown(event, point)}
            style={{ left: `${point.x * 100}%`, top: `${point.y * 100}%` }}
            className={cn(
              'absolute flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 touch-none items-center justify-center rounded-full',
              dragging === point.id ? 'z-20' : 'z-10',
            )}
          >
            <span
              className={cn(
                'block rounded-full border-2 border-white bg-brand-light shadow-glow transition-transform',
                dragging === point.id ? 'h-6 w-6 scale-110' : 'h-5 w-5',
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
