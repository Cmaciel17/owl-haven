export type BookDef = {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  chapterCount: number;
};

export type ClubDef = {
  id: string;
  name: string;
  active: boolean;
  bookId: string;
  memberCount: number;
};

export type CalendarEventDef = {
  id: string;
  date: string;
  title: string;
  subtitle: string;
  /** Texto largo para la pantalla de detalle. */
  details: string;
  kind: 'meeting' | 'start' | 'end' | 'celebration' | 'thread';
};

/** “Hoy” del mock del calendario (abril 2026). */
export const MOCK_TODAY_ISO = '2026-04-08';

export function parseEventDate(s: string) {
  const [y, m, d] = s.split('-').map(Number);
  return { y, m, d };
}

export const MOCK_BOOKS: Record<string, BookDef> = {
  b1: {
    id: 'b1',
    title: 'La biblioteca de medianoche',
    author: 'Matt Haig',
    coverUrl:
      'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&q=80',
    chapterCount: 24,
  },
  b2: {
    id: 'b2',
    title: 'Cien años de soledad',
    author: 'Gabriel García Márquez',
    coverUrl:
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80',
    chapterCount: 20,
  },
  b3: {
    id: 'b3',
    title: 'El nombre del viento',
    author: 'Patrick Rothfuss',
    coverUrl:
      'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&q=80',
    chapterCount: 92,
  },
};

export const MOCK_CLUBS: ClubDef[] = [
  {
    id: 'c1',
    name: 'Círculo Bloomsbury',
    active: true,
    bookId: 'b1',
    memberCount: 12,
  },
  {
    id: 'c2',
    name: 'Salón de té y páginas',
    active: true,
    bookId: 'b2',
    memberCount: 8,
  },
  {
    id: 'c3',
    name: 'Archivo Eólico (2025)',
    active: false,
    bookId: 'b3',
    memberCount: 15,
  },
];

/** Clubes “nuevos” de la comunidad (mock) — se muestran en “Clubs recientes”. */
export const MOCK_RECENT_CLUBS: ClubDef[] = [
  {
    id: 'c-new-1',
    name: 'Lectores del faro',
    active: true,
    bookId: 'b2',
    memberCount: 5,
  },
  {
    id: 'c-new-2',
    name: 'Noche de té y páginas',
    active: true,
    bookId: 'b1',
    memberCount: 3,
  },
  {
    id: 'c-new-3',
    name: 'Círculo Rothfuss Madrid',
    active: true,
    bookId: 'b3',
    memberCount: 9,
  },
];

export type GroupChatMessage = { id: string; author: string; text: string; at: string };

/** Semilla del chat grupal por club (mock). */
export const MOCK_GROUP_CHAT_SEED: Record<string, GroupChatMessage[]> = {
  c1: [
    {
      id: 'g1',
      author: 'Moderación',
      text: 'Bienvenidas al chat en vivo del club. Aquí podréis coordinar lectura y avisos.',
      at: '10:02',
    },
    {
      id: 'g2',
      author: 'Julian M.',
      text: '¿Alguien va al hilo del capítulo 2 antes del viernes?',
      at: '10:18',
    },
  ],
  c2: [
    {
      id: 'g3',
      author: 'Marina R.',
      text: 'Arrancamos el lunes con ritmo suave, ¿ok?',
      at: '09:41',
    },
  ],
  c3: [
    { id: 'g4', author: 'Carlos V.', text: 'Archivo cerrado pero el chat sigue por nostalgia.', at: '18:00' },
  ],
  'c-new-1': [
    { id: 'g5', author: 'Ana L.', text: '¡Hola! Primer club que creo en la app (mock).', at: '11:30' },
  ],
  'c-new-2': [{ id: 'g6', author: 'Pedro S.', text: '¿Tomamos el mismo ritmo que Bloomsbury?', at: '20:15' }],
  'c-new-3': [
    { id: 'g7', author: 'Elena P.', text: 'Quien quiera spoiler-free que avise.', at: '16:22' },
  ],
};

export function searchClubsByBookOrName(
  clubs: ClubDef[],
  query: string,
  getBookTitle: (bookId: string) => string | undefined,
): ClubDef[] {
  const q = query.trim().toLowerCase();
  if (!q) return clubs;
  return clubs.filter((c) => {
    const title = getBookTitle(c.bookId)?.toLowerCase() ?? '';
    return c.name.toLowerCase().includes(q) || title.includes(q);
  });
}

/** Club “principal” para la lectura actual en inicio (mock: el primero activo). */
export function getPrimaryActiveClub(): ClubDef | undefined {
  return MOCK_CLUBS.find((c) => c.active);
}

