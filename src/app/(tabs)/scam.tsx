import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import AppText from '../../components/Apptext';
import ScrollScreen from '../../components/Scrollscreen';
import { colors, radius, TOUCH } from '../../components/theme';
import { useLanguage } from '../../context/LanguageContext';


type Bilingual = { en: string; ur: string };
type ScamCheckErrorCode = 'NETWORK' | 'TIMEOUT' | 'RATE_LIMIT' | 'API';
type ScamImage = { base64: string; mimeType: string };
type Verdict = 'safe' | 'suspicious' | 'scam';
type ScamResult = { verdict: Verdict; reasons: Bilingual[]; advice: Bilingual };

class ScamCheckError extends Error {
  constructor(public code: ScamCheckErrorCode, message: string) {
    super(message);
    this.name = 'ScamCheckError';
  }
}

const checkScam = async ({ text, image }: { text: string; image: ScamImage | null }): Promise<ScamResult> => {
  const sample = `${text}${image ? ' screenshot' : ''}`.toLowerCase();
  const dangerWords = [
    'otp', 'pin', 'password', 'bank', 'account', 'payment', 'lottery',
    'prize', 'urgent', 'act now', 'verify', 'send money', 'account close',
  ];
  const matches = dangerWords.filter((word) => sample.includes(word));

  if (matches.length >= 3) {
    return {
      verdict: 'scam',
      reasons: matches.slice(0, 3).map((word) => ({
        en: `The message contains a common scam-related phrase: “${word}”.`,
        ur: `میسج میں ایک عام فریب سے متعلق لفظ ہے: “${word}”۔`,
      })),
      advice: {
        en: 'Do not share personal details or money. Contact the organisation using its official number.',
        ur: 'ذاتی تفصیلات یا رقم مت دیں۔ ادارے سے اس کے آفیشل نمبر پر رابطہ کریں۔',
      },
    };
  }
  if (matches.length > 0) {
    return {
      verdict: 'suspicious',
      reasons: matches.slice(0, 3).map((word) => ({
        en: `The message mentions “${word}”, which can be a warning sign.`,
        ur: `میسج میں “${word}” ذکر ہے، جو خطرے کی نشانی ہو سکتا ہے۔`,
      })),
      advice: {
        en: 'Verify the sender through an official and trusted contact method.',
        ur: 'بھیجنے والے کی تصدیق کسی آفیشل اور قابل اعتماد طریقے سے کریں۔',
      },
    };
  }
  return {
    verdict: 'safe',
    reasons: [{
      en: 'No common warning signs were detected in the text.',
      ur: 'متن میں کوئی عام خطرے کی نشانی نہیں ملی۔',
    }],
    advice: {
      en: 'Still stay cautious and never share passwords or one-time codes.',
      ur: 'احتیاط جاری رکھیں اور پاس ورڈ یا ون ٹائم کوڈز کبھی شریک نہ کریں۔',
    },
  };
};

