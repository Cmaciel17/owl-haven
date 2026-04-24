import { EditorialColors } from './theme';

const tintLight = EditorialColors.primary;
const tintDark = EditorialColors.primaryContainer;

export default {
  light: {
    text: EditorialColors.onSurface,
    background: EditorialColors.background,
    tint: tintLight,
    tabIconDefault: EditorialColors.outlineVariant,
    tabIconSelected: tintLight,
  },
  dark: {
    text: '#f4f0ea',
    background: '#1c1917',
    tint: tintDark,
    tabIconDefault: '#78716c',
    tabIconSelected: tintDark,
  },
};
