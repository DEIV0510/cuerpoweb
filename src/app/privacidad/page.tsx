import type { Metadata } from 'next';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { DeleteLocalDataButton } from '@/components/ui/DeleteLocalDataButton';
import { buttonClasses } from '@/components/ui/Button';
import { STORAGE_KEY } from '@/lib/storage';
import { SITE } from '@/data/navigation';

export const metadata: Metadata = {
  title: 'Privacidad y datos',
  description:
    'Qué información se guarda, dónde se guarda y cómo eliminarla del dispositivo.',
};

const POINTS = [
  'Tus medidas se procesan dentro del navegador. No viajan a ningún servidor ni a servicios de terceros.',
  'Si eliges estimar tus medidas con una foto, la imagen se abre solo en la memoria de tu dispositivo: no se sube, no se guarda y se descarta al salir de la pantalla.',
  'La aplicación no pide acceso permanente a tu cámara ni a tu galería: solo se abre el selector del sistema cuando tú lo tocas.',
  'No se requiere crear una cuenta ni iniciar sesión.',
  'El último resultado puede guardarse localmente en tu dispositivo para que puedas volver a consultarlo.',
  'Puedes eliminar esos datos cuando quieras desde esta misma página.',
  'Tu perfil de estilo y el checklist de tu armario también se guardan solo en tu dispositivo.',
  'No se venden ni se comparten tus datos personales.',
];

export default function PrivacidadPage() {
  return (
    <>
      <PageHeader
        eyebrow="Privacidad"
        title="Tus datos se quedan contigo"
        description="Esta herramienta está pensada para funcionar sin cuentas, sin servidores y sin recopilar información personal."
      />

      <div className="app-shell flex flex-col gap-4 px-gutter py-8 sm:py-12">
        <section
          aria-labelledby="que-guardamos"
          className="rounded-card border border-line bg-surface p-6 sm:p-8"
        >
          <h2 id="que-guardamos" className="text-2xl">
            Cómo se tratan tus datos
          </h2>
          <ul className="mt-5 flex flex-col gap-3">
            {POINTS.map((point) => (
              <li key={point} className="flex gap-3 text-[0.975rem] text-muted">
                <Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-success" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </section>

        <section
          aria-labelledby="donde-se-guarda"
          className="rounded-card border border-line bg-surface p-6 sm:p-8"
        >
          <h2 id="donde-se-guarda" className="text-2xl">
            Dónde queda guardado el resultado
          </h2>
          <p className="mt-3 text-muted">
            El análisis se guarda en el almacenamiento local de tu navegador
            (localStorage), bajo la clave{' '}
            <code className="rounded-md bg-shell px-2 py-0.5 text-sm">{STORAGE_KEY}</code>.
            Ese espacio pertenece a tu dispositivo y a tu navegador: no es accesible
            desde otros equipos ni desde otras personas.
          </p>
          <p className="mt-3 text-muted">
            Si usas el modo privado o incógnito, el resultado se borrará solo al
            cerrar la ventana. Si borras los datos de navegación, también
            desaparecerá.
          </p>
        </section>

        <section
          aria-labelledby="fotos"
          className="rounded-card border border-line bg-surface p-6 sm:p-8"
        >
          <h2 id="fotos" className="text-2xl">
            Qué pasa con tus fotos
          </h2>
          <p className="mt-3 text-muted">
            Toda foto que subas —para estimar tus medidas o para combinar una
            prenda— usa una <strong className="text-ink">URL temporal en memoria</strong>{' '}
            (<code className="rounded-md bg-shell px-2 py-0.5 text-sm">
              URL.createObjectURL
            </code>
            ). La imagen nunca se envía por la red, nunca se escribe en el
            almacenamiento del navegador y se libera en cuanto sales de la pantalla
            o cierras la aplicación.
          </p>
          <p className="mt-3 text-muted">
            Del análisis solo quedan guardados los datos que confirmaste (tus
            medidas o tu perfil), nunca la fotografía ni las marcas que hiciste sobre
            ella. Al combinar una prenda no se guarda nada.
          </p>
        </section>

        <section
          aria-labelledby="eliminar-datos"
          className="rounded-card border border-line bg-surface p-6 sm:p-8"
        >
          <h2 id="eliminar-datos" className="text-2xl">
            Eliminar mis datos guardados
          </h2>
          <p className="mt-3 text-muted">
            Este botón borra el análisis guardado en este dispositivo. Si no hay nada
            guardado, no ocurre nada: la aplicación te lo indicará igualmente.
          </p>
          <div className="mt-6">
            <DeleteLocalDataButton />
          </div>
        </section>

        <section
          aria-labelledby="alcance"
          className="rounded-card border border-line bg-surface p-6 sm:p-8"
        >
          <h2 id="alcance" className="text-2xl">
            Alcance de la herramienta
          </h2>
          <p className="mt-3 text-muted">{SITE.disclaimer}</p>
          <p className="mt-3 text-muted">
            Si tienes dudas sobre tu salud, tu peso o tu composición corporal,
            consulta a un profesional de la salud. Esta aplicación solo compara tres
            contornos para sugerir prendas y cortes.
          </p>
        </section>

        <div className="flex flex-col gap-2.5 sm:flex-row">
          <Link href="/analisis" className={buttonClasses('primary', 'lg', 'w-full sm:w-auto')}>
            Realizar mi análisis
          </Link>
          <Link href="/metodologia" className={buttonClasses('ghost', 'lg', 'w-full sm:w-auto')}>
            Ver la metodología
          </Link>
        </div>
      </div>
    </>
  );
}
