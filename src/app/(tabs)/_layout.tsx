import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarStyle: { height: 65, paddingBottom: 10 } }}>
      <Tabs.Screen name="index" options={{ title: 'Practice Hub' }} />
      <Tabs.Screen name="scam" options={{ title: 'Scam Shield' }} />
    </Tabs>
  );
}