export function getBook(bookId: string): BookDef | undefined {
  return MOCK_BOOKS[bookId];
}

export function getAllBooks(): BookDef[] {
  return Object.values(MOCK_BOOKS);
}

export const MOCK_READING_GOAL = {
  year: 2026,
  targetBooks: 12,
  completedBooks: 4,
};

export const MOCK_EVENTS: CalendarEventDef[] = [
  {
    id: 'e1',
    date: '2026-04-10',
    title: 'Hilo · Capítulos 1–3',
    subtitle: 'Círculo Bloomsbury · antes del café',
    kind: 'thread',
    details:
      'Espacio asíncrono para comentar sin spoilers fuera de rango. Propón una cita favorita y una duda para la reunión del mes. Recuerda etiquetar spoilers si avanzas más allá del capítulo 3.',
  },
  {
    id: 'e2',
    date: '2026-04-12',
    title: 'Inicio oficial · Salón de té',
    subtitle: 'Presentación y ritmo de lectura',
    kind: 'start',
    details:
      'Presentación del club, calendario tentativo y acuerdos de moderación. Definiremos páginas por semana y el canal de avisos. Trae una taza y una recomendación corta de otro libro.',
  },
  {
    id: 'e3',
    date: '2026-04-18',
    title: 'Reunión virtual',
    subtitle: '19:00 · enlace por confirmar',
    kind: 'meeting',
    details:
      'Encuentro en vivo para debatir el tramo acordado. El enlace se compartirá 24 h antes. Habrá turnos de palabra y notas en el foro por capítulos para quien no pueda asistir.',
  },
  {
    id: 'e4',
    date: '2026-04-26',
    title: 'Cierre de lectura',
    subtitle: 'Spoilers permitidos · Bloomsbury',
    kind: 'end',
    details:
      'Cierre de la lectura grupal: spoilers libres, valoración final y votación del siguiente título. Recogeremos reflexiones para el archivo del club.',
  },
  {
    id: 'e5',
    date: '2026-05-01',
    title: 'Celebración primaveral',
    subtitle: 'Recomendaciones y sorteo',
    kind: 'celebration',
    details:
      'Encuentro informal: intercambio de recomendaciones, sorteo de marcapáginas y foto grupal. No es obligatorio haber terminado el libro del trimestre.',
  },
];

export function getEventById(id: string): CalendarEventDef | undefined {
  return MOCK_EVENTS.find((e) => e.id === id);
}

/** Próximos eventos desde la fecha mock; si no hay suficientes, rellena con los primeros del calendario. */
export function getNextUpcomingEvents(count: number): CalendarEventDef[] {
  const sorted = [...MOCK_EVENTS].sort((a, b) => a.date.localeCompare(b.date));
  const upcoming = sorted.filter((e) => e.date >= MOCK_TODAY_ISO);
  if (upcoming.length >= count) return upcoming.slice(0, count);
  return sorted.slice(0, count);
}

export type MockThreadPreview = {
  id: string;
  name: string;
  preview: string;
  time: string;
  unread?: boolean;
};

export const MOCK_PRIVATE_THREADS: MockThreadPreview[] = [
  {
    id: 't1',
    name: 'Julian M.',
    preview: '¿Leíste ya el capítulo 4?',
    time: 'Hace 2 h',
    unread: true,
  },
  {
    id: 't2',
    name: 'Marina R.',
    preview: 'Te paso el enlace al podcast.',
    time: 'Ayer',
    unread: false,
  },
];

export type MockChatBubble = { id: string; from: 'me' | 'them'; text: string };

export const MOCK_CHAT_MESSAGES: Record<string, MockChatBubble[]> = {
  t1: [
    { id: 'm1', from: 'them', text: '¿Vas al hilo del capítulo 4 esta semana?' },
    { id: 'm2', from: 'me', text: 'Sí, leo mañana y comento.' },
    { id: 'm3', from: 'them', text: '¿Leíste ya el capítulo 4?' },
  ],
  t2: [
    { id: 'm4', from: 'them', text: 'Te paso el enlace al podcast que comentamos.' },
    { id: 'm5', from: 'me', text: 'Genial, gracias Marina.' },
    { id: 'm6', from: 'them', text: 'Aquí lo tienes — avísame qué te parece el episodio 3.' },
  ],
};

export function getPrivateThreadById(id: string): MockThreadPreview | undefined {
  return MOCK_PRIVATE_THREADS.find((t) => t.id === id);
}

export const LITERARY_GENRES = [
  'Narrativa contemporánea',
  'Clásicos',
  'Fantasía',
  'Ciencia ficción',
  'Ensayo',
  'Poesía',
  'Thriller',
  'Romance',
  'Histórica',
  'No ficción',
] as const;
