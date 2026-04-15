import React, { useContext, useState } from 'react';
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
  Image,
} from 'react-native';
import { ArrowLeft, CheckCircle } from 'lucide-react-native';
import { COLORS, SIZES } from '../constants/theme';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../constants/config';

const PaymentScreen = ({ navigation }: any) => {
  const { member, token, refreshMember } = useContext(AuthContext);
  const [paymentDone, setPaymentDone] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const upiId = 'aswin005achu-1@oksbi';
  const payeeName = 'GYMOS';
  const amount = member?.membershipPlan?.price ?? 1;
  const note = 'GymMembershipRenewal';

  // Per-app intent URLs — these bypass the generic upi:// limit checks
  const upiApps = [
    {
      name: 'Google Pay',
      color: '#4285F4',
      bg: 'rgba(66,133,244,0.12)',
      url: `gpay://upi/pay?pa=${upiId}&pn=${payeeName}&am=${amount}&cu=INR&tn=${note}`,
      webUrl: `https://pay.google.com/`,
    },
    {
      name: 'PhonePe',
      color: '#5f259f',
      bg: 'rgba(95,37,159,0.12)',
      url: `phonepe://pay?pa=${upiId}&pn=${payeeName}&am=${amount}&cu=INR&tn=${note}`,
      webUrl: `https://www.phonepe.com/`,
    },
    {
      name: 'Paytm',
      color: '#00BAF2',
      bg: 'rgba(0,186,242,0.12)',
      url: `paytmmp://pay?pa=${upiId}&pn=${payeeName}&am=${amount}&cu=INR&tn=${note}`,
      webUrl: `https://paytm.com/`,
    },
    {
      name: 'BHIM / Any UPI App',
      color: '#FF6D00',
      bg: 'rgba(255,109,0,0.12)',
      url: `upi://pay?pa=${upiId}&pn=${payeeName}&am=${amount}&cu=INR&tn=${note}`,
      webUrl: null,
    },
  ];

  // QR code generated server-side — zero native dependencies
  const upiQrData = `upi://pay?pa=${upiId}&pn=${payeeName}&am=${amount}&cu=INR&tn=${note}`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiQrData)}&color=ffc400&bgcolor=121212&margin=10`;

  const openApp = async (app: typeof upiApps[0]) => {
    try {
      await Linking.openURL(app.url);
    } catch {
      if (app.webUrl) {
        Linking.openURL(app.webUrl);
      } else {
        Alert.alert('App not installed', `${app.name} is not installed on your device.`);
      }
    }
  };

  const handleConfirmPayment = async () => {
    setConfirming(true);
    try {
      const res = await fetch(`${API_URL}/api/members/renew/${member._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ durationMonths: 1, amountPaid: amount }),
      });

      if (res.ok) {
        const data = await res.json();
        setPaymentDone(true);
        await refreshMember();
        setTimeout(() => navigation.replace('Dashboard'), 2500);
        // Auto-download PDF receipt if on web
        if (Platform.OS === 'web' && data.pdf) {
          const link = document.createElement('a');
          link.href = data.pdf;
          link.download = `GYMOS_Receipt.pdf`;
          link.click();
        }
      } else {
        Alert.alert('Error', 'Could not confirm renewal. Please contact support.');
      }
    } catch {
      Alert.alert('Network Error', 'Please check your internet and try again.');
    } finally {
      setConfirming(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft color={COLORS.white} size={22} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>RENEW MEMBERSHIP</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Success Overlay State */}
        {paymentDone ? (
          <View style={styles.successBlock}>
            <CheckCircle color={COLORS.success} size={72} />
            <Text style={styles.successTitle}>RENEWED!</Text>
            <Text style={styles.successSub}>Your membership has been extended by 1 month.</Text>
          </View>
        ) : (
          <>
            {/* Amount Card */}
            <View style={styles.amountCard}>
              <Text style={styles.amountLabel}>AMOUNT TO PAY</Text>
              <Text style={styles.amountValue}>₹{amount.toLocaleString()}</Text>
              <Text style={styles.amountSub}>UPI ID: {upiId}</Text>
            </View>

            {/* QR Code */}
            <View style={styles.qrContainer}>
              <Text style={styles.sectionLabel}>SCAN WITH ANY UPI APP</Text>
              <View style={styles.qrFrame}>
                <Image
                  source={{ uri: qrImageUrl }}
                  style={styles.qrImage}
                  resizeMode="contain"
                />
              </View>
            </View>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR OPEN APP DIRECTLY</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* UPI App Buttons */}
            <View style={styles.appsGrid}>
              {upiApps.map((app) => (
                <TouchableOpacity
                  key={app.name}
                  style={[styles.appBtn, { backgroundColor: app.bg, borderColor: app.color + '44' }]}
                  onPress={() => openApp(app)}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.appBtnText, { color: app.color }]}>{app.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Confirm Button */}
            <TouchableOpacity
              style={[styles.confirmBtn, confirming && { opacity: 0.6 }]}
              onPress={handleConfirmPayment}
              disabled={confirming}
              activeOpacity={0.8}
            >
              <Text style={styles.confirmBtnText}>
                {confirming ? 'CONFIRMING...' : "✓  I'VE PAID — CONFIRM RENEWAL"}
              </Text>
            </TouchableOpacity>

            <Text style={styles.disclaimer}>
              Tap this button only after completing payment. Your expiry will be extended automatically.
            </Text>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 2,
  },
  scroll: { padding: SIZES.padding, paddingBottom: 60 },
  amountCard: {
    backgroundColor: COLORS.darkGray,
    borderRadius: SIZES.radius,
    padding: 28,
    alignItems: 'center',
    marginBottom: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,196,0,0.15)',
  },
  amountLabel: {
    color: '#666',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 10,
  },
  amountValue: {
    color: COLORS.primary,
    fontSize: 52,
    fontWeight: '900',
    letterSpacing: -2,
    marginBottom: 8,
  },
  amountSub: {
    color: '#555',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  qrContainer: { alignItems: 'center', marginBottom: 28 },
  sectionLabel: {
    color: '#555',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 16,
  },
  qrFrame: {
    padding: 12,
    backgroundColor: '#121212',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,196,0,0.2)',
  },
  qrImage: { width: 220, height: 220, borderRadius: 12 },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.07)' },
  dividerText: { color: '#444', fontSize: 10, fontWeight: '800', letterSpacing: 1.5 },
  appsGrid: { gap: 12, marginBottom: 32 },
  appBtn: {
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
  },
  appBtnText: { fontSize: 13, fontWeight: '900', letterSpacing: 0.5 },
  confirmBtn: {
    backgroundColor: COLORS.primary,
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  confirmBtnText: { color: '#000', fontSize: 14, fontWeight: '900', letterSpacing: 0.5 },
  disclaimer: {
    color: '#444',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 18,
    fontWeight: '600',
  },
  successBlock: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: 16,
  },
  successTitle: {
    color: COLORS.success,
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: -1,
  },
  successSub: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '700',
    lineHeight: 22,
  },
});

export default PaymentScreen;
