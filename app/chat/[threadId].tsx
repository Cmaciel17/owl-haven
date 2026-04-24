import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { EditorialColors, EditorialFonts } from '@/constants/theme';
import { getPrivateThreadById, MOCK_CHAT_MESSAGES } from '@/data/mockData';

export default function PrivateChatScreen() {
  const { threadId } = useLocalSearchParams<{ threadId: string }>();
  const thread = threadId ? getPrivateThreadById(threadId) : undefined;
  const messages = threadId ? MOCK_CHAT_MESSAGES[threadId] ?? [] : [];

  if (!thread) {
    return (
      <View style={styles.centered}>
        <Text style={styles.err}>Conversación no encontrada.</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.banner}>
        <Text style={styles.bannerName}>{thread.name}</Text>
        <Text style={styles.bannerSub}>Chat privado (mock)</Text>
      </View>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.bubbles}
        showsVerticalScrollIndicator={false}>
        {messages.map((m) => (
          <View
            key={m.id}
            style={[styles.bubbleWrap, m.from === 'me' ? styles.bubbleWrapMe : styles.bubbleWrapThem]}>
            <View style={[styles.bubble, m.from === 'me' ? styles.bubbleMe : styles.bubbleThem]}>
              <Text style={[styles.bubbleText, m.from === 'me' && styles.bubbleTextMe]}>
                {m.text}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.composer}>
        <TextInput
          editable={false}
          placeholder="Escribir mensaje (próximamente)"
          placeholderTextColor={`${EditorialColors.onSurfaceVariant}99`}
          style={styles.input}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: EditorialColors.background,
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
  banner: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: EditorialColors.outlineVariant,
  },
  bannerName: {
    fontFamily: EditorialFonts.headlineItalic,
    fontSize: 22,
    color: EditorialColors.onSurface,
  },
  bannerSub: {
    fontFamily: EditorialFonts.body,
    fontSize: 13,
    color: EditorialColors.onSurfaceVariant,
    marginTop: 4,
  },
  scroll: {
    flex: 1,
  },
  bubbles: {
    padding: 16,
    paddingBottom: 24,
    gap: 10,
  },
  bubbleWrap: {
    maxWidth: '88%',
  },
  bubbleWrapMe: {
    alignSelf: 'flex-end',
  },
  bubbleWrapThem: {
    alignSelf: 'flex-start',
  },
  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  bubbleMe: {
    backgroundColor: EditorialColors.primary,
  },
  bubbleThem: {
    backgroundColor: EditorialColors.surfaceContainerHighest,
  },
  bubbleText: {
    fontFamily: EditorialFonts.body,
    fontSize: 16,
    lineHeight: 22,
    color: EditorialColors.onSurface,
  },
  bubbleTextMe: {
    color: EditorialColors.onPrimary,
  },
  composer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 28,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: EditorialColors.outlineVariant,
    backgroundColor: EditorialColors.surface,
  },
  input: {
    fontFamily: EditorialFonts.body,
    fontSize: 16,
    color: EditorialColors.onSurface,
    backgroundColor: EditorialColors.surfaceContainerHighest,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
});
