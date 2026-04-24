import { Link, type Href } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { EditorialColors, EditorialFonts } from '@/constants/theme';
import { useUserCreatedClubs } from '@/context/UserCreatedClubsContext';
import {
  getBook,
  getAllBooks,
  MOCK_CLUBS,
  MOCK_RECENT_CLUBS,
  searchClubsByBookOrName,
  type BookDef,
  type ClubDef,
} from '@/data/mockData';

export default function ClubsListScreen() {
  const { allClubs, userClubs, addClub } = useUserCreatedClubs();
  const [segment, setSegment] = useState<'active' | 'inactive'>('active');
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [pickedBook, setPickedBook] = useState<BookDef | null>(null);

  const q = search.trim();

  const mainList = useMemo(
    () => MOCK_CLUBS.filter((c) => (segment === 'active' ? c.active : !c.active)),
    [segment],
  );

  const searchResults = useMemo(() => {
    if (!q) return [];
    return searchClubsByBookOrName(allClubs, q, (bid) => getBook(bid)?.title);
  }, [allClubs, q]);

  const recentList = useMemo(() => {
    const u = [...userClubs].reverse();
    const seen = new Set<string>();
    const out: ClubDef[] = [];
    for (const c of [...u, ...MOCK_RECENT_CLUBS]) {
      if (!seen.has(c.id)) {
        seen.add(c.id);
        out.push(c);
      }
    }
    return out.slice(0, 8);
  }, [userClubs]);

  function openCreateFromSearch() {
    setNewName(q ? `Club: ${q}` : '');
    setPickedBook(null);
    setCreateOpen(true);
  }

  async function submitCreate() {
    if (!pickedBook || !newName.trim()) return;
    await addClub(newName.trim(), pickedBook.id);
    setCreateOpen(false);
    setNewName('');
    setPickedBook(null);
    setSearch('');
  }

  const books = getAllBooks();

  return (
    <View style={styles.screen}>
      <Text style={styles.lead}>Tus círculos</Text>
      <Text style={styles.sub}>
        Busca por libro o nombre. Los recientes incluyen clubes nuevos de la comunidad y los que
        crees tú.
      </Text>

      <View style={styles.searchWrap}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar club o libro…"
          placeholderTextColor={`${EditorialColors.onSurfaceVariant}99`}
          style={styles.searchInput}
        />
        {!q ? (
          <Pressable onPress={() => { setNewName(''); setPickedBook(null); setCreateOpen(true); }} hitSlop={8}>
            <Text style={styles.inlineCreate}>+ Crear un club nuevo</Text>
          </Pressable>
        ) : null}
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {q.length > 0 ? (
          <>
            <Text style={styles.blockTitle}>Resultados</Text>
            {searchResults.length > 0 ? (
              <View style={styles.list}>
                {searchResults.map((c) => (
                  <ClubCard key={c.id} club={c} />
                ))}
              </View>
            ) : (
              <View style={styles.emptySearch}>
                <Text style={styles.emptyTxt}>No hay clubes que coincidan.</Text>
                <Text style={styles.emptyHint}>
                  Crea uno enlazado a un libro de la lista (mock). El nombre del club puede
                  inspirarse en tu búsqueda.
                </Text>
                <Pressable onPress={openCreateFromSearch} style={styles.createBtn}>
                  <Text style={styles.createBtnTxt}>Crear club</Text>
                </Pressable>
              </View>
            )}
          </>
        ) : (
          <>
            <View style={styles.segments}>
              <Pressable
                onPress={() => setSegment('active')}
                style={[styles.segBtn, segment === 'active' && styles.segBtnOn]}>
                <Text style={[styles.segTxt, segment === 'active' && styles.segTxtOn]}>Activos</Text>
              </Pressable>
              <Pressable
                onPress={() => setSegment('inactive')}
                style={[styles.segBtn, segment === 'inactive' && styles.segBtnOn]}>
                <Text style={[styles.segTxt, segment === 'inactive' && styles.segTxtOn]}>
                  Inactivos
                </Text>
              </Pressable>
            </View>

            <View style={styles.list}>
              {mainList.map((c) => (
                <ClubCard key={c.id} club={c} />
              ))}
              {mainList.length === 0 ? (
                <Text style={styles.empty}>No hay clubes en esta pestaña.</Text>
              ) : null}
            </View>

            <Text style={styles.recentTitle}>Clubs recientes</Text>
            <Text style={styles.recentSub}>Nuevos en la comunidad y los que has creado tú.</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recentRow}>
              {recentList.map((c) => (
                <RecentClubCard key={c.id} club={c} />
              ))}
            </ScrollView>
          </>
        )}
      </ScrollView>

      <Modal visible={createOpen} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Nuevo club (mock)</Text>
            <Text style={styles.label}>Nombre del club</Text>
            <TextInput
              value={newName}
              onChangeText={setNewName}
              placeholder="Ej. Lectores del faro"
              placeholderTextColor={`${EditorialColors.onSurfaceVariant}99`}
              style={styles.modalInput}
            />
            <Text style={styles.label}>Libro (elige uno)</Text>
            <ScrollView style={styles.bookPick} nestedScrollEnabled>
              {books.map((b) => (
                <Pressable
                  key={b.id}
                  onPress={() => setPickedBook(b)}
                  style={[styles.bookRow, pickedBook?.id === b.id && styles.bookRowOn]}>
                  <Text style={styles.bookRowTitle}>{b.title}</Text>
                  <Text style={styles.bookRowAuth}>{b.author}</Text>
                </Pressable>
              ))}
            </ScrollView>
            <View style={styles.modalActions}>
              <Pressable
                onPress={() => setCreateOpen(false)}
                style={styles.modalSecondary}>
                <Text style={styles.modalSecondaryTxt}>Cancelar</Text>
              </Pressable>
              <Pressable
                onPress={submitCreate}
                disabled={!pickedBook || !newName.trim()}
                style={[
                  styles.modalPrimary,
                  (!pickedBook || !newName.trim()) && { opacity: 0.5 },
                ]}>
                <Text style={styles.modalPrimaryTxt}>Crear</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function ClubCard({ club }: { club: ClubDef }) {
  const book = getBook(club.bookId);
  return (
    <Link href={`/(tabs)/clubs/${club.id}` as Href} asChild>
      <Pressable style={({ pressed }) => [styles.card, pressed && { opacity: 0.92 }]}>
        <View style={styles.cardTop}>
          <Text style={styles.badge}>{club.active ? 'Activo' : 'Inactivo'}</Text>
          {club.id.startsWith('u-') ? (
            <Text style={styles.badgeYou}>Tú</Text>
          ) : null}
        </View>
        <Text style={styles.cardTitle}>{club.name}</Text>
        {book ? (
          <>
            <Text style={styles.cardBook}>{book.title}</Text>
            <Text style={styles.cardMeta}>
              {book.chapterCount} capítulos · {club.memberCount} personas
            </Text>
          </>
        ) : (
          <Text style={styles.cardMeta}>Libro no encontrado (mock)</Text>
        )}
      </Pressable>
    </Link>
  );
}

function RecentClubCard({ club }: { club: ClubDef }) {
  const book = getBook(club.bookId);
  return (
    <Link href={`/(tabs)/clubs/${club.id}` as Href} asChild>
      <Pressable style={({ pressed }) => [styles.recentCard, pressed && { opacity: 0.92 }]}>
        <Text style={styles.recentName} numberOfLines={2}>
          {club.name}
        </Text>
        <Text style={styles.recentBook} numberOfLines={2}>
          {book?.title ?? '—'}
        </Text>
        <Text style={styles.recentMeta}>{club.memberCount} miembros</Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: EditorialColors.background,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  lead: {
    fontFamily: EditorialFonts.headlineItalic,
    fontSize: 28,
    color: EditorialColors.onSurface,
    marginBottom: 6,
  },
  sub: {
    fontFamily: EditorialFonts.body,
    fontSize: 14,
    color: EditorialColors.onSurfaceVariant,
    marginBottom: 14,
  },
  searchWrap: {
    marginBottom: 16,
    gap: 10,
  },
  inlineCreate: {
    fontFamily: EditorialFonts.label,
    fontSize: 14,
    color: EditorialColors.primary,
    marginTop: 2,
  },
  searchInput: {
    fontFamily: EditorialFonts.body,
    fontSize: 16,
    color: EditorialColors.onSurface,
    backgroundColor: EditorialColors.surfaceContainerHighest,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  scroll: {
    paddingBottom: 100,
  },
  blockTitle: {
    fontFamily: EditorialFonts.headline,
    fontSize: 18,
    color: EditorialColors.onSurface,
    marginBottom: 12,
  },
  segments: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  segBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: EditorialColors.surfaceContainerLow,
    alignItems: 'center',
  },
  segBtnOn: {
    backgroundColor: EditorialColors.primary,
  },
  segTxt: {
    fontFamily: EditorialFonts.label,
    fontSize: 14,
    color: EditorialColors.onSurfaceVariant,
  },
  segTxtOn: {
    color: EditorialColors.onPrimary,
  },
  list: {
    gap: 14,
    marginBottom: 24,
  },
  card: {
    backgroundColor: EditorialColors.surfaceContainerLow,
    borderRadius: 18,
    padding: 18,
  },
  cardTop: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  badge: {
    fontFamily: EditorialFonts.label,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: EditorialColors.onSecondaryContainer,
    backgroundColor: EditorialColors.secondaryContainer,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: 'hidden',
  },
  badgeYou: {
    fontFamily: EditorialFonts.label,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: EditorialColors.onPrimary,
    backgroundColor: EditorialColors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: 'hidden',
  },
  cardTitle: {
    fontFamily: EditorialFonts.headline,
    fontSize: 20,
    color: EditorialColors.onSurface,
    marginBottom: 6,
  },
  cardBook: {
    fontFamily: EditorialFonts.headlineItalic,
    fontSize: 16,
    color: EditorialColors.primary,
    marginBottom: 8,
  },
  cardMeta: {
    fontFamily: EditorialFonts.body,
    fontSize: 14,
    color: EditorialColors.onSurfaceVariant,
  },
  empty: {
    fontFamily: EditorialFonts.body,
    fontSize: 15,
    color: EditorialColors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 24,
  },
  emptySearch: {
    paddingVertical: 16,
    gap: 12,
  },
  emptyTxt: {
    fontFamily: EditorialFonts.bodyMedium,
    fontSize: 16,
    color: EditorialColors.onSurface,
  },
  emptyHint: {
    fontFamily: EditorialFonts.body,
    fontSize: 14,
    lineHeight: 20,
    color: EditorialColors.onSurfaceVariant,
  },
  createBtn: {
    alignSelf: 'flex-start',
    backgroundColor: EditorialColors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
    marginTop: 8,
  },
  createBtnTxt: {
    fontFamily: EditorialFonts.label,
    fontSize: 15,
    color: EditorialColors.onPrimary,
  },
  recentTitle: {
    fontFamily: EditorialFonts.headlineItalic,
    fontSize: 22,
    color: EditorialColors.onSurface,
    marginBottom: 4,
  },
  recentSub: {
    fontFamily: EditorialFonts.body,
    fontSize: 13,
    color: EditorialColors.onSurfaceVariant,
    marginBottom: 14,
  },
  recentRow: {
    gap: 12,
    paddingRight: 8,
  },
  recentCard: {
    width: 168,
    backgroundColor: EditorialColors.surfaceContainerLow,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: EditorialColors.outlineVariant,
  },
  recentName: {
    fontFamily: EditorialFonts.headline,
    fontSize: 16,
    color: EditorialColors.onSurface,
    marginBottom: 6,
  },
  recentBook: {
    fontFamily: EditorialFonts.body,
    fontSize: 13,
    lineHeight: 18,
    color: EditorialColors.primary,
    marginBottom: 8,
  },
  recentMeta: {
    fontFamily: EditorialFonts.label,
    fontSize: 11,
    color: EditorialColors.onSurfaceVariant,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: EditorialColors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '88%',
  },
  modalTitle: {
    fontFamily: EditorialFonts.headlineItalic,
    fontSize: 24,
    color: EditorialColors.onSurface,
    marginBottom: 16,
  },
  label: {
    fontFamily: EditorialFonts.label,
    fontSize: 11,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: EditorialColors.secondary,
    marginBottom: 8,
    marginTop: 8,
  },
  modalInput: {
    fontFamily: EditorialFonts.body,
    fontSize: 16,
    color: EditorialColors.onSurface,
    backgroundColor: EditorialColors.surfaceContainerHighest,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  bookPick: {
    maxHeight: 220,
    marginTop: 8,
  },
  bookRow: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: EditorialColors.surfaceContainerLow,
  },
  bookRowOn: {
    backgroundColor: EditorialColors.secondaryContainer,
  },
  bookRowTitle: {
    fontFamily: EditorialFonts.bodyMedium,
    fontSize: 15,
    color: EditorialColors.onSurface,
  },
  bookRowAuth: {
    fontFamily: EditorialFonts.body,
    fontSize: 13,
    color: EditorialColors.onSurfaceVariant,
    marginTop: 2,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 20,
  },
  modalSecondary: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  modalSecondaryTxt: {
    fontFamily: EditorialFonts.label,
    fontSize: 15,
    color: EditorialColors.primary,
  },
  modalPrimary: {
    backgroundColor: EditorialColors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
  },
  modalPrimaryTxt: {
    fontFamily: EditorialFonts.label,
    fontSize: 15,
    color: EditorialColors.onPrimary,
  },
});
