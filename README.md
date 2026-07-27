# Alma e Imagen · Analizador de silueta corporal

Aplicación web que identifica la **silueta corporal predominante** a partir de tres
medidas (busto, cintura y cadera) y entrega una guía completa de vestuario:
prendas, escotes, telas, estampados, accesorios y outfits completos.

Incluye además la **técnica de las 8 cabezas**, que analiza la proporción
vertical (torso, tiro y piernas) para saber qué tiro de pantalón, largo de
chaqueta y altura de zapato acompañan mejor a cada persona.

Cuando los dos análisis están hechos, la aplicación los cruza en una **fórmula
personal**: seis decisiones concretas de vestuario más las reglas escritas para
esa combinación exacta.

Está diseñada **mobile first**: es una aplicación para el teléfono que además se
adapta a tablet y escritorio, no una página de escritorio reducida. Puede
instalarse desde el navegador como PWA.

Todo el cálculo se ejecuta **dentro del navegador**. No hay servidores, cuentas,
fotografías, pagos ni servicios externos.

> **Proyecto independiente.** Esta aplicación no comparte código, dependencias,
> repositorio ni datos con la aplicación de colorimetría. No importa nada de ella
> ni escribe en su almacenamiento.

---

## Objetivo

Que cualquier persona pueda:

1. Aprender a tomarse tres medidas correctamente.
2. Registrarlas en centímetros y confirmarlas antes de calcular.
3. Recibir su silueta predominante con la **explicación matemática** del resultado.
4. Consultar recomendaciones de vestuario organizadas por categoría.
5. Imprimir, guardar o compartir un resumen.

El lenguaje de toda la aplicación es respetuoso e inclusivo: no existe una silueta
mejor ni peor, y las recomendaciones hablan de **equilibrio visual** y de
**potenciar las proporciones naturales**, nunca de corregir o disimular el cuerpo.

El resultado es una **orientación de imagen y vestuario**, no una evaluación médica.

---

## Tecnologías

| Herramienta | Uso |
| --- | --- |
| Next.js 16 (App Router) | Estructura de páginas y renderizado |
| TypeScript (modo estricto) | Tipado de dominio, datos y componentes |
| Tailwind CSS 4 | Sistema de diseño mediante tokens en `globals.css` |
| React Hook Form | Manejo del formulario de medidas |
| Zod 4 | Validación y transformación de los campos |
| Lucide React | Iconografía |
| Vitest | Pruebas unitarias del algoritmo y del esquema |
| ESLint (`eslint-config-next`) | Calidad de código |
| `next/font` | Cormorant Garamond (títulos), Montserrat (texto) y Sacramento (wordmark) |

No se usan bases de datos, APIs externas, claves ni variables de entorno.

### Identidad visual

La aplicación usa la **misma ambientación de la marca Alma e Imagen**: fondo blush
`#FFF6FA`, rosa fucsia `#D6207E` con degradado `#D6207E → #B5179E → #7E125A`, texto
en ciruela profundo `#2A1622`, botones píldora con sombra *glow*, tarjetas de
esquinas amplias y el wordmark «Alma e Imagen» en Sacramento.

Los tokens viven en `src/app/globals.css` dentro del bloque `@theme`, así que
cambiar la paleta completa es cuestión de editar ese archivo.

> Se comparte únicamente el **lenguaje visual**. No hay código, dependencias,
> repositorio ni datos compartidos con la plataforma de la academia.

---

## Instalación

```bash
npm install
```

## Comandos disponibles

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo (por defecto en `http://localhost:3000`) |
| `npm run build` | Compilación de producción |
| `npm start` | Sirve la compilación de producción |
| `npm test` | Ejecuta las pruebas unitarias con Vitest |
| `npm run test:watch` | Pruebas en modo observador |
| `npm run lint` | Revisión con ESLint |
| `npm run typecheck` | Verificación de tipos con `tsc --noEmit` |

### Cómo ejecutar

```bash
npm install
npm run dev
```

Luego abre `http://localhost:3000` en el navegador. Para usar otro puerto:

```bash
npm run dev -- -p 5240
```

### Cómo ejecutar las pruebas

```bash
npm test
```

### Cómo compilar

```bash
npm run build
npm start
```

### Cómo desplegar en Vercel

1. Sube el repositorio a GitHub.
2. En Vercel, elige **Add New → Project** e importa el repositorio.
3. Vercel detecta Next.js automáticamente: framework `Next.js`, comando de
   compilación `npm run build`.
