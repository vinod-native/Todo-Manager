import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  UIManager,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Ionicons} from '@react-native-vector-icons/ionicons/static';
import AppButton from '../components/AppButton';
import AppInput from '../components/AppInput';
import {clearAuthError, login, register} from '../store/authSlice';
import {colors, shadows} from '../theme';
import {
  required,
  validateEmail,
  validatePassword,
} from '../utils/validation';

const emptyForm = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function AuthScreen() {
  const dispatch = useDispatch();
  const {loading, error: serverError} = useSelector(state => state.auth);
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const formTransition = useRef(new Animated.Value(1)).current;

  useEffect(() => () => dispatch(clearAuthError()), [dispatch]);

  const updateField = (field, value) => {
    setForm(current => ({...current, [field]: value}));
    if (errors[field]) {
      setErrors(current => ({...current, [field]: ''}));
    }
    if (serverError) {
      dispatch(clearAuthError());
    }
  };

  const submit = () => {
    const nextErrors = {
      email: validateEmail(form.email),
      password: validatePassword(form.password),
    };

    if (mode === 'register') {
      nextErrors.name = required(form.name, 'Name', 50);
      nextErrors.confirmPassword = !form.confirmPassword
        ? 'Please confirm your password.'
        : form.confirmPassword !== form.password
          ? 'Passwords do not match.'
          : '';
    }

    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) {
      return;
    }

    if (mode === 'login') {
      dispatch(login({email: form.email, password: form.password}));
    } else {
      dispatch(
        register({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      );
    }
  };

  const switchMode = nextMode => {
    if (nextMode === mode || loading) {
      return;
    }
    Animated.timing(formTransition, {
      toValue: 0,
      duration: 110,
      easing: Easing.in(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      LayoutAnimation.configureNext({
        duration: 280,
        update: {type: LayoutAnimation.Types.easeInEaseOut},
        create: {
          type: LayoutAnimation.Types.easeInEaseOut,
          property: LayoutAnimation.Properties.opacity,
        },
        delete: {
          type: LayoutAnimation.Types.easeInEaseOut,
          property: LayoutAnimation.Properties.opacity,
        },
      });
      setMode(nextMode);
      setForm(emptyForm);
      setErrors({});
      dispatch(clearAuthError());
      Animated.timing(formTransition, {
        toValue: 1,
        duration: 230,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    });
  };

  const isLogin = mode === 'login';
  const animatedFormStyle = {
    opacity: formTransition,
    transform: [
      {
        translateY: formTransition.interpolate({
          inputRange: [0, 1],
          outputRange: [8, 0],
        }),
      },
    ],
  };

  return (
    <KeyboardAvoidingView
      style={styles.page}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.logo}>
            <Ionicons name="checkmark" size={37} color="#FFFFFF" />
          </View>
          <Text style={styles.title}>
            Organize your day
          </Text>
          <Text style={styles.subtitle}>
            One simple place for all your plans and tasks.
          </Text>
        </View>

        <View style={[styles.card, shadows.card]}>
          <View style={styles.tabs}>
            <Pressable
              accessibilityRole="tab"
              accessibilityState={{selected: isLogin}}
              onPress={() => switchMode('login')}
              style={[styles.tab, isLogin && styles.activeTab]}>
              <Text style={[styles.tabText, isLogin && styles.activeTabText]}>
                Sign In
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="tab"
              accessibilityState={{selected: !isLogin}}
              onPress={() => switchMode('register')}
              style={[styles.tab, !isLogin && styles.activeTab]}>
              <Text style={[styles.tabText, !isLogin && styles.activeTabText]}>
                Sign Up
              </Text>
            </Pressable>
          </View>

          <Animated.View
            key={mode}
            style={animatedFormStyle}>
            <Text style={styles.formTitle}>
              {isLogin ? 'Welcome back!' : 'Create your account'}
            </Text>
            <Text style={styles.formHint}>
              {isLogin
                ? 'Enter your details to continue.'
                : 'All fields are required to get started.'}
            </Text>

            {!isLogin ? (
              <AppInput
                label="Full name"
                placeholder="Enter your full name"
                value={form.name}
                onChangeText={value => updateField('name', value)}
                error={errors.name}
                autoCapitalize="words"
                autoComplete="name"
                textContentType="name"
                returnKeyType="next"
                editable={!loading}
              />
            ) : null}
            <AppInput
              label="Email address"
              placeholder="you@example.com"
              value={form.email}
              onChangeText={value => updateField('email', value)}
              error={errors.email}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType="next"
              editable={!loading}
            />
            <AppInput
              label="Password"
              placeholder={
                isLogin ? 'Enter your password' : 'At least 6 characters'
              }
              value={form.password}
              onChangeText={value => updateField('password', value)}
              error={errors.password}
              showPasswordToggle
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              textContentType={isLogin ? 'password' : 'newPassword'}
              returnKeyType={isLogin ? 'done' : 'next'}
              onSubmitEditing={isLogin ? submit : undefined}
              editable={!loading}
            />
            {!isLogin ? (
              <AppInput
                label="Confirm password"
                placeholder="Re-enter your password"
                value={form.confirmPassword}
                onChangeText={value => updateField('confirmPassword', value)}
                error={errors.confirmPassword}
                showPasswordToggle
                autoComplete="new-password"
                textContentType="newPassword"
                returnKeyType="done"
                onSubmitEditing={submit}
                editable={!loading}
              />
            ) : null}

            {serverError ? (
              <Text accessibilityRole="alert" style={styles.serverError}>
                {serverError}
              </Text>
            ) : null}

            <AppButton
              title={isLogin ? 'Sign In' : 'Create Account'}
              onPress={submit}
              loading={loading}
            />
            <Text style={styles.privacy}>
              {isLogin
                ? 'Your tasks stay synced securely to your account.'
                : 'By creating an account, you agree to keep your login details secure.'}
            </Text>
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: {flex: 1, backgroundColor: colors.background},
  content: {flexGrow: 1, paddingHorizontal: 24, paddingTop: 44, paddingBottom: 32},
  hero: {alignItems: 'center', marginBottom: 24},
  logo: {
    width: 58,
    height: 58,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  title: {
    marginTop: 17,
    color: colors.text,
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
  },
  subtitle: {
    maxWidth: 310,
    marginTop: 7,
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  card: {
    padding: 20,
    borderWidth: 1,
    borderColor: '#ECEEF5',
    borderRadius: 24,
    backgroundColor: colors.surface,
  },
  tabs: {
    height: 48,
    marginBottom: 24,
    padding: 4,
    borderRadius: 14,
    backgroundColor: colors.background,
    flexDirection: 'row',
  },
  tab: {flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 11},
  activeTab: {backgroundColor: colors.surface, ...shadows.card},
  tabText: {color: colors.muted, fontSize: 14, fontWeight: '700'},
  activeTabText: {color: colors.primary, fontWeight: '900'},
  formTitle: {color: colors.text, fontSize: 19, fontWeight: '900'},
  formHint: {
    marginTop: 4,
    marginBottom: 19,
    color: colors.muted,
    fontSize: 13,
  },
  serverError: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 10,
    color: colors.danger,
    backgroundColor: '#FFF0F1',
  },
  privacy: {
    marginTop: 14,
    paddingHorizontal: 8,
    color: colors.muted,
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
  },
});
