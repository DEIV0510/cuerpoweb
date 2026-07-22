'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Printer, RotateCcw, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { shareResult } from '@/lib/share';
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
    'Tu navegador no permitió compartir ni copiar. Puedes usar el botón de imprimir para guardar tu ficha.',
};

/** Acciones disponibles sobre el resultado. */
export function ResultActions({ result }: ResultActionsProps) {
  const router = useRouter();
  const [status, setStatus] = useState('');

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
  }

  return (
    <div className="no-print flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button onClick={handleRestart} size="lg" className="w-full sm:w-auto">
          <RotateCcw aria-hidden="true" className="h-4 w-4" />
          Realizar otro análisis
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
          variant="secondary"
          size="lg"
          onClick={handleShare}
          className="w-full sm:w-auto"
        >
          <Share2 aria-hidden="true" className="h-4 w-4" />
          Compartir resumen
        </Button>
      </div>

      <p aria-live="polite" className="min-h-6 text-sm text-muted">
        {status}
      </p>

      <p className="text-sm text-muted">
        El resumen que se comparte incluye tu silueta y algunas recomendaciones, no
        tus medidas.
      </p>
    </div>
  );
}
