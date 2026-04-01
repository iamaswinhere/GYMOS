import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  Dimensions, 
  StatusBar 
} from 'react-native';
import { Dumbbell } from 'lucide-react-native';
import { COLORS, SIZES } from '../constants/theme';

const { width } = Dimensions.get('window');

const StartupLoader = () => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initial fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Pulse animation for the logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Progress bar animation
    Animated.timing(progressAnim, {
      toValue: width * 0.6,
      duration: 3000,
      useNativeDriver: false,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Animated.View style={{ transform: [{ scale: pulseAnim }], alignItems: 'center' }}>
          <View style={styles.logoCircle}>
            <Dumbbell color={COLORS.primary} size={48} strokeWidth={3} />
          </View>
          <Text style={styles.logoText}>
            GYM<Text style={{ color: COLORS.primary }}>OS</Text>
          </Text>
          <Text style={styles.tagline}>ELITE MANAGEMENT</Text>
        </Animated.View>

        <View style={styles.loaderContainer}>
          <View style={styles.progressBarBg}>
            <Animated.View 
              style={[
                styles.progressBarFill, 
                { width: progressAnim }
              ]} 
            />
          </View>
          <Text style={styles.loadingText}>INITIALIZING SYSTEM...</Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 196, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 196, 0, 0.2)',
    marginBottom: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  logoText: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -2,
  },
  tagline: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '800',
    letterSpacing: 4,
    marginTop: 5,
    opacity: 0.8,
  },
  loaderContainer: {
    marginTop: 80,
    alignItems: 'center',
    width: '100%',
  },
  progressBarBg: {
    width: width * 0.6,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
  },
  loadingText: {
    marginTop: 15,
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
  },
});

export default StartupLoader;
