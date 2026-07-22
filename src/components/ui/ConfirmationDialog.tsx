'use client';

import { AlertTriangle } from 'lucide-react';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';

interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  description: string;
  /** Puntos adicionales para revisar. */
  details?: string[];
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Confirmación presentada como panel inferior, cómoda con una sola mano. */
export function ConfirmationDialog({
  open,
  title,
  description,
  details = [],
  confirmLabel = 'Confirmar y continuar',
  cancelLabel = 'Revisar medidas',
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  return (
    <BottomSheet
      open={open}
      onClose={onCancel}
      title={title}
      role="alertdialog"
      footer={
        <div className="flex flex-col gap-2.5">
          <Button size="lg" onClick={onConfirm} className="w-full">
            {confirmLabel}
          </Button>
          <Button variant="ghost" size="lg" onClick={onCancel} className="w-full">
            {cancelLabel}
          </Button>
        </div>
      }
    >
      <div className="flex gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft">
          <AlertTriangle aria-hidden="true" className="h-5 w-5 text-brand-dark" />
        </span>
        <p className="text-[0.95rem] text-muted">{description}</p>
      </div>

      {details.length > 0 ? (
        <ul className="mt-4 flex flex-col gap-2 text-sm text-muted">
          {details.map((detail) => (
            <li key={detail} className="rounded-2xl bg-shell p-4">
              {detail}
            </li>
          ))}
        </ul>
      ) : null}
    </BottomSheet>
  );
}
