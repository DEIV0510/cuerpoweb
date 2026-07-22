'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Printer, RotateCcw, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { buildShareSummary, shareResult } from '@/lib/share';
import { clearAnalysis } from '@/lib/storage';
import type { BodyShapeResult } from '@/types/body-shape';

interface ResultActionsProps {
  result: BodyShapeResult;
}

const SHARE_MESSAGES: Record<string, string> = {
  shared: 'Resumen compartido.',
  copied: 'Resumen copiado al portapapeles.',
  cancelled: 'No se compartió el resumen.',
  unavailable:
    'Tu navegador no permitió compartir ni copiar automáticamente. Aquí tienes el resumen para copiarlo a mano.',
};

/** Acciones disponibles sobre el resultado. */
export function ResultActions({ result }: ResultActionsProps) {
  const router = useRouter();
  const [status, setStatus] = useState('');
  const [manualSummary, setManualSummary] = useState('');

  function handleRestart() {
    clearAnalysis();
    router.push('/analisis');
  }

  function handlePrint() {
    window.print();
  }

  async function handleShare() {
    setStatus('');
    const outcome = await shareResult(result);
    setStatus(SHARE_MESSAGES[outcome] ?? '');
    setManualSummary(outcome === 'unavailable' ? buildShareSummary(result) : '');
  }

  return (
    <div className="no-print flex flex-col gap-3">
      <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
        <Button onClick={handleShare} size="lg" className="w-full sm:w-auto">
          <Share2 aria-hidden="true" className="h-4 w-4" />
          Compartir resumen
        </Button>

        <Button
          variant="secondary"
          size="lg"
          onClick={handlePrint}
          className="w-full sm:w-auto"
        >
          <Printer aria-hidden="true" className="h-4 w-4" />
          Imprimir o guardar
        </Button>

        <Button
          variant="ghost"
          size="lg"
          onClick={handleRestart}
          className="w-full sm:w-auto"
        >
          <RotateCcw aria-hidden="true" className="h-4 w-4" />
          Realizar otro análisis
        </Button>
      </div>

      <p aria-live="polite" className="min-h-6 text-sm text-muted">
        {status}
      </p>

      {manualSummary ? (
        <label className="flex flex-col gap-2 text-sm text-muted">
          <span className="font-medium text-ink">Resumen para copiar</span>
          <textarea
            readOnly
            rows={8}
            value={manualSummary}
            onFocus={(event) => event.currentTarget.select()}
            className="w-full rounded-2xl border border-line bg-surface p-4 text-[0.95rem] text-ink"
          />
        </label>
      ) : null}

      <p className="text-sm text-muted">
        El resumen que se comparte incluye tu silueta y algunas recomendaciones, no
        tus medidas.
      </p>
    </div>
  );
}
