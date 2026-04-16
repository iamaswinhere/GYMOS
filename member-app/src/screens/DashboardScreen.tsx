import React, { useContext, useEffect, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  StatusBar,
  Platform,
  SafeAreaView,
  Alert,
} from 'react-native';
import { 
  Bell, 
  Calendar, 
  Cake, 
  AlertCircle, 
  ChevronRight,
  User,
  QrCode,
  LogOut,
  Image
} from 'lucide-react-native';
import { Image as RNImage } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../constants/config';

import { io } from 'socket.io-client';

const DashboardScreen = ({ navigation }: any) => {
  const { member, token, logout, refreshMember } = useContext(AuthContext);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    if (token) {
      fetchEvents();
    }

    // Setup Real-time connection
    const socket = io(API_URL);

    socket.on('eventUpdate', (data: any) => {
      if (data.type === 'added') {
        setEvents(prev => [...prev, data.event].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
      } else if (data.type === 'deleted') {
        setEvents(prev => prev.filter(e => (e._id || e.id) !== data.id));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${API_URL}/api/events/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      setEvents(data);
    } catch (e) {
      console.log('Failed to fetch events', e);
    }
  };

  const handleLogout = async () => {
    const performLogout = async () => {
      await logout();
      navigation.replace('Login');
    };

    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to log out?')) {
        performLogout();
      }
    } else {
      Alert.alert('Logout', 'Are you sure you want to log out?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log Out', style: 'destructive', onPress: performLogout }
      ]);
    }
  };

  const calculateDaysLeft = () => {
    if (!member?.expiryDate) return 0;
    const expiry = new Date(member.expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysLeft = calculateDaysLeft();
  const isExpired = daysLeft <= 0;

  const [renewing, setRenewing] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'web') {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleRenewMembership = async () => {
    const amount = member?.membershipPlan?.price ?? 1;

    Alert.alert(
      'Confirm Renewal',
      `Are you sure you want to renew your membership for ${amount} INR?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Pay Now', 
          onPress: async () => {
            setRenewing(true);
            try {
              // 1. Create Order
              const orderRes = await fetch(`${API_URL}/api/razorpay/create-order`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ amount: amount }),
              });

              if (!orderRes.ok) throw new Error('Order creation failed');
              const orderData = await orderRes.json();

              // 2. Open Razorpay Checkout
              if (Platform.OS === 'web') {
                const options = {
                  key: require('../constants/config').RAZORPAY_KEY_ID,
                  amount: orderData.amount,
                  currency: orderData.currency,
                  name: 'GYMOS Elite',
                  description: `Membership Renewal - ${member.membershipPlan.name}`,
                  order_id: orderData.id,
                  handler: async (response: any) => {
                    verifyPayment(response, amount);
                  },
                  prefill: {
                    name: member.name,
                    contact: member.mobileNumber,
                    email: member.email || '',
                  },
                  theme: { color: COLORS.primary },
                };
                const rzp = new (window as any).Razorpay(options);
                rzp.open();
              } else {
                // For Native: Integrate react-native-razorpay logic here
                // Note: Requires react-native-razorpay package and custom dev client
                Alert.alert('Notice', 'Mobile native payment integration is configured. For development builds, ensure react-native-razorpay is installed.');
                setRenewing(false);
              }
            } catch (err) {
              Alert.alert('Error', 'Could not initiate payment. Please try again.');
              setRenewing(false);
            }
          }
        }
      ]
    );
  };

  const verifyPayment = async (razorpayResponse: any, amount: number) => {
    try {
      const res = await fetch(`${API_URL}/api/razorpay/verify-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...razorpayResponse,
          memberId: member._id,
          durationMonths: 1, // Default to 1 month or from member.plan
          amountPaid: amount,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        await refreshMember();
        Alert.alert('Success', 'Membership renewed successfully!');
        
        if (Platform.OS === 'web' && data.pdf) {
          const link = document.createElement('a');
          link.href = data.pdf;
          link.download = `GYMOS_Receipt.pdf`;
          link.click();
        }
      } else {
        Alert.alert('Verification Failed', 'Payment verification failed. Please contact admin.');
      }
    } catch (err) {
      Alert.alert('Network Error', 'Verification failed. Please contact support.');
    } finally {
      setRenewing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>HELLO,</Text>
            <Text style={styles.nameText}>{member?.name?.toUpperCase() || 'MEMBER'}</Text>
            <View style={styles.idBadge}>
                <Text style={styles.idText}>ID: {member?._id?.slice(-8).toUpperCase()}</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={[styles.iconBtn, { marginRight: 10 }]} onPress={() => navigation.navigate('Scanner')}>
              <QrCode color={COLORS.primary} size={24} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={handleLogout}>
              <LogOut color={COLORS.primary} size={24} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Membership Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Text style={styles.statusTitle}>MEMBERSHIP STATUS</Text>
            <View style={[styles.activeTag, isExpired && { backgroundColor: 'rgba(244, 67, 54, 0.1)', borderColor: 'rgba(244, 67, 54, 0.2)' }]}>
              <Text style={[styles.activeTagText, isExpired && { color: '#f44336' }]}>
                {isExpired ? 'EXPIRED' : 'ACTIVE'}
              </Text>
            </View>
          </View>
          
          <View style={styles.expiryContainer}>
            <AlertCircle color={isExpired ? '#f44336' : COLORS.primary} size={20} />
            <Text style={styles.expiryText}>
              {isExpired ? 'Membership Expired' : `Expires in `}
              {!isExpired && <Text style={{ color: COLORS.primary }}>{daysLeft} Days</Text>}
            </Text>
          </View>

          <TouchableOpacity 
            style={[styles.renewBtn, renewing && { opacity: 0.7 }]} 
            onPress={handleRenewMembership}
            disabled={renewing}
          >
            <Text style={styles.renewBtnText}>{renewing ? 'RENEWING...' : 'RENEW MEMBERSHIP'}</Text>
          </TouchableOpacity>
        </View>

        {/* Upcoming Events */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>UPCOMING EVENTS</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.eventList}>
          {events.length === 0 ? (
            <Text style={{ color: '#666', marginLeft: SIZES.padding }}>No upcoming events.</Text>
          ) : (
            events.map((event, index) => {
              const eDate = new Date(event.date);
              return (
                <View key={event._id || index} style={styles.eventCard}>
                  <View style={styles.eventImagePlaceholder}>
                    {event.imageUrl ? (
                      <RNImage 
                        source={{ uri: event.imageUrl }} 
                        style={{ width: '100%', height: '100%' }}
                      />
                    ) : (
                      <Calendar color="rgba(255,255,255,0.1)" size={48} />
                    )}
                  </View>
                  <View style={styles.eventInfo}>
                    <Text style={styles.eventDate}>{eDate.toDateString().toUpperCase()}</Text>
                    <Text style={styles.eventTitle}>{event.name}</Text>
                    <View style={styles.eventFooter}>
                        <Text style={styles.eventTime}>{eDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                    </View>
                  </View>
                </View>
              )
            })
          )}
        </ScrollView>

      </ScrollView>

      {/* Floating Action Scanner Button */}
      <TouchableOpacity 
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('Scanner')}
      >
        <View style={styles.fabIconContainer}>
            <QrCode color="#000" size={28} />
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.black },
  scrollContent: { padding: SIZES.padding, paddingBottom: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30, marginTop: 20 },
  welcomeText: { color: '#666', fontSize: 14, fontWeight: '800', letterSpacing: 1 },
  nameText: { color: COLORS.white, fontSize: 24, fontWeight: '900', letterSpacing: -1, maxWidth: 220 },
  headerRight: { flexDirection: 'row' },
  idBadge: { backgroundColor: 'rgba(255,196,0,0.1)', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginTop: 4, borderWidth: 1, borderColor: 'rgba(255,196,0,0.2)' },
  idText: { color: COLORS.primary, fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  iconBtn: { width: 45, height: 45, borderRadius: 15, backgroundColor: COLORS.darkGray, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  statusCard: { backgroundColor: COLORS.darkGray, borderRadius: SIZES.radius, padding: 24, marginBottom: 32, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  statusHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  statusTitle: { color: '#888', fontSize: 12, fontWeight: '800', letterSpacing: 1.5 },
  activeTag: { backgroundColor: 'rgba(76, 175, 80, 0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: 'rgba(76, 175, 80, 0.2)' },
  activeTagText: { color: '#4caf50', fontSize: 10, fontWeight: '900' },
  expiryContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  expiryText: { color: COLORS.white, fontSize: 16, fontWeight: '600', marginLeft: 10 },
  renewBtn: { backgroundColor: 'rgba(255,196,0,0.1)', height: 54, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,196,0,0.2)' },
  renewBtnText: { color: COLORS.primary, fontSize: 14, fontWeight: '800', letterSpacing: 1 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sectionTitle: { color: COLORS.white, fontSize: 18, fontWeight: '900', letterSpacing: 0.5 },
  eventList: { marginHorizontal: -SIZES.padding, paddingLeft: SIZES.padding },
  eventCard: { width: 280, backgroundColor: COLORS.darkGray, borderRadius: SIZES.radius, marginRight: 16, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  eventImagePlaceholder: { height: 140, backgroundColor: '#1a1a1a', alignItems: 'center', justifyContent: 'center' },
  eventInfo: { padding: 16 },
  eventDate: { color: COLORS.primary, fontSize: 12, fontWeight: '800', marginBottom: 4 },
  eventTitle: { color: COLORS.white, fontSize: 18, fontWeight: '800', marginBottom: 12 },
  eventFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  eventTime: { color: '#666', fontSize: 12, fontWeight: '600' },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: '#ffc400', // Primary color
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ffc400',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  fabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default DashboardScreen;
