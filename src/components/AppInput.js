import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import {Ionicons} from '@react-native-vector-icons/ionicons/static';
import {colors} from '../theme';

export default function AppInput({label, error, showPasswordToggle, ...props}) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  return <View style={styles.wrap}>{label ? <Text style={styles.label}>{label}</Text> : null}<View><TextInput placeholderTextColor="#A0A3B3" style={[styles.input, showPasswordToggle && styles.passwordInput, error && styles.invalid]} {...props} secureTextEntry={showPasswordToggle ? !passwordVisible : props.secureTextEntry} />{showPasswordToggle ? <Pressable accessibilityRole="button" accessibilityLabel={passwordVisible ? 'Hide password' : 'Show password'} hitSlop={10} onPress={() => setPasswordVisible(value => !value)} style={styles.eyeButton}><Ionicons name={passwordVisible ? 'eye-off-outline' : 'eye-outline'} size={22} color={colors.muted}/></Pressable> : null}</View>{error ? <Text style={styles.error}>{error}</Text> : null}</View>;
}
const styles = StyleSheet.create({wrap: {marginBottom: 16}, label: {fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 7}, input: {height: 52, borderWidth: 1, borderColor: colors.border, borderRadius: 14, paddingHorizontal: 16, color: colors.text, backgroundColor: colors.surface, fontSize: 16}, passwordInput: {paddingRight: 52}, eyeButton: {position: 'absolute', right: 0, top: 0, width: 52, height: 52, alignItems: 'center', justifyContent: 'center'}, invalid: {borderColor: colors.danger}, error: {color: colors.danger, marginTop: 5, fontSize: 12}});
