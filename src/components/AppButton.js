import React from 'react';
import {ActivityIndicator, Pressable, StyleSheet, Text} from 'react-native';
import {colors} from '../theme';

export default function AppButton({title, onPress, loading, variant = 'primary', disabled, style}) {
  const secondary = variant === 'secondary';
  return <Pressable accessibilityRole="button" disabled={disabled || loading} onPress={onPress} style={({pressed}) => [styles.button, secondary && styles.secondary, (pressed || disabled) && styles.dim, style]}>
    {loading ? <ActivityIndicator color={secondary ? colors.primary : '#FFF'} /> : <Text style={[styles.text, secondary && styles.secondaryText]}>{title}</Text>}
  </Pressable>;
}
const styles = StyleSheet.create({button: {height: 52, borderRadius: 14, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center'}, secondary: {backgroundColor: colors.tint}, dim: {opacity: .65}, text: {color: '#FFF', fontWeight: '700', fontSize: 16}, secondaryText: {color: colors.primary}});
