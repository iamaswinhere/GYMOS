import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
  Alert,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { ArrowLeft, CheckCircle, ShieldCheck, Zap } from 'lucide-react-native';
import { COLORS, SIZES } from '../constants/theme';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../constants/config';
import { io } from 'socket.io-client';

const PaymentScreen = ({ navigation }: any) => {
  const { member, token, refreshMember } = useContext(AuthContext);
  const [paymentDone, setPaymentDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentLink, setPaymentLink] = useState<string | null>(null);

  const amount = member?.membershipPlan?.price ?? 1;

  // Listen for real-time payment success via WebSockets
  useEffect(() => {
    const socket = io(API_URL.replace('/api', ''));
    
    socket.on('paymentUpdate', (data) => {
      if (data.memberId === member?._id && data.type === 'renewal') {
        setPaymentDone(true);
        refreshMember();
        setTimeout(() => navigation.replace('Dashboard'), 3000);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [member?._id]);

  const handleInitializePayment = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/razorpay/create-link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ durationMonths: 1 }),
      });

      const data = await res.json();
      if (res.ok && data.paymentLink) {
        setPaymentLink(data.paymentLink);
        // Open the secure Razorpay checkout link
        Linking.openURL(data.paymentLink);
      } else {
        Alert.alert('Error', data.message || 'Failed to initialize payment.');
      }
    } catch (err) {
      Alert.alert('Network Error', 'Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft color={COLORS.white} size={22} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SECURE CHECKOUT</Text>
        <div style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {paymentDone ? (
          <View style={styles.successBlock}>
            <CheckCircle color={COLORS.success} size={80} strokeWidth={3} />
            <Text style={styles.successTitle}>PAYMENT VERIFIED</Text>
            <Text style={styles.successSub}>Your membership was renewed automatically. Redirecting to dashboard...</Text>
          </View>
        ) : (
          <>
            <View style={styles.infoCard}>
              <View style={styles.planHeader}>
                <Zap color={COLORS.primary} size={20} fill={COLORS.primary} />
                <Text style={styles.planName}>{member?.membershipPlan?.name?.toUpperCase() || 'MEMBERSHIP'}</Text>
              </View>
              
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>TOTAL AMOUNT</Text>
                <Text style={styles.priceValue}>₹{amount.toLocaleString()}</Text>
              </View>
              
              <View style={styles.detailsList}>
                <View style={styles.detailItem}>
                   <View style={styles.dot} />
                   <Text style={styles.detailText}>Automated Renewal (1 Month)</Text>
                </View>
                <View style={styles.detailItem}>
                   <View style={styles.dot} />
                   <Text style={styles.detailText}>Instant Expiry Update</Text>
                </View>
                <View style={styles.detailItem}>
                   <View style={styles.dot} />
                   <Text style={styles.detailText}>Secure Razorpay Checkout</Text>
                </View>
              </View>
            </View>

            <View style={styles.securityBanner}>
                <ShieldCheck color="#4CAF50" size={18} />
                <Text style={styles.securityText}>100% SECURE ENCRYPTED PAYMENTS</Text>
            </View>

            <TouchableOpacity
              style={[styles.payBtn, loading && { opacity: 0.7 }]}
              onPress={handleInitializePayment}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.payBtnText}>PAY SECURELY WITH RAZORPAY</Text>
              )}
            </TouchableOpacity>

            {paymentLink && (
               <TouchableOpacity 
                 onPress={() => Linking.openURL(paymentLink)}
                 style={styles.retryLink}
               >
                 <Text style={styles.retryText}>Payment link not opening? Tap here</Text>
               </TouchableOpacity>
            )}

            <Text style={styles.disclaimer}>
              After payment, you will be redirected back to GYMOS. Your membership will refresh automatically.
            </Text>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#888',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 2,
  },
  scroll: { padding: SIZES.padding, paddingBottom: 60 },
  infoCard: {
    backgroundColor: '#0D0D0D',
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginTop: 10,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 24,
  },
  planName: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  priceRow: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    paddingBottom: 20,
    marginBottom: 20,
  },
  priceLabel: {
    color: '#555',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 6,
  },
  priceValue: {
    color: COLORS.primary,
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: -1,
  },
  detailsList: { gap: 12 },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: COLORS.primary },
  detailText: { color: '#888', fontSize: 13, fontWeight: '600' },
  securityBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 32,
    marginTop: 10,
  },
  securityText: {
    color: '#4CAF50',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  payBtn: {
    backgroundColor: COLORS.primary,
    height: 64,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  payBtnText: { color: '#000', fontSize: 15, fontWeight: '900', letterSpacing: 0.5 },
  retryLink: { marginTop: 20, alignSelf: 'center' },
  retryText: { color: '#555', fontSize: 12, textDecorationLine: 'underline', fontWeight: 'bold' },
  disclaimer: {
    color: '#333',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 32,
    fontWeight: '700',
  },
  successBlock: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    gap: 24,
  },
  successTitle: {
    color: COLORS.success,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 1,
  },
  successSub: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '700',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
});

export default PaymentScreen;
