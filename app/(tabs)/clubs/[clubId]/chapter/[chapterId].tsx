import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EditorialColors, EditorialFonts } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { type ForumComment, useForum } from '@/context/ForumContext';
import { useProfile } from '@/context/ProfileContext';

function CommentRow({
  item,
  onVote,
}: {
  item: ForumComment;
  onVote: (dir: 'up' | 'down') => void;
}) {
  return (
    <View style={styles.comment}>
      <Text style={styles.author}>{item.author}</Text>
      <Text style={styles.body}>{item.body}</Text>
      <View style={styles.votes}>
        <Pressable
          onPress={() => onVote('up')}
          style={[styles.voteBtn, item.userVote === 'up' && styles.voteOn]}>
          <Text style={styles.voteEmoji}>👍</Text>
          <Text style={styles.voteCount}>{item.up}</Text>
        </Pressable>
        <Pressable
          onPress={() => onVote('down')}
          style={[styles.voteBtn, item.userVote === 'down' && styles.voteOnDown]}>
          <Text style={styles.voteEmoji}>👎</Text>
          <Text style={styles.voteCount}>{item.down}</Text>
        </Pressable>
      </View>
      <Text style={styles.threadHint}>Hilos de respuestas: próximamente.</Text>
    </View>
  );
}

export default function ChapterForumScreen() {
  const insets = useSafeAreaInsets();
  const { clubId, chapterId } = useLocalSearchParams<{ clubId: string; chapterId: string }>();
  const { getThread, addComment, vote } = useForum();
  const { email } = useAuth();
  const { profile } = useProfile();
  const [draft, setDraft] = useState('');

  const chapterNum = chapterId ?? '1';

  const thread = getThread(clubId ?? '', chapterNum);

  const displayAuthor =
    profile.displayName.trim() || email?.split('@')[0] || 'Lector';

  function send() {
    const t = draft.trim();
    if (!t || !clubId) return;
    addComment(clubId, chapterNum, displayAuthor, t);
    setDraft('');
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={thread}
        keyExtractor={(c) => c.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.listHead}>
            <Text style={styles.chapterHeading}>Capítulo {chapterNum}</Text>
            <Text style={styles.intro}>
              Comentarios del capítulo (mock). Un voto por persona y comentario; tocar de nuevo
              quita el voto.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <CommentRow
            item={item}
            onVote={(dir) => {
              if (!clubId) return;
              vote(clubId, chapterNum, item.id, dir);
            }}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
      />
      <View style={[styles.composer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="Escribe un comentario…"
          placeholderTextColor={`${EditorialColors.onSurfaceVariant}99`}
          style={styles.input}
          multiline
        />
        <Pressable onPress={send} style={styles.send}>
          <Text style={styles.sendLabel}>Enviar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: EditorialColors.background,
  },
  list: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 120,
  },
  listHead: {
    marginBottom: 8,
  },
  chapterHeading: {
    fontFamily: EditorialFonts.headlineItalic,
    fontSize: 24,
    color: EditorialColors.onSurface,
    marginBottom: 10,
  },
  intro: {
    fontFamily: EditorialFonts.body,
    fontSize: 13,
    lineHeight: 18,
    color: EditorialColors.onSurfaceVariant,
    marginBottom: 16,
  },
  comment: {
    backgroundColor: EditorialColors.surfaceContainerLow,
    borderRadius: 16,
    padding: 16,
  },
  author: {
    fontFamily: EditorialFonts.label,
    fontSize: 12,
    color: EditorialColors.secondary,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  body: {
    fontFamily: EditorialFonts.body,
    fontSize: 16,
    lineHeight: 24,
    color: EditorialColors.onSurface,
    marginBottom: 12,
  },
  votes: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  voteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: EditorialColors.surfaceContainerHighest,
  },
  voteOn: {
    backgroundColor: EditorialColors.secondaryContainer,
  },
  voteOnDown: {
    backgroundColor: '#e7bdb1',
  },
  voteEmoji: {
    fontSize: 16,
  },
  voteCount: {
    fontFamily: EditorialFonts.bodyMedium,
    fontSize: 14,
    color: EditorialColors.onSurface,
  },
  threadHint: {
    fontFamily: EditorialFonts.body,
    fontSize: 12,
    color: EditorialColors.onSurfaceVariant,
    marginTop: 10,
    fontStyle: 'italic',
  },
  composer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 12,
    backgroundColor: EditorialColors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: EditorialColors.outlineVariant,
  },
  input: {
    flex: 1,
    fontFamily: EditorialFonts.body,
    fontSize: 16,
    color: EditorialColors.onSurface,
    backgroundColor: EditorialColors.surfaceContainerHighest,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxHeight: 100,
  },
  send: {
    backgroundColor: EditorialColors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    marginBottom: 2,
  },
  sendLabel: {
    fontFamily: EditorialFonts.label,
    fontSize: 14,
    color: EditorialColors.onPrimary,
  },
});
