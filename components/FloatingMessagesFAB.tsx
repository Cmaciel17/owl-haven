import FontAwesome from '@expo/vector-icons/FontAwesome';
import { type Href, router } from 'expo-router';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EditorialColors, EditorialFonts } from '@/constants/theme';
import { useInbox } from '@/context/InboxContext';

const TAB_BAR_OFFSET = Platform.OS === 'ios' ? 78 : 58;

export function FloatingMessagesFAB() {
  const insets = useSafeAreaInsets();
  const { hasUnread } = useInbox();

  function goMessages() {
    router.push('/messages' as Href);
  }

  return (
    <View
      style={[styles.wrap, { bottom: TAB_BAR_OFFSET + insets.bottom }]}
      pointerEvents="box-none">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Entrar a chats privados"
        onPress={goMessages}
        style={({ pressed }) => [styles.fab, pressed && { opacity: 0.92 }]}>
        <View style={styles.inner}>
          <FontAwesome name="comments" size={20} color={EditorialColors.onPrimary} />
          <Text style={styles.label}>Entrar a chats</Text>
          {hasUnread ? <View style={styles.dot} /> : null}
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    right: 0,
    left: 0,
    zIndex: 999,
    elevation: 12,
    alignItems: 'flex-end',
    pointerEvents: 'box-none',
  },
  fab: {
    marginRight: 16,
    borderRadius: 28,
    overflow: 'visible',
    shadowColor: EditorialColors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
  },
  inner: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 18,
    minHeight: 52,
    borderRadius: 28,
    backgroundColor: EditorialColors.primary,
  },
  label: {
    fontFamily: EditorialFonts.label,
    fontSize: 15,
    color: EditorialColors.onPrimary,
  },
  dot: {
    position: 'absolute',
    top: 6,
    right: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ba1a1a',
    borderWidth: 2,
    borderColor: EditorialColors.background,
  },
});
