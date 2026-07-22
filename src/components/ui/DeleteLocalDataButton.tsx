'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { clearAnalysis } from '@/lib/storage';

/** Elimina el análisis guardado en el dispositivo. */
export function DeleteLocalDataButton() {
  const [message, setMessage] = useState('');

  function handleDelete() {
    const existed = clearAnalysis();
    setMessage(
      existed
        ? 'Listo: tu resultado guardado se eliminó de este dispositivo.'
        : 'No había ningún resultado guardado en este dispositivo.',
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <Button variant="danger" size="lg" onClick={handleDelete} className="w-full sm:w-fit">
        <Trash2 aria-hidden="true" className="h-4 w-4" />
        Eliminar mis datos guardados
      </Button>

      <p aria-live="polite" className="min-h-6 text-sm text-success">
        {message}
      </p>
    </div>
  );
}
