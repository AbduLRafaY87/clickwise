import { useRouter } from 'expo-router';
import { useEffect, useMemo, useRef } from 'react';
import { Alert, Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import AppText from '../../components/Apptext';
import ScrollScreen from '../../components/Scrollscreen';
import { colors, radius, TOUCH } from '../../components/theme';
import { useLanguage } from '../../context/LanguageContext';

type Module = {
  id: 'banking' | 'video' | 'gov' | 'scam' | 'guide';
  icon: string;
  color: string;
  soft: string;
  title: string;
  desc: string;
  ready: boolean;
};

export default function DashboardScreen() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const isUrdu = language === 'ur';

  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? { icon: '🌤️', en: 'Good morning', ur: 'صبح بخیر' }
      : hour < 17
        ? { icon: '☀️', en: 'Good afternoon', ur: 'دوپہر بخیر' }
        : { icon: '🌙', en: 'Good evening', ur: 'شام بخیر' };

  const modules: Module[] = [
    {
      id: 'scam',
      icon: '🛡️',
      color: colors.coral,
      soft: colors.coralSoft,
      title: t('Scam Inspector', 'اسکیم انسپیکٹر'),
      desc: t('Scan suspicious messages & links', 'مشکوک میسجز اور لنکس چیک کریں'),
      ready: true,
    },
    {
      id: 'guide',
      icon: '👆',
      color: colors.marigoldDark,
      soft: colors.marigoldSoft,
      title: t('Show Me Where to Tap', 'مجھے بتائیں کہاں ٹیپ کرنا ہے'),
      desc: t('Add a screenshot and we mark the buttons', 'اسکرین شاٹ دیں، ہم بٹن پر نشان لگائیں گے'),
      ready: true,
    },
    {
      id: 'banking',
      icon: '🏦',
      color: colors.sky,
      soft: colors.skySoft,
      title: t('Banking Practice', 'بینکنگ پریکٹس'),
      desc: t('Understand sessions & OTPs safely', 'سیشن ٹائم آؤٹ اور او ٹی پی سمجھیں'),
      ready: false,
    },
    {
      id: 'video',
      icon: '📹',
      color: colors.teal,
      soft: colors.tealSoft,
      title: t('Video Call Check', 'ویڈیو کال چیک'),
      desc: t('Test mic & camera settings', 'مائیک اور کیمرہ پرمیشن چیک کریں'),
      ready: false,
    },
    {
      id: 'gov',
      icon: '📝',
      color: colors.marigoldDark,
      soft: colors.marigoldSoft,
      title: t('Gov Form Guide', 'سرکاری فارم گائیڈ'),
      desc: t('Step-by-step form helper', 'آسان زبان میں فارم بھرنا سیکھیں'),
      ready: false,
    },
  ];

  // One safety tip per day, rotating through the list.
  const tips = [
    {
      en: 'A real bank will never ask for your OTP or password, not by call, SMS or WhatsApp.',
      ur: 'اصلی بینک کبھی آپ سے او ٹی پی یا پاس ورڈ نہیں مانگتا، نہ کال پر، نہ ایس ایم ایس پر، نہ واٹس ایپ پر۔',
    },
    {
      en: 'If a message says "act now", stop. Scammers use hurry to stop you from thinking.',
      ur: 'اگر کوئی پیغام کہے "فوراً کریں" تو رک جائیں۔ جعلساز جلدی مچا کر آپ کو سوچنے نہیں دیتے۔',
    },
    {
      en: 'Do not tap links in messages from unknown numbers. Type the website yourself instead.',
      ur: 'انجان نمبر سے آئے لنک پر ٹیپ نہ کریں۔ ویب سائٹ خود ٹائپ کر کے کھولیں۔',
    },
    {
      en: 'Won a prize you never entered? It is almost always a scam.',
      ur: 'ایسا انعام جس کے لیے آپ نے کچھ نہیں کیا؟ یہ تقریباً ہمیشہ دھوکا ہوتا ہے۔',
    },
    {
      en: 'Not sure about a message? Ask a family member, or check it here first.',
      ur: 'پیغام پر شک ہے؟ گھر کے کسی فرد سے پوچھیں، یا پہلے یہاں چیک کریں۔',
    },
  ];
  const dayIndex = Math.floor(Date.now() / 86_400_000);
  const tip = tips[dayIndex % tips.length];

  // Gentle staggered entrance so the screen does not just "pop" in.
  const anims = useRef(Array.from({ length: modules.length + 3 }, () => new Animated.Value(0))).current;
  useEffect(() => {
    Animated.stagger(
      70,
      anims.map((v) =>
        Animated.timing(v, { toValue: 1, duration: 320, useNativeDriver: true })
      )
    ).start();
  }, [anims]);

  const reveal = (i: number) => ({
    opacity: anims[i],
    transform: [
      { translateY: anims[i].interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) },
    ],
  });

  const openModule = (m: Module) => {
    if (m.id === 'scam') {
      router.navigate('/(tabs)/scam');
      return;
    }
    if (m.id === 'guide') {
      router.navigate('/(tabs)/guide');
      return;
    }
    // Other lessons are not built yet.
    Alert.alert(
      t('Coming soon', 'جلد آ رہا ہے'),
      t('This lesson is being prepared.', 'یہ سبق تیار کیا جا رہا ہے۔')
    );
  };

  const readyCount = useMemo(() => modules.filter((m) => m.ready).length, [modules]);

  return (
    <ScrollScreen style={styles.container} contentContainerStyle={styles.scroll}>
      {/* Hero */}
      <Animated.View style={[styles.hero, reveal(0)]}>
        <View style={styles.blobA} pointerEvents="none" />
        <View style={styles.blobB} pointerEvents="none" />

        <View style={[styles.greetRow, isUrdu && styles.rowRtl]}>
          <Text accessible={false} style={styles.greetIcon}>{greeting.icon}</Text>
          <AppText style={styles.greetText}>{t(greeting.en, greeting.ur)}</AppText>
        </View>

        <AppText accessibilityRole="header" style={styles.heroTitle}>
          {t('What would you like to learn today?', 'آج آپ کیا سیکھنا چاہیں گے؟')}
        </AppText>
        <AppText style={styles.heroSub}>
          {t(
            'Tap any lesson to start. Go slowly, there is no timer.',
            'کوئی بھی سبق چنیں۔ آرام سے چلیں، کوئی جلدی نہیں۔'
          )}
        </AppText>

        <View style={[styles.safePill, isUrdu && styles.safePillRtl]}>
          <Text accessible={false} style={styles.safeIcon}>🔒</Text>
          <AppText style={styles.safeText}>
            {t('Practice mode: nothing here is real', 'پریکٹس موڈ: یہاں کچھ بھی اصلی نہیں')}
          </AppText>
        </View>
      </Animated.View>

      {/* Quick action */}
      <Animated.View style={reveal(1)}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t(
            'Got a suspicious message? Check it now',
            'مشکوک پیغام ملا؟ ابھی چیک کریں'
          )}
          onPress={() => router.navigate('/(tabs)/scam')}
          style={({ pressed }) => [
            styles.quick,
            isUrdu && styles.rowRtl,
            pressed && styles.pressed,
          ]}
        >
          <View style={styles.quickIcon}>
            <Text accessible={false} style={styles.quickEmoji}>🚨</Text>
          </View>
          <View style={styles.quickBody}>
            <AppText style={styles.quickTitle}>
              {t('Got a suspicious message?', 'مشکوک پیغام ملا؟')}
            </AppText>
            <AppText style={styles.quickDesc}>
              {t('Check it in 10 seconds', 'دس سیکنڈ میں چیک کریں')}
            </AppText>
          </View>
          <Text accessible={false} style={styles.quickChevron}>{isUrdu ? '‹' : '›'}</Text>
        </Pressable>
      </Animated.View>

      {/* Lessons */}
      <Animated.View style={[styles.sectionHead, isUrdu && styles.rowRtl, reveal(2)]}>
        <AppText accessibilityRole="header" style={styles.sectionTitle}>
          {t('Your lessons', 'آپ کے اسباق')}
        </AppText>
        <View style={styles.countPill}>
          <AppText style={styles.countText}>
            {t(`${readyCount} of ${modules.length} ready`, `${modules.length} میں سے ${readyCount} تیار`)}
          </AppText>
        </View>
      </Animated.View>

      <View style={styles.grid}>
        {modules.map((item, i) => (
          <Animated.View key={item.id} style={reveal(i + 3)}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`${item.title}. ${item.desc}. ${
                item.ready ? t('Ready', 'تیار') : t('Coming soon', 'جلد آ رہا ہے')
              }`}
              onPress={() => openModule(item)}
              android_ripple={{ color: item.soft }}
              style={({ pressed }) => [
                styles.card,
                isUrdu && styles.cardRtl,
                { borderColor: item.soft },
                !item.ready && styles.cardSoon,
                pressed && styles.pressed,
              ]}
            >
              <View
                style={[styles.accent, isUrdu && styles.accentRtl, { backgroundColor: item.color }]}
              />
              <View style={[styles.iconCircle, { backgroundColor: item.soft }]}>
                <Text accessible={false} style={styles.cardIcon}>{item.icon}</Text>
              </View>
              <View style={styles.cardBody}>
                <AppText style={[styles.cardTitle, { color: item.color }]}>{item.title}</AppText>
                <AppText style={styles.cardDesc}>{item.desc}</AppText>
                <View
                  style={[
                    styles.badge,
                    isUrdu && styles.badgeRtl,
                    { backgroundColor: item.ready ? colors.tealSoft : colors.line },
                  ]}
                >
                  <AppText
                    style={[
                      styles.badgeText,
                      { color: item.ready ? colors.tealDark : colors.muted },
                    ]}
                  >
                    {item.ready
                      ? t('✓ Ready to practise', '✓ پریکٹس کے لیے تیار')
                      : t('Coming soon', 'جلد آ رہا ہے')}
                  </AppText>
                </View>
              </View>
              <Text accessible={false} style={[styles.chevron, { color: item.color }]}>
                {isUrdu ? '‹' : '›'}
              </Text>
            </Pressable>
          </Animated.View>
        ))}
      </View>

      {/* Daily tip */}
      <View style={styles.tip}>
        <View style={[styles.tipHead, isUrdu && styles.rowRtl]}>
          <Text accessible={false} style={styles.tipIcon}>💡</Text>
          <AppText style={styles.tipLabel}>{t('Safety tip of the day', 'آج کی حفاظتی ہدایت')}</AppText>
        </View>
        <AppText style={styles.tipText}>{t(tip.en, tip.ur)}</AppText>
      </View>
    </ScrollScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper },
  scroll: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },
  rowRtl: { flexDirection: 'row-reverse' },
  pressed: { opacity: 0.85, transform: [{ scale: 0.99 }] },

  // Hero
  hero: {
    padding: 24,
    borderRadius: 28,
    backgroundColor: colors.teal,
    marginBottom: 16,
    overflow: 'hidden',
  },
  blobA: {
    position: 'absolute',
    top: -50,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.tealDark,
    opacity: 0.55,
  },
  blobB: {
    position: 'absolute',
    bottom: -60,
    left: -30,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: colors.tealDark,
    opacity: 0.35,
  },
  greetRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  greetIcon: { fontSize: 22 },
  greetText: { color: '#D6EFEC', fontSize: 18, fontWeight: '700' },
  heroTitle: { color: '#FFFFFF', fontSize: 28, fontWeight: '800', lineHeight: 36 },
  heroSub: { color: '#D6EFEC', fontSize: 18, lineHeight: 26, marginTop: 8 },
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
  safePillRtl: { flexDirection: 'row-reverse', alignSelf: 'flex-end' },
  safeIcon: { fontSize: 18 },
  safeText: { color: colors.marigoldDark, fontSize: 16, fontWeight: '700', flexShrink: 1 },

  // Quick action
  quick: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    minHeight: TOUCH + 16,
    padding: 14,
    marginBottom: 24,
    borderRadius: radius.card,
    backgroundColor: colors.coral,
  },
  quickIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.coralSoft,
  },
  quickEmoji: { fontSize: 26 },
  quickBody: { flex: 1 },
  quickTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '800' },
  quickDesc: { color: '#FBE3DF', fontSize: 16, marginTop: 2 },
  quickChevron: { color: '#FFFFFF', fontSize: 34, fontWeight: '700' },

  // Section header
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: { color: colors.ink, fontSize: 24, fontWeight: '800' },
  countPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.skySoft,
  },
  countText: { color: colors.sky, fontSize: 15, fontWeight: '700' },

  // Lesson cards
  grid: { gap: 14 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 18,
    paddingLeft: 22,
    minHeight: 112,
    borderRadius: radius.card,
    borderWidth: 2,
    backgroundColor: colors.card,
    overflow: 'hidden',
  },
  cardSoon: { backgroundColor: '#FAFCFD' },
  cardRtl: { flexDirection: 'row-reverse', paddingLeft: 18, paddingRight: 22 },
  accent: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 6 },
  accentRtl: { left: undefined, right: 0 },
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
  badge: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  badgeRtl: { alignSelf: 'flex-end' },
  badgeText: { fontSize: 14, fontWeight: '700' },
  chevron: { fontSize: 36, fontWeight: '700' },

  // Tip
  tip: {
    marginTop: 24,
    padding: 20,
    borderRadius: radius.card,
    backgroundColor: colors.marigoldSoft,
    borderWidth: 2,
    borderColor: colors.marigold,
  },
  tipHead: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  tipIcon: { fontSize: 22 },
  tipLabel: { color: colors.marigoldDark, fontSize: 17, fontWeight: '800' },
  tipText: { color: colors.ink, fontSize: 18, lineHeight: 27 },
});