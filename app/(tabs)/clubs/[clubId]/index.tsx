import { Image } from 'expo-image';
import { type Href, Link, router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { EditorialColors, EditorialFonts } from '@/constants/theme';
import { useChapterProgress } from '@/context/ChapterProgressContext';
import { getBook } from '@/data/mockData';
import { useUserCreatedClubs } from '@/context/UserCreatedClubsContext';

const GAP = 10;

export default function ClubDetailScreen() {
  const { clubId } = useLocalSearchParams<{ clubId: string }>();
  const { getClubById } = useUserCreatedClubs();
  const club = clubId ? getClubById(clubId) : undefined;
  const book = club ? getBook(club.bookId) : undefined;
  const { isRead, toggleRead } = useChapterProgress();

  if (!club || !book || !clubId) {
    return (
      <View style={styles.centered}>
        <Text style={styles.err}>Club no encontrado.</Text>
      </View>
    );
  }

  const maxShown = Math.min(book.chapterCount, 36);
  const chapters = Array.from({ length: maxShown }, (_, i) => i + 1);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <View style={styles.coverWrap}>
          <Image source={{ uri: book.coverUrl }} style={styles.cover} contentFit="cover" />
        </View>
        <View style={styles.heroText}>
          <Text style={styles.clubLabel}>{club.name}</Text>
          <Text style={styles.bookTitle}>{book.title}</Text>
          <Text style={styles.author}>{book.author}</Text>
          <Pressable
            onPress={() => router.push(`/(tabs)/clubs/${clubId}/group` as Href)}
            style={({ pressed }) => [styles.chatCta, pressed && { opacity: 0.92 }]}>
            <Text style={styles.chatCtaTitle}>Chat en vivo del club</Text>
            <Text style={styles.chatCtaSub}>Habla con quienes leen a la vez (mock guardado local)</Text>
          </Pressable>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Capítulos</Text>
      <Text style={styles.sectionSub}>
        El interruptor en cada tarjeta guarda tu progreso. Toca el centro para el foro del capítulo.
      </Text>
      {book.chapterCount > maxShown ? (
        <Text style={styles.capNote}>
          Mostrando {maxShown} de {book.chapterCount} (mock).
        </Text>
      ) : null}

      <View style={styles.grid}>
        {chapters.map((n) => {
          const read = isRead(clubId, n);
          return (
            <View
              key={n}
              style={[
                styles.chapterCard,
                read ? styles.chapterCardRead : styles.chapterCardUnread,
              ]}>
              <Link href={`/(tabs)/clubs/${club.id}/chapter/${n}` as Href} asChild>
                <Pressable
                  style={({ pressed }) => [
                    styles.chapterTap,
                    read ? styles.chapterTapRead : styles.chapterTapUnread,
                    pressed && { opacity: 0.94 },
                  ]}>
                  <Text style={[styles.chapterBigNum, read && styles.chapterBigNumRead]}>{n}</Text>
                  <Text style={[styles.chapterLabel, read && styles.chapterLabelRead]}>Capítulo</Text>
                  <Text style={[styles.chapterForum, read && styles.chapterForumRead]}>Foro →</Text>
                </Pressable>
              </Link>
              <View style={[styles.switchBar, read && styles.switchBarRead]}>
                <View style={styles.switchScale}>
                  <Switch
                    value={read}
                    onValueChange={() => toggleRead(clubId, n)}
                    trackColor={{
                      false: EditorialColors.surfaceContainerHigh,
                      true: EditorialColors.secondary,
                    }}
                    thumbColor={read ? EditorialColors.onPrimary : EditorialColors.surface}
                    ios_backgroundColor={EditorialColors.surfaceContainerHigh}
                  />
                </View>
              </View>
            </View>
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
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100,
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
  hero: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 22,
  },
  coverWrap: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: EditorialColors.primary,
    shadowOffset: { width: 4, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  cover: {
    width: 108,
    aspectRatio: 2 / 3,
    backgroundColor: EditorialColors.surfaceContainerHighest,
  },
  heroText: {
    flex: 1,
    minWidth: 0,
  },
  clubLabel: {
    fontFamily: EditorialFonts.label,
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: EditorialColors.secondary,
    marginBottom: 6,
  },
  bookTitle: {
    fontFamily: EditorialFonts.headlineItalic,
    fontSize: 21,
    lineHeight: 25,
    color: EditorialColors.onSurface,
    marginBottom: 4,
  },
  author: {
    fontFamily: EditorialFonts.bodyMedium,
    fontSize: 14,
    color: EditorialColors.onSurfaceVariant,
    marginBottom: 12,
  },
  chatCta: {
    backgroundColor: EditorialColors.surfaceContainerLow,
    borderRadius: 14,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: EditorialColors.primary,
  },
  chatCtaTitle: {
    fontFamily: EditorialFonts.headline,
    fontSize: 16,
    color: EditorialColors.onSurface,
  },
  chatCtaSub: {
    fontFamily: EditorialFonts.body,
    fontSize: 12,
    lineHeight: 16,
    color: EditorialColors.onSurfaceVariant,
    marginTop: 4,
  },
  sectionTitle: {
    fontFamily: EditorialFonts.headlineItalic,
    fontSize: 22,
    color: EditorialColors.onSurface,
    marginBottom: 6,
  },
  sectionSub: {
    fontFamily: EditorialFonts.body,
    fontSize: 13,
    lineHeight: 18,
    color: EditorialColors.onSurfaceVariant,
    marginBottom: 10,
  },
  capNote: {
    fontFamily: EditorialFonts.body,
    fontSize: 12,
    color: EditorialColors.onSurfaceVariant,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: GAP,
  },
  chapterCard: {
    width: '48%',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 2,
  },
  chapterCardUnread: {
    backgroundColor: EditorialColors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: EditorialColors.outlineVariant,
  },
  chapterCardRead: {
    backgroundColor: EditorialColors.secondaryContainer,
    borderWidth: 2,
    borderColor: EditorialColors.secondary,
    shadowColor: EditorialColors.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 2,
  },
  chapterTap: {
    alignItems: 'center',
    paddingTop: 18,
    paddingHorizontal: 16,
    paddingBottom: 12,
    minHeight: 118,
  },
  chapterTapUnread: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: EditorialColors.outlineVariant,
  },
  chapterTapRead: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: `${EditorialColors.secondary}55`,
  },
  chapterBigNum: {
    fontFamily: EditorialFonts.display,
    fontSize: 34,
    lineHeight: 38,
    color: EditorialColors.primary,
  },
  chapterBigNumRead: {
    color: EditorialColors.onSecondaryContainer,
  },
  chapterLabel: {
    fontFamily: EditorialFonts.label,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: EditorialColors.onSurfaceVariant,
    marginTop: 6,
  },
  chapterLabelRead: {
    color: EditorialColors.secondary,
  },
  chapterForum: {
    fontFamily: EditorialFonts.label,
    fontSize: 13,
    color: EditorialColors.secondary,
    marginTop: 12,
  },
  chapterForumRead: {
    color: EditorialColors.onSecondaryContainer,
  },
  switchBar: {
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 12,
    alignItems: 'flex-end',
    backgroundColor: EditorialColors.surfaceContainerHigh,
  },
  switchBarRead: {
    backgroundColor: 'rgba(67, 102, 77, 0.14)',
  },
  switchScale: {
    transform: [{ scaleX: 0.82 }, { scaleY: 0.82 }],
    marginRight: -4,
    marginBottom: -2,
  },
});
