import { useRef, useState } from 'react';
import {
    NativeScrollEvent,
    NativeSyntheticEvent,
    Pressable,
    ScrollView,
    ScrollViewInstance,
    ScrollViewProps,
    StyleSheet,
    View,
} from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import AppText from './Apptext';
import { colors, radius } from './theme';

/**
 * A ScrollView that always shows its scrollbar and, whenever there is more
 * content below, floats a big "Scroll down" button. It disappears at the bottom.
 */
export default function ScrollScreen({
  children,
  style,
  ...rest
}: Omit<ScrollViewProps, 'onScroll' | 'onLayout' | 'onContentSizeChange'>) {
  const { t } = useLanguage();
  const ref = useRef<ScrollViewInstance>(null);
  const [layoutH, setLayoutH] = useState(0);
  const [contentH, setContentH] = useState(0);
  const [offset, setOffset] = useState(0);

  const hasMore = layoutH > 0 && contentH - layoutH - offset > 24;

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setOffset(e.nativeEvent.contentOffset.y);
  };

  const scrollDown = () => {
    ref.current?.scrollTo({ y: offset + layoutH * 0.8, animated: true });
  };

  return (
    <View style={styles.wrap}>
      <ScrollView
        ref={ref}
        style={[styles.scroll, style]}
        showsVerticalScrollIndicator
        scrollEventThrottle={16}
        onScroll={handleScroll}
        onLayout={(e) => setLayoutH(e.nativeEvent.layout.height)}
        onContentSizeChange={(_, h) => setContentH(h)}
        {...rest}
      >
        {children}
      </ScrollView>

      {hasMore && (
        <View pointerEvents="box-none" style={styles.hintWrap}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('Scroll down to see more', 'مزید دیکھنے کے لیے نیچے جائیں')}
            onPress={scrollDown}
            style={({ pressed }) => [styles.hint, pressed && styles.pressed]}
          >
            <AppText style={styles.hintText}>
              {t('↓ Scroll down', '↓ نیچے دیکھیں')}
            </AppText>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  scroll: { flex: 1 },
  hintWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 16,
    alignItems: 'center',
  },
  hint: {
    minHeight: 52,
    justifyContent: 'center',
    paddingHorizontal: 24,
    borderRadius: radius.pill,
    backgroundColor: colors.tealDark,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  pressed: { opacity: 0.85 },
  hintText: { color: '#FFFFFF', fontSize: 18, fontWeight: '800' },
});