import { z } from 'zod';
import {
  MAX_HEIGHT_CM,
  MAX_MEASUREMENT_CM,
  MEASUREMENT_PATTERN,
  MIN_HEIGHT_CM,
  MIN_MEASUREMENT_CM,
  VALIDATION_MESSAGES,
  parseMeasurement,
} from '@/lib/body-shape/validation';

/** Acepta cualquier número decimal escrito con punto o coma. */
const NUMERIC_PATTERN = /^[+-]?\d+([.,]\d+)?$/;

/**
 * Los campos se manejan como texto para poder mostrar mensajes precisos y
 * aceptar coma decimal. El esquema los transforma a número al validar.
 */
function measurementField(requiredMessage: string) {
  return z
    .string()
    .trim()
    .superRefine((value, ctx) => {
      if (value.length === 0) {
        ctx.addIssue({ code: 'custom', message: requiredMessage });
        return;
      }

      if (!NUMERIC_PATTERN.test(value)) {
        ctx.addIssue({ code: 'custom', message: VALIDATION_MESSAGES.notANumber });
        return;
      }

      const parsed = parseMeasurement(value);

      if (!Number.isFinite(parsed)) {
        ctx.addIssue({ code: 'custom', message: VALIDATION_MESSAGES.notANumber });
        return;
      }

      if (parsed < MIN_MEASUREMENT_CM || parsed > MAX_MEASUREMENT_CM) {
        ctx.addIssue({ code: 'custom', message: VALIDATION_MESSAGES.outOfRange });
        return;
      }

      if (!MEASUREMENT_PATTERN.test(value)) {
        ctx.addIssue({ code: 'custom', message: VALIDATION_MESSAGES.oneDecimal });
      }
    })
    .transform(parseMeasurement);
}

/** La altura es opcional y no participa en la clasificación. */
const heightField = z
  .string()
  .trim()
  .superRefine((value, ctx) => {
    if (value.length === 0) return;

    if (!NUMERIC_PATTERN.test(value)) {
      ctx.addIssue({ code: 'custom', message: VALIDATION_MESSAGES.notANumber });
      return;
    }

    const parsed = parseMeasurement(value);
    if (parsed < MIN_HEIGHT_CM || parsed > MAX_HEIGHT_CM) {
      ctx.addIssue({
        code: 'custom',
        message: VALIDATION_MESSAGES.heightOutOfRange,
      });
    }
  })
  .transform((value) => (value.length === 0 ? undefined : parseMeasurement(value)));

/** Esquema del formulario de medidas. */
export const measurementsSchema = z.object({
  bust: measurementField(VALIDATION_MESSAGES.requiredBust),
  waist: measurementField(VALIDATION_MESSAGES.requiredWaist),
  hips: measurementField(VALIDATION_MESSAGES.requiredHips),
  height: heightField,
});

/** Valores tal como se escriben en el formulario (texto). */
export type MeasurementsFormInput = z.input<typeof measurementsSchema>;
/** Valores ya validados y convertidos a número. */
export type MeasurementsFormValues = z.output<typeof measurementsSchema>;

/** Valores iniciales del formulario. */
export const EMPTY_MEASUREMENTS_FORM: MeasurementsFormInput = {
  bust: '',
  waist: '',
  hips: '',
  height: '',
};
