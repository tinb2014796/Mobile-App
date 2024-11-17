import { Text, View, Button, PermissionsAndroid, Platform, Alert } from 'react-native';
import React, { useState } from 'react';
import Geolocation from '@react-native-community/geolocation';


const ContactScreen = () => {
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
  });


  const officeLocation = {
    latitude: 37.421, // Ví dụ tọa độ văn phòng
    longitude: -122.084,
  };

  const GetLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        console.log(position);
        const newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setLocation(newLocation);
        checkProximityAndClockIn(newLocation);
      },
      (error) => {
        console.log(error);
      }
    );
  };

  const checkProximityAndClockIn = (currentLocation) => {
    const distance = calculateDistance(currentLocation, officeLocation);
    if (distance <= 0.02) { // Trong phạm vi 20 mét
      sendClockInToServer();
    } else {
      Alert.alert("Không thể chấm công", "Bạn không ở gần văn phòng.");
    }
  };

  const calculateDistance = (loc1, loc2) => {
    const R = 6371; // Bán kính Trái Đất tính bằng km
    const dLat = toRad(loc2.latitude - loc1.latitude);
    const dLon = toRad(loc2.longitude - loc1.longitude);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(toRad(loc1.latitude)) * Math.cos(toRad(loc2.latitude)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Khoảng cách tính bằng km
  };

  const toRad = (value) => {
    return value * Math.PI / 180;
  };

  const sendClockInToServer = () => {
    // Gửi thông tin chấm công về server
    console.log("Đã gửi thông tin chấm công về server");
    Alert.alert("Thành công", "Đã chấm công thành công!");
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization();
      GetLocation();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "This app needs access to your location.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          GetLocation();
        } else {
          console.log("Location permission denied");
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  return (
    <View>
      <Text>ContactScreen</Text>
      <Button onPress={requestLocationPermission} title="Chấm công" />
      {location.latitude !== 0 && location.longitude !== 0 && (
        <Text>
          Vị trí hiện tại: {location.latitude}, {location.longitude}
        </Text>
      )}
    </View>
  );
};

export default ContactScreen;