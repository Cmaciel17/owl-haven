import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { EditorialColors, EditorialFonts } from '@/constants/theme';
import {
  getEventById,
  MOCK_TODAY_ISO,
  parseEventDate,
  type CalendarEventDef,
} from '@/data/mockData';

const MONTH_LABEL: Record<number, string> = {
  1: 'Enero',
  2: 'Febrero',
  3: 'Marzo',
  4: 'Abril',
  5: 'Mayo',
  6: 'Junio',
  7: 'Julio',
  8: 'Agosto',
  9: 'Septiembre',
  10: 'Octubre',
  11: 'Noviembre',
  12: 'Diciembre',
};

function kindLabel(k: CalendarEventDef['kind']) {
  switch (k) {
    case 'start':
      return 'Inicio de club / lectura';
    case 'end':
      return 'Cierre de lectura';
    case 'meeting':
      return 'Reunión';
    case 'celebration':
      return 'Celebración';
    case 'thread':
      return 'Hilo de discusión';
    default:
      return 'Evento';
  }
}

export default function EventDetailScreen() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const event = eventId ? getEventById(eventId) : undefined;

  if (!event) {
    return (
      <View style={styles.centered}>
        <Text style={styles.err}>Evento no encontrado.</Text>
      </View>
    );
  }

  const { y, m, d } = parseEventDate(event.date);
  const dateLine = `${d} de ${MONTH_LABEL[m]} de ${y}`;
  const isPast = event.date < MOCK_TODAY_ISO;

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      <Text style={styles.kind}>{kindLabel(event.kind)}</Text>
      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.date}>{dateLine}</Text>
      {isPast ? <Text style={styles.past}>Ya pasó (según fecha mock del calendario)</Text> : null}
      <Text style={styles.subtitle}>{event.subtitle}</Text>
      <View style={styles.divider} />
      <Text style={styles.body}>{event.details}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: EditorialColors.background,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: EditorialColors.background,
  },
  err: {
    fontFamily: EditorialFonts.body,
    color: EditorialColors.onSurfaceVariant,
  },
  kind: {
    fontFamily: EditorialFonts.label,
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: EditorialColors.secondary,
    marginBottom: 8,
  },
  title: {
    fontFamily: EditorialFonts.headlineItalic,
    fontSize: 28,
    lineHeight: 32,
    color: EditorialColors.onSurface,
    marginBottom: 8,
  },
  date: {
    fontFamily: EditorialFonts.bodyMedium,
    fontSize: 16,
    color: EditorialColors.primary,
    marginBottom: 6,
  },
  past: {
    fontFamily: EditorialFonts.body,
    fontSize: 13,
    color: EditorialColors.onSurfaceVariant,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  subtitle: {
    fontFamily: EditorialFonts.body,
    fontSize: 16,
    lineHeight: 24,
    color: EditorialColors.onSurfaceVariant,
    marginTop: 4,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: EditorialColors.outlineVariant,
    marginVertical: 22,
  },
  body: {
    fontFamily: EditorialFonts.body,
    fontSize: 17,
    lineHeight: 28,
    color: EditorialColors.onSurface,
  },
});
