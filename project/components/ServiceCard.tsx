import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { COLORS, FONTS } from '@/utils/constants';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2; // 60 = padding + gap

interface ServiceCardProps {
  title: string;
  icon: string;
  color: string;
  onPress: () => void;
}

export default function ServiceCard({ title, icon, color, onPress }: ServiceCardProps) {
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[
      styles.container,
      { transform: [{ scale: scaleValue }] }
    ]}>
      <TouchableOpacity
        style={[styles.card, { backgroundColor: color }]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    marginBottom: 15,
    marginHorizontal: 5,
  },
  card: {
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  icon: {
    fontSize: 32,
    marginBottom: 8,
  },
  title: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: FONTS.bold,
    lineHeight: 18,
  },
});