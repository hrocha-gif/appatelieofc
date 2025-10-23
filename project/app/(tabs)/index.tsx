import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '@/utils/constants';

export default function TabIndex() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tab Index Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  text: {
    fontSize: 18,
    color: COLORS.dark,
    fontFamily: FONTS.regular,
  },
});