import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useLanguage } from '../../context/LanguageContext';

export default function ScamScreen() {
  const { t } = useLanguage();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{t('🛡️ Scam Shield', '🛡️ اسکیم شیلڈ')}</Text>
        <Text style={styles.subtitle}>
          {t('Upload a screenshot or paste a message to verify if it is safe.', 'کسی بھی مشکوک میسج یا اسکرین شاٹ کو چیک کرنے کے لیے اپ لوڈ کریں۔')}
        </Text>

        <TouchableOpacity style={styles.uploadBtn}>
          <Text style={styles.uploadText}>{t('+ Upload Screenshot / Message', '+ اسکرین شاٹ / میسج اپ لوڈ کریں')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#0F172A', marginBottom: 12 },
  subtitle: { fontSize: 16, color: '#64748B', textAlign: 'center', marginBottom: 24, lineHeight: 24 },
  uploadBtn: { backgroundColor: '#2563EB', paddingHorizontal: 24, paddingVertical: 16, borderRadius: 14 },
  uploadText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});
