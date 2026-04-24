import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
} from '@expo-google-fonts/manrope';
import {
  Newsreader_400Regular,
  Newsreader_600SemiBold,
  Newsreader_600SemiBold_Italic,
  Newsreader_700Bold,
} from '@expo-google-fonts/newsreader';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useMemo } from 'react';
import 'react-native-reanimated';

import { HeaderBackVolver } from '@/components/HeaderBackVolver';
import { OwlHavenTitle } from '@/components/OwlHavenTitle';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ChapterProgressProvider } from '@/context/ChapterProgressContext';
import { ClubGroupChatProvider } from '@/context/ClubGroupChatContext';
import { ForumProvider } from '@/context/ForumContext';
import { InboxProvider } from '@/context/InboxContext';
import { LibraryProvider } from '@/context/LibraryContext';
import { ProfileProvider } from '@/context/ProfileContext';
import { UserCreatedClubsProvider } from '@/context/UserCreatedClubsContext';
import { EditorialColors } from '@/constants/theme';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index',
};

SplashScreen.preventAutoHideAsync();

const navigationLight = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: EditorialColors.primary,
    background: EditorialColors.background,
    card: EditorialColors.background,
    text: EditorialColors.onSurface,
    border: 'transparent',
    notification: EditorialColors.primary,
  },
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Newsreader_400Regular,
    Newsreader_600SemiBold,
    Newsreader_600SemiBold_Italic,
    Newsreader_700Bold,
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <ProfileProvider>
        <LibraryProvider>
          <ForumProvider>
            <InboxProvider>
              <ChapterProgressProvider>
                <ClubGroupChatProvider>
                  <UserCreatedClubsProvider>
                    <RootLayoutNav />
                  </UserCreatedClubsProvider>
                </ClubGroupChatProvider>
              </ChapterProgressProvider>
            </InboxProvider>
          </ForumProvider>
        </LibraryProvider>
      </ProfileProvider>
    </AuthProvider>
  );
}

const modalHeader = {
  headerTitle: () => <OwlHavenTitle />,
  headerTitleAlign: 'center' as const,
  headerStyle: { backgroundColor: EditorialColors.background },
  headerShadowVisible: false,
  headerTintColor: EditorialColors.primary,
  headerBackTitle: 'Volver',
  headerLeft: (props: { canGoBack?: boolean }) =>
    props.canGoBack ? <HeaderBackVolver canGoBack /> : undefined,
};

function RootLayoutNav() {
  const { isReady } = useAuth();
  const theme = useMemo(() => navigationLight, []);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <ThemeProvider value={theme}>
      <Stack screenOptions={{ headerShadowVisible: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false, title: 'Inicio' }} />
        <Stack.Screen name="messages" options={{ ...modalHeader }} />
        <Stack.Screen name="profile" options={{ ...modalHeader }} />
        <Stack.Screen name="chat/[threadId]" options={{ ...modalHeader }} />
      </Stack>
    </ThemeProvider>
  );
}
