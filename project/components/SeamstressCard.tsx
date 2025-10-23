import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Image,
} from 'react-native';
import { COLORS, FONTS, SIZES } from '@/utils/constants';

interface Seamstress {
  id: number;
  name: string;
  address: string;
  photo: any;
  rating: string;
  distance: string;
  services: string[];
  price: string;
}

interface SeamstressCardProps {
  seamstress: Seamstress;
  onPress: () => void;
}

export default function SeamstressCard({ seamstress, onPress }: SeamstressCardProps) {
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.98,
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
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        {/* Profile Image Placeholder */}
        <View style={styles.imageContainer}>
          <Image 
            source={seamstress.photo} 
            style={styles.profileImage}
            resizeMode="cover"
          />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.name} numberOfLines={1}>
              {seamstress.name}
            </Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.star}>⭐</Text>
              <Text style={styles.rating}>{seamstress.rating}</Text>
            </View>
          </View>

          <Text style={styles.address} numberOfLines={2}>
            {seamstress.address}
          </Text>

          <View style={styles.servicesContainer}>
            {seamstress.services.slice(0, 2).map((service, index) => (
              <View key={index} style={styles.serviceTag}>
                <Text style={styles.serviceText}>{service}</Text>
              </View>
            ))}
          </View>

          <View style={styles.footer}>
            <Text style={styles.price}>{seamstress.price}</Text>
            <View style={styles.distanceContainer}>
              <Text style={styles.distanceIcon}>📍</Text>
              <Text style={styles.distance}>{seamstress.distance}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
    fontFamily: FONTS.bold,
    flex: 1,
    marginRight: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    fontSize: 16,
    marginRight: 2,
  },
  rating: {
    fontSize: 14,
    color: COLORS.dark,
    fontFamily: FONTS.medium,
  },
  address: {
    fontSize: 14,
    color: COLORS.gray,
    fontFamily: FONTS.regular,
    marginBottom: 10,
    lineHeight: 18,
  },
  servicesContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  serviceTag: {
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  serviceText: {
    fontSize: 12,
    color: COLORS.primary,
    fontFamily: FONTS.medium,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    fontFamily: FONTS.bold,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  distance: {
    fontSize: 14,
    color: COLORS.gray,
    fontFamily: FONTS.medium,
  },
});