import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { COLORS, SIZES } from '../constants/theme';
import { ArrowLeft } from 'lucide-react-native';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../constants/config';

const AttendanceScannerScreen = ({ navigation }: any) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const { member } = useContext(AuthContext);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }: any) => {
    setScanned(true);
    
    try {
      const response = await fetch(`${API_URL}/api/attendance/mark`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ memberId: member._id })
      });

      const resData = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Attendance marked successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('Attendance Failed', resData.message || 'Could not mark attendance.', [
          { text: 'OK', onPress: () => setScanned(false) }
        ]);
      }

    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.', [
        { text: 'OK', onPress: () => setScanned(false) }
      ]);
    }
  };

  if (hasPermission === null) {
    return <View style={styles.container}><Text style={styles.text}>Requesting for camera permission...</Text></View>;
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No access to camera</Text>
        <TouchableOpacity style={styles.backBtnWrapper} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft color={COLORS.white} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SCAN GYM QR</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <View style={styles.cameraContainer}>
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.overlay}>
          <View style={styles.scanBox} />
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Point the camera at the GYMOS QR code at the front desk to mark your daily attendance.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    paddingTop: 20
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.darkGray,
    alignItems: 'center', justifyContent: 'center'
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1
  },
  text: {
    color: COLORS.white,
    textAlign: 'center',
    marginTop: 100,
    fontSize: 16
  },
  cameraContainer: {
    flex: 1,
    overflow: 'hidden',
    marginTop: 20,
    borderRadius: 30,
    marginHorizontal: SIZES.padding,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanBox: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: 'transparent',
    borderRadius: 20
  },
  footer: {
    padding: SIZES.padding,
    paddingBottom: 40,
    alignItems: 'center'
  },
  footerText: {
    color: '#888',
    textAlign: 'center',
    lineHeight: 22,
    fontSize: 14
  },
  backBtnWrapper: {
    marginTop: 20,
    padding: 15,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    marginHorizontal: 50,
    alignItems: 'center'
  },
  backBtnText: {
    color: COLORS.black,
    fontWeight: 'bold'
  }
});

export default AttendanceScannerScreen;
