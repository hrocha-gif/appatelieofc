import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const COLORS = {
  primary: '#FF6B35',
  secondary: '#FFA726',
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
  info: '#2196F3',
  
  dark: '#212121',
  gray: '#757575',
  lightGray: '#E0E0E0',
  white: '#FFFFFF',
  black: '#000000',
  background: '#F5F5F5',
  
  // Sewing theme colors
  cream: '#F5F5DC',
  beige: '#FFF8DC',
};

export const SIZES = {
  // Global sizes
  base: 8,
  font: 14,
  radius: 12,
  padding: 20,
  margin: 16,

  // Font sizes
  largeTitle: 50,
  h1: 30,
  h2: 22,
  h3: 20,
  h4: 18,
  body1: 30,
  body2: 20,
  body3: 16,
  body4: 14,

  // App dimensions
  width,
  height,
};

export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  black: 'System',
};

export default {
  COLORS,
  SIZES,
  FONTS,
};