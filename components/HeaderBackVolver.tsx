import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import { Pressable, Text } from 'react-native';

import { EditorialColors, EditorialFonts } from '@/constants/theme';

type Props = {
  canGoBack?: boolean;
};

export function HeaderBackVolver({ canGoBack = true }: Props) {
  if (!canGoBack) return null;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Volver"
      onPress={() => router.back()}
      hitSlop={12}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 10,
      }}>
      <FontAwesome name="chevron-left" size={18} color={EditorialColors.primary} />
      <Text
        style={{
          marginLeft: 2,
          fontFamily: EditorialFonts.bodyMedium,
          fontSize: 16,
          color: EditorialColors.primary,
        }}>
        Volver
      </Text>
    </Pressable>
  );
}
