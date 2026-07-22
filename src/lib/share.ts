import type { BodyShapeResult } from '@/types/body-shape';

/** Resultado de intentar compartir. */
export type ShareOutcome = 'shared' | 'copied' | 'cancelled' | 'unavailable';

const APP_NAME = 'Analizador de silueta · Alma e Imagen';

/**
 * Construye el resumen que se comparte.
 *
 * Por privacidad, el texto no incluye las medidas exactas: solo la silueta,
 * el objetivo visual y algunas recomendaciones.
 */
export function buildShareSummary(result: BodyShapeResult): string {
  const topRecommendations = [
    result.recommendations.tops[0],
    result.recommendations.pants[0],
    result.recommendations.accessories[0],
  ].filter(Boolean);

  return [
    `${APP_NAME}`,
    '',
    `Silueta predominante: ${result.name}.`,
    `Objetivo visual: ${result.visualObjective}`,
    '',
    'Algunas recomendaciones:',
    ...topRecommendations.map((item) => `• ${item}`),
    '',
    'Resultado orientativo de imagen y vestuario.',
  ].join('\n');
}

/** Copia un texto al portapapeles con respaldo para navegadores antiguos. */
async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Continúa con el método de respaldo.
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand('copy');
    document.body.removeChild(textarea);
    return copied;
  } catch {
    return false;
  }
}

/**
 * Comparte el resumen con la Web Share API cuando está disponible.
 * Si no lo está, copia el texto al portapapeles.
 */
export async function shareResult(result: BodyShapeResult): Promise<ShareOutcome> {
  if (typeof window === 'undefined') return 'unavailable';

  const text = buildShareSummary(result);

  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      await navigator.share({ title: APP_NAME, text });
      return 'shared';
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return 'cancelled';
      }
      // Si compartir falla por otro motivo, se intenta copiar.
    }
  }

  return (await copyToClipboard(text)) ? 'copied' : 'unavailable';
}