4. No hay variables de entorno que configurar.
5. Pulsa **Deploy**.

---

## Experiencia móvil

La aplicación se construyó primero para anchos de 320 a 430 px y después se
amplió a tablet y escritorio.

**Apariencia de app**

- Encabezado compacto de 56 px con wordmark, botón de retroceso y menú.
- El análisis ocupa la pantalla completa: encabezado propio con «Paso X de 5» y
  barra de progreso, sin navegación que distraiga.
- Acción principal en una **barra inferior fija** que respeta el área segura y
  acompaña al teclado (es `sticky`, no `fixed`).
- Menú y confirmaciones como **paneles inferiores** deslizantes, con foco
  atrapado y cierre con `Escape`.
- Estado de carga cuidado mientras se calcula la silueta.

**Flujo del análisis en seis pantallas**

1. Preparación y consejos esenciales.
2. Contorno de busto.
3. Contorno de cintura.
4. Contorno de cadera.
5. Confirmación de las tres medidas (con botón «Editar» por medida).
6. Resultado.

El progreso se guarda en `localStorage` (`alma-silueta-corporal:draft`): si se
cierra la aplicación a mitad del proceso, al volver se retoma en el mismo paso y
con los valores escritos. Al terminar el análisis el borrador se elimina.

**Campos de medida**

- `inputMode="decimal"` para abrir el teclado numérico.
- 60 px de alto, número centrado a 30 px y unidad «cm» visible.
- Nunca por debajo de 16 px, para que iOS no haga zoom automático.
- Error debajo del campo con altura reservada: el diseño no salta.
- `enterKeyHint` avanza al siguiente paso desde el teclado.

**Áreas seguras**

Se usan `env(safe-area-inset-*)` en encabezado, barra inferior, paneles y pie de
página, junto con `viewport-fit=cover` e `interactive-widget=resizes-content`.

**Resultado**

Pantalla de resumen con la silueta y un botón «Ver mis recomendaciones»; después
el detalle en acordeones (`<details>`, sin JavaScript) en este orden: por qué se
obtuvo, comparación de medidas, objetivo visual, las diez categorías de prendas,
outfits completos y las acciones de compartir, imprimir o repetir el análisis.

**Verificado en** 320, 360, 375, 390, 412, 430 y 768 px: sin desplazamiento
horizontal, sin textos cortados y con áreas táctiles de 44 px o más.

---

## PWA

- `manifest.webmanifest` generado desde `src/app/manifest.ts`.
- Nombre corto **Mi silueta**, `display: standalone`, `orientation:
  portrait-primary`, color de tema `#ED2A8C` y fondo `#FFF6FA`.
- Iconos 192, 512 y 512 *maskable* en `public/`, más `apple-icon.png` (180 px) e
  `icon.svg`.
- Accesos directos a «Analizar» y «Cómo medirse» desde el icono instalado.

Para instalarla: abre la aplicación en Chrome (Android) y elige **Añadir a la
pantalla de inicio**; en iPhone, desde Safari, **Compartir → Añadir a inicio**.
Requiere HTTPS, así que funciona en el dominio publicado (o en `localhost`).

---

## Mi armario (encuesta de estilo)

Un módulo aparte, en `/armario`. Es una **encuesta** de seis preguntas (una por
pantalla, como los demás flujos) que traduce el estilo y las ocasiones de la
persona en tres cosas:

1. **Perfil de estilo** con nombre propio (arquetipo × tono), p. ej. «Clásico
   sereno» o «Ecléctico con carácter», y las prioridades por dónde empezar.
2. **Checklist de básicos** filtrado por sus ocasiones y marcado con los
   esenciales de su estilo. La persona marca lo que ya tiene y ve su progreso y
   los esenciales que le faltan. El estado se guarda en el dispositivo.
3. **Cápsulas de outfits** ya combinadas, seleccionadas por estilo, ocasión y
   tono.

Las prendas se muestran con **ilustraciones SVG propias** (componente
`GarmentIcon`), sin depender de imágenes externas. Si la persona ya analizó su
silueta, el módulo enlaza con la fórmula personal.

La lógica está en `src/lib/wardrobe/` (perfil + plan) con 26 pruebas unitarias;
el contenido editable (básicos, cápsulas, preguntas) vive en `src/data/`.

### Colorimetría (estación de color)

En `/colorimetria`, un cuestionario guiado de siete preguntas (color de las
venas, oro vs plata, reacción al sol, cabello y ojos naturales, blanco puro vs
crema, cómo sientan los colores vivos) deduce:

