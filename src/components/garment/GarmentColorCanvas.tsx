'use client';

import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { sampleColorAt, type RGB } from '@/lib/garment/color';

interface GarmentColorCanvasProps {
  src: string;
  /** Se llama con el color muestreado cada vez que la persona toca la imagen. */
  onSample: (rgb: RGB) => void;
  /** Punto inicial normalizado (0 a 1). */
  initialPoint?: { x: number; y: number };
}

/**
 * Muestra la foto de la prenda y deja tomar su color tocándola.
 *
 * La imagen se dibuja en un canvas oculto a su resolución natural para leer
 * los píxeles; nunca se sube ni se guarda.
 */
export function GarmentColorCanvas({
  src,
  onSample,
  initialPoint = { x: 0.5, y: 0.5 },
}: GarmentColorCanvasProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [point, setPoint] = useState(initialPoint);
  // La marca solo se muestra cuando el canvas de ESTA foto está listo.
  const [readySrc, setReadySrc] = useState<string | null>(null);
  const ready = readySrc === src;

  /** Dibuja la imagen en el canvas oculto para poder leer sus píxeles. */
  function prepareCanvas() {
    const img = imgRef.current;
    if (!img || img.naturalWidth === 0) return;

    const maxSide = 240;
    const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
    const w = Math.max(1, Math.round(img.naturalWidth * scale));
    const h = Math.max(1, Math.round(img.naturalHeight * scale));

    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    ctx.drawImage(img, 0, 0, w, h);
    canvasRef.current = canvas;
    setReadySrc(src);
    sampleAt(initialPoint.x, initialPoint.y);
  }

  function sampleAt(x: number, y: number) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    try {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const rgb = sampleColorAt(
        { data: imageData.data, width: canvas.width, height: canvas.height },
        x,
        y,
        4,
      );
      onSample(rgb);
    } catch {
      // Si el navegador bloquea la lectura del canvas, no se muestrea.
    }
  }

  function handlePointer(event: ReactPointerEvent<HTMLDivElement>) {
    const img = imgRef.current;
    if (!img) return;
    const rect = img.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const x = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
    const y = Math.min(Math.max((event.clientY - rect.top) / rect.height, 0), 1);
    setPoint({ x, y });
    sampleAt(x, y);
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        onPointerDown={handlePointer}
        onPointerMove={(event) => {
          if (event.buttons === 1) handlePointer(event);
        }}
        className="relative inline-block cursor-crosshair touch-none select-none overflow-hidden rounded-card border border-line bg-ink/5"
      >
        {/* La foto es una URL temporal en memoria: no sale del dispositivo. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={src}
          alt="Tu prenda. Tócala para tomar su color."
          draggable={false}
          onLoad={prepareCanvas}
          className="block max-h-[46dvh] w-auto max-w-full"
        />

        {ready ? (
          <span
            aria-hidden="true"
            style={{ left: `${point.x * 100}%`, top: `${point.y * 100}%` }}
            className="pointer-events-none absolute h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-glow ring-2 ring-brand"
          />
        ) : null}
      </div>
      <p className="text-sm text-muted">Toca tu prenda para tomar su color.</p>
    </div>
  );
}
