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
  'En esta versión no se suben fotografías: la aplicación no solicita acceso a la cámara ni a tus archivos.',
  'Tus medidas se procesan dentro del navegador. No viajan a ningún servidor ni a servicios de terceros.',
  'No se requiere crear una cuenta ni iniciar sesión.',
  'El último resultado puede guardarse localmente en tu dispositivo para que puedas volver a consultarlo.',
  'Puedes eliminar esos datos cuando quieras desde esta misma página.',
  'No se venden ni se comparten medidas personales.',
];

export default function PrivacidadPage() {
  return (
    <>
      <PageHeader
        eyebrow="Privacidad"
        title="Tus datos se quedan contigo"
        description="Esta herramienta está pensada para funcionar sin cuentas, sin servidores y sin recopilar información personal."
      />

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-12 sm:px-6 sm:py-16">
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

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/analisis" className={buttonClasses('primary', 'lg')}>
            Realizar mi análisis
          </Link>
          <Link href="/metodologia" className={buttonClasses('secondary', 'lg')}>
            Ver la metodología
          </Link>
        </div>
      </div>
    </>
  );
}