- **Subtono** (cálido / frío / neutro), **profundidad** (clara / profunda) y
  **croma** (vivo / suave), combinados en una de las cuatro **estaciones**:
  primavera, verano, otoño o invierno.
- La **paleta** de colores que te iluminan, tus mejores **neutros** y el
  **metal** (dorado / plateado) que te favorece.

No usa la cámara ni inteligencia artificial: son reglas sobre respuestas, así
que es una orientación. La lógica está en `src/lib/color-analysis/` con 24
pruebas unitarias.

Además, al combinar una prenda, si la persona ya hizo su colorimetría, la app
**evalúa el color de la prenda contra su estación** (`favorece` / `neutral` /
`cuidado`) y lo muestra destacado en el resultado.

### Combinar una prenda por foto

Dentro del armario, en `/armario/prenda`, la persona sube la foto de una prenda,
**toca su color sobre la imagen** y elige qué es. Con eso la app sugiere:

- **Colores que combinan**: los neutros que siempre funcionan y unos acentos
  curados según la familia de color de la prenda.
- **Con qué prendas**: qué prenda inferior, chaqueta o calzado le van; si la
  persona ya analizó su silueta, las sugerencias salen de las recomendaciones de
  esa silueta.
- **Ideas de look** y una nota según la silueta.

No usa inteligencia artificial: el color se extrae de los píxeles de la foto (se
convierte a HSL, se separa neutro de color por el croma y se clasifica en una
familia). La foto se abre como URL temporal en memoria y se libera al salir; no
se guarda nada. La lógica está en `src/lib/garment/` con 28 pruebas unitarias.

> Siguen pendientes, porque necesitan decisiones aparte: fotos reales de prendas
> (en vez de ilustraciones), cruzar con colorimetría y enlazar tiendas.

---

## La fórmula personal (guía combinada)

Cuando los **dos análisis** están hechos, la aplicación los cruza en una sola
guía. La silueta dice *qué* cortes acompañan tus contornos; la proporción
vertical dice *a qué altura* ponerlos.

El cruce produce seis decisiones concretas, calculadas con reglas fijas:

| Decisión | De dónde sale |
| --- | --- |
| Tiro del pantalón | Estrategia vertical, corregida si tu tiro es corto o largo |
| Blusa por dentro o por fuera | Estrategia vertical, con excepción para la silueta óvalo |
| Largo de chaqueta | Largo del torso, y de las piernas si el torso está en proporción |
| Altura del zapato | Largo de las piernas |
| Escote | Silueta, cambiando a su alternativa vertical si el torso es corto |
| Punto focal | Silueta |

Además añade las reglas escritas para esa pareja concreta (5 siluetas × 3
estrategias = 15 combinaciones) y aporta a cada outfit su **ajuste vertical**.

Ejemplo real: *reloj de arena* + *subir la cintura* → tiro alto, blusa por
dentro, chaqueta corta a la cintura, zapato con altura en tono continuo, escote
en V suave y punto focal en la cintura.

La fórmula aparece en `/resultado` y en `/proporciones/resultado`; si falta uno
de los dos análisis, cada página invita a completarlo. La lógica está en
`src/lib/style-guide/combined-guide.ts` con 31 pruebas unitarias.

---

## Proporción vertical · técnica de las 8 cabezas

Un segundo análisis, complementario al de la silueta, en `/proporciones`. La
silueta compara **contornos** (horizontal); esta técnica compara **alturas**
(vertical), que es lo que decide el tiro del pantalón, el largo de la chaqueta y
la altura del zapato.

**El canon**

| Tramo | Referencia |
| --- | --- |
| Coronilla a quijada | 1 cabeza (es la unidad) |
| Quijada a cintura | 2 cabezas |
| Cintura a entrepierna | 1 cabeza |
| Entrepierna a los pies | 4 cabezas |

Cada tramo se divide entre la medida de la cabeza y se compara con su
referencia. Un tramo está **en proporción** cuando la diferencia no supera
`HEAD_TOLERANCE` = 0,25 cabezas (unos 5 cm en una persona de 1,62 m); por debajo
es corto y por encima, largo.

Comparando cuánto se aleja el torso de su referencia frente a cuánto se alejan
las piernas de la suya (`resolveStrategy`), se obtiene la estrategia general:

- **Subir la línea de la cintura** — tiro alto, blusa por dentro, chaqueta corta,
  zapato en continuidad con el pantalón.
