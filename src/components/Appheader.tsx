import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLanguage } from '../context/LanguageContext';
import LanguageToggle from './LanguageToggle';
import { colors, radius } from './theme';

/**
 * One header for the whole app, so the language switch is always in the same
 * place. It is intentionally NOT mirrored in Urdu: the switch the user just
 * tapped must not jump to the other side of the screen.
 *
 * Shows the brand, a compact learning reminder and the language switch.
 */
export default function AppHeader() {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();

  return (
    <View style={[styles.wrap, { paddingTop: insets.top + 8 }]}>
      <View style={styles.row}>
        <View
          style={styles.brand}
          accessible
          accessibilityRole="header"
          accessibilityLabel={`ClickWise. ${t(
            'Learn safely, at your pace',
            'اپنی رفتار سے محفوظ طریقے سے سیکھیں'
          )}`}
        >
          <View style={styles.mark}>
            <View style={styles.markInner}>
              <Text style={styles.markText}>✓</Text>
            </View>
          </View>
          <View style={styles.brandCopy}>
            <Text style={styles.brandText} numberOfLines={1}>
              ClickWise
            </Text>
            {/* Plain Text keeps the brand and switch in a stable position in Urdu. */}
            <View style={styles.tagRow}>
              <View style={styles.dot} />
              <Text style={styles.tagline} numberOfLines={1}>
                {t('Learn safely', 'محفوظ سیکھیں')}
              </Text>
            </View>
          </View>
        </View>
        <LanguageToggle />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowColor: '#12263A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  brand: {
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mark: {
    width: 44,
    height: 44,
    padding: 3,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.tealSoft,
  },
  markInner: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: colors.teal,
  },
  markText: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '900',
  },
  brandCopy: {
    flexShrink: 0,
  },
  brandText: {
    flexShrink: 0, // the name must never wrap or shrink
    color: colors.ink,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0.2,
    lineHeight: 25,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.teal,
  },
  tagline: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 18,
  },
});