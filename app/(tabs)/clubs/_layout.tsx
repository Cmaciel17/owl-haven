import { Stack } from 'expo-router';

import { HeaderBackVolver } from '@/components/HeaderBackVolver';
import { OwlHavenTitle } from '@/components/OwlHavenTitle';
import { ProfileHeaderButton } from '@/components/ProfileHeaderButton';
import { EditorialColors } from '@/constants/theme';

export default function ClubsStackLayout() {
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