- **Alargar la línea del torso** — blusa por fuera, escote en V, cárdigan largo,
  tiro medio.
- **Equilibrio** — libertad para elegir por gusto.

Como todo se mide en cabezas, el resultado **no depende de la estatura**: dos
personas de distinta altura con la misma proporción obtienen la misma guía.

Las ocho cabezas son un canon del dibujo de figurín, no una norma de belleza:
casi ninguna persona real mide exactamente ocho, y el dato útil es el reparto
entre tramos, no el total.

La lógica vive en `src/lib/proportions/eight-heads.ts` con 28 pruebas
unitarias.

---

## Estimación con foto (opcional)

Además de escribir las medidas, la aplicación permite estimarlas desde una
fotografía en `/analisis/foto`. **No usa inteligencia artificial ni envía la
imagen a ningún servicio**: es fotogrametría guiada, y todo el cálculo ocurre en
el dispositivo.

**Cómo funciona**

1. Subes una foto de cuerpo completo (cámara o galería) e indicas tu estatura.
2. Marcas tu coronilla y tus pies sobre la foto. Como conoces tu estatura real,
   eso da la escala: cuántos centímetros representa cada píxel.
3. Marcas los bordes del cuerpo a la altura de busto, cintura y cadera; esos
   anchos se convierten a centímetros con la escala anterior.
4. Cada zona se modela como una elipse: el ancho es el eje mayor y la
   profundidad se estima como una proporción del ancho (0,80 en busto, 0,74 en
   cintura y 0,72 en cadera). El contorno es el perímetro de esa elipse,
   calculado con la aproximación de Ramanujan.
5. Las tres medidas se muestran **editables** antes de clasificar.

**Limitaciones, dichas claramente**

Una foto frontal no puede ver la profundidad del cuerpo, así que el resultado es
una estimación. La postura, la ropa, la distancia y la perspectiva de la cámara
también desplazan los valores. La cinta métrica sigue siendo el método fiable; la
foto sirve como punto de partida. El resultado queda marcado como «estimado desde
una foto».

**Privacidad de la imagen**

La foto se abre con `URL.createObjectURL` (una URL temporal en memoria), nunca se
sube ni se escribe en el almacenamiento, y se libera con `URL.revokeObjectURL` al
salir de la pantalla. Del análisis solo se guardan los tres números confirmados.

La matemática vive en `src/lib/photo/photo-estimation.ts` y está cubierta por 25
pruebas unitarias.

---

## El algoritmo

La función principal es pura, determinista y está separada de la interfaz:

```ts
import { classifyBodyShape } from '@/lib/body-shape/classify-body-shape';

const resultado = classifyBodyShape({ bust: 98, waist: 74, hips: 99 });
// resultado.type === 'hourglass'
```

Devuelve un objeto con `type`, `name`, `shortName`, `explanation`, `measurements`,
`calculatedDifferences`, `matchedRules`, `visualObjective`, `recommendations`,
`warnings` y `algorithmVersion`.

Versión actual del algoritmo: **1.0.0**.

### Variables

Con `B` = busto, `C` = cintura y `H` = cadera:

```
differenceBustHips     = |B − H|
hipsMinusBust          = H − B
bustMinusHips          = B − H
bustWaistDifference    = B − C
hipsWaistDifference    = H − C
averageBustHips        = (B + H) / 2
averageWaistDifference = averageBustHips − C
```

Todas las diferencias se redondean a dos decimales antes de compararse, para que
los límites exactos (5 cm, 10 cm, 20 cm) no se vean afectados por errores de coma
flotante.

### Orden de prioridad de las reglas

Las reglas se evalúan **en este orden** y gana la primera que se cumple:

| # | Silueta | Condición |
| --- | --- | --- |
| 1 | Óvalo | `(C ≥ B y C ≥ H)` **o** `(abs(B − C) < 10 y abs(H − C) < 10)` |
| 2 | Triángulo | `H − B > 5` |
| 3 | Triángulo invertido | `B − H > 5` |
| 4 | Reloj de arena | `abs(B − H) ≤ 5` y `B − C ≥ 20` y `H − C ≥ 20` |
| 5 | Rectángulo | `abs(B − H) ≤ 5` sin cumplir la condición de cintura de la regla 4 |

El óvalo se evalúa primero porque, cuando la cintura iguala o se acerca mucho a las
otras dos medidas, esa zona domina la proporción visual. Si ninguna de las reglas
1 a 4 se cumple, `abs(B − H) ≤ 5` es necesariamente cierto: el algoritmo siempre
devuelve una silueta.

