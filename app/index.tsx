import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { APP_NAME } from '@/constants/branding';
import { EditorialColors, EditorialFonts } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { email: sessionEmail, isReady, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isReady && sessionEmail) {
      router.replace('/(tabs)');
    }
  }, [isReady, sessionEmail]);

  async function handleSubmit() {
    setError(null);
    setSubmitting(true);
    try {
      await signIn(email, password);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo iniciar sesión.');
    } finally {
      setSubmitting(false);
    }
  }

  if (!isReady || sessionEmail) {
    return (
      <View style={[styles.loading, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={EditorialColors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.root, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}>
        <StatusBar style="dark" />
        <View style={styles.content}>
          <Text style={styles.kicker}>Club de lectura</Text>
          <Text style={styles.title}>{APP_NAME}</Text>
          <Text style={styles.subtitle}>
            Acceso de prueba: no hay servidor; guardamos solo un correo en el dispositivo.
          </Text>
          <View style={styles.form}>
            <Text style={styles.label}>Correo</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="tu@email.com"
              placeholderTextColor={`${EditorialColors.onSurfaceVariant}99`}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="emailAddress"
              style={styles.input}
            />
            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Cualquier texto (demo)"
              placeholderTextColor={`${EditorialColors.onSurfaceVariant}99`}
              secureTextEntry
              textContentType="password"
              style={styles.input}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
          </View>
        </View>
        <Pressable
          accessibilityRole="button"
          disabled={submitting}
          onPress={handleSubmit}
          style={({ pressed }) => [
            styles.ctaWrap,
            (pressed || submitting) && { opacity: submitting ? 0.7 : 0.92 },
          ]}>
          <LinearGradient
            colors={[EditorialColors.primary, EditorialColors.primaryContainer]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cta}>
            {submitting ? (
              <ActivityIndicator color={EditorialColors.onPrimary} />
            ) : (
              <Text style={styles.ctaLabel}>Iniciar sesión</Text>
            )}
          </LinearGradient>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: EditorialColors.background,
  },
  root: {
    flex: 1,
    backgroundColor: EditorialColors.background,
    paddingHorizontal: 28,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: 16,
  },
  kicker: {
    fontFamily: EditorialFonts.label,
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: EditorialColors.secondary,
  },
  title: {
    fontFamily: EditorialFonts.headlineItalic,
    fontSize: 36,
    lineHeight: 40,
    color: EditorialColors.onSurface,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontFamily: EditorialFonts.body,
    fontSize: 15,
    lineHeight: 22,
    color: EditorialColors.onSurfaceVariant,
    maxWidth: 340,
    marginBottom: 8,
  },
  form: {
    marginTop: 8,
    gap: 8,
  },
  label: {
    fontFamily: EditorialFonts.label,
    fontSize: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: EditorialColors.secondary,
    marginTop: 8,
  },
  input: {
    fontFamily: EditorialFonts.body,
    fontSize: 16,
    color: EditorialColors.onSurface,
    backgroundColor: EditorialColors.surfaceContainerHighest,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  error: {
    fontFamily: EditorialFonts.body,
    fontSize: 14,
    color: '#ba1a1a',
    marginTop: 8,
  },
  ctaWrap: {
    borderRadius: 16,
    overflow: 'hidden',
    alignSelf: 'stretch',
  },
  cta: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    minHeight: 52,
  },
  ctaLabel: {
    fontFamily: EditorialFonts.label,
    fontSize: 16,
    color: EditorialColors.onPrimary,
  },
});
