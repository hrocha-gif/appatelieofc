import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  Animated,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { COLORS, FONTS } from '@/utils/constants';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  loadingText?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

export default function CustomButton({
  title,
  onPress,
  loading = false,
  loadingText = 'Carregando...',
  style,
  textStyle,
  disabled = false,
}: CustomButtonProps) {
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
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

  const buttonStyle = [
    styles.button,
    disabled && styles.buttonDisabled,
    style,
  ];

  const buttonTextStyle = [
    styles.buttonText,
    disabled && styles.buttonTextDisabled,
    textStyle,
  ];

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <TouchableOpacity
        style={buttonStyle}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={1}
      >
        {loading ? (
          <>
            <ActivityIndicator
              size="small"
              color={COLORS.white}
              style={styles.loader}
            />
            <Text style={buttonTextStyle}>{loadingText}</Text>
          </>
        ) : (
          <Text style={buttonTextStyle}>{title}</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 30,
    paddingVertical: 18,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  buttonDisabled: {
    backgroundColor: COLORS.gray,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: FONTS.bold,
  },
  buttonTextDisabled: {
    color: COLORS.lightGray,
  },
  loader: {
    marginRight: 10,
  },
});