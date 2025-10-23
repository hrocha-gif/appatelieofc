import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  Animated,
  Platform,
  TouchableOpacity,
  Image,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { COLORS, FONTS } from '@/utils/constants';

interface CustomInputProps extends TextInputProps {
  label: string;
  error?: string;
}

export default function CustomInput({ 
  label, 
  error, 
  style, 
  secureTextEntry,
  ...props 
}: CustomInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const focusAnim = React.useRef(new Animated.Value(0)).current;
  const errorAnim = React.useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    Animated.timing(focusAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(focusAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
  };
  React.useEffect(() => {
    if (error) {
      Animated.sequence([
        Animated.timing(errorAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.timing(errorAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [error]);

  const borderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [error ? COLORS.error : '#E5E7EB', COLORS.primary],
  });

  const labelColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.gray, COLORS.primary],
  });

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.label, { color: error ? COLORS.error : labelColor }]}>
        {label}
      </Animated.Text>
      <Animated.View style={[styles.inputContainer, { borderColor }]}>
        <TextInput
          {...props}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          style={[styles.input, style]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={COLORS.gray}
        />
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={togglePasswordVisibility}
          >
            <Image
              source={isPasswordVisible ? require('../assets/images/olho-aberto.png') : require('../assets/images/olho-vermelho.png')}
              style={styles.eyeIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </Animated.View>
      {error && (
        <Animated.View style={[styles.errorContainer, { opacity: errorAnim }]}>
          <Text style={styles.error}>{error}</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    fontFamily: FONTS.medium,
  },
  inputContainer: {
    borderWidth: 1.5,
    borderRadius: 16,
    paddingHorizontal: 15,
    backgroundColor: '#F9FAFB',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  input: {
    height: 56,
    fontSize: 16,
    color: COLORS.dark,
    fontFamily: FONTS.regular,
    flex: 1,
  },
  eyeButton: {
    padding: 5,
    marginLeft: 10,
  },
  eyeIcon: {
    width: 20,
    height: 20,
    tintColor: COLORS.gray,
  },
  errorContainer: {
    marginTop: 5,
  },
  error: {
    fontSize: 14,
    color: COLORS.error,
    fontFamily: FONTS.regular,
    marginLeft: 4,
  },
});