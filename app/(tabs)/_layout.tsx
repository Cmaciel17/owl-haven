import FontAwesome from '@expo/vector-icons/FontAwesome';
import { type Href, router, Tabs } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';

import { FloatingMessagesFAB } from '@/components/FloatingMessagesFAB';
import { OwlHavenTitle } from '@/components/OwlHavenTitle';
import { ProfileHeaderButton } from '@/components/ProfileHeaderButton';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { EditorialColors } from '@/constants/theme';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={22} style={{ marginBottom: -2 }} {...props} />;
}

const headerLiterary = {
  headerTitle: () => <OwlHavenTitle />,
  headerTitleAlign: 'center' as const,
  headerStyle: {
    backgroundColor: EditorialColors.background,
  },
  headerTintColor: EditorialColors.primary,
};

export default function TabLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          ...headerLiterary,
          tabBarActiveTintColor: EditorialColors.primary,
          tabBarInactiveTintColor: EditorialColors.onSurfaceVariant,
          tabBarStyle: {
            backgroundColor: EditorialColors.background,
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
            height: Platform.OS === 'ios' ? 88 : 64,
            paddingBottom: Platform.OS === 'ios' ? 28 : 10,
            paddingTop: 8,
          },
          headerShown: useClientOnlyValue(false, true),
          headerRight: () => <ProfileHeaderButton />,
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          }}
        />
        <Tabs.Screen
          name="clubs"
          options={{
            title: 'Clubs',
            headerShown: false,
            tabBarIcon: ({ color }) => <TabBarIcon name="users" color={color} />,
          }}
        />
        <Tabs.Screen
          name="events"
          options={{
            title: 'Eventos',
            headerShown: false,
            tabBarIcon: ({ color }) => <TabBarIcon name="calendar" color={color} />,
          }}
          listeners={{
            tabPress: () => {
              /* Vuelve siempre al calendario + lista; si no, el stack se queda en el detalle. */
              router.replace('/(tabs)/events' as Href);
            },
          }}
        />
        <Tabs.Screen
          name="library"
          options={{
            title: 'Biblioteca',
            tabBarIcon: ({ color }) => <TabBarIcon name="book" color={color} />,
          }}
        />
      </Tabs>
      <FloatingMessagesFAB />
    </View>
  );
}
