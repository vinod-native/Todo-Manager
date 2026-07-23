import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {onAuthStateChanged} from 'firebase/auth';
import {useDispatch, useSelector} from 'react-redux';
import {auth} from '../config/firebase'; import {authStateChanged} from '../store/authSlice'; import {hydrateTodos, resetTodos} from '../store/todosSlice';
import AuthScreen from '../screens/AuthScreen'; import ListsScreen from '../screens/ListsScreen'; import TodosScreen from '../screens/TodosScreen'; import LoadingView from '../components/LoadingView'; import {colors} from '../theme';
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
const Stack = createNativeStackNavigator();
const ONBOARDING_KEY = '@todo/onboarding-complete';

export default function RootNavigator() {
  const [splashFinished, setSplashFinished] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(null);
  const dispatch = useDispatch(); const {user, initializing} = useSelector(s => s.auth); const {hydrated} = useSelector(s => s.todos);
  useEffect(() => onAuthStateChanged(auth, firebaseUser => { dispatch(authStateChanged(firebaseUser)); if (firebaseUser) dispatch(hydrateTodos(firebaseUser.uid)); else dispatch(resetTodos()); }), [dispatch]);
  useEffect(() => {
    const timer = setTimeout(() => setSplashFinished(true), 1400);
    AsyncStorage.getItem(ONBOARDING_KEY)
      .then(value => setOnboardingComplete(value === 'true'))
      .catch(() => setOnboardingComplete(false));
    return () => clearTimeout(timer);
  }, []);
  const finishOnboarding = async () => {
    setOnboardingComplete(true);
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    } catch {
      // The user can still continue if local persistence is unavailable.
    }
  };
  if (!splashFinished || onboardingComplete === null) return <SplashScreen />;
  if (!onboardingComplete) return <OnboardingScreen onComplete={finishOnboarding} />;
  if (initializing || (user && !hydrated)) return <LoadingView message={initializing ? 'Restoring your session…' : 'Loading your lists…'}/>;
  return <NavigationContainer><Stack.Navigator screenOptions={{headerShadowVisible: false, headerStyle: {backgroundColor: colors.background}, headerTintColor: colors.text, contentStyle: {backgroundColor: colors.background}}}>{user ? <><Stack.Screen name="Lists" component={ListsScreen} options={{headerShown: false}}/><Stack.Screen name="Todos" component={TodosScreen}/></> : <Stack.Screen name="Auth" component={AuthScreen} options={{headerShown: false}}/>}</Stack.Navigator></NavigationContainer>;
}
