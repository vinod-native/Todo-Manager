import React, {useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors, shadows} from '../theme';

const {width} = Dimensions.get('window');

const steps = [
  {
    eyebrow: 'STEP 1 OF 3',
    title: 'Plan your day,\nyour way',
    description:
      'Create separate lists for work, personal goals, shopping, or anything else you want to organize.',
    accent: '#5B5FEF',
    tint: '#EEEEFF',
    icon: '＋',
    cards: ['Today’s priorities', 'Weekend shopping'],
  },
  {
    eyebrow: 'STEP 2 OF 3',
    title: 'Turn ideas into\naction',
    description:
      'Add clear tasks inside every list, then edit them anytime as your plans change.',
    accent: '#F19A54',
    tint: '#FFF2E7',
    icon: '✎',
    cards: ['Prepare presentation', 'Book dentist appointment'],
  },
  {
    eyebrow: 'STEP 3 OF 3',
    title: 'Check it off.\nFeel accomplished.',
    description:
      'Mark todos complete and keep a simple view of everything you have already achieved.',
    accent: '#2E9D68',
    tint: '#E8F7F0',
    icon: '✓',
    cards: ['Morning workout', 'Send weekly report'],
  },
];

function Illustration({step}) {
  return (
    <View style={[styles.illustration, {backgroundColor: step.tint}]}>
      <View style={[styles.glow, {backgroundColor: step.accent}]} />
      <View style={[styles.iconBox, shadows.card]}>
        <Text style={[styles.icon, {color: step.accent}]}>{step.icon}</Text>
      </View>
      <View style={[styles.taskCard, styles.firstCard, shadows.card]}>
        <View style={[styles.checkCircle, {borderColor: step.accent}]} />
        <View>
          <Text style={styles.taskText}>{step.cards[0]}</Text>
          <View style={[styles.taskLine, styles.longTaskLine]} />
        </View>
      </View>
      <View style={[styles.taskCard, styles.secondCard, shadows.card]}>
        <View
          style={[
            styles.checkCircle,
            {backgroundColor: step.accent, borderColor: step.accent},
          ]}>
          <Text style={styles.tinyCheck}>✓</Text>
        </View>
        <View>
          <Text style={styles.taskText}>{step.cards[1]}</Text>
          <View style={[styles.taskLine, styles.shortTaskLine]} />
        </View>
      </View>
    </View>
  );
}

export default function OnboardingScreen({onComplete}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const fade = useRef(new Animated.Value(1)).current;
  const step = steps[activeIndex];

  const showStep = nextIndex => {
    Animated.timing(fade, {
      toValue: 0,
      duration: 120,
      useNativeDriver: true,
    }).start(() => {
      setActiveIndex(nextIndex);
      Animated.timing(fade, {
        toValue: 1,
        duration: 260,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleNext = () => {
    if (activeIndex === steps.length - 1) {
      onComplete();
      return;
    }
    showStep(activeIndex + 1);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.brand}>
          <Text style={styles.brandCheck}>✓</Text>
          <Text style={styles.brandText}>Todo</Text>
        </View>
        {activeIndex < steps.length - 1 ? (
          <Pressable
            accessibilityRole="button"
            hitSlop={12}
            onPress={onComplete}>
            <Text style={styles.skip}>Skip</Text>
          </Pressable>
        ) : (
          <View style={styles.skipPlaceholder} />
        )}
      </View>

      <Animated.View style={[styles.content, {opacity: fade}]}>
        <Illustration step={step} />
        <Text style={[styles.eyebrow, {color: step.accent}]}>
          {step.eyebrow}
        </Text>
        <Text style={styles.title}>{step.title}</Text>
        <Text style={styles.description}>{step.description}</Text>
      </Animated.View>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {steps.map((item, index) => (
            <View
              key={item.eyebrow}
              style={[
                styles.dot,
                index === activeIndex && [
                  styles.activeDot,
                  {backgroundColor: step.accent},
                ],
              ]}
            />
          ))}
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={handleNext}
          style={({pressed}) => [
            styles.button,
            {backgroundColor: step.accent},
            pressed && styles.buttonPressed,
          ]}>
          <Text style={styles.buttonText}>
            {activeIndex === steps.length - 1 ? 'Get Started' : 'Continue'}
          </Text>
          <Text style={styles.arrow}>→</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: colors.background},
  header: {
    height: 62,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {flexDirection: 'row', alignItems: 'center'},
  brandCheck: {
    width: 30,
    height: 30,
    borderRadius: 10,
    textAlign: 'center',
    lineHeight: 30,
    overflow: 'hidden',
    color: '#FFFFFF',
    backgroundColor: colors.primary,
    fontSize: 18,
    fontWeight: '900',
  },
  brandText: {
    marginLeft: 9,
    color: colors.text,
    fontSize: 20,
    fontWeight: '900',
  },
  skip: {color: colors.muted, fontSize: 15, fontWeight: '700'},
  skipPlaceholder: {width: 34},
  content: {flex: 1, paddingHorizontal: 24, alignItems: 'center'},
  illustration: {
    width: Math.min(width - 48, 350),
    height: Math.min(width - 48, 350) * 0.78,
    maxHeight: 275,
    marginTop: 14,
    marginBottom: 31,
    borderRadius: 36,
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    opacity: 0.12,
    right: -32,
    top: -35,
  },
  iconBox: {
    position: 'absolute',
    width: 78,
    height: 78,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    left: 30,
    top: 30,
  },
  icon: {fontSize: 42, lineHeight: 48, fontWeight: '900'},
  taskCard: {
    position: 'absolute',
    left: 56,
    right: 24,
    height: 68,
    borderRadius: 18,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
  },
  firstCard: {top: 120, transform: [{rotate: '-2deg'}]},
  secondCard: {top: 195, left: 82, transform: [{rotate: '2deg'}]},
  checkCircle: {
    width: 24,
    height: 24,
    marginRight: 12,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tinyCheck: {color: '#FFFFFF', fontSize: 13, fontWeight: '900'},
  taskText: {color: colors.text, fontSize: 13, fontWeight: '800'},
  taskLine: {
    height: 5,
    borderRadius: 3,
    marginTop: 7,
    backgroundColor: colors.border,
  },
  longTaskLine: {width: 82},
  shortTaskLine: {width: 62},
  eyebrow: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  title: {
    color: colors.text,
    fontSize: 33,
    lineHeight: 40,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: -0.6,
  },
  description: {
    maxWidth: 340,
    marginTop: 16,
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  footer: {paddingHorizontal: 24, paddingBottom: 14},
  dots: {
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 7,
    height: 7,
    marginHorizontal: 4,
    borderRadius: 4,
    backgroundColor: '#D9DAE4',
  },
  activeDot: {width: 24},
  button: {
    height: 58,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {opacity: 0.86, transform: [{scale: 0.99}]},
  buttonText: {color: '#FFFFFF', fontSize: 17, fontWeight: '900'},
  arrow: {
    position: 'absolute',
    right: 22,
    color: '#FFFFFF',
    fontSize: 25,
    lineHeight: 28,
  },
});
