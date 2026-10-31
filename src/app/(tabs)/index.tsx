import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useLanguage } from '../../context/LanguageContext';

export default function DashboardScreen() {
  const { t } = useLanguage();

  const scenarios = [
    { id: 'banking', title: t('🏦 Banking Practice', '🏦 بینکنگ پریکٹس'), desc: t('Understand sessions & OTPs safely', 'سیشن ٹائم آؤٹ اور او ٹی پی سمجھیں') },
    { id: 'video', title: t('📹 Video Call Check', '📹 ویڈیو کال چیک'), desc: t('Test mic & camera settings', 'مائیک اور کیمرہ پرمیشن چیک کریں') },
    { id: 'gov', title: t('📝 Gov Form Guide', '📝 سرکاری فارم گائیڈ'), desc: t('Step-by-step form helper', 'آسان زبان میں فارمز پر کریں۔') },
    { id: 'scam', title: t('🛡️ Scam Inspector', '🛡️ اسکیم انسپیکٹر'), desc: t('Scan suspicious messages & links', 'مشکوک میسجز اور لنکس چیک کریں') },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.headerTitle}>{t('Choose a Lesson', 'سبق منتخب کریں')}</Text>
        <Text style={styles.headerSub}>{t('Select any module to start practicing safely', 'محفوظ طریقے سے پریکٹس شروع کرنے کے لیے منتخب کریں')}</Text>

        <View style={styles.grid}>
          {scenarios.map((item) => (
            <TouchableOpacity key={item.id} style={styles.card} activeOpacity={0.8}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDesc}>{item.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F5F9' },
  scroll: { padding: 20 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#0F172A', marginTop: 10 },
  headerSub: { fontSize: 16, color: '#64748B', marginBottom: 20, marginTop: 4 },
  grid: { gap: 16 },
  card: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 18, borderWidth: 1, borderColor: '#E2E8F0' },
  cardTitle: { fontSize: 20, fontWeight: 'bold', color: '#1E293B', marginBottom: 6 },
  cardDesc: { fontSize: 15, color: '#64748B', lineHeight: 22 },
});
