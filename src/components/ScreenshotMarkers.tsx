import { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { colors } from './theme';
import type { Box2D } from '../services/screenGuide';

type Props = {
  uri: string;
  /** Pixel size of the picture, used to keep the exact shape. */
  width: number;
  height: number;
  /** Boxes in Gemini format (0-1000), one per step. null = no marker for that step. */
  boxes: (Box2D | null)[];
  /** Index of the step being shown. */
  current: number;
};

const pct = (n: number) => `${n / 10}%` as const;

/**
 * Screenshot with a "spotlight" on the current step: everything else is dimmed,
 * the target gets a pulsing marigold frame and a numbered badge. Steps already
 * done keep a thin green outline so the user sees their progress.
 * Positions are percentages, so it works at any display size.
 */
export default function ScreenshotMarkers({ uri, width, height, boxes, current }: Props) {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const box = boxes[current] ?? null;
  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.04] });

  return (
    <View style={[styles.frame, { aspectRatio: width / height }]}>
      <Image source={{ uri }} style={StyleSheet.absoluteFill} resizeMode="contain" accessibilityIgnoresInvertColors />

      {/* Steps already done */}
      {boxes.slice(0, current).map(
        (b, i) =>
          b && (
            <View
              key={`done-${i}`}
              pointerEvents="none"
              style={[
                styles.done,
                { top: pct(b[0]), left: pct(b[1]), height: pct(b[2] - b[0]), width: pct(b[3] - b[1]) },
              ]}
            />
          )
      )}

      {box && (
        <>
          {/* Four dim rectangles around the target leave a bright "window" */}
          <View pointerEvents="none" style={[styles.dim, { top: 0, left: 0, right: 0, height: pct(box[0]) }]} />
          <View pointerEvents="none" style={[styles.dim, { top: pct(box[2]), left: 0, right: 0, bottom: 0 }]} />
          <View
            pointerEvents="none"
            style={[styles.dim, { top: pct(box[0]), height: pct(box[2] - box[0]), left: 0, width: pct(box[1]) }]}
          />
          <View
            pointerEvents="none"
            style={[styles.dim, { top: pct(box[0]), height: pct(box[2] - box[0]), left: pct(box[3]), right: 0 }]}
          />

          <Animated.View
            pointerEvents="none"
            style={[
              styles.target,
              {
                top: pct(box[0]),
                left: pct(box[1]),
                height: pct(box[2] - box[0]),
                width: pct(box[3] - box[1]),
                transform: [{ scale }],
              },
            ]}
          >
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{current + 1}</Text>
            </View>
          </Animated.View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    width: '100%',
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: colors.line,
    borderWidth: 2,
    borderColor: colors.line,
  },
  dim: { position: 'absolute', backgroundColor: 'rgba(8, 20, 30, 0.55)' },
  target: {
    position: 'absolute',
    borderWidth: 4,
    borderRadius: 10,
    borderColor: colors.marigold,
    backgroundColor: 'rgba(242, 169, 0, 0.12)',
  },
  done: {
    position: 'absolute',
    borderWidth: 2,
    borderRadius: 8,
    borderColor: colors.teal,
    opacity: 0.7,
  },
  badge: {
    position: 'absolute',
    top: 2,
    left: 2,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.marigold,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  badgeText: { color: colors.ink, fontSize: 17, fontWeight: '900' },
});
