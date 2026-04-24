import { Stack } from 'expo-router';

import { HeaderBackVolver } from '@/components/HeaderBackVolver';
import { OwlHavenTitle } from '@/components/OwlHavenTitle';
import { ProfileHeaderButton } from '@/components/ProfileHeaderButton';
import { EditorialColors } from '@/constants/theme';

/** El calendario y la lista completa viven en `index`, no en el detalle. */
export const unstable_settings = {
  initialRouteName: 'index',
};

export default function EventsStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitle: () => <OwlHavenTitle />,
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: EditorialColors.background },
        headerShadowVisible: false,
        headerTintColor: EditorialColors.primary,
        headerRight: () => <ProfileHeaderButton />,
        headerBackTitle: 'Volver',
        headerLeft: (props) =>
          props.canGoBack ? <HeaderBackVolver canGoBack /> : undefined,
      }}
    />
  );
}
