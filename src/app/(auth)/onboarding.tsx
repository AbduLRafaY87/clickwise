import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../../components/Appheader';
import AppText from '../../components/Apptext';
import ScrollScreen from '../../components/Scrollscreen';
import { colors, radius, TOUCH } from '../../components/theme';
import { useLanguage } from '../../context/LanguageContext';

const SLIDE_COUNT = 2;

export default function OnboardingScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const isLast = step === SLIDE_COUNT;

  const handlePrimaryAction = () => {
    if (!isLast) {
      setStep(step + 1);
      return;
    }
    router.replace('/(tabs)');
  };

  const chips = [
    { icon: '🏦', label: t('Banking', 'بینکنگ') },
    { icon: '📹', label: t('Video calls', 'ویڈیو کالز') },
    { icon: '📝', label: t('Forms', 'فارمز') },
    { icon: '🛡️', label: t('Scams', 'اسکیم') },
  ];

  return (
    <View style={styles.root}>
      <AppHeader />
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <ScrollScreen contentContainerStyle={styles.screenContent}>
          <View style={styles.content}>
            <View style={styles.card}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: isLast ? colors.tealSoft : colors.marigoldSoft },
                ]}
              >
                <Text accessible={false} style={styles.icon}>
                  {isLast ? '🛡️' : '👋'}
                </Text>
              </View>

              <AppText accessibilityRole="header" style={styles.title}>
                {isLast
                  ? t('100% Safe Environment', 'مکمل محفوظ ماحول')
                  : t('Welcome to ClickWise', 'کلک وائز میں خوش آمدید')}
              </AppText>

              <AppText style={styles.subtitle}>
                {isLast
                  ? t(
                      'Practice banking logins, video calls and forms, and learn to spot scams, with voice guidance.',
                      'بینک لاگ ان، ویڈیو کالز اور فارمز کی پریکٹس کریں اور اسکیم پہچاننا سیکھیں، وائس گائیڈنس کے ساتھ۔'
                    )
                  : t(
                      'Learn digital skills at your own pace. Nothing here is real, so you cannot make a costly mistake.',
                      'اپنی رفتار سے ڈیجیٹل اسکلز سیکھیں۔ یہاں کچھ بھی اصلی نہیں، اس لیے کوئی نقصان دہ غلطی نہیں ہو سکتی۔'
                    )}
              </AppText>

              {isLast && (
                <View style={styles.chipRow}>
                  {chips.map((chip) => (
                    <View key={chip.icon} style={styles.chip}>
                      <Text style={styles.chipIcon}>{chip.icon}</Text>
                      <AppText style={styles.chipText}>{chip.label}</AppText>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>

          <View style={styles.footer}>
            <Pressable
              accessibilityRole="button"
              onPress={handlePrimaryAction}
              style={({ pressed }) => [
                styles.primaryButton,
                isLast && styles.startButton,
                pressed && styles.pressed,
              ]}
            >
              <AppText style={styles.primaryButtonText}>
                {isLast
                  ? t('Start Learning 🎉', 'شروع کریں 🎉')
                  : t('Next →', 'آگے بڑھیں ←')}
              </AppText>
            </Pressable>

            {isLast && (
              <Pressable
                accessibilityRole="button"
                onPress={() => setStep(step - 1)}
                style={styles.backButton}
              >
                <AppText style={styles.backButtonText}>
                  {t('Back', 'واپس')}
                </AppText>
              </Pressable>
            )}

            <View
              accessibilityRole="progressbar"
              accessibilityLabel={t(
                `Slide ${step} of ${SLIDE_COUNT}`,
                `سلائیڈ ${step} از ${SLIDE_COUNT}`
              )}
              accessibilityValue={{ min: 1, max: SLIDE_COUNT, now: step }}
              style={styles.pagination}
            >
              {Array.from({ length: SLIDE_COUNT }, (_, index) => (
                <View
                  key={index}
                  style={[
                    styles.paginationDot,
                    step === index + 1 && styles.activePaginationDot,
                  ]}
                />
              ))}
            </View>
          </View>
        </ScrollScreen>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.paper },
  safeArea: { flex: 1 },
  screenContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 16,
  },
  card: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 36,
    borderRadius: 32,
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.line,
  },
  iconCircle: {
    width: 148,
    height: 148,
    borderRadius: 74,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  icon: { fontSize: 76, lineHeight: 96 },
  title: {
    marginBottom: 14,
    color: colors.ink,
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 40,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.muted,
    fontSize: 20,
    lineHeight: 30,
    textAlign: 'center',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginTop: 24,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.chip,
    backgroundColor: colors.tealSoft,
  },
  chipIcon: { fontSize: 20 },
  chipText: { fontSize: 17, fontWeight: '700', color: colors.tealDark },
  footer: { alignItems: 'center', paddingTop: 16 },
  primaryButton: {
    width: '100%',
    minHeight: 68,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderRadius: radius.button,
    backgroundColor: colors.teal,
  },
  startButton: { backgroundColor: colors.tealDark },
  pressed: { opacity: 0.85, transform: [{ scale: 0.99 }] },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  backButton: {
    minHeight: TOUCH,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    marginTop: 4,
  },
  backButtonText: {
    color: colors.teal,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    minHeight: 40,
    marginTop: 8,
  },
  paginationDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#9FB0C0',
  },
  activePaginationDot: {
    width: 32,
    backgroundColor: colors.teal,
  },
});