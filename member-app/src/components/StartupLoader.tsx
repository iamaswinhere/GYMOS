import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  Dimensions, 
  StatusBar,
  Image,
  Easing
} from 'react-native';
import { COLORS } from '../constants/theme';

const { width, height } = Dimensions.get('window');

const StartupLoader = () => {
  // Animation values
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(20)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;
  const dotsOpacity1 = useRef(new Animated.Value(0.3)).current;
  const dotsOpacity2 = useRef(new Animated.Value(0.3)).current;
  const dotsOpacity3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Phase 1: Logo appears with dramatic scale-up
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1, duration: 600, useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1, tension: 60, friction: 8, useNativeDriver: true,
        }),
        Animated.timing(glowOpacity, {
          toValue: 1, duration: 800, useNativeDriver: true,
        }),
      ]),
      // Phase 2: Text slides up
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1, duration: 500, useNativeDriver: true,
        }),
        Animated.timing(textTranslateY, {
          toValue: 0, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true,
        }),
      ]),
      // Phase 3: Tagline fades in
      Animated.timing(taglineOpacity, {
        toValue: 1, duration: 400, useNativeDriver: true,
      }),
      // Phase 4: Progress bar
      Animated.timing(progressWidth, {
        toValue: width * 0.55, duration: 2000, easing: Easing.out(Easing.cubic), useNativeDriver: false,
      }),
    ]).start();

    // Pulsing glow loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowOpacity, { toValue: 0.4, duration: 1200, useNativeDriver: true }),
        Animated.timing(glowOpacity, { toValue: 1, duration: 1200, useNativeDriver: true }),
      ])
    ).start();

    // Animated loading dots
    const dotDelay = 300;
    const animDot = (dot: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0.3, duration: 400, useNativeDriver: true }),
          Animated.delay(dotDelay * 2),
        ])
      ).start();
    };
    setTimeout(() => {
      animDot(dotsOpacity1, 0);
      animDot(dotsOpacity2, dotDelay);
      animDot(dotsOpacity3, dotDelay * 2);
    }, 1800);

  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Background radial glow */}
      <Animated.View style={[styles.bgGlow, { opacity: glowOpacity }]} />

      {/* Logo Section */}
      <Animated.View style={[
        styles.logoSection,
        { opacity: logoOpacity, transform: [{ scale: logoScale }] }
      ]}>
        <View style={styles.logoIconWrapper}>
          <Image 
            source={require('../../assets/icon.png')} 
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
      </Animated.View>

      {/* Brand Text */}
      <Animated.View style={[
        styles.brandSection,
        { opacity: textOpacity, transform: [{ translateY: textTranslateY }] }
      ]}>
        <Text style={styles.brandText}>
          GYM<Text style={styles.brandHighlight}>OS</Text>
        </Text>
      </Animated.View>

      {/* Tagline */}
      <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
        ELITE GYM MANAGEMENT
      </Animated.Text>

      {/* Progress Bar */}
      <Animated.View style={[styles.progressContainer, { opacity: textOpacity }]}>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
        </View>

        {/* Animated Loading Dots */}
        <View style={styles.dotsRow}>
          <Animated.View style={[styles.dot, { opacity: dotsOpacity1 }]} />
          <Animated.View style={[styles.dot, { opacity: dotsOpacity2 }]} />
          <Animated.View style={[styles.dot, { opacity: dotsOpacity3 }]} />
        </View>
      </Animated.View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bgGlow: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: 'rgba(255, 196, 0, 0.07)',
    top: height / 2 - 250,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoIconWrapper: {
    width: 120,
    height: 120,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 30,
    elevation: 15,
  },
  logoImage: {
    width: 120,
    height: 120,
    borderRadius: 30,
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: 8,
  },
  brandText: {
    fontSize: 52,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -2,
  },
  brandHighlight: {
    color: COLORS.primary,
  },
  tagline: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255, 196, 0, 0.7)',
    letterSpacing: 4,
    marginBottom: 70,
  },
  progressContainer: {
    alignItems: 'center',
    width: '100%',
  },
  progressTrack: {
    width: width * 0.55,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 20,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 5,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },
});

export default StartupLoader;
