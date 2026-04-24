import { type Href, router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { EditorialColors, EditorialFonts } from '@/constants/theme';
import {
  MOCK_EVENTS,
  MOCK_TODAY_ISO,
  parseEventDate,
  type CalendarEventDef,
} from '@/data/mockData';

const WEEKDAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

function daysInMonth(y: number, m: number) {
  return new Date(y, m, 0).getDate();
}

function startWeekdayMon(y: number, m: number) {
  const js = new Date(y, m - 1, 1).getDay();
  return js === 0 ? 6 : js - 1;
}

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
      return 'Inicio';
    case 'end':
      return 'Cierre';
    case 'meeting':
      return 'Reunión';
    case 'celebration':
      return 'Celebración';
    case 'thread':
      return 'Hilo';
    default:
      return 'Evento';
  }
}

export default function EventsCalendarScreen() {
  const focus = useMemo(() => parseEventDate(MOCK_TODAY_ISO), []);
  const y = focus.y;
  const m = focus.m;
  const dim = daysInMonth(y, m);
  const pad = startWeekdayMon(y, m);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const eventDays = useMemo(() => {
    const map = new Map<number, CalendarEventDef[]>();
    for (const e of MOCK_EVENTS) {
      const { y: ey, m: em, d } = parseEventDate(e.date);
      if (ey === y && em === m) {
        const list = map.get(d) ?? [];
        list.push(e);
        map.set(d, list);
      }
    }
    return map;
  }, [y, m]);

  const cells: (number | null)[] = [...Array(pad).fill(null)];
  for (let d = 1; d <= dim; d++) cells.push(d);

  const sortedEvents = useMemo(
    () => [...MOCK_EVENTS].sort((a, b) => a.date.localeCompare(b.date)),
    [],
  );

  const listEvents = useMemo(() => {
    if (selectedDay == null) return sortedEvents;
    return sortedEvents.filter((e) => {
      const { y: ey, m: em, d } = parseEventDate(e.date);
      return ey === y && em === m && d === selectedDay;
    });
  }, [sortedEvents, selectedDay, y, m]);

  function onPressDay(day: number) {
    if (selectedDay === day) {
      setSelectedDay(null);
      return;
    }
    setSelectedDay(day);
  }

  function openEvent(id: string) {
    router.push(`/(tabs)/events/${id}` as Href);
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>
      <Text style={styles.month}>
        {MONTH_LABEL[m]} {y}
      </Text>
      <Text style={styles.season}>
        Calendario y lista completa. Toca un día con marca para filtrar; vuelve a tocar el día para ver
        todos los eventos.
      </Text>

      <View style={styles.weekRow}>
        {WEEKDAYS.map((w) => (
          <Text key={w} style={styles.weekday}>
            {w}
          </Text>
        ))}
      </View>
      <View style={styles.grid}>
        {cells.map((day, i) => {
          const has = day ? (eventDays.get(day)?.length ?? 0) > 0 : false;
          const selected = day != null && selectedDay === day;
          return (
            <Pressable
              key={i}
              disabled={day == null}
              onPress={() => day != null && onPressDay(day)}
              style={({ pressed }) => [
                styles.cell,
                day === focus.d ? styles.cellToday : undefined,
                has ? styles.cellEvent : undefined,
                selected ? styles.cellSelected : undefined,
                day != null && pressed ? styles.cellPressed : undefined,
              ]}>
              {day ? <Text style={styles.cellNum}>{day}</Text> : null}
              {has ? <View style={styles.dot} /> : null}
            </Pressable>
          );
        })}
      </View>

      {selectedDay != null && listEvents.length === 0 ? (
        <Text style={styles.noEvents}>No hay eventos el día {selectedDay}. Pulsa el día otra vez para quitar el filtro.</Text>
      ) : null}

      <Text style={styles.listTitle}>
        {selectedDay != null ? `Eventos del día ${selectedDay}` : 'Todos los eventos'}
      </Text>
      <View style={styles.list}>
        {listEvents.map((e) => {
          const { d } = parseEventDate(e.date);
          const highlighted =
            selectedDay != null && parseEventDate(e.date).d === selectedDay && parseEventDate(e.date).m === m && parseEventDate(e.date).y === y;
          return (
            <Pressable
              key={e.id}
              onPress={() => openEvent(e.id)}
              style={({ pressed }) => [
                styles.row,
                highlighted && styles.rowHighlighted,
                pressed && { opacity: 0.92 },
              ]}>
              <View style={styles.dayBadge}>
                <Text style={styles.dayNum}>{d}</Text>
                <Text style={styles.dayMon}>{MONTH_LABEL[parseEventDate(e.date).m].slice(0, 3)}</Text>
              </View>
              <View style={styles.rowText}>
                <Text style={styles.kind}>{kindLabel(e.kind)}</Text>
                <Text style={styles.rowTitle}>{e.title}</Text>
                <Text style={styles.rowSub}>{e.subtitle}</Text>
                <Text style={styles.tapDetail}>Ver detalle →</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: EditorialColors.background,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 32,
  },
  month: {
    fontFamily: EditorialFonts.headlineItalic,
    fontSize: 32,
    color: EditorialColors.onSurface,
    marginBottom: 4,
  },
  season: {
    fontFamily: EditorialFonts.body,
    fontSize: 14,
    lineHeight: 20,
    color: EditorialColors.onSurfaceVariant,
    marginBottom: 20,
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekday: {
    flex: 1,
    textAlign: 'center',
    fontFamily: EditorialFonts.label,
    fontSize: 11,
    color: EditorialColors.onSurfaceVariant,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  cell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    maxWidth: '14.28%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    marginBottom: 6,
  },
  cellToday: {
    borderWidth: 2,
    borderColor: EditorialColors.primary,
  },
  cellEvent: {
    backgroundColor: EditorialColors.surfaceContainerLow,
  },
  cellSelected: {
    backgroundColor: EditorialColors.secondaryContainer,
  },
  cellPressed: {
    opacity: 0.85,
  },
  cellNum: {
    fontFamily: EditorialFonts.bodyMedium,
    fontSize: 14,
    color: EditorialColors.onSurface,
  },
  dot: {
    marginTop: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: EditorialColors.primary,
  },
  noEvents: {
    fontFamily: EditorialFonts.body,
    fontSize: 14,
    color: EditorialColors.onSurfaceVariant,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  listTitle: {
    fontFamily: EditorialFonts.headline,
    fontSize: 18,
    color: EditorialColors.onSurface,
    marginBottom: 14,
  },
  list: {
    gap: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    backgroundColor: EditorialColors.surfaceContainerLow,
    borderRadius: 16,
    padding: 14,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  rowHighlighted: {
    borderColor: EditorialColors.primary,
    backgroundColor: EditorialColors.surfaceContainerHigh,
  },
  dayBadge: {
    width: 52,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: EditorialColors.surfaceContainerHighest,
    borderRadius: 12,
    paddingVertical: 8,
  },
  dayNum: {
    fontFamily: EditorialFonts.display,
    fontSize: 18,
    color: EditorialColors.primary,
  },
  dayMon: {
    fontFamily: EditorialFonts.label,
    fontSize: 10,
    color: EditorialColors.onSurfaceVariant,
    textTransform: 'uppercase',
  },
  rowText: {
    flex: 1,
  },
  kind: {
    fontFamily: EditorialFonts.label,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: EditorialColors.secondary,
    marginBottom: 4,
  },
  rowTitle: {
    fontFamily: EditorialFonts.bodyMedium,
    fontSize: 16,
    color: EditorialColors.onSurface,
    marginBottom: 4,
  },
  rowSub: {
    fontFamily: EditorialFonts.body,
    fontSize: 14,
    color: EditorialColors.onSurfaceVariant,
  },
  tapDetail: {
    fontFamily: EditorialFonts.label,
    fontSize: 12,
    color: EditorialColors.primary,
    marginTop: 8,
  },
});
