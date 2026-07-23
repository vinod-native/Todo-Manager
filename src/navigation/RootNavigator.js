import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {onAuthStateChanged} from 'firebase/auth';
import {useDispatch, useSelector} from 'react-redux';
import {auth} from '../config/firebase'; import {authStateChanged} from '../store/authSlice'; import {hydrateTodos, resetTodos} from '../store/todosSlice';
import AuthScreen from '../screens/AuthScreen'; import ListsScreen from '../screens/ListsScreen'; import TodosScreen from '../screens/TodosScreen'; import LoadingView from '../components/LoadingView'; import {colors} from '../theme';
import SplashScreen from '../screens/SplashScreen';
const Stack = createNativeStackNavigator();
export default function RootNavigator() {
  const [splashFinished, setSplashFinished] = useState(false);
  const dispatch = useDispatch(); const {user, initializing} = useSelector(s => s.auth); const {hydrated} = useSelector(s => s.todos);
  useEffect(() => onAuthStateChanged(auth, firebaseUser => { dispatch(authStateChanged(firebaseUser)); if (firebaseUser) dispatch(hydrateTodos(firebaseUser.uid)); else dispatch(resetTodos()); }), [dispatch]);
  useEffect(() => {
    const timer = setTimeout(() => setSplashFinished(true), 1400);
    return () => clearTimeout(timer);
  }, []);
  if (!splashFinished) return <SplashScreen />;
  if (initializing || (user && !hydrated)) return <LoadingView message={initializing ? 'Restoring your session…' : 'Loading your lists…'}/>;
  return <NavigationContainer><Stack.Navigator screenOptions={{headerShadowVisible: false, headerStyle: {backgroundColor: colors.background}, headerTintColor: colors.text, contentStyle: {backgroundColor: colors.background}}}>{user ? <><Stack.Screen name="Lists" component={ListsScreen} options={{headerShown: false}}/><Stack.Screen name="Todos" component={TodosScreen}/></> : <Stack.Screen name="Auth" component={AuthScreen} options={{headerShown: false}}/>}</Stack.Navigator></NavigationContainer>;
}
