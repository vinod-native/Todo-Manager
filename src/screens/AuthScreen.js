import React, {useEffect, useState} from 'react';
import {KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import AppButton from '../components/AppButton';
import AppInput from '../components/AppInput';
import {clearAuthError, login, register} from '../store/authSlice';
import {colors} from '../theme';
import {validateEmail, validatePassword} from '../utils/validation';

export default function AuthScreen() {
  const dispatch = useDispatch(); const {loading, error: serverError} = useSelector(s => s.auth);
  const [mode, setMode] = useState('login'); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [errors, setErrors] = useState({});
  useEffect(() => () => dispatch(clearAuthError()), [dispatch]);
  const submit = () => {
    const next = {email: validateEmail(email), password: validatePassword(password)}; setErrors(next);
    if (next.email || next.password) return;
    dispatch(mode === 'login' ? login({email, password}) : register({email, password}));
  };
  const switchMode = () => { setMode(mode === 'login' ? 'register' : 'login'); setErrors({}); dispatch(clearAuthError()); };
  return <KeyboardAvoidingView style={styles.page} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
    <View style={styles.logo}><Text style={styles.logoText}>✓</Text></View><Text style={styles.title}>Todo Manager</Text><Text style={styles.subtitle}>{mode === 'login' ? 'Welcome back. Your plans are waiting.' : 'Create an account and start organizing.'}</Text>
    <View style={styles.card}><AppInput label="Email" value={email} onChangeText={setEmail} error={errors.email} autoCapitalize="none" keyboardType="email-address" autoComplete="email" editable={!loading}/><AppInput label="Password" value={password} onChangeText={setPassword} error={errors.password} showPasswordToggle autoComplete={mode === 'login' ? 'current-password' : 'new-password'} editable={!loading}/>{serverError ? <Text style={styles.serverError}>{serverError}</Text> : null}<AppButton title={mode === 'login' ? 'Sign in' : 'Create account'} onPress={submit} loading={loading}/><AppButton style={styles.switch} variant="secondary" title={mode === 'login' ? 'Create a new account' : 'I already have an account'} onPress={switchMode} disabled={loading}/></View>
  </ScrollView></KeyboardAvoidingView>;
}
const styles = StyleSheet.create({page: {flex: 1, backgroundColor: colors.background}, content: {flexGrow: 1, justifyContent: 'center', padding: 24}, logo: {width: 64, height: 64, borderRadius: 20, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary}, logoText: {color: '#FFF', fontSize: 34, fontWeight: '800'}, title: {fontSize: 30, fontWeight: '800', color: colors.text, textAlign: 'center', marginTop: 18}, subtitle: {color: colors.muted, textAlign: 'center', marginTop: 8, marginBottom: 28}, card: {backgroundColor: colors.surface, borderRadius: 22, padding: 20}, serverError: {color: colors.danger, backgroundColor: '#FFF0F1', padding: 12, borderRadius: 10, marginBottom: 16}, switch: {marginTop: 12}});
