import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppHeader from '../../components/Appheader';
import { colors } from '../../components/theme';
import { useLanguage } from '../../context/LanguageContext';

export default function TabsLayout() {
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        // The shared header carries the language switch on every tab.
        header: () => <AppHeader />,
        tabBarActiveTintColor: colors.teal,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontSize: 15, fontWeight: '700' },
        tabBarStyle: {
          height: 68 + insets.bottom,
          paddingTop: 8,
          paddingBottom: 10 + insets.bottom,
          backgroundColor: colors.card,
          borderTopColor: colors.line,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('Practice Hub', 'پریکٹس ہب'),
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 26, opacity: focused ? 1 : 0.55 }}>🏠</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="scam"
        options={{
          title: t('Scam Shield', 'اسکیم شیلڈ'),
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 26, opacity: focused ? 1 : 0.55 }}>🛡️</Text>
          ),
        }}
      />
    </Tabs>
  );
}