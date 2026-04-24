import { useFocusEffect } from '@react-navigation/native';
import { type Href, router } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { EditorialColors, EditorialFonts } from '@/constants/theme';
import { useInbox } from '@/context/InboxContext';
import { MOCK_PRIVATE_THREADS } from '@/data/mockData';

export default function MessagesScreen() {
  const { openInbox, simulateNotification } = useInbox();

  useFocusEffect(
    useCallback(() => {
      openInbox();
    }, [openInbox]),
  );

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <Text style={styles.lead}>Chats</Text>
      <Text style={styles.sub}>
        Toca una conversación para entrar al chat (mock). El aviso rojo del botón flotante se quita al
        abrir esta pantalla.
      </Text>
      <View style={styles.list}>
        {MOCK_PRIVATE_THREADS.map((t) => (
          <Pressable
            key={t.id}
            accessibilityRole="button"
            accessibilityLabel={`Entrar al chat con ${t.name}`}
            onPress={() => router.push(`/chat/${t.id}` as Href)}
            style={({ pressed }) => [styles.row, pressed && { opacity: 0.92 }]}>
            <View style={styles.avatar}>
              <Text style={styles.avatarTxt}>{t.name.charAt(0)}</Text>
            </View>
            <View style={styles.rowBody}>
              <View style={styles.rowTop}>
                <Text style={styles.name}>{t.name}</Text>
                <Text style={styles.time}>{t.time}</Text>
              </View>
              <Text style={styles.preview} numberOfLines={2}>
                {t.preview}
              </Text>
              <Text style={styles.enterHint}>Entrar al chat →</Text>
            </View>
            {t.unread ? <View style={styles.unreadDot} /> : null}
          </Pressable>
        ))}
      </View>
      <Pressable onPress={simulateNotification} style={styles.demo}>
        <Text style={styles.demoTxt}>Simular nueva notificación (demo)</Text>
      </Pressable>
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
    paddingTop: 16,
    paddingBottom: 40,
  },
  lead: {
    fontFamily: EditorialFonts.headlineItalic,
    fontSize: 26,
    color: EditorialColors.onSurface,
    marginBottom: 8,
  },
  sub: {
    fontFamily: EditorialFonts.body,
    fontSize: 14,
    lineHeight: 20,
    color: EditorialColors.onSurfaceVariant,
    marginBottom: 20,
  },
  list: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: EditorialColors.surfaceContainerLow,
    borderRadius: 16,
    padding: 14,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: EditorialColors.surfaceContainerHighest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarTxt: {
    fontFamily: EditorialFonts.headline,
    fontSize: 18,
    color: EditorialColors.primary,
  },
  rowBody: {
    flex: 1,
    minWidth: 0,
  },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    fontFamily: EditorialFonts.bodyMedium,
    fontSize: 16,
    color: EditorialColors.onSurface,
  },
  time: {
    fontFamily: EditorialFonts.body,
    fontSize: 12,
    color: EditorialColors.onSurfaceVariant,
  },
  preview: {
    fontFamily: EditorialFonts.body,
    fontSize: 14,
    color: EditorialColors.onSurfaceVariant,
  },
  enterHint: {
    fontFamily: EditorialFonts.label,
    fontSize: 12,
    color: EditorialColors.primary,
    marginTop: 8,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: EditorialColors.primary,
  },
  demo: {
    marginTop: 28,
    alignSelf: 'center',
    paddingVertical: 10,
  },
  demoTxt: {
    fontFamily: EditorialFonts.label,
    fontSize: 13,
    color: EditorialColors.secondary,
    textDecorationLine: 'underline',
  },
});
