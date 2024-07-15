/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0A7EA4';
const tintColorDark = '#FFF';

export const Colors = {
  light: {
    text: '#000',
    background: '#F2F2F7',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    listItem: '#FFF',
    listValue: '#8A8A8E',
    listGapLine: '#EFEFEF',
  },
  dark: {
    text: '#FFF',
    background: '#000',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    listItem: '#1C1C1E',
    listValue: '#98989E',
    listGapLine: '#2E2E30',
  },
};
