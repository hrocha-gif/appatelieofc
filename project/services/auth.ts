import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  token: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  message?: string;
}

const API_BASE_URL = 'https://dummyjson.com';
const TOKEN_KEY = '@auth_token';
const USER_KEY = '@user_data';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Determine if input is email or username
      const isEmail = credentials.username.includes('@');
      
      // First try to find user in local storage
      let storedUser = null;
      
      if (isEmail) {
        // If it's an email, we need to search through all stored users
        const keys = await AsyncStorage.getAllKeys();
        const userKeys = keys.filter(key => key.startsWith('user_'));
        
        for (const key of userKeys) {
          const userData = await AsyncStorage.getItem(key);
          if (userData) {
            const user = JSON.parse(userData);
            if (user.email === credentials.username) {
              storedUser = userData;
              break;
            }
          }
        }
      } else {
        // If it's a username, search directly
        storedUser = await AsyncStorage.getItem(`user_${credentials.username}`);
      }
      
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        if (userData.password === credentials.password) {
          const token = `token_${Date.now()}`;
          const userWithToken = { ...userData, token };
          
          await AsyncStorage.setItem(TOKEN_KEY, token);
          await AsyncStorage.setItem(USER_KEY, JSON.stringify(userWithToken));
          
          return {
            success: true,
            user: userWithToken,
          };
        }
      }
      
      // Fallback to API for demo users
      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        });

        const data = await response.json();

        if (response.ok && data.token) {
          await AsyncStorage.setItem(TOKEN_KEY, data.token);
          await AsyncStorage.setItem(USER_KEY, JSON.stringify(data));
          
          return {
            success: true,
            user: data,
          };
        }
      } catch (apiError) {
        // API failed, continue to error below
      }
      
      return {
        success: false,
        message: 'E-mail/username ou senha incorretos',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erro na conexão. Tente novamente.',
      };
    }
  },

  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      // Simulate registration process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Store user data locally for demo purposes
      const newUser = {
        id: Date.now(),
        ...userData,
        image: 'https://via.placeholder.com/150',
        gender: 'other',
      };
      
      // Store in AsyncStorage for later login
      await AsyncStorage.setItem(`user_${userData.username}`, JSON.stringify(newUser));
      
      return {
        success: true,
        message: 'Cadastro realizado com sucesso! Faça login com suas credenciais.',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erro na conexão. Tente novamente.',
      };
    }
  },

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    try {
      // Simulate API call since DummyJSON doesn't have forgot password endpoint
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (email.includes('@')) {
        return {
          success: true,
          message: 'Password reset instructions have been sent to your email.',
        };
      } else {
        return {
          success: false,
          message: 'Please enter a valid email address.',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Network error. Please try again.',
      };
    }
  },

  async logout(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      return null;
    }
  },

  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      return null;
    }
  },

  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      return !!token;
    } catch (error) {
      return false;
    }
  },
};