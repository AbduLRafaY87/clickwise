import { StyleSheet, Text, TextProps, TextStyle } from 'react-native';
import { useLanguage } from '../context/LanguageContext';

/**
 * Drop-in replacement for <Text>.
 * In Urdu it switches to right-to-left, enlarges the font slightly and adds
 * extra line height (Urdu script is taller and gets clipped otherwise).
 */
export default function AppText({ style, ...rest }: TextProps) {
  const { language } = useLanguage();

  if (language !== 'ur') {
    return <Text {...rest} style={style} />;
  }

  const flat = StyleSheet.flatten(style) ?? {};
  const baseSize = flat.fontSize ?? 16;
  const fontSize = Math.round(baseSize * 1.08);

  const urdu: TextStyle = {
    writingDirection: 'rtl',
    fontSize,
    lineHeight: Math.max(flat.lineHeight ?? 0, Math.round(fontSize * 1.7)),
    textAlign:
      flat.textAlign === undefined || flat.textAlign === 'left'
        ? 'right'
        : flat.textAlign,
  };

  return <Text {...rest} style={[style, urdu]} />;
}