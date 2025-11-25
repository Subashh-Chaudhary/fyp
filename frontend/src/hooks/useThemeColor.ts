/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { darkColors, colors as lightColors } from '../../constants/Colors';
import { useColorScheme } from './useColorScheme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof lightColors
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) return colorFromProps;

  if (theme === 'dark') {
    // darkColors may override some keys — fall back to lightColors if missing
    return (darkColors as any)[colorName] ?? (lightColors as any)[colorName];
  }

  return (lightColors as any)[colorName];
}
