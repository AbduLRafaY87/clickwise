import { Tabs } from 'expo-router';
import { StyleSheet, Text } from 'react-native';
import AppHeader from '../../components/Appheader';
import BottomTabBar from '../../components/BottomTabBar';
import { useLanguage } from '../../context/LanguageContext';

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <Text accessible={false} style={[styles.icon, !focused && styles.iconInactive]}>
      {emoji}
    </Text>
  );
}

export default function TabsLayout() {
  const { t } = useLanguage();

  return (
    <Tabs
      // Custom bar: filled active pill, big touch targets, safe-area aware.
      tabBar={(props) => <BottomTabBar {...props} />}
      screenOptions={{
        // The shared header carries the language switch on every tab.
        header: () => <AppHeader />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('Practice Hub', 'پریکٹس ہب'),
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="guide"
        options={{
          title: t('Guide Me', 'رہنمائی'),
          tabBarIcon: ({ focused }) => <TabIcon emoji="👆" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="scam"
        options={{
          title: t('Scam Shield', 'اسکیم شیلڈ'),
          tabBarIcon: ({ focused }) => <TabIcon emoji="🛡️" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  icon: { fontSize: 24 },
  iconInactive: { opacity: 0.6 },
});