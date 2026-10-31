import type { ComponentProps } from 'react';
import { useEffect, useRef } from 'react';
import { Animated, Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Tabs } from 'expo-router';
import AppText from './Apptext';
import { colors, radius, TOUCH } from './theme';

// Derive the tab bar prop types from expo-router so we do not depend on
// @react-navigation/bottom-tabs being importable directly.
type TabBarRenderer = NonNullable<ComponentProps<typeof Tabs>['tabBar']>;
type TabBarProps = Parameters<TabBarRenderer>[0];

/**
 * Bottom navigation for ClickWise.
 *
 * - Active tab gets a filled teal pill behind the icon plus a bold teal label,
 *   so the current location is obvious without relying on colour alone.
 * - Every item is at least TOUCH (56) tall and shares the full width equally.
 * - Not mirrored in Urdu: tabs stay in the same place when the language
 *   changes, matching the header's language switch.
 * - Urdu labels use AppText so they get the taller line height they need.
 */
export default function BottomTabBar({
  state,
  descriptors,
  emitter,
  navigateToTab,
}: TabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      accessibilityRole="tablist"
      style={[styles.bar, { bottom: Math.max(insets.bottom, 8) + 12 }]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const focused = state.index === index;
        const label =
          typeof options.tabBarLabel === 'string'
            ? options.tabBarLabel
            : (options.title ?? route.name);

        const onPress = () => {
          const event = emitter.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            navigateToTab(route.key);
          }
        };

        const onLongPress = () => {
          emitter.emit({ type: 'tabLongPress', target: route.key });
        };

        return (
          <TabItem
            key={route.key}
            label={label}
            focused={focused}
            accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
            icon={options.tabBarIcon?.({
              focused,
              color: focused ? colors.teal : colors.muted,
              size: 26,
            })}
            onPress={onPress}
            onLongPress={onLongPress}
          />
        );
      })}
    </View>
  );
}

type TabItemProps = {
  label: string;
  focused: boolean;
  accessibilityLabel: string;
  icon: React.ReactNode;
  onPress: () => void;
  onLongPress: () => void;
};

function TabItem({
  label,
  focused,
  accessibilityLabel,
  icon,
  onPress,
  onLongPress,
}: TabItemProps) {
  // 0 = inactive, 1 = active. Drives the pill fade and a small icon pop.
  const progress = useRef(new Animated.Value(focused ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(progress, {
      toValue: focused ? 1 : 0,
      useNativeDriver: true,
      friction: 7,
      tension: 140,
    }).start();
  }, [focused, progress]);

  const pillScaleX = progress.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] });
  const iconScale = progress.interpolate({ inputRange: [0, 1], outputRange: [1, 1.12] });

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected: focused }}
      onPress={onPress}
      onLongPress={onLongPress}
      android_ripple={{ color: colors.tealSoft, borderless: false, radius: 48 }}
      style={({ pressed }) => [styles.item, pressed && Platform.OS === 'ios' && styles.pressed]}
    >
      <View style={styles.iconWrap}>
        <Animated.View
          pointerEvents="none"
          style={[styles.pill, { opacity: progress, transform: [{ scaleX: pillScaleX }] }]}
        />
        <Animated.View style={{ transform: [{ scale: iconScale }] }}>{icon}</Animated.View>
      </View>
      <AppText
        numberOfLines={1}
        style={[styles.label, focused ? styles.labelActive : styles.labelInactive]}
      >
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 26,
    elevation: 12,
    shadowColor: '#12263A',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.14,
    shadowRadius: 12,
  },
  item: {
    flex: 1,
    minHeight: TOUCH,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    borderRadius: radius.chip,
  },
  pressed: { opacity: 0.7 },
  iconWrap: {
    width: 72,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pill: {
    position: 'absolute',
    width: 72,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.tealSoft,
  },
  label: {
    fontSize: 15,
    textAlign: 'center',
  },
  labelActive: { color: colors.teal, fontWeight: '800' },
  labelInactive: { color: colors.muted, fontWeight: '600' },
});
