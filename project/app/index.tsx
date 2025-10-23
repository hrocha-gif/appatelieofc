import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  StatusBar,
  Dimensions,
  Platform,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { COLORS, FONTS, SIZES } from '@/utils/constants';

// Import the new image
const NewImage = require('../assets/images/pessoas-que-costuram-um-conceito-de-mascara.png');

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  
  // Animation refs
  const logoFadeAnim = useRef(new Animated.Value(0)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;
  const subtitleAnim = useRef(new Animated.Value(0)).current;
  const imageSlideAnim = useRef(new Animated.Value(50)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;
  const containerFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animations sequence
    startAnimations();
  }, []);

  const startAnimations = () => {
    // Container fade in first
    Animated.timing(containerFadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // Logo fade-in animation
      Animated.timing(logoFadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();

      // Title animation with delay
      setTimeout(() => {
        Animated.timing(titleAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
      }, 200);

      // Subtitle animation with additional delay
      setTimeout(() => {
        Animated.timing(subtitleAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
      }, 400);

      // Image slide-up animation
      setTimeout(() => {
        Animated.timing(imageSlideAnim, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }).start();
      }, 600);
    });
  };

  const handleButtonPress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    // Button scale animation
    Animated.sequence([
      Animated.timing(buttonScaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Navigate to login screen
      router.push('/login');
    });
  };

  return (
    <Animated.View 
      style={[
        styles.container,
        { opacity: containerFadeAnim }
      ]}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5DC" />
      
      {/* Background Pattern */}
      <View style={styles.backgroundPattern}>
      </View>

      {/* Main Image */}
      <Animated.View 
        style={[
          styles.mainImageContainer,
          {
            transform: [{ translateY: imageSlideAnim }],
            opacity: imageSlideAnim.interpolate({
              inputRange: [0, 50],
              outputRange: [1, 0],
            })
          }
        ]}
      >
        <Image
          source={NewImage}
          style={styles.mainImage}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Content Section */}
      <View style={styles.contentSection}>
        {/* Title */}
        <Animated.View
          style={[
            styles.titleContainer,
            {
              opacity: titleAnim,
              transform: [{
                translateY: titleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                })
              }]
            }
          ]}
        >
          <Text style={styles.title}>
            Encontre costureiras perto de você
          </Text>
        </Animated.View>

        {/* Subtitle */}
        <Animated.View
          style={[
            styles.subtitleContainer,
            {
              opacity: subtitleAnim,
              transform: [{
                translateY: subtitleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                })
              }]
            }
          ]}
        >
          <Text style={styles.subtitle}>
            Conecte-se com profissionais da costura para consertos, ajustes e serviços personalizados na sua região
          </Text>
        </Animated.View>

        {/* Primary Button */}
        <Animated.View
          style={[
            styles.buttonContainer,
            {
              opacity: subtitleAnim,
              transform: [
                { scale: buttonScaleAnim },
                {
                  translateY: subtitleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0],
                  })
                }
              ]
            }
          ]}
        >
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleButtonPress}
            activeOpacity={1}
          >
            <Text style={styles.buttonText}>COMEÇAR</Text>
            <Text style={styles.buttonIcon}>→</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Bottom Decoration */}
      <View style={styles.bottomDecoration}>
        <View style={styles.decorativeLine} />
        <Text style={styles.bottomText}>Sua costureira ideal está aqui</Text>
        <View style={styles.decorativeLine} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    opacity: 0.03,
    zIndex: -1,
  },
  patternText: {
    fontSize: 40,
    margin: 30,
    color: COLORS.primary,
  },
  logoSection: {
    alignItems: 'center',
    paddingTop: 60,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.primary,
    fontFamily: FONTS.bold,
    textAlign: 'center',
  },
  mainImageContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingTop: 40,
  },
  mainImage: {
    width: width * 0.9,
    height: height * 0.4,
  },
  contentSection: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  titleContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.dark,
    textAlign: 'center',
    fontFamily: FONTS.bold,
    lineHeight: 36,
  },
  subtitleContainer: {
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    fontFamily: FONTS.regular,
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 50,
    paddingVertical: 18,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
    minWidth: 200,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: FONTS.bold,
    marginRight: 10,
  },
  buttonIcon: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  bottomDecoration: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  decorativeLine: {
    height: 1,
    backgroundColor: COLORS.primary,
    flex: 1,
    opacity: 0.3,
  },
  bottomText: {
    fontSize: 14,
    color: COLORS.gray,
    fontFamily: FONTS.medium,
    marginHorizontal: 15,
    fontStyle: 'italic',
  },
});