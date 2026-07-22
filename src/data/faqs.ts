export interface Faq {
  question: string;
  answer: string;
}

/** Preguntas frecuentes que se muestran en la página de inicio. */
export const FAQS: Faq[] = [
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
      'En esta versión no. La altura es un campo opcional que se guarda como referencia, pero la clasificación se basa únicamente en la relación entre busto, cintura y cadera.',
  },
  {
    question: '¿Se guardan mis medidas en algún servidor?',
    answer:
      'No. Todo el cálculo ocurre dentro de tu navegador. El último resultado puede quedar guardado en tu propio dispositivo y puedes eliminarlo cuando quieras desde la página de privacidad.',
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
    question: '¿Sirve para hombres?',
    answer:
      'Sí. El cálculo compara tres contornos y funciona para cualquier persona. Las recomendaciones están redactadas en términos de prendas y proporciones, así que puedes trasladarlas al tipo de vestuario que uses habitualmente.',
  },
];
