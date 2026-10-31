import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LanguageToggle from './Languagetoggle';
import { colors } from './theme';

/**
 * One header for the whole app, so the language switch is always in the same
 * place. It is intentionally NOT mirrored in Urdu: the switch the user just
 * tapped must not jump to the other side of the screen.
 */
export default function AppHeader() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingTop: insets.top + 8 }]}>
      <View style={styles.row}>
        <View style={styles.brand}>
          <View style={styles.mark}>
            <Text style={styles.markText}>✓</Text>
          </View>
          <Text style={styles.brandText}>ClickWise</Text>
        </View>
        <LanguageToggle />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: colors.paper,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  mark: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.teal,
  },
  markText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
  },
  brandText: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: '800',
  },
});