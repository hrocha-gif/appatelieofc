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
} from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import * as Haptics from 'expo-haptics';
import { COLORS, FONTS, SIZES } from '@/utils/constants';
import { useAuth } from '@/contexts/AuthContext';
import { validateEmail } from '@/utils/validation';
import CustomInput from '@/components/CustomInput';
import CustomButton from '@/components/CustomButton';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { forgotPassword } = useAuth();
  
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const successAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
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

  const showSuccessAnimation = () => {
    Animated.spring(successAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const validateForm = () => {
    setEmailError('');

    if (!email.trim()) {
      setEmailError('E-mail é obrigatório');
      return false;
    } else if (!validateEmail(email)) {
      setEmailError('Digite um e-mail válido');
      return false;
    }

    return true;
  };

  const handleForgotPassword = async () => {
    if (!validateForm()) {
      shakeInput();
      return;
    }

    setIsLoading(true);

    try {
      const result = await forgotPassword(email);
      
      if (result.success) {
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        
        setIsSuccess(true);
        showSuccessAnimation();
        
        Toast.show({
          type: 'success',
          text1: 'E-mail Enviado!',
          text2: result.message,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Erro',
          text2: result.message,
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

  const handleBackToLogin = () => {
    router.back();
  };

  if (isSuccess) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
        <Animated.View 
          style={[
            styles.successContainer,
            {
              opacity: successAnim,
              transform: [{
                scale: successAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                })
              }]
            }
          ]}
        >
          <Text style={styles.successIcon}>📧</Text>
          <Text style={styles.successTitle}>E-mail Enviado!</Text>
          <Text style={styles.successMessage}>
            Enviamos instruções para recuperação de senha para o seu e-mail.
            Verifique sua caixa de entrada e spam.
          </Text>
          
          <CustomButton
            title="VOLTAR AO LOGIN"
            onPress={handleBackToLogin}
            style={styles.backButton}
          />
        </Animated.View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        {/* Header */}
        <Animated.View 
          style={[
            styles.header,
            { 
              opacity: fadeAnim,
              transform: [{ 
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-50, 0],
                })
              }]
            }
          ]}
        >
          <TouchableOpacity style={styles.backButtonHeader} onPress={handleBackToLogin}>
            <Text style={styles.backButtonText}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Recuperar Senha</Text>
          <Text style={styles.headerSubtitle}>🔐</Text>
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
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  })
                }
              ]
            }
          ]}
        >
          <Text style={styles.formTitle}>Esqueceu sua senha?</Text>
          <Text style={styles.formDescription}>
            Digite seu e-mail e enviaremos instruções para recuperar sua senha.
          </Text>
          
          <CustomInput
            label="E-mail"
            placeholder="Digite seu e-mail"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (emailError) setEmailError('');
            }}
            error={emailError}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <CustomButton
            title="ENVIAR INSTRUÇÕES"
            onPress={handleForgotPassword}
            loading={isLoading}
            loadingText="Enviando..."
            style={styles.sendButton}
          />

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Lembrou da senha? </Text>
            <TouchableOpacity onPress={handleBackToLogin}>
              <Text style={styles.loginLink}>Faça login</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Info Card */}
        <Animated.View 
          style={[
            styles.infoCard,
            { opacity: fadeAnim }
          ]}
        >
          <Text style={styles.infoIcon}>💡</Text>
          <Text style={styles.infoTitle}>Dica de Segurança</Text>
          <Text style={styles.infoText}>
            Verifique sua caixa de spam se não receber o e-mail em alguns minutos.
            O link de recuperação expira em 24 horas.
          </Text>
        </Animated.View>

        {/* Background Pattern */}
        <View style={styles.backgroundPattern}>
          <Text style={styles.patternText}>🧵</Text>
          <Text style={styles.patternText}>✂️</Text>
          <Text style={styles.patternText}>🪡</Text>
          <Text style={styles.patternText}>🧵</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: SIZES.padding,
    paddingTop: 50,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  backButtonHeader: {
    alignSelf: 'flex-start',
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: COLORS.lightGray,
    borderRadius: 20,
  },
  backButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontFamily: FONTS.medium,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    fontFamily: FONTS.bold,
  },
  headerSubtitle: {
    fontSize: 24,
    marginTop: 5,
  },
  formCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingHorizontal: 30,
    paddingVertical: 35,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    marginBottom: 10,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.dark,
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: FONTS.bold,
  },
  formDescription: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: FONTS.regular,
    lineHeight: 22,
  },
  sendButton: {
    marginTop: 20,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },
  loginText: {
    color: COLORS.gray,
    fontSize: 16,
    fontFamily: FONTS.regular,
  },
  loginLink: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: FONTS.bold,
  },
  infoCard: {
    backgroundColor: '#FFF8DC',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  infoIcon: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 10,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: FONTS.bold,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
    fontFamily: FONTS.regular,
    lineHeight: 20,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
  },
  successIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 15,
    fontFamily: FONTS.bold,
  },
  successMessage: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: 40,
    fontFamily: FONTS.regular,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  backButton: {
    marginTop: 20,
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    opacity: 0.05,
    zIndex: -1,
  },
  patternText: {
    fontSize: 30,
    margin: 20,
    color: COLORS.primary,
  },
});