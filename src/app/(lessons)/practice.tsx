import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppText from '../../components/Apptext';
import { colors, radius, TOUCH } from '../../components/theme';
import { useLanguage } from '../../context/LanguageContext';

type Copy = { en: string; ur: string };
type Choice = { label: Copy; correct: boolean; feedback: Copy };
type Step = {
  question: Copy;
  detail: Copy;
  choices?: Choice[];
  simulation?: 'call-controls';
};
type LessonId = 'banking' | 'video' | 'gov';

const choice = (
  en: string,
  ur: string,
  correct: boolean,
  feedbackEn: string,
  feedbackUr: string
): Choice => ({
  label: { en, ur },
  correct,
  feedback: { en: feedbackEn, ur: feedbackUr },
});

const lessons: Record<LessonId, { title: Copy; icon: string; steps: Step[] }> = {
  banking: {
    title: { en: 'Banking practice', ur: 'بینکنگ پریکٹس' },
    icon: '🏦',
    steps: [
      {
        question: {
          en: 'Your practice banking session has timed out. What is the safest next step?',
          ur: 'آپ کا پریکٹس بینکنگ سیشن ختم ہو گیا ہے۔ اب محفوظ طریقہ کیا ہے؟',
        },
        detail: {
          en: 'This is a fictional bank screen. Real banking apps may sign you out when you have been inactive.',
          ur: 'یہ بینک کی فرضی اسکرین ہے۔ استعمال نہ ہونے پر اصل بینکنگ ایپ آپ کو سائن آؤٹ کر سکتی ہے۔',
        },
        choices: [
          choice(
            'Close the message and reopen the official banking app yourself',
            'پیغام بند کریں اور خود آفیشل بینکنگ ایپ کھولیں',
            true,
            'Correct. Open your bank using its official app or a trusted bookmark.',
            'درست۔ بینک کی آفیشل ایپ یا محفوظ بک مارک استعمال کریں۔'
          ),
          choice(
            'Tap a sign-in link in an unexpected text message',
            'غیر متوقع ٹیکسٹ میسج میں سائن اِن لنک کھولیں',
            false,
            'Unexpected links can lead to fake sign-in pages. Open the official app instead.',
            'غیر متوقع لنک جعلی سائن اِن صفحے پر لے جا سکتا ہے۔ آفیشل ایپ کھولیں۔'
          ),
        ],
      },
      {
        question: {
          en: 'Someone calls and asks you to read out a one-time code. What do you do?',
          ur: 'کوئی فون کر کے ون ٹائم کوڈ مانگتا ہے۔ آپ کیا کریں گے؟',
        },
        detail: {
          en: 'One-time codes are for you to enter into an action you started. Never share them with a caller.',
          ur: 'ون ٹائم کوڈ صرف آپ کے شروع کیے گئے کام کے لیے ہے۔ اسے فون پر کسی کو نہ بتائیں۔',
        },
        choices: [
          choice(
            'Tell them the code because they say they work for the bank',
            'انہیں کوڈ بتا دیں کیونکہ وہ خود کو بینک کا ملازم کہتے ہیں',
            false,
            'A caller can pretend to be bank staff. Never share a code, even with someone claiming to help.',
            'کوئی بھی بینک کا ملازم بننے کا دعویٰ کر سکتا ہے۔ کسی کو کوڈ نہ بتائیں۔'
          ),
          choice(
            'Do not share it; end the call and contact the bank using its official number',
            'کوڈ نہ بتائیں؛ کال بند کریں اور بینک کے آفیشل نمبر پر رابطہ کریں',
            true,
            'Correct. Keep codes private and contact the bank through a number you trust.',
            'درست۔ کوڈ خفیہ رکھیں اور بینک کے قابلِ اعتماد نمبر پر رابطہ کریں۔'
          ),
        ],
      },
      {
        question: {
          en: 'You finished using a shared device. How do you leave it safely?',
          ur: 'آپ نے مشترکہ ڈیوائس استعمال کر لی ہے۔ اسے محفوظ طریقے سے کیسے چھوڑیں گے؟',
        },
        detail: {
          en: 'A short sign-out step helps prevent the next person from seeing your practice session.',
          ur: 'سائن آؤٹ کرنے سے اگلا شخص آپ کا پریکٹس سیشن نہیں دیکھ سکے گا۔',
        },
        choices: [
          choice(
            'Sign out, then close the app or browser window',
            'سائن آؤٹ کریں، پھر ایپ یا براؤزر بند کریں',
            true,
            'Correct. You completed the safe session routine.',
            'درست۔ آپ نے محفوظ سیشن کا طریقہ مکمل کر لیا۔'
          ),
          choice(
            'Leave the account open so it is faster next time',
            'اکاؤنٹ کھلا چھوڑ دیں تاکہ اگلی بار جلدی ہو',
            false,
            'Leaving an account open can expose private information. Sign out before walking away.',
            'اکاؤنٹ کھلا چھوڑنے سے نجی معلومات دیکھی جا سکتی ہیں۔ جانے سے پہلے سائن آؤٹ کریں۔'
          ),
        ],
      },
    ],
  },
  video: {
    title: { en: 'Video call practice', ur: 'ویڈیو کال پریکٹس' },
    icon: '📹',
    steps: [
      {
        question: {
          en: 'Try the controls before joining your practice call',
          ur: 'پریکٹس کال میں شامل ہونے سے پہلے کنٹرول آزمائیں',
        },
        detail: {
          en: 'These sample controls do not access your real camera or microphone. Tap both to practice turning them on.',
          ur: 'یہ نمونہ کنٹرول آپ کے اصل کیمرے یا مائیک تک رسائی نہیں کرتے۔ دونوں کو آن کر کے پریکٹس کریں۔',
        },
        simulation: 'call-controls',
      },
      {
        question: {
          en: 'A video app asks to use your camera. What is a sensible choice?',
          ur: 'ویڈیو ایپ کیمرہ استعمال کرنے کی اجازت مانگتی ہے۔ مناسب فیصلہ کیا ہے؟',
        },
        detail: {
          en: 'Permissions let an app use parts of your device. Check which app is asking and whether you started the call.',
          ur: 'اجازت سے ایپ ڈیوائس کے حصے استعمال کر سکتی ہے۔ دیکھیں کون سی ایپ مانگ رہی ہے اور کیا آپ نے کال شروع کی ہے۔',
        },
        choices: [
          choice(
            'Allow the trusted call app when you are ready to join',
            'کال میں شامل ہونے کے لیے تیار ہوں تو قابلِ اعتماد ایپ کو اجازت دیں',
            true,
            'Correct. Only grant access to an app you recognize for a call you chose to join.',
            'درست۔ صرف اپنی منتخب کردہ کال اور پہچانی ہوئی ایپ کو اجازت دیں۔'
          ),
          choice(
            'Allow every app because a caller says it is urgent',
            'ہر ایپ کو اجازت دیں کیونکہ کال کرنے والا اسے ضروری کہتا ہے',
            false,
            'Urgency is not a reason to grant access. Check the app and change permissions in device settings.',
            'جلدی کا دباؤ اجازت دینے کی وجہ نہیں۔ ایپ دیکھیں اور ڈیوائس سیٹنگز میں اجازت بدلیں۔'
          ),
        ],
      },
      {
        question: {
          en: 'You joined but cannot hear anyone. What should you check first?',
          ur: 'آپ کال میں شامل ہیں مگر آواز نہیں آ رہی۔ پہلے کیا چیک کریں گے؟',
        },
        detail: {
          en: 'Simple checks often solve call problems without changing advanced settings.',
          ur: 'آسان چیکس اکثر مشکل سیٹنگز بدلے بغیر مسئلہ حل کر دیتے ہیں۔',
        },
        choices: [
          choice(
            'Check device volume, call audio output, and whether the speaker is muted',
            'ڈیوائس کی آواز، کال کا آڈیو آؤٹ پٹ اور اسپیکر کا میوٹ ہونا چیک کریں',
            true,
            'Correct. Check volume and the call’s audio controls before leaving the call.',
            'درست۔ کال چھوڑنے سے پہلے آواز اور کال کے آڈیو کنٹرول چیک کریں۔'
          ),
          choice(
            'Share your screen with anyone who asks',
            'جو بھی کہے اس کے ساتھ اسکرین شیئر کریں',
            false,
            'Screen sharing can reveal private information. It does not fix a sound problem.',
            'اسکرین شیئر کرنے سے نجی معلومات ظاہر ہو سکتی ہیں۔ اس سے آواز ٹھیک نہیں ہوتی۔'
          ),
        ],
      },
    ],
  },
  gov: {
    title: { en: 'Government form practice', ur: 'سرکاری فارم پریکٹس' },
    icon: '📝',
    steps: [
      {
        question: {
          en: 'A sample form asks for the “beneficiary.” Who is that?',
          ur: 'نمونہ فارم میں “مستفید ہونے والا” پوچھا گیا ہے۔ یہ کون ہے؟',
        },
        detail: {
          en: 'Forms often use formal words. This exercise uses made-up details only.',
          ur: 'فارمز میں مشکل الفاظ ہو سکتے ہیں۔ اس مشق میں صرف فرضی معلومات ہیں۔',
        },
        choices: [
          choice(
            'The person who will receive the service or support',
            'وہ شخص جسے سروس یا مدد ملے گی',
            true,
            'Correct. The beneficiary is the person who receives the benefit.',
            'درست۔ مستفید ہونے والا وہ شخص ہے جسے فائدہ ملے۔'
          ),
          choice(
            'The person who built the website',
            'وہ شخص جس نے ویب سائٹ بنائی ہے',
            false,
            'That is not what beneficiary means. It means the person receiving the service.',
            'اس کا مطلب ویب سائٹ بنانے والا نہیں۔ یہ سروس حاصل کرنے والا شخص ہے۔'
          ),
        ],
      },
      {
        question: {
          en: 'A sample form asks for “domicile.” What information is it usually asking for?',
          ur: 'نمونہ فارم “ڈومیسائل” پوچھتا ہے۔ عموماً یہ کون سی معلومات مانگتا ہے؟',
        },
        detail: {
          en: 'The exact requirement can vary. Read the form guidance or ask the official service if unsure.',
          ur: 'ضرورت مختلف ہو سکتی ہے۔ شک ہو تو فارم کی ہدایات پڑھیں یا آفیشل ادارے سے پوچھیں۔',
        },
        choices: [
          choice(
            'Your official district or area of domicile',
            'آپ کا سرکاری ڈومیسائل ضلع یا علاقہ',
            true,
            'Correct. Use the area shown on your official domicile record, not a guess.',
            'درست۔ اندازہ لگانے کے بجائے سرکاری ڈومیسائل ریکارڈ دیکھیں۔'
          ),
          choice(
            'The nearest shop to your home',
            'آپ کے گھر کے قریب دکان',
            false,
            'A shop location is not domicile. Check your official record or the form instructions.',
            'دکان کا مقام ڈومیسائل نہیں۔ اپنا سرکاری ریکارڈ یا فارم کی ہدایات دیکھیں۔'
          ),
        ],
      },
      {
        question: {
          en: 'Before sending a real form, what should you do?',
          ur: 'اصل فارم بھیجنے سے پہلے آپ کو کیا کرنا چاہیے؟',
        },
        detail: {
          en: 'This practice form will not be sent. Real forms can contain important personal information.',
          ur: 'یہ پریکٹس فارم نہیں بھیجا جائے گا۔ اصل فارم میں اہم ذاتی معلومات ہو سکتی ہیں۔',
        },
        choices: [
          choice(
            'Review every answer and confirm the site is the official service',
            'ہر جواب دیکھیں اور تصدیق کریں کہ ویب سائٹ آفیشل ہے',
            true,
            'Correct. Check your answers and the official site before you decide to submit.',
            'درست۔ بھیجنے کا فیصلہ کرنے سے پہلے جوابات اور آفیشل ویب سائٹ چیک کریں۔'
          ),
          choice(
            'Submit quickly without checking the address or answers',
            'پتہ یا جوابات دیکھے بغیر جلدی سے بھیج دیں',
            false,
            'Take your time. Check the site and review your answers before any real submission.',
            'آرام سے کریں۔ اصل فارم بھیجنے سے پہلے ویب سائٹ اور جوابات دیکھیں۔'
          ),
        ],
      },
    ],
  },
};

