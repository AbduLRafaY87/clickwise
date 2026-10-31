import { useState } from 'react';
import {
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
import ScrollScreen from '../../components/Scrollscreen';
import { colors, radius, TOUCH } from '../../components/theme';
import { useLanguage } from '../../context/LanguageContext';

export default function ScamScreen() {
  const { t, language } = useLanguage();
  const isUrdu = language === 'ur';
  const [message, setMessage] = useState('');

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

  const handleUpload = () => {
    // TODO: hook up expo-image-picker here.
    Alert.alert(
      t('Coming soon', 'جلد آ رہا ہے'),
      t('Screenshot upload is being prepared.', 'اسکرین شاٹ اپ لوڈ تیار کیا جا رہا ہے۔')
    );
  };

  const handleCheck = () => {
    // TODO: send `message` to your scam-check service (e.g. Gemini) and show the result.
    Alert.alert(
      t('Checking', 'چیک ہو رہا ہے'),
      t('The scam check will appear here.', 'اسکیم چیک کا نتیجہ یہاں نظر آئے گا۔')
    );
  };

  const canCheck = message.trim().length > 0;

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
          onChangeText={setMessage}
          multiline
          placeholder={t('Paste the message here', 'میسج یہاں پیسٹ کریں')}
          placeholderTextColor={colors.muted}
          accessibilityLabel={t('Message to check', 'چیک کرنے والا میسج')}
          textAlignVertical="top"
          style={[styles.input, isUrdu && styles.inputRtl]}
        />

        <Pressable
          accessibilityRole="button"
          onPress={handleCheck}
          disabled={!canCheck}
          style={({ pressed }) => [
            styles.checkBtn,
            !canCheck && styles.checkBtnDisabled,
            pressed && styles.pressed,
          ]}
        >
          <AppText style={styles.checkText}>
            {t('Check this message', 'یہ میسج چیک کریں')}
          </AppText>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={handleUpload}
          style={({ pressed }) => [styles.uploadBtn, pressed && styles.pressed]}
        >
          <AppText style={styles.uploadText}>
            {t('+ Upload a screenshot', '+ اسکرین شاٹ اپ لوڈ کریں')}
          </AppText>
        </Pressable>

        <View style={styles.flagsCard}>
          <AppText style={styles.flagsTitle}>
            {t('Warning signs of a scam', 'اسکیم کی نشانیاں')}
          </AppText>
          {redFlags.map((flag) => (
            <View key={flag.icon} style={[styles.flagRow, isUrdu && styles.flagRowRtl]}>
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
  flagsCard: {
    marginTop: 24,
    padding: 20,
    borderRadius: radius.card,
    backgroundColor: colors.coralSoft,
    gap: 14,
  },
  flagsTitle: { color: colors.coral, fontSize: 21, fontWeight: '800' },
  flagRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  flagRowRtl: { flexDirection: 'row-reverse' },
  flagIcon: { fontSize: 26 },
  flagText: { flex: 1, color: colors.ink, fontSize: 18, lineHeight: 25 },
});