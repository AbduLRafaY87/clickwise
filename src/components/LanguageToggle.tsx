import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { colors, radius } from './theme';

const OPTIONS = [
  { code: 'en', label: 'English', a11y: 'Switch language to English' },
  { code: 'ur', label: 'اردو', a11y: 'زبان اردو میں تبدیل کریں' },
] as const;

/**
 * Shows BOTH languages at all times, with the active one highlighted.
 * Users never have to guess what the button will do, and each option is
 * written in its own language so it is always readable.
 */
export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <View style={styles.track} accessibilityRole="radiogroup">
      {OPTIONS.map((option) => {
        const selected = language === option.code;
        return (
          <Pressable
            key={option.code}
            accessibilityRole="radio"
            accessibilityLabel={option.a11y}
            accessibilityState={{ selected }}
            hitSlop={6}
            onPress={() => setLanguage(option.code)}
            style={[styles.option, selected && styles.optionActive]}
          >
            <Text style={[styles.label, selected && styles.labelActive]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.line,
  },
  option: {
    minWidth: 64,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderRadius: radius.pill,
  },
  optionActive: {
    backgroundColor: colors.teal,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.ink,
  },
  labelActive: {
    color: '#FFFFFF',
  },
});