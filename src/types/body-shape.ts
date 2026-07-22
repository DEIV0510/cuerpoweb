/**
 * Tipos base del dominio "silueta corporal".
 *
 * Este archivo no importa nada de React ni de Next.js: describe únicamente
 * la forma de los datos con los que trabaja el algoritmo y los archivos
 * de contenido.
 */

/** Identificador estable de cada silueta. Se usa como clave en datos y storage. */
export type BodyShapeType =
  | 'hourglass'
  | 'rectangle'
  | 'triangle'
  | 'inverted-triangle'
  | 'oval';

/** Medidas corporales en centímetros. */
export interface Measurements {
  /** Contorno de busto en cm. */
  bust: number;
  /** Contorno de cintura en cm. */
  waist: number;
  /** Contorno de cadera en cm. */
  hips: number;
  /** Altura en cm. Opcional e informativa: no participa en la clasificación. */
  height?: number;
}

/** Diferencias derivadas de las tres medidas principales. */
export interface CalculatedDifferences {
  /** |busto - cadera| */
  differenceBustHips: number;
  /** cadera - busto */
  hipsMinusBust: number;
  /** busto - cadera */
  bustMinusHips: number;
  /** busto - cintura */
  bustWaistDifference: number;
  /** cadera - cintura */
  hipsWaistDifference: number;
  /** (busto + cadera) / 2 */
  averageBustHips: number;
  /** promedio(busto, cadera) - cintura */
  averageWaistDifference: number;
}

/** Identificador de cada regla del algoritmo. */
export type RuleId =
  | 'rule-1-oval'
  | 'rule-2-triangle'
  | 'rule-3-inverted-triangle'
  | 'rule-4-hourglass'
  | 'rule-5-rectangle';

/** Resultado de evaluar una regla concreta con unas medidas concretas. */
export interface RuleEvaluation {
  id: RuleId;
  /** Posición en el orden de prioridad (1 a 5). */
  order: number;
  /** Nombre legible de la regla. */
  name: string;
  /** Condición matemática en notación corta (B, C, H). */
  condition: string;
  /** Si la condición se cumplió con estas medidas. */
  matched: boolean;
  /** Si esta fue la regla que determinó el resultado final. */
  decisive: boolean;
  /** Explicación en lenguaje natural del cálculo realizado. */
  detail: string;
}

/** Aviso informativo. Nunca bloquea el análisis. */
export interface AnalysisWarning {
  code:
    | 'waist-largest'
    | 'waist-over-bust'
    | 'waist-over-hips'
    | 'extreme-difference'
    | 'out-of-common-range';
  message: string;
}

/** Ejemplo de outfit completo para una silueta. */
export interface OutfitExample {
  /** Nombre corto del look. */
  name: string;
  /** Ocasión de uso. */
  occasion: 'Casual' | 'Profesional' | 'Evento o salida especial';
  /** Prenda superior. */
  top: string;
  /** Prenda inferior (o vestido). */
  bottom: string;
  /** Capa, chaqueta o abrigo. */
  layer: string;
  /** Calzado sugerido. */
  shoes: string;
  /** Accesorios sugeridos. */
  accessories: string;
  /** Por qué funciona esta combinación. */
  why: string;
}

/** Bloque completo de recomendaciones de una silueta. */
export interface BodyShapeRecommendation {
  id: BodyShapeType;
  name: string;
  alternativeName?: string;
  description: string;
  visualObjective: string;
  tops: string[];
  necklines: string[];
  pants: string[];
  skirts: string[];
  dresses: string[];
  jackets: string[];
  fabrics: string[];
  prints: string[];
  accessories: string[];
  stylingTips: string[];
  outfitExamples: OutfitExample[];
}

/** Ficha descriptiva de una silueta (contenido editorial, sin lógica). */
export interface BodyShapeProfile {
  id: BodyShapeType;
  /** Nombre completo, por ejemplo "Reloj de arena". */
  name: string;
  /** Otro nombre habitual para la misma silueta. */
  alternativeName?: string;
  /** Nombre corto para chips y títulos, por ejemplo "Reloj". */
  shortName: string;
  /** Frase de una línea. */
  tagline: string;
  /** Descripción de las características de la silueta. */
  description: string;
  /** Regla matemática resumida, en lenguaje claro. */
  ruleSummary: string;
  /** Objetivo visual recomendado. */
  visualObjective: string;
  /** Proporciones relativas usadas para dibujar la ilustración abstracta. */
  illustration: {
    bust: number;
    waist: number;
    hips: number;
  };
}

/** Resultado completo devuelto por `classifyBodyShape`. */
export interface BodyShapeResult {
  type: BodyShapeType;
  name: string;
  shortName: string;
  /** Explicación matemática y personalizada del resultado. */
  explanation: string;
  measurements: Measurements;
  calculatedDifferences: CalculatedDifferences;
  /** Todas las reglas evaluadas, en orden de prioridad. */
  matchedRules: RuleEvaluation[];
  visualObjective: string;
  recommendations: BodyShapeRecommendation;
  warnings: AnalysisWarning[];
  algorithmVersion: string;
}

/** Análisis guardado localmente en el dispositivo. */
export interface StoredAnalysis {
  /** Versión del formato de almacenamiento. */
  storageVersion: number;
  /** Fecha ISO en la que se realizó el análisis. */
  createdAt: string;
  result: BodyShapeResult;
}
