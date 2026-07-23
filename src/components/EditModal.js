import React, {useEffect, useState} from 'react';
import {KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, View} from 'react-native';
import AppButton from './AppButton'; import AppInput from './AppInput'; import {colors} from '../theme'; import {required} from '../utils/validation';
export default function EditModal({visible, title, initialValue = '', label, onCancel, onSave}) {
  const [value, setValue] = useState(initialValue); const [error, setError] = useState('');
  useEffect(() => { if (visible) { setValue(initialValue); setError(''); } }, [visible, initialValue]);
  const save = () => { const message = required(value, label); setError(message); if (!message) onSave(value.trim()); };
  return <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}><KeyboardAvoidingView style={styles.overlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><Pressable style={StyleSheet.absoluteFill} onPress={onCancel}/><View style={styles.card}><Text style={styles.title}>{title}</Text><AppInput autoFocus label={label} value={value} onChangeText={setValue} error={error} maxLength={80} returnKeyType="done" onSubmitEditing={save}/><View style={styles.actions}><AppButton style={styles.button} variant="secondary" title="Cancel" onPress={onCancel}/><AppButton style={styles.button} title="Save" onPress={save}/></View></View></KeyboardAvoidingView></Modal>;
}
const styles = StyleSheet.create({overlay: {flex: 1, backgroundColor: 'rgba(16,18,32,.45)', alignItems: 'center', justifyContent: 'center', padding: 24}, card: {width: '100%', padding: 20, borderRadius: 20, backgroundColor: colors.surface}, title: {fontSize: 21, fontWeight: '800', color: colors.text, marginBottom: 18}, actions: {flexDirection: 'row', gap: 10}, button: {flex: 1}});
