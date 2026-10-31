import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import AppText from '../../components/Apptext';
import ScreenshotMarkers from '../../components/ScreenshotMarkers';
import ScrollScreen from '../../components/Scrollscreen';
import { colors, radius, TOUCH } from '../../components/theme';
import { useLanguage } from '../../context/LanguageContext';
import { getScreenGuide, GuideError, GuideErrorCode, GuideResult, GuideStep } from '../../services/screenGuide';

// Phone screenshots can be several MB. Shrinking them first makes the upload
// much faster and far less likely to drop on mobile data, and the buttons
// stay perfectly readable at this size.
const MAX_WIDTH = 1000;

type Shot = { uri: string; base64: string; mimeType: string; width: number; height: number };

const ACTION_ICON: Record<GuideStep['action'], string> = {
  tap: '👆',
  type: '⌨️',
  scroll: '↕️',
  wait: '⏳',
  other: 'ℹ️',
};

export default function GuideScreen() {
  const { t, language } = useLanguage();
  const isUrdu = language === 'ur';
  const hasGeminiKey = Boolean(process.env.EXPO_PUBLIC_GEMINI_API_KEY);
  const [shot, setShot] = useState<Shot | null>(null);
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GuideResult | null>(null);
  const [error, setError] = useState<GuideErrorCode | null>(null);
  const [step, setStep] = useState(0);

  const pick = (b: { en: string; ur: string }) => (isUrdu ? b.ur : b.en);

  const ideas = [
    { en: 'Send a message', ur: 'میسج بھیجنا' },
    { en: 'Start a video call', ur: 'ویڈیو کال شروع کرنا' },
    { en: 'Change a setting', ur: 'سیٹنگ تبدیل کرنا' },
    { en: 'Pay a bill', ur: 'بل ادا کرنا' },
  ];

  const errorText = (code: GuideErrorCode) => {
    switch (code) {
      case 'NO_KEY':
        return t(
          'Gemini is not configured. Add EXPO_PUBLIC_GEMINI_API_KEY to a root .env.local file, then restart Expo.',
          'جیمنائی سیٹ اپ نہیں ہے۔ روٹ کی .env.local فائل میں EXPO_PUBLIC_GEMINI_API_KEY شامل کریں، پھر ایکسپو دوبارہ شروع کریں۔'
        );
      case 'NETWORK':
        return t(
          'Could not reach the AI service. Check your internet connection and try again.',
          'اے آئی سروس تک رسائی نہیں ہو سکی۔ انٹرنیٹ چیک کر کے دوبارہ کوشش کریں۔'
        );
      case 'TIMEOUT':
        return t('This took too long. Please try again.', 'اس میں بہت وقت لگ گیا۔ دوبارہ کوشش کریں۔');
      case 'RATE_LIMIT':
        return t('Too many requests right now. Wait a minute and try again.', 'اس وقت بہت زیادہ درخواستیں ہیں۔ ایک منٹ رک کر دوبارہ کوشش کریں۔');
      case 'MODEL_GONE':
        return t(
          'The AI model this app uses has been retired by Google. The app needs a small update. Please tell the app owner.',
          'جو اے آئی ماڈل یہ ایپ استعمال کرتی ہے اسے گوگل نے بند کر دیا ہے۔ ایپ کو چھوٹی اپ ڈیٹ چاہیے۔ براہِ کرم ایپ کے مالک کو بتائیں۔'
        );
      case 'BUSY':
        return t(
          'The AI is very busy right now. Please wait a minute and try again.',
          'اے آئی پر اس وقت بہت رش ہے۔ ایک منٹ رک کر دوبارہ کوشش کریں۔'
        );
      case 'BAD_KEY':
        return t(
          'Google rejected the request. Check that the Gemini API key is valid and Gemini API access is enabled.',
          'گوگل نے درخواست قبول نہیں کی۔ جیمنائی API key کی درستگی اور API رسائی چیک کریں۔'
        );
      case 'API':
        return t(
          'Gemini had a problem. Please try again in a moment.',
          'جیمنائی میں مسئلہ آیا۔ تھوڑی دیر بعد دوبارہ کوشش کریں۔'
        );
      case 'BAD_RESPONSE':
        return t(
          'Gemini returned a response the guide could not understand. Please try another screenshot or goal.',
          'جیمنائی کا جواب سمجھ نہیں آیا۔ کوئی دوسرا اسکرین شاٹ یا مقصد آزمائیں۔'
        );
      default:
        return t('Something went wrong. Please try again.', 'کچھ غلط ہو گیا۔ دوبارہ کوشش کریں۔');
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
    setStep(0);
  };

  const handleUpload = async () => {
    const picked = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1, // we compress once ourselves below
    });
    if (picked.canceled) return;
    const a = picked.assets[0];
    let small: Shot | null = null;
    if (a?.uri && a.width && a.height) {
      try {
        const ctx = ImageManipulator.manipulate(a.uri);
        if (a.width > MAX_WIDTH) ctx.resize({ width: MAX_WIDTH });
        const ref = await ctx.renderAsync();
        const out = await ref.saveAsync({
          format: SaveFormat.JPEG,
          compress: 0.7,
          base64: true,
        });
        if (out.base64) {
          small = { uri: out.uri, base64: out.base64, mimeType: 'image/jpeg', width: out.width, height: out.height };
        }
      } catch (e) {
        if (__DEV__) console.warn('[ScreenGuide] could not shrink screenshot', e);
      }
    }
    if (!small) {
      Alert.alert(
        t('Could not open the picture', 'تصویر نہیں کھل سکی'),
        t('Please choose another screenshot.', 'براہِ کرم کوئی دوسرا اسکرین شاٹ چنیں۔')
      );
      return;
    }
    setShot(small);
    reset();
  };

  const canGo = hasGeminiKey && !!shot && goal.trim().length > 1 && !loading;
  const readinessMessage = !hasGeminiKey
    ? t(
        'Setup needed: add your Gemini API key to .env.local and restart Expo.',
        'سیٹ اپ درکار ہے: Gemini API key کو .env.local میں شامل کریں اور Expo دوبارہ شروع کریں۔'
      )
    : !shot
      ? t('Choose a screenshot to get started.', 'شروع کرنے کے لیے اسکرین شاٹ چنیں۔')
      : goal.trim().length <= 1
        ? t('Tell us what you want to do in the screenshot.', 'بتائیں کہ اسکرین شاٹ میں کیا کرنا چاہتے ہیں۔')
        : null;

  const handleGuide = async () => {
    if (!shot || !canGo) return;
    setLoading(true);
    reset();
    try {
      const res = await getScreenGuide({ goal, image: { base64: shot.base64, mimeType: shot.mimeType } });
      setResult(res);
    } catch (e) {
      setError(e instanceof GuideError ? e.code : 'API');
    } finally {
      setLoading(false);
    }
  };

  const steps = result?.steps ?? [];
  const current = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollScreen contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Text accessible={false} style={styles.heroEmoji}>👆</Text>
          </View>
          <AppText accessibilityRole="header" style={styles.title}>
            {t('Show me where to tap', 'مجھے بتائیں کہاں ٹیپ کرنا ہے')}
          </AppText>
          <AppText style={styles.subtitle}>
            {t(
              'Add a screenshot, tell us what you want to do, and we will mark the buttons for you.',
              'اسکرین شاٹ شامل کریں، بتائیں کیا کرنا ہے، ہم بٹن پر نشان لگا دیں گے۔'
            )}
          </AppText>
        </View>

        {/* 1. Screenshot */}
        <View style={[styles.stepHead, isUrdu && styles.rowRtl]}>
          <View style={styles.stepNum}><Text style={styles.stepNumText}>1</Text></View>
          <AppText style={styles.stepTitle}>{t('Add your screenshot', 'اپنا اسکرین شاٹ شامل کریں')}</AppText>
        </View>

        {shot ? (
          <View style={styles.thumbRow}>
            {!result && (
              <View style={styles.preview}>
                <ScreenshotMarkers uri={shot.uri} width={shot.width} height={shot.height} boxes={[]} current={0} />
              </View>
            )}
            <Pressable
              accessibilityRole="button"
              onPress={handleUpload}
              style={({ pressed }) => [styles.secondaryBtn, pressed && styles.pressed]}
            >
              <AppText style={styles.secondaryText}>{t('Choose a different screenshot', 'دوسرا اسکرین شاٹ چنیں')}</AppText>
            </Pressable>
          </View>
        ) : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('Choose a screenshot from your photos', 'اپنی تصاویر سے اسکرین شاٹ چنیں')}
            onPress={handleUpload}
            style={({ pressed }) => [styles.drop, pressed && styles.pressed]}
          >
            <Text accessible={false} style={styles.dropIcon}>🖼️</Text>
            <AppText style={styles.dropText}>{t('Tap to choose a screenshot', 'اسکرین شاٹ چننے کے لیے ٹیپ کریں')}</AppText>
          </Pressable>
        )}

        {/* 2. Goal */}
        <View style={[styles.stepHead, isUrdu && styles.rowRtl]}>
          <View style={styles.stepNum}><Text style={styles.stepNumText}>2</Text></View>
          <AppText style={styles.stepTitle}>{t('What do you want to do?', 'آپ کیا کرنا چاہتے ہیں؟')}</AppText>
        </View>

        <TextInput
          value={goal}
          onChangeText={(v) => {
            setGoal(v);
            reset();
          }}
          multiline
          maxLength={300}
          placeholder={t('For example: send a photo to my son', 'مثلاً: بیٹے کو تصویر بھیجنی ہے')}
          placeholderTextColor={colors.muted}
          accessibilityLabel={t('What you want to do', 'آپ کیا کرنا چاہتے ہیں')}
          textAlignVertical="top"
          style={[styles.input, isUrdu && styles.inputRtl]}
        />

        <View style={[styles.chips, isUrdu && styles.rowRtl]}>
          {ideas.map((i) => (
            <Pressable
              key={i.en}
              accessibilityRole="button"
              onPress={() => {
                setGoal(pick(i));
                reset();
              }}
              style={({ pressed }) => [styles.chip, pressed && styles.pressed]}
            >
              <AppText style={styles.chipText}>{pick(i)}</AppText>
            </Pressable>
          ))}
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: !canGo }}
          disabled={!canGo}
          onPress={handleGuide}
          style={({ pressed }) => [styles.primaryBtn, !canGo && styles.disabled, pressed && styles.pressed]}
        >
          {loading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color="#FFFFFF" />
              <AppText style={styles.primaryText}>{t('Finding the buttons…', 'بٹن تلاش ہو رہے ہیں…')}</AppText>
            </View>
          ) : (
            <AppText style={styles.primaryText}>{t('Show me', 'مجھے دکھائیں')}</AppText>
          )}
        </Pressable>

        {readinessMessage && (
          <View
            accessibilityLiveRegion="polite"
            style={[styles.setupHint, !hasGeminiKey && styles.setupHintWarning]}
          >
            <AppText style={styles.setupHintText}>{readinessMessage}</AppText>
          </View>
        )}

        <AppText style={styles.privacy}>
          {t(
            '🔒 Your screenshot is sent to Google Gemini only to find the buttons. Do not use screenshots that show passwords or one-time codes.',
            '🔒 آپ کا اسکرین شاٹ صرف بٹن تلاش کرنے کے لیے گوگل جیمنائی کو بھیجا جاتا ہے۔ ایسا اسکرین شاٹ نہ لیں جس میں پاس ورڈ یا ون ٹائم کوڈ نظر آئے۔'
          )}
        </AppText>

        {error && (
          <View accessibilityRole="alert" style={styles.errorBox}>
            <AppText style={styles.errorText}>{errorText(error)}</AppText>
          </View>
        )}

        {/* Result */}
        {result && shot && (
          <View style={styles.result}>
            {result.warning && (
              <View style={styles.warn}>
                <Text accessible={false} style={styles.warnIcon}>⚠️</Text>
                <AppText style={styles.warnText}>{pick(result.warning)}</AppText>
              </View>
            )}

            {!result.possible || steps.length === 0 ? (
              <View style={styles.noBox}>
                <AppText style={styles.noTitle}>{t('This screen cannot do that', 'اس اسکرین سے یہ نہیں ہو سکتا')}</AppText>
                <AppText style={styles.noText}>{pick(result.summary)}</AppText>
              </View>
            ) : (
              <>
                <AppText style={styles.summary}>{pick(result.summary)}</AppText>

                <ScreenshotMarkers
                  uri={shot.uri}
                  width={shot.width}
                  height={shot.height}
                  boxes={steps.map((s) => s.box)}
                  current={step}
                />

                {current && (
                  <View style={styles.stepCard}>
                    <View style={[styles.stepTop, isUrdu && styles.rowRtl]}>
                      <View style={styles.counter}>
                        <AppText style={styles.counterText}>
                          {t(`Step ${step + 1} of ${steps.length}`, `مرحلہ ${step + 1} از ${steps.length}`)}
                        </AppText>
                      </View>
                      <Text accessible={false} style={styles.actionIcon}>{ACTION_ICON[current.action]}</Text>
                    </View>

                    <AppText accessibilityLiveRegion="polite" style={styles.instruction}>
                      {pick(current.instruction)}
                    </AppText>

                    {!!current.label && (
                      <View style={styles.lookFor}>
                        <AppText style={styles.lookForLabel}>{t('Look for:', 'تلاش کریں:')}</AppText>
                        {/* Label is shown as written on screen, so keep it left-to-right */}
                        <Text style={styles.lookForValue}>{current.label}</Text>
                      </View>
                    )}
                    {!current.box && current.action === 'tap' && (
                      <AppText style={styles.noMarker}>
                        {t('We could not mark this one. Look for it on your screen.', 'اس پر نشان نہیں لگ سکا۔ اپنی اسکرین پر خود تلاش کریں۔')}
                      </AppText>
                    )}

                    <View style={[styles.navRow, isUrdu && styles.rowRtl]}>
                      <Pressable
                        accessibilityRole="button"
                        disabled={step === 0}
                        onPress={() => setStep(step - 1)}
                        style={({ pressed }) => [styles.navBtn, styles.navBack, step === 0 && styles.disabled, pressed && styles.pressed]}
                      >
                        <AppText style={styles.navBackText}>{t('← Back', 'پیچھے →')}</AppText>
                      </Pressable>
                      <Pressable
                        accessibilityRole="button"
                        onPress={() => (isLast ? setStep(0) : setStep(step + 1))}
                        style={({ pressed }) => [styles.navBtn, styles.navNext, pressed && styles.pressed]}
                      >
                        <AppText style={styles.navNextText}>
                          {isLast ? t('✓ Done · Start again', '✓ مکمل · دوبارہ شروع') : t('Next →', 'اگلا ←')}
                        </AppText>
                      </Pressable>
                    </View>
                  </View>
                )}

                {/* All steps at a glance */}
                <View style={styles.list}>
                  {steps.map((s, i) => (
                    <Pressable
                      key={i}
                      accessibilityRole="button"
                      accessibilityState={{ selected: i === step }}
                      onPress={() => setStep(i)}
                      style={[styles.listItem, isUrdu && styles.rowRtl, i === step && styles.listItemActive]}
                    >
                      <View style={[styles.listNum, i < step && styles.listNumDone, i === step && styles.listNumActive]}>
                        <Text style={[styles.listNumText, i === step && { color: colors.ink }]}>{i < step ? '✓' : i + 1}</Text>
                      </View>
                      <AppText style={styles.listText}>{pick(s.instruction)}</AppText>
                    </Pressable>
                  ))}
                </View>

                <AppText style={styles.tryIt}>
                  {t(
                    'Now open your real app and follow the steps. Nothing is tapped for you.',
                    'اب اپنی اصلی ایپ کھولیں اور ان مراحل پر عمل کریں۔ آپ کی طرف سے کچھ ٹیپ نہیں ہوتا۔'
                  )}
                </AppText>
              </>
            )}
          </View>
        )}
      </ScrollScreen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper },
  scroll: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 48 },
  rowRtl: { flexDirection: 'row-reverse' },
  pressed: { opacity: 0.85, transform: [{ scale: 0.99 }] },
  disabled: { opacity: 0.4 },

  hero: { alignItems: 'center', paddingVertical: 8, marginBottom: 12 },
  heroIcon: {
    width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.marigoldSoft,
  },
  heroEmoji: { fontSize: 46 },
  title: { marginTop: 14, color: colors.ink, fontSize: 28, fontWeight: '800', textAlign: 'center' },
  subtitle: { marginTop: 8, color: colors.muted, fontSize: 18, lineHeight: 26, textAlign: 'center' },

  stepHead: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 22, marginBottom: 12 },
  stepNum: {
    width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.teal,
  },
  stepNumText: { color: '#FFFFFF', fontSize: 18, fontWeight: '800' },
  stepTitle: { color: colors.ink, fontSize: 21, fontWeight: '800', flexShrink: 1 },

  drop: {
    minHeight: 150, alignItems: 'center', justifyContent: 'center', gap: 8, padding: 20,
    borderRadius: radius.card, borderWidth: 2.5, borderStyle: 'dashed', borderColor: colors.teal,
    backgroundColor: colors.tealSoft,
  },
  dropIcon: { fontSize: 40 },
  dropText: { color: colors.tealDark, fontSize: 19, fontWeight: '800', textAlign: 'center' },
  thumbRow: { gap: 12 },
  preview: { alignSelf: 'center', width: '60%' },
  secondaryBtn: {
    minHeight: TOUCH, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20,
    borderRadius: radius.button, borderWidth: 2, borderColor: colors.teal, backgroundColor: colors.card,
  },
  secondaryText: { color: colors.teal, fontSize: 18, fontWeight: '800' },

  input: {
    minHeight: 110, padding: 18, borderRadius: radius.card, borderWidth: 2, borderColor: colors.line,
    backgroundColor: colors.card, color: colors.ink, fontSize: 19, lineHeight: 28,
  },
  inputRtl: { textAlign: 'right', writingDirection: 'rtl' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  chip: {
    minHeight: 44, justifyContent: 'center', paddingHorizontal: 14, borderRadius: radius.pill,
    backgroundColor: colors.skySoft,
  },
  chipText: { color: colors.sky, fontSize: 16, fontWeight: '700' },

  primaryBtn: {
    minHeight: TOUCH + 4, marginTop: 20, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 20, borderRadius: radius.button, backgroundColor: colors.teal,
  },
  primaryText: { color: '#FFFFFF', fontSize: 21, fontWeight: '800' },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  privacy: { marginTop: 14, color: colors.muted, fontSize: 15, lineHeight: 22 },

  setupHint: {
    marginTop: 10,
    padding: 14,
    borderRadius: radius.chip,
    backgroundColor: colors.skySoft,
  },
  setupHintWarning: { backgroundColor: colors.marigoldSoft },
  setupHintText: { color: colors.ink, fontSize: 16, fontWeight: '700', lineHeight: 24 },

  errorBox: { marginTop: 16,marginBottom: 76, padding: 16, borderRadius: radius.card, backgroundColor: colors.coralSoft },
  errorText: { color: colors.coral, fontSize: 17, fontWeight: '700', lineHeight: 25 },

  result: { marginTop: 24, gap: 14 },
  warn: {
    flexDirection: 'row', gap: 10, padding: 16, borderRadius: radius.card,
    backgroundColor: colors.coralSoft, borderWidth: 2, borderColor: colors.coral,
  },
  warnIcon: { fontSize: 22 },
  warnText: { flex: 1, color: colors.coral, fontSize: 17, fontWeight: '700', lineHeight: 25 },
  noBox: { padding: 20, borderRadius: radius.card, backgroundColor: colors.marigoldSoft, gap: 6 },
  noTitle: { color: colors.marigoldDark, fontSize: 20, fontWeight: '800' },
  noText: { color: colors.ink, fontSize: 18, lineHeight: 27 },
  summary: { color: colors.ink, fontSize: 19, lineHeight: 28, fontWeight: '600' },

  stepCard: {
    padding: 20, borderRadius: radius.card, backgroundColor: colors.card, borderWidth: 2,
    borderColor: colors.marigold, gap: 12,
  },
  stepTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  counter: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: radius.pill, backgroundColor: colors.marigoldSoft },
  counterText: { color: colors.marigoldDark, fontSize: 15, fontWeight: '800' },
  actionIcon: { fontSize: 30 },
  instruction: { color: colors.ink, fontSize: 24, fontWeight: '800', lineHeight: 33 },
  lookFor: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  lookForLabel: { color: colors.muted, fontSize: 17, fontWeight: '700' },
  lookForValue: {
    color: colors.tealDark, fontSize: 18, fontWeight: '800', paddingHorizontal: 12, paddingVertical: 4,
    borderRadius: radius.chip, backgroundColor: colors.tealSoft, overflow: 'hidden',
  },
  noMarker: { color: colors.marigoldDark, fontSize: 16, fontWeight: '700', lineHeight: 23 },
  navRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  navBtn: { flex: 1, minHeight: TOUCH, alignItems: 'center', justifyContent: 'center', borderRadius: radius.button },
  navBack: { backgroundColor: colors.paper, borderWidth: 2, borderColor: colors.line },
  navBackText: { color: colors.ink, fontSize: 18, fontWeight: '800' },
  navNext: { flex: 1.6, backgroundColor: colors.teal },
  navNextText: { color: '#FFFFFF', fontSize: 19, fontWeight: '800', textAlign: 'center' },

  list: { gap: 8 },
  listItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: radius.chip,
    backgroundColor: colors.card, borderWidth: 2, borderColor: 'transparent', minHeight: 56,
  },
  listItemActive: { borderColor: colors.marigold },
  listNum: {
    width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.line,
  },
  listNumDone: { backgroundColor: colors.teal },
  listNumActive: { backgroundColor: colors.marigold },
  listNumText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  listText: { flex: 1, color: colors.ink, fontSize: 17, lineHeight: 24 },
  tryIt: { color: colors.muted, fontSize: 16, lineHeight: 24, textAlign: 'center' },
});