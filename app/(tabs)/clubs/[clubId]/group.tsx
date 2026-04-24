import { type Href, router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EditorialColors, EditorialFonts } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useClubGroupChat } from '@/context/ClubGroupChatContext';
import { useProfile } from '@/context/ProfileContext';
import { type GroupChatMessage } from '@/data/mockData';
import { useUserCreatedClubs } from '@/context/UserCreatedClubsContext';

export default function ClubGroupChatScreen() {
  const { clubId } = useLocalSearchParams<{ clubId: string }>();
  const { getClubById } = useUserCreatedClubs();
  const club = clubId ? getClubById(clubId) : undefined;
  const { getMessages, sendMessage } = useClubGroupChat();
  const { email } = useAuth();
  const { profile } = useProfile();
  const insets = useSafeAreaInsets();
  const [draft, setDraft] = useState('');
  const listRef = useRef<FlatList>(null);

  const author =
    profile.displayName.trim() || email?.split('@')[0] || 'Lector';

  const messages = clubId ? getMessages(clubId) : [];

  function send() {
    if (!clubId) return;
    sendMessage(clubId, author, draft);
    setDraft('');
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 80);
  }

  if (!club) {
    return (
      <View style={styles.centered}>
        <Text style={styles.err}>Club no encontrado.</Text>
        <Pressable onPress={() => router.back()} style={styles.backLink}>
          <Text style={styles.backLinkTxt}>Volver</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}>
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>Chat del club</Text>
        <Text style={styles.bannerSub}>{club.name}</Text>
        <Text style={styles.bannerHint}>
          Mock en vivo: los mensajes se guardan en el dispositivo. Con backend habrá tiempo real.
        </Text>
        <Pressable
          onPress={() => router.replace(`/(tabs)/clubs/${clubId}` as Href)}
          style={styles.forumLink}>
          <Text style={styles.forumLinkTxt}>Volver al club y capítulos →</Text>
        </Pressable>
      </View>
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
        renderItem={({ item }) => <Bubble message={item} />}
      />
      <View style={[styles.composer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="Escribe al club…"
          placeholderTextColor={`${EditorialColors.onSurfaceVariant}99`}
          style={styles.input}
          multiline
          maxLength={500}
        />
        <Pressable onPress={send} style={styles.send}>
          <Text style={styles.sendTxt}>Enviar</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

function Bubble({ message }: { message: GroupChatMessage }) {
  const mod = message.author === 'Moderación';
  return (
    <View style={[styles.bubbleRow, mod && styles.bubbleRowMod]}>
      <View style={[styles.bubble, mod ? styles.bubbleMod : styles.bubblePeer]}>
        <Text style={[styles.bubbleAuthor, mod && styles.bubbleAuthorMod]}>{message.author}</Text>
        <Text style={[styles.bubbleText, mod && styles.bubbleTextMod]}>{message.text}</Text>
        <Text style={[styles.bubbleTime, mod && styles.bubbleTimeMod]}>{message.at}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: EditorialColors.background,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: EditorialColors.background,
  },
  err: {
    fontFamily: EditorialFonts.body,
    color: EditorialColors.onSurfaceVariant,
    marginBottom: 12,
  },
  backLink: {
    padding: 12,
  },
  backLinkTxt: {
    fontFamily: EditorialFonts.label,
    color: EditorialColors.primary,
  },
  banner: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: EditorialColors.outlineVariant,
    backgroundColor: EditorialColors.surfaceContainerLow,
  },
  bannerTitle: {
    fontFamily: EditorialFonts.headlineItalic,
    fontSize: 22,
    color: EditorialColors.onSurface,
  },
  bannerSub: {
    fontFamily: EditorialFonts.bodyMedium,
    fontSize: 15,
    color: EditorialColors.primary,
    marginTop: 4,
  },
  bannerHint: {
    fontFamily: EditorialFonts.body,
    fontSize: 12,
    lineHeight: 17,
    color: EditorialColors.onSurfaceVariant,
    marginTop: 8,
  },
  forumLink: {
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  forumLinkTxt: {
    fontFamily: EditorialFonts.label,
    fontSize: 13,
    color: EditorialColors.secondary,
  },
  listContent: {
    padding: 16,
    paddingBottom: 8,
    gap: 12,
  },
  bubbleRow: {
    alignItems: 'flex-start',
  },
  bubbleRowMod: {
    alignItems: 'center',
  },
  bubble: {
    maxWidth: '92%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  bubblePeer: {
    backgroundColor: EditorialColors.surfaceContainerHighest,
    borderTopLeftRadius: 4,
  },
  bubbleMod: {
    backgroundColor: EditorialColors.tertiary,
  },
  bubbleAuthor: {
    fontFamily: EditorialFonts.label,
    fontSize: 11,
    color: EditorialColors.secondary,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bubbleAuthorMod: {
    color: EditorialColors.onPrimary,
    opacity: 0.95,
  },
  bubbleText: {
    fontFamily: EditorialFonts.body,
    fontSize: 16,
    lineHeight: 22,
    color: EditorialColors.onSurface,
  },
  bubbleTextMod: {
    color: EditorialColors.onPrimary,
  },
  bubbleTime: {
    fontFamily: EditorialFonts.body,
    fontSize: 11,
    color: EditorialColors.onSurfaceVariant,
    marginTop: 6,
    alignSelf: 'flex-end',
  },
  bubbleTimeMod: {
    color: EditorialColors.onPrimary,
    opacity: 0.85,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    paddingHorizontal: 14,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: EditorialColors.outlineVariant,
    backgroundColor: EditorialColors.surface,
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
  sendTxt: {
    fontFamily: EditorialFonts.label,
    fontSize: 14,
    color: EditorialColors.onPrimary,
  },
});