### Manejo de límites

- 5 cm exactos entre busto y cadera → se consideran **medidas similares**.
- Triángulo y triángulo invertido exigen una diferencia **mayor** de 5 cm.
- 20 cm exactos entre cintura y busto/cadera **sí** permiten reloj de arena.
- Para el óvalo, 10 cm exactos **no** entran por la condición «menor de 10», salvo
  que la cintura sea la medida predominante.

### Ejemplos de clasificación

| Busto | Cintura | Cadera | Resultado |
| --- | --- | --- | --- |
| 98 | 74 | 99 | Reloj de arena |
| 92 | 73 | 101 | Triángulo |
| 104 | 80 | 95 | Triángulo invertido |
| 96 | 82 | 95 | Rectángulo |
| 100 | 96 | 98 | Óvalo |

### Validación de entrada

- Las tres medidas son obligatorias, numéricas y deben estar entre **45 y 220 cm**.
- Se acepta un decimal como máximo, con punto o coma (`92`, `92.5`, `101,3`).
- Se rechazan textos, `NaN`, `Infinity` y valores negativos.
- La altura es opcional (120–230 cm) y **no** modifica la clasificación.
- Las combinaciones poco habituales **no se bloquean**: se muestra un diálogo de
  confirmación con un aviso, y la persona decide si continúa.

---

## Estructura del proyecto

```
src/
├── app/
│   ├── page.tsx                # Inicio
│   ├── como-medirse/page.tsx   # Guía de medición
│   ├── analisis/page.tsx       # Flujo por pasos
│   ├── analisis/foto/page.tsx  # Estimación con fotografía
│   ├── resultado/page.tsx      # Resultado
│   ├── metodologia/page.tsx    # Cómo se calcula
│   ├── privacidad/page.tsx     # Privacidad y borrado de datos
│   ├── manifest.ts             # PWA
│   ├── icon.svg / apple-icon.png
│   ├── not-found.tsx
│   ├── layout.tsx
│   └── globals.css             # Tokens, áreas seguras y estilos de impresión
├── components/
│   ├── layout/                 # Header, MobileMenu, Footer, PageHeader
│   ├── home/                   # Hero, ProcessSteps, BodyShapePreview, Benefits
│   ├── measurements/           # Flujo por pasos, campo táctil, guía, ilustraciones
│   ├── results/                # Resultado, gráfico, reglas, acordeones, outfits
│   └── ui/                     # Button, Card, Accordion, BottomSheet, silueta SVG
├── data/
│   ├── body-shapes.ts          # Fichas de las cinco siluetas
│   ├── recommendations.ts      # Recomendaciones y outfits por silueta
│   ├── measurement-guide.ts    # Instrucciones de medición
│   ├── faqs.ts
│   └── navigation.ts
├── lib/
│   ├── body-shape/
│   │   ├── classify-body-shape.ts       # Algoritmo principal
│   │   ├── calculations.ts              # Diferencias y formato
│   │   ├── validation.ts                # Rangos, mensajes y avisos
│   │   └── classify-body-shape.test.ts  # Pruebas unitarias
│   ├── photo/
│   │   ├── photo-estimation.ts       # Fotogrametría y modelo elíptico
│   │   └── photo-estimation.test.ts  # Pruebas de la estimación
│   ├── proportions/
│   │   ├── eight-heads.ts            # Técnica de las 8 cabezas
│   │   └── eight-heads.test.ts       # Pruebas de la proporción vertical
│   ├── style-guide/
│   │   ├── combined-guide.ts         # Cruce silueta + proporción vertical
│   │   └── combined-guide.test.ts    # Pruebas de la fórmula personal
│   ├── wardrobe/
│   │   ├── style-profile.ts          # Perfil de estilo desde la encuesta
│   │   ├── wardrobe-plan.ts          # Checklist de básicos y cápsulas
│   │   └── wardrobe.test.ts          # Pruebas del módulo Mi Armario
│   ├── garment/
│   │   ├── color.ts                  # Color de una prenda por píxeles
│   │   ├── combine.ts                # Sugerencias de combinación
│   │   └── garment.test.ts           # Pruebas de combinar prenda
│   ├── color-analysis/
│   │   ├── season.ts                 # Colorimetría (estación de color)
│   │   └── season.test.ts            # Pruebas de colorimetría
│   ├── storage.ts              # localStorage (guardar, leer, borrar)
│   ├── share.ts                # Web Share API con respaldo al portapapeles
│   └── utils.ts
├── schemas/
│   └── measurements-schema.ts  # Esquema Zod del formulario
└── types/
    └── body-shape.ts           # Tipos del dominio
```

