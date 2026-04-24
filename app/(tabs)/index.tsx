import { Image } from 'expo-image';
import { type Href, Link, router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { EditorialColors, EditorialFonts } from '@/constants/theme';
import {
  getBook,
  getNextUpcomingEvents,
  getPrimaryActiveClub,
  MOCK_READING_GOAL,
  parseEventDate,
} from '@/data/mockData';

const MONTH_SHORT: Record<number, string> = {
  1: 'ene',
  2: 'feb',
  3: 'mar',
  4: 'abr',
  5: 'may',
  6: 'jun',
  7: 'jul',
  8: 'ago',
  9: 'sep',
  10: 'oct',
  11: 'nov',
  12: 'dic',
};

export default function HomeScreen() {
  const club = getPrimaryActiveClub();
  const book = club ? getBook(club.bookId) : undefined;
  const goal = MOCK_READING_GOAL;
  const goalProgress = Math.min(1, goal.completedBooks / goal.targetBooks);
  const upcoming = getNextUpcomingEvents(2);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.screen}
      showsVerticalScrollIndicator={false}>
      {book && club ? (
        <View style={styles.currentCard}>
          <Text style={styles.tag}>Lectura actual · {club.name}</Text>
          <View style={styles.bookRow}>
            <View style={styles.coverShadow}>
              <Image
                source={{ uri: book.coverUrl }}
                style={styles.cover}
                contentFit="cover"
                transition={200}
              />
            </View>
            <View style={styles.bookMeta}>
              <Text style={styles.bookTitle}>{book.title}</Text>
              <Text style={styles.author}>{book.author}</Text>
              <Text style={styles.chaptersHint}>
                {book.chapterCount} capítulos · foro por capítulo en el club
              </Text>
              <Link href={`/(tabs)/clubs/${club.id}` as Href} asChild>
                <Pressable style={styles.linkBtn}>
                  <Text style={styles.linkBtnLabel}>Abrir club</Text>
                </Pressable>
              </Link>
            </View>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${38}%` }]} />
          </View>
          <Text style={styles.progressLabel}>Progreso grupal (mock) · 38%</Text>
        </View>
      ) : (
        <Text style={styles.fallback}>No hay club activo asignado (mock).</Text>
      )}

      <View style={styles.goalCard}>
        <Text style={styles.goalTitle}>Reading goal {goal.year}</Text>
        <Text style={styles.goalSub}>
          Libros leídos este año (mock):{' '}
          <Text style={styles.goalEmph}>
            {goal.completedBooks}/{goal.targetBooks}
          </Text>
        </Text>
        <View style={styles.goalTrack}>
          <View style={[styles.goalFill, { width: `${Math.round(goalProgress * 100)}%` }]} />
        </View>
        <Text style={styles.goalFoot}>
          Más adelante podrás enlazarlo a tu biblioteca y a los cierres de club.
        </Text>
      </View>

      <View style={styles.chatSection}>
        <Text style={styles.chatTitle}>Chats privados</Text>
        <Text style={styles.chatHint}>
          Habla con contactos del club (mock). También puedes usar el botón «Entrar a chats» abajo a
          la derecha.
        </Text>
        <Pressable
          onPress={() => router.push('/messages' as Href)}
          style={({ pressed }) => [styles.chatBtn, pressed && { opacity: 0.92 }]}>
          <Text style={styles.chatBtnLabel}>Entrar a chats</Text>
        </Pressable>
      </View>

      <View style={styles.eventsSection}>
        <Text style={styles.eventsTitle}>Próximos eventos</Text>
        <Text style={styles.eventsHint}>Los dos siguientes según el calendario mock.</Text>
        <View style={styles.eventsList}>
          {upcoming.map((e) => {
            const { d, m } = parseEventDate(e.date);
            return (
              <Pressable
                key={e.id}
                onPress={() => router.push(`/(tabs)/events/${e.id}` as Href)}
                style={({ pressed }) => [styles.eventCard, pressed && { opacity: 0.92 }]}>
                <Text style={styles.eventDate}>
                  {d} {MONTH_SHORT[m]}
                </Text>
                <View style={styles.eventBody}>
                  <Text style={styles.eventCardTitle} numberOfLines={2}>
                    {e.title}
                  </Text>
                  <Text style={styles.eventCardSub} numberOfLines={2}>
                    {e.subtitle}
                  </Text>
                  <Text style={styles.eventTap}>Ver detalle →</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: EditorialColors.background,
  },
  screen: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 32,
  },
  currentCard: {
    backgroundColor: EditorialColors.surfaceContainerLow,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  tag: {
    fontFamily: EditorialFonts.label,
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: EditorialColors.onSecondaryContainer,
    backgroundColor: EditorialColors.secondaryContainer,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    overflow: 'hidden',
    marginBottom: 16,
  },
  bookRow: {
    flexDirection: 'row',
    gap: 18,
    alignItems: 'flex-start',
  },
  coverShadow: {
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: EditorialColors.primary,
    shadowOffset: { width: 6, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 4,
  },
  cover: {
    width: 112,
    aspectRatio: 2 / 3,
    backgroundColor: EditorialColors.surfaceContainerHighest,
  },
  bookMeta: {
    flex: 1,
    minWidth: 0,
  },
  bookTitle: {
    fontFamily: EditorialFonts.headlineItalic,
    fontSize: 22,
    lineHeight: 26,
    color: EditorialColors.onSurface,
    marginBottom: 4,
  },
  author: {
    fontFamily: EditorialFonts.bodyMedium,
    fontSize: 15,
    color: EditorialColors.onSurfaceVariant,
    marginBottom: 8,
  },
  chaptersHint: {
    fontFamily: EditorialFonts.body,
    fontSize: 13,
    lineHeight: 18,
    color: EditorialColors.onSurfaceVariant,
    marginBottom: 12,
  },
  linkBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: EditorialColors.surfaceContainerHighest,
  },
  linkBtnLabel: {
    fontFamily: EditorialFonts.label,
    fontSize: 13,
    color: EditorialColors.primary,
  },
  progressTrack: {
    height: 6,
    borderRadius: 4,
    backgroundColor: EditorialColors.surfaceContainerHighest,
    overflow: 'hidden',
    marginTop: 18,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: EditorialColors.tertiary,
  },
  progressLabel: {
    fontFamily: EditorialFonts.bodyMedium,
    fontSize: 13,
    color: EditorialColors.onSurfaceVariant,
    marginTop: 10,
  },
  fallback: {
    fontFamily: EditorialFonts.body,
    fontSize: 15,
    color: EditorialColors.onSurfaceVariant,
    marginBottom: 16,
  },
  goalCard: {
    backgroundColor: EditorialColors.surfaceContainerLow,
    borderRadius: 20,
    padding: 20,
  },
  goalTitle: {
    fontFamily: EditorialFonts.headlineItalic,
    fontSize: 22,
    color: EditorialColors.onSurface,
    marginBottom: 6,
  },
  goalSub: {
    fontFamily: EditorialFonts.body,
    fontSize: 15,
    color: EditorialColors.onSurfaceVariant,
    marginBottom: 14,
  },
  goalEmph: {
    fontFamily: EditorialFonts.bodyMedium,
    color: EditorialColors.primary,
  },
  goalTrack: {
    height: 10,
    borderRadius: 6,
    backgroundColor: EditorialColors.surfaceContainerHighest,
    overflow: 'hidden',
  },
  goalFill: {
    height: '100%',
    borderRadius: 6,
    backgroundColor: EditorialColors.secondary,
  },
  goalFoot: {
    fontFamily: EditorialFonts.body,
    fontSize: 13,
    lineHeight: 18,
    color: EditorialColors.onSurfaceVariant,
    marginTop: 12,
  },
  chatSection: {
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: EditorialColors.surfaceContainerLow,
    borderRadius: 20,
    padding: 20,
  },
  chatTitle: {
    fontFamily: EditorialFonts.headlineItalic,
    fontSize: 22,
    color: EditorialColors.onSurface,
    marginBottom: 6,
  },
  chatHint: {
    fontFamily: EditorialFonts.body,
    fontSize: 14,
    lineHeight: 20,
    color: EditorialColors.onSurfaceVariant,
    marginBottom: 14,
  },
  chatBtn: {
    alignSelf: 'flex-start',
    backgroundColor: EditorialColors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
  },
  chatBtnLabel: {
    fontFamily: EditorialFonts.label,
    fontSize: 15,
    color: EditorialColors.onPrimary,
  },
  eventsSection: {
    marginTop: 8,
  },
  eventsTitle: {
    fontFamily: EditorialFonts.headlineItalic,
    fontSize: 22,
    color: EditorialColors.onSurface,
    marginBottom: 4,
  },
  eventsHint: {
    fontFamily: EditorialFonts.body,
    fontSize: 13,
    color: EditorialColors.onSurfaceVariant,
    marginBottom: 14,
  },
  eventsList: {
    gap: 12,
  },
  eventCard: {
    flexDirection: 'row',
    gap: 14,
    backgroundColor: EditorialColors.surfaceContainerLow,
    borderRadius: 16,
    padding: 14,
    alignItems: 'flex-start',
  },
  eventDate: {
    fontFamily: EditorialFonts.headline,
    fontSize: 15,
    color: EditorialColors.primary,
    minWidth: 52,
  },
  eventBody: {
    flex: 1,
    minWidth: 0,
  },
  eventCardTitle: {
    fontFamily: EditorialFonts.bodyMedium,
    fontSize: 16,
    color: EditorialColors.onSurface,
    marginBottom: 4,
  },
  eventCardSub: {
    fontFamily: EditorialFonts.body,
    fontSize: 14,
    color: EditorialColors.onSurfaceVariant,
  },
  eventTap: {
    fontFamily: EditorialFonts.label,
    fontSize: 12,
    color: EditorialColors.primary,
    marginTop: 8,
  },
});
