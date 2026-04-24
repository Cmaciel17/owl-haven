import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { EditorialColors, EditorialFonts } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/context/ProfileContext';
import { LITERARY_GENRES } from '@/data/mockData';

export default function ProfileScreen() {
  const { email, signOut } = useAuth();
  const { profile, updateProfile } = useProfile();
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [birthDate, setBirthDate] = useState(profile.birthDate);
  const [bio, setBio] = useState(profile.bio);
  const [avatarUri, setAvatarUri] = useState(profile.avatarUri);
  const [genres, setGenres] = useState<string[]>(profile.genres);

  useEffect(() => {
    setDisplayName(profile.displayName);
    setBirthDate(profile.birthDate);
    setBio(profile.bio);
    setAvatarUri(profile.avatarUri);
    setGenres(profile.genres);
  }, [profile]);

  function toggleGenre(g: string) {
    setGenres((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g],
    );
  }

  async function save() {
    await updateProfile({
      displayName: displayName.trim(),
      birthDate: birthDate.trim(),
      bio: bio.trim(),
      avatarUri: avatarUri.trim(),
      genres,
    });
    router.back();
  }

  async function handleSignOut() {
    await signOut();
    router.replace('/');
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <Text style={styles.hint}>
        Cuenta (mock): <Text style={styles.hintEm}>{email}</Text>
      </Text>

      <Text style={styles.label}>Nombre para mostrar</Text>
      <TextInput
        value={displayName}
        onChangeText={setDisplayName}
        placeholder="Cómo te ven en los clubes"
        placeholderTextColor={`${EditorialColors.onSurfaceVariant}99`}
        style={styles.input}
      />

      <Text style={styles.label}>Fecha de nacimiento</Text>
      <TextInput
        value={birthDate}
        onChangeText={setBirthDate}
        placeholder="AAAA-MM-DD (opcional)"
        placeholderTextColor={`${EditorialColors.onSurfaceVariant}99`}
        style={styles.input}
      />

      <Text style={styles.label}>URL de foto de perfil (opcional)</Text>
      <TextInput
        value={avatarUri}
        onChangeText={setAvatarUri}
        placeholder="https://…"
        placeholderTextColor={`${EditorialColors.onSurfaceVariant}99`}
        autoCapitalize="none"
        style={styles.input}
      />

      <Text style={styles.label}>Bio</Text>
      <TextInput
        value={bio}
        onChangeText={setBio}
        placeholder="Unas líneas sobre ti"
        placeholderTextColor={`${EditorialColors.onSurfaceVariant}99`}
        style={[styles.input, styles.bio]}
        multiline
      />

      <Text style={styles.label}>Géneros favoritos</Text>
      <View style={styles.chips}>
        {LITERARY_GENRES.map((g) => {
          const on = genres.includes(g);
          return (
            <Pressable
              key={g}
              onPress={() => toggleGenre(g)}
              style={[styles.chip, on && styles.chipOn]}>
              <Text style={[styles.chipTxt, on && styles.chipTxtOn]} numberOfLines={2}>
                {g}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable onPress={save} style={styles.save}>
        <Text style={styles.saveTxt}>Guardar</Text>
      </Pressable>

      <Pressable onPress={handleSignOut} style={styles.signOut}>
        <Text style={styles.signOutTxt}>Cerrar sesión</Text>
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
    paddingBottom: 48,
  },
  hint: {
    fontFamily: EditorialFonts.body,
    fontSize: 14,
    color: EditorialColors.onSurfaceVariant,
    marginBottom: 20,
  },
  hintEm: {
    fontFamily: EditorialFonts.bodyMedium,
    color: EditorialColors.onSurface,
  },
  label: {
    fontFamily: EditorialFonts.label,
    fontSize: 11,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: EditorialColors.secondary,
    marginTop: 14,
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
  bio: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: EditorialColors.surfaceContainerLow,
    maxWidth: '100%',
  },
  chipOn: {
    backgroundColor: EditorialColors.secondaryContainer,
  },
  chipTxt: {
    fontFamily: EditorialFonts.bodyMedium,
    fontSize: 13,
    color: EditorialColors.onSurface,
  },
  chipTxtOn: {
    color: EditorialColors.onSecondaryContainer,
  },
  save: {
    marginTop: 28,
    backgroundColor: EditorialColors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  saveTxt: {
    fontFamily: EditorialFonts.label,
    fontSize: 16,
    color: EditorialColors.onPrimary,
  },
  signOut: {
    marginTop: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  signOutTxt: {
    fontFamily: EditorialFonts.label,
    fontSize: 15,
    color: EditorialColors.primary,
  },
});