---

## Páginas

| Ruta | Contenido |
| --- | --- |
| `/` | Presentación, proceso en tres pasos, las cinco siluetas, beneficios, privacidad y preguntas frecuentes |
| `/como-medirse` | Guía visual completa para tomar cada medida |
| `/analisis` | Flujo de cinco pasos a pantalla completa, con progreso guardado y aviso de valores poco habituales |
| `/analisis/foto` | Estimación de las medidas marcando puntos sobre una foto, en seis pasos |
| `/proporciones` | Técnica de las 8 cabezas: cuatro medidas verticales paso a paso |
| `/proporciones/resultado` | Torso, tiro y piernas en cabezas, con sus recomendaciones |
| `/armario` | Encuesta de estilo de seis preguntas |
| `/armario/resultado` | Perfil de estilo, checklist de básicos y cápsulas de outfits |
| `/armario/prenda` | Sube una prenda, toma su color y ve con qué combinarla |
| `/colorimetria` | Cuestionario de colorimetría de siete preguntas |
| `/colorimetria/resultado` | Tu estación de color, tu paleta, neutros y metal |
| `/resultado` | Silueta, explicación, comparación de medidas, reglas, recomendaciones y outfits |
| `/metodologia` | Medidas usadas, orden de reglas, límites del método y versión del algoritmo |
| `/privacidad` | Qué se guarda, dónde y botón para eliminar los datos locales |

---

## Privacidad

- No se suben fotografías ni se solicita acceso a la cámara.
- Las medidas se procesan en el navegador; no viajan a ningún servidor.
- No hay cuentas, inicio de sesión ni analítica de terceros.
- El último resultado se guarda en `localStorage` bajo la clave
  `alma-silueta-corporal:last-analysis`, y el progreso del formulario bajo
  `alma-silueta-corporal:draft`. El botón de borrado elimina ambos.
- La página `/privacidad` incluye un botón funcional para eliminar esos datos.
- El resumen que se comparte **no incluye las medidas**, solo la silueta y algunas
  recomendaciones.

---

## Accesibilidad

- HTML semántico, enlace «saltar al contenido» y navegación completa por teclado.
- `label` reales asociados a cada campo, `aria-invalid`, `aria-describedby` y
  mensajes de error vinculados.
- Región `aria-live` para los mensajes del formulario y de las acciones.
- Diálogos con `role="dialog"` / `role="alertdialog"`, cierre con `Escape` y ciclo
  de foco contenido.
- Pestañas con `role="tablist"` y navegación con flechas, `Home` y `End`.
- Estados de foco visibles, contraste alto y áreas táctiles de al menos 44 px.
- Se respeta `prefers-reduced-motion`.
- La información nunca depende solo del color: los gráficos incluyen los valores.

---

## Limitaciones

- Las siluetas son categorías orientativas; muchas personas presentan
  características mixtas, sobre todo cerca de un límite.
- El método no considera altura, estructura ósea, proporción entre torso y piernas
  ni distribución del volumen.
- La postura, la ropa y la tensión de la cinta pueden mover el resultado.
- No es un diagnóstico médico ni una valoración de salud o composición corporal.
- No se muestran porcentajes de certeza porque el método no los tiene.

---

## Posibles mejoras futuras

La arquitectura está preparada para crecer sin reescribir el núcleo:

- Historial de análisis y comparación entre fechas.
- Cuentas de usuario opcionales y sincronización entre dispositivos.
- Módulo de colorimetría como aplicación hermana (siempre independiente).
- Segunda foto de perfil para medir la profundidad real en vez de estimarla.
- Detección automática de los puntos del cuerpo sobre la foto.
- Exportación a PDF con diseño propio y catálogo de prendas con imágenes.
- Nuevas versiones de la fórmula (`algorithmVersion`) con notas de cambio.

---

## Independencia del proyecto

Este repositorio es autónomo: tiene su propio `package.json`, sus propias
dependencias, su propia clave de `localStorage` y su propio historial de Git. No
lee, escribe ni importa nada de la aplicación de colorimetría.

---

© Alma e Imagen · Analizador de silueta corporal · Algoritmo versión 1.0.0
