import { Image } from 'expo-image';
import { useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { EditorialColors, EditorialFonts } from '@/constants/theme';
import { type LibraryBook, type LibraryStatus, useLibrary } from '@/context/LibraryContext';

const STATUS_LABEL: Record<LibraryStatus, string> = {
  reading: 'Leyendo ahora',
  want: 'Quiero leer',
  read: 'Leídos',
};

const DEFAULT_COVER =
  'https://images.unsplash.com/photo-1526243741027-444d633d7365?w=200&q=80';

function BookRow({
  item,
  onRemove,
  onMove,
}: {
  item: LibraryBook;
  onRemove: () => void;
  onMove: (s: LibraryStatus) => void;
}) {
  return (
    <View style={styles.bookRow}>
      <Image
        source={{ uri: item.coverUrl || DEFAULT_COVER }}
        style={styles.thumb}
        contentFit="cover"
      />
      <View style={styles.bookBody}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <Text style={styles.bookAuthor}>{item.author}</Text>
        <View style={styles.rowActions}>
          {(['reading', 'want', 'read'] as const).map((s) => (
            <Pressable
              key={s}
              onPress={() => onMove(s)}
              style={[styles.pill, item.status === s && styles.pillOn]}>
              <Text style={[styles.pillTxt, item.status === s && styles.pillTxtOn]}>
                {s === 'reading' ? 'Ahora' : s === 'want' ? 'Lista' : 'Leído'}
              </Text>
            </Pressable>
          ))}
          <Pressable onPress={onRemove} style={styles.remove}>
            <Text style={styles.removeTxt}>Quitar</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export default function LibraryScreen() {
  const { books, addBook, removeBook, setStatus } = useLibrary();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [addStatus, setAddStatus] = useState<LibraryStatus>('want');

  function closeModal() {
    setOpen(false);
    setTitle('');
    setAuthor('');
    setCoverUrl('');
    setAddStatus('want');
  }

  async function submitAdd() {
    const t = title.trim();
    const a = author.trim();
    if (!t || !a) return;
    await addBook({
      title: t,
      author: a,
      coverUrl: coverUrl.trim() || DEFAULT_COVER,
      status: addStatus,
    });
    closeModal();
  }

  const sections = (['reading', 'want', 'read'] as const).map((status) => ({
    status,
    data: books.filter((b) => b.status === status),
  }));

  return (
    <View style={styles.screen}>
      <Text style={styles.lead}>Tu biblioteca</Text>
      <Text style={styles.sub}>Mock local: se guarda en el dispositivo.</Text>
      <Pressable onPress={() => setOpen(true)} style={styles.addBtn}>
        <Text style={styles.addBtnLabel}>Añadir libro</Text>
      </Pressable>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {sections.map(({ status, data }) => (
          <View key={status} style={styles.section}>
            <Text style={styles.sectionTitle}>{STATUS_LABEL[status]}</Text>
            {data.length === 0 ? (
              <Text style={styles.empty}>Nada aquí todavía.</Text>
            ) : (
              <FlatList
                data={data}
                scrollEnabled={false}
                keyExtractor={(b) => b.id}
                renderItem={({ item }) => (
                  <BookRow
                    item={item}
                    onRemove={() => removeBook(item.id)}
                    onMove={(s) => setStatus(item.id, s)}
                  />
                )}
                ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
              />
            )}
          </View>
        ))}
      </ScrollView>

      <Modal visible={open} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Nuevo libro</Text>
            <Text style={styles.label}>Título</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Título"
              placeholderTextColor={`${EditorialColors.onSurfaceVariant}99`}
              style={styles.input}
            />
            <Text style={styles.label}>Autor/a</Text>
            <TextInput
              value={author}
              onChangeText={setAuthor}
              placeholder="Autor o autora"
              placeholderTextColor={`${EditorialColors.onSurfaceVariant}99`}
              style={styles.input}
            />
            <Text style={styles.label}>URL de portada (opcional)</Text>
            <TextInput
              value={coverUrl}
              onChangeText={setCoverUrl}
              placeholder="https://…"
              placeholderTextColor={`${EditorialColors.onSurfaceVariant}99`}
              autoCapitalize="none"
              style={styles.input}
            />
            <Text style={styles.label}>Estado</Text>
            <View style={styles.statusRow}>
              {(['reading', 'want', 'read'] as const).map((s) => (
                <Pressable
                  key={s}
                  onPress={() => setAddStatus(s)}
                  style={[styles.statusChip, addStatus === s && styles.statusChipOn]}>
                  <Text style={[styles.statusChipTxt, addStatus === s && styles.statusChipTxtOn]}>
                    {STATUS_LABEL[s]}
                  </Text>
                </Pressable>
              ))}
            </View>
            <View style={styles.modalActions}>
              <Pressable onPress={closeModal} style={styles.secondaryBtn}>
                <Text style={styles.secondaryBtnTxt}>Cancelar</Text>
              </Pressable>
              <Pressable onPress={submitAdd} style={styles.primaryBtn}>
                <Text style={styles.primaryBtnTxt}>Guardar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: EditorialColors.background,
    paddingHorizontal: 24,
    paddingTop: 8,
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
  addBtn: {
    alignSelf: 'flex-start',
    backgroundColor: EditorialColors.primary,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
    marginBottom: 16,
  },
  addBtnLabel: {
    fontFamily: EditorialFonts.label,
    fontSize: 14,
    color: EditorialColors.onPrimary,
  },
  scroll: {
    paddingBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: EditorialFonts.headline,
    fontSize: 18,
    color: EditorialColors.onSurface,
    marginBottom: 12,
  },
  empty: {
    fontFamily: EditorialFonts.body,
    fontSize: 14,
    color: EditorialColors.onSurfaceVariant,
  },
  bookRow: {
    flexDirection: 'row',
    gap: 14,
    backgroundColor: EditorialColors.surfaceContainerLow,
    borderRadius: 16,
    padding: 12,
  },
  thumb: {
    width: 56,
    height: 84,
    borderRadius: 8,
    backgroundColor: EditorialColors.surfaceContainerHighest,
  },
  bookBody: {
    flex: 1,
    minWidth: 0,
  },
  bookTitle: {
    fontFamily: EditorialFonts.bodyMedium,
    fontSize: 16,
    color: EditorialColors.onSurface,
  },
  bookAuthor: {
    fontFamily: EditorialFonts.body,
    fontSize: 14,
    color: EditorialColors.onSurfaceVariant,
    marginBottom: 8,
  },
  rowActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: EditorialColors.surfaceContainerHighest,
  },
  pillOn: {
    backgroundColor: EditorialColors.secondaryContainer,
  },
  pillTxt: {
    fontFamily: EditorialFonts.label,
    fontSize: 11,
    color: EditorialColors.onSurfaceVariant,
  },
  pillTxtOn: {
    color: EditorialColors.onSecondaryContainer,
  },
  remove: {
    marginLeft: 4,
  },
  removeTxt: {
    fontFamily: EditorialFonts.label,
    fontSize: 12,
    color: EditorialColors.primary,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: EditorialColors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 36,
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
    marginTop: 10,
    marginBottom: 6,
  },
  input: {
    fontFamily: EditorialFonts.body,
    fontSize: 16,
    color: EditorialColors.onSurface,
    backgroundColor: EditorialColors.surfaceContainerHighest,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  statusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  statusChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: EditorialColors.surfaceContainerLow,
  },
  statusChipOn: {
    backgroundColor: EditorialColors.primary,
  },
  statusChipTxt: {
    fontFamily: EditorialFonts.bodyMedium,
    fontSize: 13,
    color: EditorialColors.onSurface,
  },
  statusChipTxtOn: {
    color: EditorialColors.onPrimary,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 24,
  },
  secondaryBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  secondaryBtnTxt: {
    fontFamily: EditorialFonts.label,
    fontSize: 15,
    color: EditorialColors.primary,
  },
  primaryBtn: {
    backgroundColor: EditorialColors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
  },
  primaryBtnTxt: {
    fontFamily: EditorialFonts.label,
    fontSize: 15,
    color: EditorialColors.onPrimary,
  },
});
