import React, { useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { COLORS } from '@/utils/constants';

export default function LoadingSkeleton() {
  const shimmerValue = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmerAnimation = () => {
      Animated.sequence([
        Animated.timing(shimmerValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => shimmerAnimation());
    };

    shimmerAnimation();
  }, []);

  const opacity = shimmerValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const renderSkeletonCard = (key: number) => (
    <Animated.View
      key={key}
      style={[styles.card, { opacity }]}
    >
      <View style={styles.avatar} />
      <View style={styles.content}>
        <View style={styles.namePlaceholder} />
        <View style={styles.addressPlaceholder} />
        <View style={styles.servicesPlaceholder}>
          <View style={styles.serviceTag} />
          <View style={styles.serviceTag} />
        </View>
        <View style={styles.footer}>
          <View style={styles.pricePlaceholder} />
          <View style={styles.distancePlaceholder} />
        </View>
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {[1, 2, 3].map(renderSkeletonCard)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.lightGray,
    marginRight: 15,
  },
  content: {
    flex: 1,
  },
  namePlaceholder: {
    height: 20,
    backgroundColor: COLORS.lightGray,
    borderRadius: 4,
    marginBottom: 8,
    width: '60%',
  },
  addressPlaceholder: {
    height: 16,
    backgroundColor: COLORS.lightGray,
    borderRadius: 4,
    marginBottom: 10,
    width: '80%',
  },
  servicesPlaceholder: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  serviceTag: {
    height: 20,
    width: 60,
    backgroundColor: COLORS.lightGray,
    borderRadius: 10,
    marginRight: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pricePlaceholder: {
    height: 18,
    width: 80,
    backgroundColor: COLORS.lightGray,
    borderRadius: 4,
  },
  distancePlaceholder: {
    height: 16,
    width: 50,
    backgroundColor: COLORS.lightGray,
    borderRadius: 4,
  },
});