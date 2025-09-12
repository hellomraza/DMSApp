import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { scale, spacing } from '../../utils/scale';

interface SkeletonItemProps {
  animated: Animated.Value;
}

const SkeletonItem: React.FC<SkeletonItemProps> = ({ animated }) => {
  const animatedStyle = {
    opacity: animated.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.3, 0.7, 0.3],
    }),
  };

  return (
    <Animated.View style={[styles.skeletonCard, animatedStyle]}>
      {/* Image skeleton */}
      <View style={styles.skeletonImage} />

      {/* Content skeleton */}
      <View style={styles.skeletonContent}>
        <View style={styles.skeletonTitle} />
        <View style={styles.skeletonSubtitle} />
        <View style={styles.skeletonDate} />
        <View style={styles.skeletonTags}>
          <View style={styles.skeletonTag} />
          <View style={styles.skeletonTag} />
        </View>
      </View>
    </Animated.View>
  );
};

const DocumentListSkeleton: React.FC = () => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimation = () => {
      Animated.loop(
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ).start();
    };

    startAnimation();
  }, [animatedValue]);

  // Create skeleton items in 2-column layout
  const renderSkeletonRow = (index: number) => (
    <View key={index} style={styles.skeletonRow}>
      <SkeletonItem animated={animatedValue} />
      <SkeletonItem animated={animatedValue} />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerSkeleton}>
        <View style={styles.skeletonHeaderTitle} />
        <View style={styles.skeletonHeaderButton} />
      </View>

      {/* Generate 3 rows (6 skeleton items total) */}
      {Array.from({ length: 3 }, (_, index) => renderSkeletonRow(index))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.sm,
  },
  headerSkeleton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  skeletonHeaderTitle: {
    width: scale(120),
    height: scale(20),
    backgroundColor: '#E1E9EE',
    borderRadius: scale(4),
  },
  skeletonHeaderButton: {
    width: scale(80),
    height: scale(32),
    backgroundColor: '#E1E9EE',
    borderRadius: scale(6),
  },
  skeletonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  skeletonCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: scale(12),
    padding: spacing.sm,
    marginHorizontal: spacing.xs,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: scale(2),
    },
    shadowOpacity: 0.1,
    shadowRadius: scale(4),
    elevation: 3,
  },
  skeletonImage: {
    width: '100%',
    height: scale(80),
    backgroundColor: '#E1E9EE',
    borderRadius: scale(8),
    marginBottom: spacing.sm,
  },
  skeletonContent: {
    flex: 1,
  },
  skeletonTitle: {
    width: '80%',
    height: scale(16),
    backgroundColor: '#E1E9EE',
    borderRadius: scale(4),
    marginBottom: spacing.xs,
  },
  skeletonSubtitle: {
    width: '60%',
    height: scale(14),
    backgroundColor: '#E1E9EE',
    borderRadius: scale(4),
    marginBottom: spacing.xs,
  },
  skeletonDate: {
    width: '50%',
    height: scale(12),
    backgroundColor: '#E1E9EE',
    borderRadius: scale(4),
    marginBottom: spacing.sm,
  },
  skeletonTags: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  skeletonTag: {
    width: scale(40),
    height: scale(20),
    backgroundColor: '#E1E9EE',
    borderRadius: scale(10),
  },
});

export default DocumentListSkeleton;
