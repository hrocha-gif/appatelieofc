import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import * as Haptics from 'expo-haptics';
import { COLORS, FONTS, SIZES } from '@/utils/constants';
import { useAuth } from '@/contexts/AuthContext';
import CustomInput from '@/components/CustomInput';
import CustomButton from '@/components/CustomButton';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [emailOrUsernameError, setEmailOrUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const shakeInput = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
    
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const validateForm = () => {
    let isValid = true;
    
    // Reset errors
    setEmailOrUsernameError('');
    setPasswordError('');

    // Email/Username validation
    if (!emailOrUsername.trim()) {
      setEmailOrUsernameError('E-mail ou username é obrigatório');
      isValid = false;
    } else if (emailOrUsername.length < 3) {
      setEmailOrUsernameError('Digite pelo menos 3 caracteres');
      isValid = false;
    }

    // Password validation
    if (!password.trim()) {
      setPasswordError('Senha é obrigatória');
      isValid = false;
    } else if (password.length < 4) {
      setPasswordError('Senha deve ter pelo menos 4 caracteres');
      isValid = false;
    }

    if (!isValid) {
      shakeInput();
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Try to determine if it's an email or username
      const isEmail = emailOrUsername.includes('@');
      const credentials = isEmail 
        ? { username: emailOrUsername, password } // For email, we'll use it as username in the API
        : { username: emailOrUsername, password };

      const result = await login(credentials);
      
      if (result.success) {
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        
        Toast.show({
          type: 'success',
          text1: 'Sucesso!',
          text2: 'Login realizado com sucesso!',
        });
        
        router.replace('/welcome');
      } else {
        Toast.show({
          type: 'error',
          text1: 'Erro no Login',
          text2: result.message || 'Credenciais inválidas',
        });
        shakeInput();
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Falha na conexão. Tente novamente.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push('/forgot-password');
  };

  const handleSignUp = () => {
    router.push('/register');
  };

  const handleSocialLogin = (provider: 'google' | 'apple') => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    Toast.show({
      type: 'info',
      text1: 'Em breve!',
      text2: `Login com ${provider === 'google' ? 'Google' : 'Apple'} será implementado em breve.`,
    });
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        
        {/* Header with Logo */}
        <Animated.View 
          style={[
            styles.header,
            { 
              opacity: fadeAnim,
              transform: [{ 
                translateY: slideAnim.interpolate({
                  inputRange: [0, 50],
                  outputRange: [0, -50],
                })
              }]
            }
          ]}
        >
          <View style={styles.logoContainer}>
            <View style={styles.logoIcon}>
              <Text style={styles.logoIconText}>✂️</Text>
            </View>
            <Text style={styles.logoText}>AteliêPerto</Text>
          </View>
          <Text style={styles.welcomeTitle}>Bem-vindo!!</Text>
          <Text style={styles.welcomeSubtitle}>
            Faça login para continuar criando seus sonhos
          </Text>
        </Animated.View>

        {/* Form Card */}
        <Animated.View 
          style={[
            styles.formCard,
            { 
              opacity: fadeAnim,
              transform: [
                { translateX: shakeAnim },
                { 
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 50],
                    outputRange: [0, 50],
                  })
                }
              ]
            }
          ]}
        >
          <CustomInput
            label="E-mail"
            placeholder="Digite seu e-mail"
            value={emailOrUsername}
            onChangeText={(text) => {
              setEmailOrUsername(text);
              if (emailOrUsernameError) setEmailOrUsernameError('');
            }}
            error={emailOrUsernameError}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <CustomInput
            label="Senha"
            placeholder="Digite sua senha"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (passwordError) setPasswordError('');
            }}
            error={passwordError}
            secureTextEntry
          />

          <CustomButton
            title="Entrar"
            onPress={handleLogin}
            loading={isLoading}
            loadingText="Entrando..."
            style={styles.loginButton}
          />

          <TouchableOpacity style={styles.forgotPassword} onPress={handleForgotPassword}>
            <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OU CONTINUE COM</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Login Buttons */}
          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity 
              style={styles.socialButton}
              onPress={() => handleSocialLogin('google')}
            >
              <Text style={styles.socialButtonIcon}>G</Text>
              <Text style={styles.socialButtonText}>Google</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.socialButton}
              onPress={() => handleSocialLogin('apple')}
            >
              <Text style={styles.socialButtonIcon}>🍎</Text>
              <Text style={styles.socialButtonText}>Apple</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Não tem uma conta? </Text>
            <TouchableOpacity onPress={handleSignUp}>
              <Text style={styles.signUpLink}>Criar Conta</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Background Decoration */}
        <View style={styles.backgroundDecoration}>
          <View style={styles.decorativeCircle1} />
          <View style={styles.decorativeCircle2} />
          <View style={styles.decorativeCircle3} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: SIZES.padding,
    paddingTop: 40,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  logoIconText: {
    fontSize: 32,
    color: COLORS.white,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    fontFamily: FONTS.bold,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.dark,
    textAlign: 'center',
    marginBottom: 15,
    fontFamily: FONTS.bold,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    fontFamily: FONTS.regular,
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  formCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    paddingHorizontal: 30,
    paddingVertical: 30,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    marginTop: -20,
  },
  loginButton: {
    marginTop: 10,
    paddingVertical: 18,
    borderRadius: 16,
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  forgotPasswordText: {
    color: COLORS.gray,
    fontSize: 16,
    fontFamily: FONTS.medium,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.lightGray,
  },
  dividerText: {
    color: COLORS.gray,
    fontSize: 12,
    fontFamily: FONTS.medium,
    marginHorizontal: 15,
    letterSpacing: 0.5,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.lightGray,
    borderRadius: 16,
    paddingVertical: 15,
    marginHorizontal: 5,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  socialButtonIcon: {
    fontSize: 18,
    marginRight: 8,
    fontWeight: 'bold',
  },
  socialButtonText: {
    fontSize: 16,
    color: COLORS.dark,
    fontFamily: FONTS.medium,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    color: COLORS.gray,
    fontSize: 16,
    fontFamily: FONTS.regular,
  },
  signUpLink: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: FONTS.bold,
  },
  backgroundDecoration: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  decorativeCircle1: {
    position: 'absolute',
    top: 100,
    right: -50,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primary,
    opacity: 0.05,
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: 200,
    left: -30,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.secondary,
    opacity: 0.08,
  },
  decorativeCircle3: {
    position: 'absolute',
    top: 300,
    left: width * 0.7,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    opacity: 0.06,
  },
});