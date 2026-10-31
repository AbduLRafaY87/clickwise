import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../../context/LanguageContext';

const SLIDE_COUNT = 2;

export default function OnboardingScreen() {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const [step, setStep] = useState(1);
  const isUrdu = language === 'ur';

  const handlePrimaryAction = () => {
    if (step === 1) {
      setStep(2);
      return;
    }

    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.screenContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={t(
              'Switch language to Urdu',
              'زبان کو انگریزی میں تبدیل کریں'
            )}
            accessibilityHint={t(
              'Changes the app language to Urdu.',
              'ایپ کی زبان انگریزی میں تبدیل ہو جائے گی۔'
            )}
            onPress={() => setLanguage(isUrdu ? 'en' : 'ur')}
            style={styles.languageButton}
          >
            <Text style={styles.languageButtonText}>
              {isUrdu ? 'English' : 'Urdu (اردو)'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.card}>
            <Text
              accessible={false}
              style={styles.icon}
            >
              {step === 1 ? '👋' : '🛡️'}
            </Text>
            <Text
              accessibilityRole="header"
              style={[styles.title, isUrdu && styles.urduText]}
            >
              {step === 1
                ? t('Welcome to ClickWise', 'کلک وائز میں خوش آمدید')
                : t('100% Safe Environment', 'مکمل محفوظ ماحول')}
            </Text>
            <Text
              style={[styles.subtitle, isUrdu && styles.urduText]}
            >
              {step === 1
                ? t(
                    'Learn and practice digital skills safely without fear of making mistakes.',
                    'بغیر کسی ڈر کے ڈیجیٹل اسکلز کو آسانی سے سمجھیں اور پریکٹس کریں۔'
                  )
                : t(
                    'Practice banking logins, video calls, forms, and spot scams with voice guidance.',
                    'بینک لاگ ان، ویڈیو کالز، فارمز اور اسکیم میسجز کی پریکٹس وائس گائیڈنس کے ساتھ کریں۔'
                  )}
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            accessibilityRole="button"
            onPress={handlePrimaryAction}
            style={[
              styles.primaryButton,
              step === 2 && styles.startButton,
            ]}
          >
            <Text
              style={[
                styles.primaryButtonText,
                isUrdu && styles.urduText,
              ]}
            >
              {step === 1
                ? t('Next →', 'آگے بڑھیں ←')
                : t('Start Learning 🎉', 'شروع کریں 🎉')}
            </Text>
          </TouchableOpacity>

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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  screenContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  header: {
    minHeight: 72,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  languageButton: {
    minHeight: 56,
    justifyContent: 'center',
    paddingHorizontal: 18,
    borderRadius: 16,
    backgroundColor: '#E2E8F0',
  },
  languageButtonText: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '700',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 24,
  },
  card: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    elevation: 3,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  icon: {
    marginBottom: 20,
    fontSize: 76,
    lineHeight: 96,
  },
  title: {
    marginBottom: 16,
    color: '#0F172A',
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 40,
    textAlign: 'center',
  },
  subtitle: {
    color: '#334155',
    fontSize: 20,
    lineHeight: 30,
    textAlign: 'center',
  },
  urduText: {
    writingDirection: 'rtl',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 16,
  },
  primaryButton: {
    width: '100%',
    minHeight: 64,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderRadius: 18,
    backgroundColor: '#004F9F',
  },
  startButton: {
    backgroundColor: '#005A32',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    minHeight: 48,
    marginTop: 12,
  },
  paginationDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#64748B',
  },
  activePaginationDot: {
    width: 32,
    backgroundColor: '#004F9F',
  },
});