const isLessonId = (value: string | undefined): value is LessonId =>
  value !== undefined && Object.prototype.hasOwnProperty.call(lessons, value);

export default function PracticeLessonScreen() {
  const router = useRouter();
  const { lesson: lessonParam } = useLocalSearchParams<{ lesson?: string }>();
  const { language, t } = useLanguage();
  const isUrdu = language === 'ur';
  const lesson = isLessonId(lessonParam) ? lessons[lessonParam] : null;
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [micOn, setMicOn] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [complete, setComplete] = useState(false);

  const copy = (value: Copy) => (isUrdu ? value.ur : value.en);

  const restart = () => {
    setStepIndex(0);
    setSelectedChoice(null);
    setMicOn(false);
    setCameraOn(false);
    setComplete(false);
  };

  if (!lesson) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.invalidContent}>
          <AppText accessibilityRole="header" style={styles.title}>
            {t('Lesson not found', 'سبق نہیں ملا')}
          </AppText>
          <ActionButton
            label={t('Back to lessons', 'اسباق پر واپس جائیں')}
            onPress={() => router.replace('/(tabs)')}
          />
        </View>
      </SafeAreaView>
    );
  }

  const step = lesson.steps[stepIndex];
  const selected = selectedChoice === null ? undefined : step.choices?.[selectedChoice];
  const controlsReady = step.simulation === 'call-controls' && micOn && cameraOn;
  const canContinue = step.simulation === 'call-controls' ? controlsReady : selected?.correct === true;

  const advance = () => {
    if (!canContinue) return;
    if (stepIndex === lesson.steps.length - 1) {
      setComplete(true);
      return;
    }
    setStepIndex((current) => current + 1);
    setSelectedChoice(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.screen}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.topBar, isUrdu && styles.rowRtl]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('Back to lessons', 'اسباق پر واپس جائیں')}
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
          >
            <Text style={styles.backIcon}>{isUrdu ? '→' : '←'}</Text>
            <AppText style={styles.backLabel}>{t('Lessons', 'اسباق')}</AppText>
          </Pressable>
          <View style={styles.practiceBadge}>
            <Text style={styles.practiceBadgeIcon}>🔒</Text>
            <AppText style={styles.practiceBadgeText}>
              {t('Practice only', 'صرف پریکٹس')}
            </AppText>
          </View>
        </View>

        <View style={styles.lessonHeading}>
          <View style={styles.lessonIcon}>
            <Text style={styles.lessonEmoji}>{lesson.icon}</Text>
          </View>
          <AppText accessibilityRole="header" style={styles.title}>
            {copy(lesson.title)}
          </AppText>
          <AppText style={styles.subtitle}>
            {t(
              'Try each situation. You can take your time.',
              'ہر صورتِ حال آزمائیں۔ آپ آرام سے کر سکتے ہیں۔'
            )}
          </AppText>
        </View>

        {!complete ? (
          <>
            <View
              accessibilityRole="progressbar"
              accessibilityLabel={t(
                `Step ${stepIndex + 1} of ${lesson.steps.length}`,
                `مرحلہ ${stepIndex + 1} از ${lesson.steps.length}`
              )}
              accessibilityValue={{
                min: 1,
                max: lesson.steps.length,
                now: stepIndex + 1,
              }}
              style={styles.progressCard}
            >
              <AppText style={styles.progressText}>
                {t(
                  `Step ${stepIndex + 1} of ${lesson.steps.length}`,
                  `مرحلہ ${stepIndex + 1} از ${lesson.steps.length}`
                )}
              </AppText>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${((stepIndex + 1) / lesson.steps.length) * 100}%` },
                  ]}
                />
              </View>
            </View>

            <View style={styles.questionCard}>
              <AppText accessibilityRole="header" style={styles.question}>
                {copy(step.question)}
              </AppText>
              <AppText style={styles.detail}>{copy(step.detail)}</AppText>

              {lessonParam === 'banking' && (
                <View style={styles.bankPreview}>
                  <View style={styles.bankHeader}>
                    <Text style={styles.bankIcon}>🏦</Text>
                    <View style={styles.bankHeaderCopy}>
                      <AppText style={styles.bankName}>
                        {t('ClickWise Practice Bank', 'کلک وائز پریکٹس بینک')}
                      </AppText>
                      <AppText style={styles.bankSample}>
                        {t('Fictional sample account •••• 0000', 'فرضی نمونہ اکاؤنٹ •••• 0000')}
                      </AppText>
                    </View>
                  </View>
                  <View style={styles.bankStatus}>
                    <View style={styles.bankStatusDot} />
                    <AppText style={styles.bankStatusText}>
                      {stepIndex === 0
                        ? t('Session safely signed out', 'سیشن محفوظ طریقے سے بند ہے')
                        : stepIndex === 1
                          ? t('No real code or money is involved', 'کوئی اصل کوڈ یا رقم شامل نہیں')
                          : t('Remember to sign out when finished', 'مکمل ہونے پر سائن آؤٹ کرنا یاد رکھیں')}
                    </AppText>
                  </View>
                </View>
              )}

              {lessonParam === 'gov' && (
                <View style={styles.formPreview}>
                  <View style={styles.formPreviewHeader}>
                    <Text style={styles.formPreviewIcon}>📄</Text>
                    <View>
                      <AppText style={styles.formPreviewTitle}>
                        {t('Sample service form', 'نمونہ سروس فارم')}
                      </AppText>
                      <AppText style={styles.formPreviewCaption}>
                        {t('Fictional details only', 'صرف فرضی معلومات')}
                      </AppText>
                    </View>
                  </View>
                  <View style={styles.sampleField}>
                    <AppText style={styles.sampleFieldLabel}>
                      {stepIndex === 0
                        ? t('Beneficiary', 'مستفید ہونے والا')
                        : stepIndex === 1
                          ? t('Domicile', 'ڈومیسائل')
                          : t('Review', 'جائزہ')}
                    </AppText>
                    <AppText style={styles.sampleFieldValue}>
                      {stepIndex === 0
                        ? t('Amina Example', 'آمنہ مثال')
                        : stepIndex === 1
                          ? t('Example District', 'نمونہ ضلع')
                          : t('Check details before submitting', 'بھیجنے سے پہلے تفصیل دیکھیں')}
                    </AppText>
                  </View>
                  <AppText style={styles.formPreviewCaption}>
                    {t(
                      'This sample is not saved or sent.',
                      'یہ نمونہ محفوظ یا بھیجا نہیں جاتا۔'
                    )}
                  </AppText>
                </View>
              )}

              {step.simulation === 'call-controls' ? (
                <View style={styles.callPreview}>
                  <View style={styles.previewScreen}>
                    <Text style={styles.previewFace}>🙂</Text>
                    <AppText style={styles.previewText}>
                      {t('Practice call preview', 'پریکٹس کال کا منظر')}
                    </AppText>
                    <AppText style={styles.previewStatus}>
                      {t(
                        micOn && cameraOn
                          ? 'Ready to join'
                          : 'Turn on both controls to continue',
                        micOn && cameraOn
                          ? 'شامل ہونے کے لیے تیار'
                          : 'جاری رکھنے کے لیے دونوں کنٹرول آن کریں'
                      )}
                    </AppText>
                  </View>
                  <View style={[styles.controlRow, isUrdu && styles.rowRtl]}>
                    <ControlButton
                      label={t('Microphone', 'مائیکروفون')}
                      icon={micOn ? '🎙️' : '🔇'}
                      onText={t('On', 'آن')}
                      offText={t('Off', 'بند')}
                      enabled={micOn}
                      onPress={() => setMicOn((value) => !value)}
                    />
                    <ControlButton
                      label={t('Camera', 'کیمرہ')}
                      icon={cameraOn ? '📹' : '🚫'}
                      onText={t('On', 'آن')}
                      offText={t('Off', 'بند')}
                      enabled={cameraOn}
                      onPress={() => setCameraOn((value) => !value)}
                    />
                  </View>
                  <AppText style={styles.localOnly}>
                    {t(
                      'Practice controls only — no camera or microphone is accessed.',
                      'صرف پریکٹس کنٹرول — کیمرہ یا مائیک استعمال نہیں ہو رہا۔'
                    )}
                  </AppText>
                </View>
              ) : (
                <View style={styles.choices}>
                  {step.choices?.map((option, index) => {
                    const isSelected = selectedChoice === index;
                    return (
                      <Pressable
                        key={option.label.en}
                        accessibilityRole="radio"
                        accessibilityState={{ checked: isSelected }}
                        onPress={() => setSelectedChoice(index)}
                        style={({ pressed }) => [
                          styles.choice,
                          isSelected && styles.choiceSelected,
                          isSelected && option.correct && styles.choiceCorrect,
                          isSelected && !option.correct && styles.choiceIncorrect,
                          pressed && styles.pressed,
                        ]}
                      >
                        <View style={[styles.radio, isSelected && styles.radioSelected]}>
                          {isSelected && <View style={styles.radioDot} />}
                        </View>
                        <AppText style={styles.choiceText}>{copy(option.label)}</AppText>
                      </Pressable>
                    );
                  })}
                </View>
              )}

              {selected && (
                <View
                  accessibilityLiveRegion="polite"
                  style={[
                    styles.feedback,
                    selected.correct ? styles.feedbackCorrect : styles.feedbackTryAgain,
                  ]}
                >
                  <Text style={styles.feedbackIcon}>
                    {selected.correct ? '✅' : '💡'}
                  </Text>
                  <AppText style={styles.feedbackText}>{copy(selected.feedback)}</AppText>
                </View>
              )}

              {step.simulation === 'call-controls' && controlsReady && (
                <View accessibilityLiveRegion="polite" style={styles.feedbackCorrect}>
                  <AppText style={styles.feedbackText}>
                    {t(
                      'Nice work. In a real call, these controls turn your mic and camera on or off.',
                      'بہت خوب۔ اصل کال میں یہ کنٹرول مائیک اور کیمرہ آن یا آف کرتے ہیں۔'
                    )}
                  </AppText>
                </View>
              )}
            </View>

            <ActionButton
              label={
                stepIndex === lesson.steps.length - 1
                  ? t('Finish practice', 'پریکٹس مکمل کریں')
                  : t('Continue', 'جاری رکھیں')
              }
              disabled={!canContinue}
              onPress={advance}
            />
          </>
        ) : (
          <View style={styles.completeCard}>
            <Text style={styles.completeIcon}>🎉</Text>
            <AppText accessibilityRole="header" style={styles.completeTitle}>
              {t('Practice complete!', 'پریکٹس مکمل ہو گئی!')}
            </AppText>
            <AppText style={styles.completeBody}>
              {t(
                'You worked through each situation. Nothing was sent, and no real account, device permission, or personal information was used.',
                'آپ نے ہر صورتِ حال کی مشق کی۔ کچھ بھی نہیں بھیجا گیا اور کوئی اصل اکاؤنٹ، ڈیوائس اجازت یا ذاتی معلومات استعمال نہیں ہوئیں۔'
              )}
            </AppText>
            <ActionButton
              label={t('Practice again', 'دوبارہ پریکٹس کریں')}
              onPress={restart}
            />
            <Pressable
              accessibilityRole="button"
              onPress={() => router.replace('/(tabs)')}
              style={({ pressed }) => [styles.homeButton, pressed && styles.pressed]}
            >
              <AppText style={styles.homeButtonText}>
                {t('Back to learning hub', 'لرننگ ہب پر واپس جائیں')}
              </AppText>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function ActionButton({
  label,
  onPress,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.primaryButton,
        disabled && styles.buttonDisabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <AppText style={styles.primaryButtonText}>{label}</AppText>
    </Pressable>
  );
}

function ControlButton({
  label,
  icon,
  onText,
  offText,
  enabled,
  onPress,
}: {
  label: string;
  icon: string;
  onText: string;
  offText: string;
  enabled: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: enabled }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.controlButton,
        enabled && styles.controlButtonOn,
        pressed && styles.pressed,
      ]}
    >
      <Text style={styles.controlIcon}>{icon}</Text>
      <AppText style={styles.controlLabel}>{label}</AppText>
      <AppText style={styles.controlState}>
        {enabled ? onText : offText}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  screen: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 32,
  },
  invalidContent: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    gap: 20,
  },
  topBar: {
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },
  rowRtl: {
    flexDirection: 'row-reverse',
  },
  backButton: {
    minHeight: TOUCH,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
  },
  backIcon: {
    color: colors.tealDark,
    fontSize: 24,
    fontWeight: '700',
  },
  backLabel: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '700',
  },
  practiceBadge: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
    backgroundColor: colors.tealSoft,
  },
  practiceBadgeIcon: {
    fontSize: 16,
  },
  practiceBadgeText: {
    color: colors.tealDark,
    fontSize: 14,
    fontWeight: '800',
  },
  lessonHeading: {
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  lessonIcon: {
    width: 76,
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderRadius: 24,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
  },
  lessonEmoji: {
    fontSize: 40,
  },
  title: {
    color: colors.ink,
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 38,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 4,
    color: colors.muted,
    fontSize: 17,
    lineHeight: 26,
    textAlign: 'center',
  },
  progressCard: {
    padding: 16,
    marginBottom: 14,
    borderRadius: radius.card,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
  },
  progressText: {
    marginBottom: 10,
    color: colors.tealDark,
    fontSize: 16,
    fontWeight: '800',
  },
  progressTrack: {
    height: 10,
    overflow: 'hidden',
    borderRadius: radius.pill,
    backgroundColor: colors.tealSoft,
  },
  progressFill: {
    height: '100%',
    borderRadius: radius.pill,
    backgroundColor: colors.teal,
  },
  questionCard: {
    padding: 20,
    marginBottom: 16,
    borderRadius: radius.card,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
  },
  question: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 32,
  },
  detail: {
    marginTop: 10,
    color: colors.muted,
    fontSize: 17,
    lineHeight: 26,
  },
  bankPreview: {
    padding: 14,
    marginTop: 18,
    borderRadius: radius.chip,
    backgroundColor: '#EFF5F8',
    borderWidth: 1,
    borderColor: colors.line,
  },
  bankHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bankIcon: {
    fontSize: 28,
  },
  bankHeaderCopy: {
    flex: 1,
  },
  bankName: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: '800',
  },
  bankSample: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
  },
  bankStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  bankStatusDot: {
    width: 10,
    height: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.teal,
  },
  bankStatusText: {
    flex: 1,
    color: colors.tealDark,
    fontSize: 15,
    fontWeight: '700',
  },
  formPreview: {
    gap: 12,
    padding: 14,
    marginTop: 18,
    borderRadius: radius.chip,
    backgroundColor: '#FFFAEB',
    borderWidth: 1,
    borderColor: colors.marigold,
  },
  formPreviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  formPreviewIcon: {
    fontSize: 24,
  },
  formPreviewTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '800',
  },
  formPreviewCaption: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
  },
  sampleField: {
    gap: 4,
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
  },
  sampleFieldLabel: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '600',
  },
  sampleFieldValue: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: '700',
  },
  choices: {
    gap: 12,
    marginTop: 20,
  },
  choice: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderWidth: 2,
    borderColor: colors.line,
    borderRadius: radius.chip,
    backgroundColor: colors.paper,
  },
  choiceSelected: {
    borderColor: colors.sky,
    backgroundColor: colors.skySoft,
  },
  choiceCorrect: {
    borderColor: colors.teal,
    backgroundColor: colors.tealSoft,
  },
  choiceIncorrect: {
    borderColor: colors.marigoldDark,
    backgroundColor: colors.marigoldSoft,
  },
  radio: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.muted,
    backgroundColor: colors.card,
  },
  radioSelected: {
    borderColor: colors.tealDark,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: radius.pill,
    backgroundColor: colors.tealDark,
  },
  choiceText: {
    flex: 1,
    color: colors.ink,
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 25,
  },
  feedback: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 16,
    padding: 14,
    borderRadius: radius.chip,
  },
  feedbackCorrect: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 16,
    padding: 14,
    borderRadius: radius.chip,
    backgroundColor: colors.tealSoft,
  },
  feedbackTryAgain: {
    backgroundColor: colors.marigoldSoft,
  },
  feedbackIcon: {
    fontSize: 20,
  },
  feedbackText: {
    flex: 1,
    color: colors.ink,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  callPreview: {
    marginTop: 20,
    padding: 14,
    borderRadius: radius.chip,
    backgroundColor: '#E8F0F6',
  },
  previewScreen: {
    minHeight: 160,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: '#D5E4EF',
  },
  previewFace: {
    fontSize: 58,
  },
  previewText: {
    marginTop: 6,
    color: colors.ink,
    fontSize: 18,
    fontWeight: '800',
  },
  previewStatus: {
    marginTop: 4,
    color: colors.muted,
    fontSize: 15,
    textAlign: 'center',
  },
  controlRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
  },
  controlButton: {
    flex: 1,
    minHeight: 100,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderRadius: radius.chip,
    borderWidth: 2,
    borderColor: colors.line,
    backgroundColor: colors.card,
  },
  controlButtonOn: {
    borderColor: colors.teal,
    backgroundColor: colors.tealSoft,
  },
  controlIcon: {
    fontSize: 24,
  },
  controlLabel: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '700',
  },
  controlState: {
    color: colors.tealDark,
    fontSize: 13,
    fontWeight: '900',
  },
  localOnly: {
    marginTop: 12,
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },
  primaryButton: {
    minHeight: 64,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderRadius: radius.button,
    backgroundColor: colors.tealDark,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '800',
    textAlign: 'center',
  },
  buttonDisabled: {
    backgroundColor: colors.muted,
  },
  completeCard: {
    alignItems: 'center',
    padding: 24,
    borderRadius: radius.card,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
  },
  completeIcon: {
    marginBottom: 8,
    fontSize: 54,
  },
  completeTitle: {
    color: colors.tealDark,
    fontSize: 26,
    fontWeight: '900',
    textAlign: 'center',
  },
  completeBody: {
    marginTop: 12,
    marginBottom: 20,
    color: colors.ink,
    fontSize: 17,
    lineHeight: 27,
    textAlign: 'center',
  },
  homeButton: {
    minHeight: TOUCH,
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginTop: 8,
  },
  homeButtonText: {
    color: colors.tealDark,
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.78,
  },
});