export default function ScamScreen() {
  const { t, language } = useLanguage();
  const isUrdu = language === 'ur';
  const [message, setMessage] = useState('');
  const [image, setImage] = useState<(ScamImage & { uri: string }) | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScamResult | null>(null);
  const [error, setError] = useState<ScamCheckErrorCode | null>(null);
  const [dialog, setDialog] = useState<{ title: string; body: string } | null>(null);

  const redFlags = [
    {
      icon: '🔢',
      text: t('Asks for your OTP, PIN or password', 'آپ سے او ٹی پی، پن یا پاس ورڈ مانگتا ہے'),
    },
    {
      icon: '⏰',
      text: t('Says "act now" or your account will close', 'کہتا ہے "فوراً کریں" ورنہ اکاؤنٹ بند ہو جائے گا'),
    },
    {
      icon: '🔗',
      text: t('Has a link from a number you do not know', 'انجان نمبر سے آیا ہوا لنک ہے'),
    },
  ];

  // "safe" is worded as "no warning signs" so nobody treats it as a guarantee.
  const verdictStyle: Record<
    Verdict,
    { icon: string; color: string; soft: string; label: string }
  > = {
    safe: {
      icon: '✅',
      color: colors.tealDark,
      soft: colors.tealSoft,
      label: t('No warning signs found', 'کوئی خطرے کی نشانی نہیں ملی'),
    },
    suspicious: {
      icon: '⚠️',
      color: colors.marigoldDark,
      soft: colors.marigoldSoft,
      label: t('Be careful', 'احتیاط کریں'),
    },
    scam: {
      icon: '🚫',
      color: colors.coral,
      soft: colors.coralSoft,
      label: t('This looks like a scam', 'یہ اسکیم لگتا ہے'),
    },
  };

  const errorText = (code: ScamCheckErrorCode) => {
    switch (code) {
      case 'NETWORK':
        return t(
          'No internet connection. Please check your connection and try again.',
          'انٹرنیٹ نہیں ہے۔ اپنا کنکشن چیک کریں اور دوبارہ کوشش کریں۔'
        );
      case 'TIMEOUT':
        return t(
          'This took too long. Please try again.',
          'اس میں بہت وقت لگ گیا۔ دوبارہ کوشش کریں۔'
        );
      case 'RATE_LIMIT':
        return t(
          'Too many checks right now. Please wait a minute and try again.',
          'اس وقت بہت زیادہ چیک ہو رہے ہیں۔ ایک منٹ رک کر دوبارہ کوشش کریں۔'
        );
      default:
        return t(
          'Something went wrong. Please try again.',
          'کچھ غلط ہو گیا۔ دوبارہ کوشش کریں۔'
        );
    }
  };

  const pick = (b: Bilingual) => (isUrdu ? b.ur : b.en);

  const handleUpload = async () => {
    const picked = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.5, // keeps screenshots small so the request stays fast
      base64: true,
    });
    if (picked.canceled) return;

    const asset = picked.assets[0];
    if (!asset?.base64) {
      Alert.alert(
        t('Could not open the picture', 'تصویر نہیں کھل سکی'),
        t('Please choose another screenshot.', 'براہِ کرم کوئی دوسرا اسکرین شاٹ چنیں۔')
      );
      return;
    }
    setImage({ uri: asset.uri, base64: asset.base64, mimeType: asset.mimeType ?? 'image/jpeg' });
    setResult(null);
    setError(null);
  };

  const handleCheck = async () => {
  if (loading) return;
  setLoading(true);
  setResult(null);
  setError(null);
  try {
    const res = await checkScam({
      text: message,
      image: image ? { base64: image.base64, mimeType: image.mimeType } : null,
    });
    setResult(res);

    

    // Title follows the verdict, e.g. "This looks like a scam"
    const vs = verdictStyle[res.verdict];
    Alert.alert(
      `${vs.icon} ${vs.label}`,
      t(
        'Scroll down to see why and what to do next.',
        'وجہ اور آگے کیا کرنا ہے، یہ دیکھنے کے لیے نیچے سکرول کریں۔'
      )
    );
  } catch (e) {
    const code: ScamCheckErrorCode = e instanceof ScamCheckError ? e.code : 'API';
    setError(code);
    if (__DEV__) console.warn('Scam check failed:', e);

    // Message follows the error type (no internet, timeout, too many checks, ...)
    Alert.alert(
      t('Could not check', 'چیک نہیں ہو سکا'),
      `${errorText(code)}\n\n${t('Scroll down to see details.', 'تفصیل دیکھنے کے لیے نیچے سکرول کریں۔')}`
    );
  } finally {
    setLoading(false);
  }
};

  const canCheck = (message.trim().length > 0 || !!image) && !loading;
  const vs = result ? verdictStyle[result.verdict] : null;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollScreen
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.hero}>
          <View style={styles.shield}>
            <Text style={styles.shieldIcon}>🛡️</Text>
          </View>
          <AppText accessibilityRole="header" style={styles.title}>
            {t('Is this message safe?', 'کیا یہ میسج محفوظ ہے؟')}
          </AppText>
          <AppText style={styles.subtitle}>
            {t(
              'Paste a message or upload a screenshot and we will check it for you.',
              'کوئی بھی مشکوک میسج پیسٹ کریں یا اسکرین شاٹ اپ لوڈ کریں، ہم آپ کے لیے چیک کریں گے۔'
            )}
          </AppText>
        </View>

        <TextInput
          value={message}
          onChangeText={(v) => {
            setMessage(v);
            setResult(null);
            setError(null);
          }}
          multiline
          placeholder={t('Paste the message here', 'میسج یہاں پیسٹ کریں')}
          placeholderTextColor={colors.muted}
          accessibilityLabel={t('Message to check', 'چیک کرنے والا میسج')}
          textAlignVertical="top"
          style={[styles.input, isUrdu && styles.inputRtl]}
        />

        {image && (
          <View style={[styles.imageRow, isUrdu && styles.rowRtl]}>
            <Image
              source={{ uri: image.uri }}
              style={styles.thumb}
              accessibilityLabel={t('Your screenshot', 'آپ کا اسکرین شاٹ')}
            />
            <AppText style={styles.imageText}>
              {t('Screenshot added', 'اسکرین شاٹ شامل ہو گیا')}
            </AppText>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('Remove screenshot', 'اسکرین شاٹ ہٹائیں')}
              onPress={() => {
                setImage(null);
                setResult(null);
                setError(null);
              }}
              style={({ pressed }) => [styles.removeBtn, pressed && styles.pressed]}
            >
              <AppText style={styles.removeText}>{t('Remove', 'ہٹائیں')}</AppText>
            </Pressable>
          </View>
        )}

        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: !canCheck, busy: loading }}
          onPress={handleCheck}
          disabled={!canCheck}
          style={({ pressed }) => [
            styles.checkBtn,
            !canCheck && styles.checkBtnDisabled,
            pressed && styles.pressed,
          ]}
        >
          {loading ? (
            <View style={[styles.loadingRow, isUrdu && styles.rowRtl]}>
              <ActivityIndicator color="#FFFFFF" />
              <AppText style={styles.checkText}>{t('Checking...', 'چیک ہو رہا ہے...')}</AppText>
            </View>
          ) : (
            <AppText style={styles.checkText}>
              {t('Check this message', 'یہ میسج چیک کریں')}
            </AppText>
          )}
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={handleUpload}
          disabled={loading}
          style={({ pressed }) => [styles.uploadBtn, pressed && styles.pressed]}
        >
          <AppText style={styles.uploadText}>
            {image
              ? t('Change screenshot', 'اسکرین شاٹ تبدیل کریں')
              : t('+ Upload a screenshot', '+ اسکرین شاٹ اپ لوڈ کریں')}
          </AppText>
        </Pressable>

        {error && (
          <View
            accessibilityLiveRegion="polite"
            style={[styles.errorCard, isUrdu && styles.rowRtl]}
          >
            <Text style={styles.flagIcon}>📡</Text>
            <AppText style={styles.errorText}>{errorText(error)}</AppText>
          </View>
        )}

        {result && vs && (
          <View
            accessibilityLiveRegion="polite"
            style={[styles.resultCard, { backgroundColor: vs.soft, borderColor: vs.color }]}
          >
            <View style={[styles.verdictRow, isUrdu && styles.rowRtl]}>
              <Text style={styles.verdictIcon}>{vs.icon}</Text>
              <AppText
                accessibilityRole="header"
                style={[styles.verdictText, { color: vs.color }]}
              >
                {vs.label}
              </AppText>
            </View>

            {result.reasons.map((reason: Bilingual, i: number) => (
              <View key={i} style={[styles.reasonRow, isUrdu && styles.rowRtl]}>
                <Text style={[styles.bullet, { color: vs.color }]}>●</Text>
                <AppText style={styles.reasonText}>{pick(reason)}</AppText>
              </View>
            ))}

            <View style={styles.adviceBox}>
              <AppText style={[styles.adviceTitle, { color: vs.color }]}>
                {t('What to do', 'اب کیا کریں')}
              </AppText>
              <AppText style={styles.adviceText}>{pick(result.advice)}</AppText>
            </View>

            <AppText style={styles.disclaimer}>
              {t(
                'This check can make mistakes. Never share an OTP, PIN or password with anyone.',
                'اس چیک میں غلطی ہو سکتی ہے۔ او ٹی پی، پن یا پاس ورڈ کبھی کسی کو نہ بتائیں۔'
              )}
            </AppText>
          </View>
        )}

        <View style={styles.flagsCard}>
          <AppText style={styles.flagsTitle}>
            {t('Warning signs of a scam', 'اسکیم کی نشانیاں')}
          </AppText>
          {redFlags.map((flag) => (
            <View key={flag.icon} style={[styles.flagRow, isUrdu && styles.rowRtl]}>
              <Text style={styles.flagIcon}>{flag.icon}</Text>
              <AppText style={styles.flagText}>{flag.text}</AppText>
            </View>
          ))}
        </View>
      </ScrollScreen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper },
  scroll: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 40 },
  hero: { alignItems: 'center', paddingVertical: 12 },
  shield: {
    width: 104,
    height: 104,
    borderRadius: 52,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.coralSoft,
    marginBottom: 16,
  },
  shieldIcon: { fontSize: 54 },
  title: {
    color: colors.ink,
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 18,
    lineHeight: 26,
    textAlign: 'center',
  },
  input: {
    minHeight: 150,
    marginTop: 16,
    padding: 18,
    borderRadius: radius.card,
    borderWidth: 2,
    borderColor: colors.line,
    backgroundColor: colors.card,
    color: colors.ink,
    fontSize: 19,
    lineHeight: 28,
  },
  inputRtl: { textAlign: 'right', writingDirection: 'rtl' },
  imageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
    padding: 10,
    borderRadius: radius.card,
    borderWidth: 2,
    borderColor: colors.line,
    backgroundColor: colors.card,
  },
  rowRtl: { flexDirection: 'row-reverse' },
  thumb: { width: 64, height: 64, borderRadius: 12, backgroundColor: colors.line },
  imageText: { flex: 1, color: colors.ink, fontSize: 18, fontWeight: '700' },
  removeBtn: {
    minHeight: TOUCH,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeText: { color: colors.coral, fontSize: 18, fontWeight: '800' },
  checkBtn: {
    marginTop: 14,
    minHeight: 68,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.button,
    backgroundColor: colors.teal,
  },
  checkBtnDisabled: { backgroundColor: '#9FB0C0' },
  checkText: { color: '#FFFFFF', fontSize: 21, fontWeight: '800', textAlign: 'center' },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  uploadBtn: {
    marginTop: 12,
    minHeight: TOUCH + 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.button,
    borderWidth: 2,
    borderColor: colors.teal,
    backgroundColor: colors.card,
  },
  uploadText: { color: colors.teal, fontSize: 19, fontWeight: '800', textAlign: 'center' },
  pressed: { opacity: 0.85, transform: [{ scale: 0.99 }] },
  errorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 20,
    padding: 18,
    borderRadius: radius.card,
    backgroundColor: colors.marigoldSoft,
  },
  errorText: { flex: 1, color: colors.marigoldDark, fontSize: 18, lineHeight: 25, fontWeight: '700' },
  resultCard: {
    marginTop: 20,
    padding: 20,
    borderRadius: radius.card,
    borderWidth: 2,
    gap: 12,
  },
  verdictRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  verdictIcon: { fontSize: 36 },
  verdictText: { flex: 1, fontSize: 24, fontWeight: '800', lineHeight: 32 },
  reasonRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  bullet: { fontSize: 12, marginTop: 8 },
  reasonText: { flex: 1, color: colors.ink, fontSize: 18, lineHeight: 26 },
  adviceBox: {
    marginTop: 4,
    padding: 16,
    borderRadius: radius.card,
    backgroundColor: colors.card,
    gap: 6,
  },
  adviceTitle: { fontSize: 18, fontWeight: '800' },
  adviceText: { color: colors.ink, fontSize: 19, lineHeight: 28, fontWeight: '600' },
  disclaimer: { color: colors.muted, fontSize: 15, lineHeight: 22 },
  flagsCard: {
    marginTop: 24,
    padding: 20,
    borderRadius: radius.card,
    backgroundColor: colors.coralSoft,
    gap: 14,
  },
  flagsTitle: { color: colors.coral, fontSize: 21, fontWeight: '800' },
  flagRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  flagIcon: { fontSize: 26 },
  flagText: { flex: 1, color: colors.ink, fontSize: 18, lineHeight: 25 },
});