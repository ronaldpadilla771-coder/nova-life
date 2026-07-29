export const MOTIVATIONAL_QUOTES = [
  "La disciplina es el puente entre las metas y los logros.",
  "Pequeños progresos cada día se convierten en grandes resultados.",
  "No cuentes los días, haz que los días cuenten.",
  "El éxito es la suma de pequeños esfuerzos repetidos cada día.",
  "Tu único límite eres tú mismo.",
  "La constancia vence al talento cuando el talento no es constante.",
  "Hazlo con miedo, pero hazlo.",
  "Cada hábito que construyes es un voto por la persona que quieres ser.",
  "El futuro depende de lo que hagas hoy.",
  "No esperes el momento perfecto, toma el momento y hazlo perfecto.",
  "Un viaje de mil kilómetros comienza con un solo paso.",
  "La motivación te pone en marcha, el hábito te mantiene en movimiento.",
];

export function getRandomQuote() {
  const index = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
  return MOTIVATIONAL_QUOTES[index];
}
