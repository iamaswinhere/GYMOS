import React, { useState, useContext } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ImageBackground,
  StatusBar,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Dumbbell, ArrowRight } from 'lucide-react-native';
import { COLORS, SIZES } from '../constants/theme';
import { AuthContext } from '../context/AuthContext';

const LoginScreen = ({ navigation }: any) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!mobileNumber || mobileNumber.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
      return;
    }

    try {
      setLoading(true);
      await login(mobileNumber);
      navigation.replace('Dashboard');
    } catch (error: any) {
      Alert.alert('No member found', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Dumbbell color={COLORS.primary} size={64} strokeWidth={3} />
          <Text style={styles.logoText}>GYM<Text style={{ color: COLORS.primary }}>OS</Text></Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>WELCOME BACK</Text>
          <Text style={styles.subtitle}>Enter your mobile number to access your membership</Text>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputPrefix}>+91</Text>
            <TextInput
              style={styles.input}
              placeholder="Mobile Number"
              placeholderTextColor="#666"
              keyboardType="phone-pad"
              value={mobileNumber}
              onChangeText={setMobileNumber}
              maxLength={10}
            />
          </View>

          <TouchableOpacity 
            style={styles.button}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.black} />
            ) : (
              <>
                <Text style={styles.buttonText}>CONTINUE</Text>
                <ArrowRight color={COLORS.black} size={20} strokeWidth={3} />
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>New to GYMOS? Visit our website to join.</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  content: {
    flex: 1,
    padding: SIZES.padding,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logoText: {
    fontSize: 40,
    fontWeight: '900',
    color: COLORS.white,
    letterSpacing: -2,
    marginTop: 10,
  },
  formContainer: {
    width: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 40,
    lineHeight: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.darkGray,
    borderRadius: SIZES.radius,
    paddingHorizontal: 20,
    height: 64,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  inputPrefix: {
    color: COLORS.primary,
    fontWeight: '700',
    marginRight: 10,
    fontSize: 16,
  },
  input: {
    flex: 1,
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '600',
  },
  button: {
    backgroundColor: COLORS.primary,
    height: 64,
    borderRadius: SIZES.radius,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  buttonText: {
    color: COLORS.black,
    fontSize: 16,
    fontWeight: '800',
    marginRight: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    left: 24,
    right: 24,
    alignItems: 'center',
  },
  footerText: {
    color: '#555',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default LoginScreen;
