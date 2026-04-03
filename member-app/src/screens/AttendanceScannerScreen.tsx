import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AttendanceScannerScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<any>();
  const { member: user } = React.useContext(AuthContext);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }: { type: string, data: string }) => {
    setScanned(true);
    
    // Validate that it's a GYMOS check-in QR code
    if (!data.startsWith('gymos://checkin?token=')) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert("Invalid QR Code", "Please scan the official GYMOS check-in QR code at the front desk.", [
            { text: "Try Again", onPress: () => setScanned(false) }
        ]);
        return;
    }

    const token = data.replace('gymos://checkin?token=', '');
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    try {
      const jwtToken = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${API_URL}/api/attendance/mark`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify({
          memberId: user?._id || user?.id,
          token: token
        })
      });

      const result = await response.json();

      if (response.ok) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert("Check-in Successful!", "Welcome to GYMOS. Have a great workout!", [
            { text: "Awesome", onPress: () => navigation.goBack() }
        ]);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert("Check-in Failed", result.message || "Could not check in.", [
            { text: "OK", onPress: () => setScanned(false) }
        ]);
      }
    } catch (error) {
      console.error(error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Network Error", "Check your connection and try again.", [
        { text: "Retry", onPress: () => setScanned(false) }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (hasPermission === null) {
    return <View style={styles.container}><ActivityIndicator color="#ffc400" size="large" /></View>;
  }
  if (hasPermission === false) {
    return (
        <View style={styles.container}>
            <MaterialCommunityIcons name="camera-off" size={64} color="#555" />
            <Text style={styles.text}>No access to camera</Text>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Text style={styles.backButtonText}>Go Back</Text>
            </TouchableOpacity>
        </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        style={StyleSheet.absoluteFillObject}
      />
      
      {/* Overlay to guide user */}
      <View style={styles.overlay}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
                <MaterialCommunityIcons name="close" size={28} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>SCAN TO ENTER</Text>
            <View style={{width: 44}} />
        </View>

        <View style={styles.scannerBox}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
        </View>
        
        <Text style={styles.instruction}>Point camera at the front desk Kiosk</Text>
        
        {loading && (
             <View style={styles.loadingContainer}>
                <ActivityIndicator color="#ffc400" size="large" />
                <Text style={styles.loadingText}>Verifying Pass...</Text>
             </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
  },
  header: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 60,
      paddingHorizontal: 20,
  },
  headerTitle: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '900',
      letterSpacing: 2,
  },
  closeButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: 'rgba(255,255,255,0.2)',
      alignItems: 'center',
      justifyContent: 'center',
  },
  scannerBox: {
    width: 280,
    height: 280,
    marginTop: '30%',
    backgroundColor: 'transparent',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#ffc400',
  },
  topLeft: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 16 },
  topRight: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 16 },
  bottomLeft: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 16 },
  bottomRight: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 16 },
  instruction: {
      color: '#fff',
      fontSize: 14,
      fontWeight: '600',
      marginTop: 40,
      letterSpacing: 1,
  },
  loadingContainer: {
      position: 'absolute',
      bottom: 100,
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.8)',
      paddingHorizontal: 30,
      paddingVertical: 15,
      borderRadius: 20,
  },
  loadingText: {
      color: '#ffc400',
      marginTop: 10,
      fontWeight: 'bold',
      letterSpacing: 1,
  },
  text: { color: '#fff', marginTop: 20, fontSize: 16 },
  backButton: { marginTop: 30, backgroundColor: '#ffc400', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  backButtonText: { color: '#000', fontWeight: 'bold' }
});
