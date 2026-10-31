import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useLanguage } from '../../context/LanguageContext';

export default function OnboardingScreen() {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const [step, setStep] = useState(1);

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.langBtn} 
          onPress={() => setLanguage(language === 'en' ? 'ur' : 'en')}
        >
          <Text style={styles.langText}>
            {language === 'en' ? 'Urdu (اردو)' : 'English'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {step === 1 ? (
          <View style={styles.card}>
            <Text style={styles.icon}>👋</Text>
            <Text style={styles.title}>
              {t('Welcome to Noor', 'نور میں خوش آمدید')}
            </Text>
            <Text style={styles.subtitle}>
              {t(
                'Learn and practice digital skills safely without fear of making mistakes.',
                'بغیر کسی ڈر کے ڈیجیٹل اسکلز کو آسانی سے سمجھیں اور پریکٹس کریں۔'
              )}
            </Text>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.icon}>🛡️</Text>
            <Text style={styles.title}>
              {t('Safe Environment', 'مکمل محفوظ ماحول')}
            </Text>
            <Text style={styles.subtitle}>
              {t(
                'Practice banking logins, video calls, forms, and spot scams with voice guidance.',
                'بینک لاگ ان، ویڈیو کالز، فارمز اور اسکیم میسجز کی پریکٹس وائس گائیڈنس کے ساتھ کریں۔'
              )}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.primaryBtn} onPress={handleNext}>
          <Text style={styles.btnText}>
            {step === 1 
              ? t('Next →', 'آگے بڑھیں ←') 
              : t('Start Learning 🎉', 'شروع کریں 🎉')
            }
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { padding: 16, alignItems: 'flex-end' },
  langBtn: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#E2E8F0', borderRadius: 20 },
  langText: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  card: { alignItems: 'center', backgroundColor: '#FFFFFF', padding: 32, borderRadius: 24, elevation: 2 },
  icon: { fontSize: 64, marginBottom: 16 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#0F172A', textAlign: 'center', marginBottom: 12 },
  subtitle: { fontSize: 18, color: '#475569', textAlign: 'center', lineHeight: 26 },
  footer: { padding: 24 },
  primaryBtn: { backgroundColor: '#2563EB', paddingVertical: 18, borderRadius: 16, alignItems: 'center' },
  btnText: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
});
