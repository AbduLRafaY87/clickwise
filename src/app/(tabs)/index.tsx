import { useRouter } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import AppText from '../../components/Apptext';
import ScrollScreen from '../../components/Scrollscreen';
import { colors, radius } from '../../components/theme';
import { useLanguage } from '../../context/LanguageContext';

export default function DashboardScreen() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const isUrdu = language === 'ur';

  const modules = [
    {
      id: 'banking',
      icon: '🏦',
      color: colors.sky,
      soft: colors.skySoft,
      title: t('Banking Practice', 'بینکنگ پریکٹس'),
      desc: t('Understand sessions & OTPs safely', 'سیشن ٹائم آؤٹ اور او ٹی پی سمجھیں'),
    },
    {
      id: 'video',
      icon: '📹',
      color: colors.teal,
      soft: colors.tealSoft,
      title: t('Video Call Check', 'ویڈیو کال چیک'),
      desc: t('Test mic & camera settings', 'مائیک اور کیمرہ پرمیشن چیک کریں'),
    },
    {
      id: 'gov',
      icon: '📝',
      color: colors.marigoldDark,
      soft: colors.marigoldSoft,
      title: t('Gov Form Guide', 'سرکاری فارم گائیڈ'),
      desc: t('Step-by-step form helper', 'آسان زبان میں فارم بھرنا سیکھیں'),
    },
    {
      id: 'scam',
      icon: '🛡️',
      color: colors.coral,
      soft: colors.coralSoft,
      title: t('Scam Inspector', 'اسکیم انسپیکٹر'),
      desc: t('Scan suspicious messages & links', 'مشکوک میسجز اور لنکس چیک کریں'),
    },
  ];

  const openModule = (id: string) => {
    if (id === 'scam') {
      router.navigate('/(tabs)/scam');
      return;
    }
    // Other lessons are not built yet.
    Alert.alert(
      t('Coming soon', 'جلد آ رہا ہے'),
      t('This lesson is being prepared.', 'یہ سبق تیار کیا جا رہا ہے۔')
    );
  };

  return (
    <ScrollScreen style={styles.container} contentContainerStyle={styles.scroll}>
      <View style={styles.hero}>
        <AppText accessibilityRole="header" style={styles.heroTitle}>
          {t('What would you like to learn today?', 'آج آپ کیا سیکھنا چاہیں گے؟')}
        </AppText>
        <AppText style={styles.heroSub}>
          {t('Tap any lesson to start. Go slowly, there is no timer.', 'کوئی بھی سبق چنیں۔ آرام سے چلیں، کوئی جلدی نہیں۔')}
        </AppText>
        <View style={styles.safePill}>
          <Text style={styles.safeIcon}>🔒</Text>
          <AppText style={styles.safeText}>
            {t('Practice mode: nothing here is real', 'پریکٹس موڈ: یہاں کچھ بھی اصلی نہیں')}
          </AppText>
        </View>
      </View>

      <View style={styles.grid}>
        {modules.map((item) => (
          <Pressable
            key={item.id}
            accessibilityRole="button"
            accessibilityLabel={`${item.title}. ${item.desc}`}
            onPress={() => openModule(item.id)}
            style={({ pressed }) => [
              styles.card,
              isUrdu && styles.cardRtl,
              { borderColor: item.soft },
              pressed && styles.pressed,
            ]}
          >
            <View style={[styles.iconCircle, { backgroundColor: item.soft }]}>
              <Text style={styles.cardIcon}>{item.icon}</Text>
            </View>
            <View style={styles.cardBody}>
              <AppText style={[styles.cardTitle, { color: item.color }]}>{item.title}</AppText>
              <AppText style={styles.cardDesc}>{item.desc}</AppText>
            </View>
            <Text style={[styles.chevron, { color: item.color }]}>{isUrdu ? '‹' : '›'}</Text>
          </Pressable>
        ))}
      </View>
    </ScrollScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper },
  scroll: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 32 },
  hero: {
    padding: 24,
    borderRadius: 28,
    backgroundColor: colors.teal,
    marginBottom: 20,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 36,
  },
  heroSub: {
    color: '#D6EFEC',
    fontSize: 18,
    lineHeight: 26,
    marginTop: 8,
  },
  safePill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    marginTop: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.marigoldSoft,
  },
  safeIcon: { fontSize: 18 },
  safeText: { color: colors.marigoldDark, fontSize: 16, fontWeight: '700' },
  grid: { gap: 14 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 18,
    minHeight: 104,
    borderRadius: radius.card,
    borderWidth: 2,
    backgroundColor: colors.card,
  },
  cardRtl: { flexDirection: 'row-reverse' },
  pressed: { opacity: 0.85, transform: [{ scale: 0.99 }] },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardIcon: { fontSize: 34 },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: 22, fontWeight: '800', marginBottom: 4 },
  cardDesc: { fontSize: 17, color: colors.muted, lineHeight: 24 },
  chevron: { fontSize: 36, fontWeight: '700' },
});