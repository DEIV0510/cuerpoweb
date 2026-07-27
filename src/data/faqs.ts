export interface Faq {
  question: string;
  answer: string;
}

/** Preguntas frecuentes que se muestran en la página de inicio. */
export const FAQS: Faq[] = [
  {
    question: '¿Tengo que hacer las tres herramientas?',
    answer:
      'No. Puedes usar solo la que te interese: la silueta, la técnica de las 8 cabezas o el armario. Cada una funciona por su cuenta, pero cuando combinas la silueta con las proporciones se crea tu fórmula personal, que es donde más brillan.',
  },
  {
    question: '¿Qué es la fórmula personal?',
    answer:
      'Es el cruce entre tu silueta (qué cortes te acompañan) y tu proporción vertical (a qué altura llevarlos). Cuando completas los dos análisis, aparece en tu resultado con seis decisiones concretas: tiro del pantalón, blusa por dentro o por fuera, largo de chaqueta, altura de zapato, escote y punto focal.',
  },
  {
    question: '¿Necesito una cinta métrica especial?',
    answer:
      'No. Basta con una cinta métrica flexible de costura. Si no tienes una, puedes usar una cuerda o un cordón, marcar el punto donde se cierra y luego medir esa longitud con una regla o un metro rígido.',
  },
  {
    question: '¿Debo medirme con ropa?',
    answer:
      'Lo ideal es medirse sobre ropa interior o con ropa delgada y ajustada. La ropa gruesa suma centímetros y cambia el resultado.',
  },
  {
    question: '¿Qué pasa si no me identifico del todo con el resultado?',
    answer:
      'Es normal. Muchas personas presentan características mixtas de dos siluetas. El resultado es una orientación: puedes tomar las recomendaciones que te resulten útiles y dejar el resto.',
  },
  {
    question: '¿La altura cambia mi silueta?',
    answer:
      'En esta versión no. La altura es un campo opcional que se guarda como referencia, pero la clasificación se basa únicamente en la relación entre busto, cintura y cadera. Si quieres trabajar las alturas, ese es justo el objetivo de la técnica de las 8 cabezas.',
  },
  {
    question: '¿Qué es la técnica de las 8 cabezas?',
    answer:
      'Es un segundo análisis, complementario al de la silueta. Divide el cuerpo verticalmente en unidades del tamaño de tu propia cabeza: lo proporcional son 2 cabezas de la quijada a la cintura, 1 de la cintura a la entrepierna y 4 de la entrepierna a los pies. Con eso sabes si tu torso es corto o largo y qué tiro de pantalón, largo de chaqueta y altura de zapato te acompañan mejor.',
  },
  {
    question: '¿Tengo que medir 8 cabezas exactas?',
    answer:
      'No. Las ocho cabezas son un canon del dibujo de figurín, no una norma de belleza: casi ninguna persona real mide exactamente ocho. El dato útil no es el total, sino cómo se reparten tus tramos entre sí.',
  },
  {
    question: '¿Se guardan mis medidas en algún servidor?',
    answer:
      'No. Todo el cálculo ocurre dentro de tu navegador. El último resultado puede quedar guardado en tu propio dispositivo y puedes eliminarlo cuando quieras desde la página de privacidad.',
  },
  {
    question: '¿Puedo usar una foto en vez de la cinta métrica?',
    answer:
      'Sí. Puedes subir una foto de cuerpo completo, marcar tu estatura y el ancho de busto, cintura y cadera, y la aplicación estima los contornos. Es un apoyo cuando no tienes cinta a mano, pero la medición real siempre será más precisa: una foto no puede ver la profundidad del cuerpo.',
  },
  {
    question: '¿Mi foto se sube a internet?',
    answer:
      'No. La imagen se abre solo en la memoria de tu dispositivo, se usa para tomar las marcas y se descarta al salir de la pantalla. No se envía, no se guarda y del análisis solo quedan los tres números que confirmes.',
  },
  {
    question: '¿Esto es un diagnóstico de salud?',
    answer:
      'No. Es una orientación de imagen y vestuario. No evalúa salud, peso ni composición corporal, y no sustituye la valoración de un profesional de la salud.',
  },
  {
    question: '¿Puedo repetir el análisis?',
    answer:
      'Todas las veces que quieras. Cada nuevo análisis reemplaza al anterior en tu dispositivo, y siempre puedes volver a la guía de medición para revisar la técnica.',
  },
  {
    question: '¿Qué es "Mi armario"?',
    answer:
      'Es una encuesta corta de estilo que arma tu perfil, un checklist de los básicos que te faltan según tu estilo y tus ocasiones, y cápsulas de outfits ya combinadas. Se apoya en tu silueta si ya la calculaste, y todo se guarda solo en tu dispositivo.',
  },
  {
    question: '¿Sirve para hombres?',
    answer:
      'Sí. El cálculo compara tres contornos y funciona para cualquier persona. Las recomendaciones están redactadas en términos de prendas y proporciones, así que puedes trasladarlas al tipo de vestuario que uses habitualmente.',
  },
];
