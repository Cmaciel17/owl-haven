import { StyleSheet, Text } from 'react-native';

import { APP_NAME } from '@/constants/branding';
import { EditorialColors, EditorialFonts } from '@/constants/theme';

export function OwlHavenTitle() {
  return <Text style={styles.title}>{APP_NAME}</Text>;
}

const styles = StyleSheet.create({
  title: {
    fontFamily: EditorialFonts.headlineItalic,
    fontSize: 22,
    letterSpacing: -0.3,
    color: EditorialColors.onSurface,
  },
});
