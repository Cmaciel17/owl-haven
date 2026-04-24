import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { EditorialColors } from '@/constants/theme';
import { useProfile } from '@/context/ProfileContext';

export function ProfileHeaderButton() {
  const { profile } = useProfile();
  const uri = profile.avatarUri?.trim();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Abrir perfil"
      onPress={() => router.push('/profile')}
      style={({ pressed }) => [styles.wrap, pressed && { opacity: 0.85 }]}>
      <View style={styles.circle}>
        {uri ? (
          <Image source={{ uri }} style={styles.image} contentFit="cover" />
        ) : (
          <FontAwesome name="user-circle" size={28} color={EditorialColors.primary} />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginRight: 16,
  },
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: EditorialColors.surfaceContainerHighest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
