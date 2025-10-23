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
import { validateEmail, validatePassword, validateName } from '@/utils/validation';
import CustomInput from '@/components/CustomInput';
import CustomButton from '@/components/CustomButton';

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

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

  const validateForm = () => {
    let isValid = true;
    
    // Reset errors
    setFirstNameError('');
    setLastNameError('');
    setUsernameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    // First name validation
    if (!firstName.trim()) {
      setFirstNameError('Nome é obrigatório');
      isValid = false;
    } else if (!validateName(firstName)) {
      setFirstNameError('Nome deve ter pelo menos 2 caracteres');
      isValid = false;
    }

    // Last name validation
    if (!lastName.trim()) {
      setLastNameError('Sobrenome é obrigatório');
      isValid = false;
    } else if (!validateName(lastName)) {
      setLastNameError('Sobrenome deve ter pelo menos 2 caracteres');
      isValid = false;
    }

    // Username validation
    if (!username.trim()) {
      setUsernameError('Username é obrigatório');
      isValid = false;
    } else if (username.length < 3) {
      setUsernameError('Username deve ter pelo menos 3 caracteres');
      isValid = false;
    }

    // Email validation
    if (!email.trim()) {
      setEmailError('E-mail é obrigatório');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Digite um e-mail válido');
      isValid = false;
    }

    // Password validation
    if (!password.trim()) {
      setPasswordError('Senha é obrigatória');
      isValid = false;
    } else if (!validatePassword(password)) {
      setPasswordError('Senha deve ter pelo menos 6 caracteres');
      isValid = false;
    }

    // Confirm password validation
    if (!confirmPassword.trim()) {
      setConfirmPasswordError('Confirmação de senha é obrigatória');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Senhas não coincidem');
      isValid = false;
    }

    if (!isValid) {
      shakeInput();
    }

    return isValid;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const result = await register({
        firstName,
        lastName,
        username,
        email,
        password,
      });
      
      if (result.success) {
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        
        Toast.show({
          type: 'success',
          text1: 'Sucesso!',
          text2: result.message || 'Conta criada com sucesso!',
        });
        
        // Navigate back to login after successful registration
        setTimeout(() => {
          router.replace('/login');
        }, 2000);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Erro no Cadastro',
          text2: result.message || 'Falha ao criar conta',
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
          <TouchableOpacity style={styles.backButton} onPress={handleBackToLogin}>
            <Text style={styles.backButtonText}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Criar Conta</Text>
          <Text style={styles.headerSubtitle}>✂️ 🪡</Text>
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
          <Text style={styles.formTitle}>Cadastre-se no AteliêPerto</Text>
          
          <View style={styles.nameRow}>
            <View style={styles.nameInput}>
              <CustomInput
                label="Nome"
                placeholder="Seu nome"
                value={firstName}
                onChangeText={(text) => {
                  setFirstName(text);
                  if (firstNameError) setFirstNameError('');
                }}
                error={firstNameError}
                autoCapitalize="words"
              />
            </View>
            <View style={styles.nameInput}>
              <CustomInput
                label="Sobrenome"
                placeholder="Seu sobrenome"
                value={lastName}
                onChangeText={(text) => {
                  setLastName(text);
                  if (lastNameError) setLastNameError('');
                }}
                error={lastNameError}
                autoCapitalize="words"
              />
            </View>
          </View>

          <CustomInput
            label="Username"
            placeholder="Escolha um username"
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              if (usernameError) setUsernameError('');
            }}
            error={usernameError}
            autoCapitalize="none"
          />

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


          <CustomInput
            label="Senha"
            placeholder="Crie uma senha"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (passwordError) setPasswordError('');
            }}
            error={passwordError}
            secureTextEntry
          />

          <CustomInput
            label="Confirmar Senha"
            placeholder="Confirme sua senha"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              if (confirmPasswordError) setConfirmPasswordError('');
            }}
            error={confirmPasswordError}
            secureTextEntry
          />

          <CustomButton
            title="CRIAR CONTA"
            onPress={handleRegister}
            loading={isLoading}
            loadingText="Criando conta..."
            style={styles.registerButton}
          />

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Já tem conta? </Text>
            <TouchableOpacity onPress={handleBackToLogin}>
              <Text style={styles.loginLink}>Faça login</Text>
            </TouchableOpacity>
          </View>
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
  backButton: {
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
    fontSize: 20,
    marginTop: 5,
  },
  formCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingHorizontal: 25,
    paddingVertical: 30,
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
    marginBottom: 30,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.dark,
    textAlign: 'center',
    marginBottom: 25,
    fontFamily: FONTS.bold,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nameInput: {
    flex: 1,
    marginHorizontal: 5,
  },
  registerButton: {
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