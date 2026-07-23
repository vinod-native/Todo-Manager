import React, {useEffect, useRef} from 'react';
import {Animated, Easing, StyleSheet, Text, View} from 'react-native';
import {Ionicons} from '@react-native-vector-icons/ionicons/static';
import {colors} from '../theme';

export default function SplashScreen() {
  const scale = useRef(new Animated.Value(0.85)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.back(1.4)),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, scale]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.content, {opacity, transform: [{scale}]}]}>
        <View style={styles.logo}>
          <Ionicons name="checkmark" size={56} color={colors.primary} />
        </View>
        <Text style={styles.title}>Todo Manager</Text>
        <Text style={styles.subtitle}>Plan it. Do it. Done.</Text>
      </Animated.View>
      <Text style={styles.footer}>YOUR DAY, ORGANIZED</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  content: {alignItems: 'center'},
  logo: {
    width: 94,
    height: 94,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  title: {marginTop: 24, fontSize: 31, fontWeight: '900', color: '#FFFFFF'},
  subtitle: {marginTop: 8, fontSize: 16, color: '#E4E5FF'},
  footer: {
    position: 'absolute',
    bottom: 42,
    color: '#D2D3FF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
  },
});
