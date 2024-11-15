import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import employeeService from '../services/employee.service';
import { handleResponse } from '../function/index';
import { CheckIn, CheckOut } from '../function/api';
import { Alert } from 'react-native';
import tw from 'tailwind-react-native-classnames';

interface ShiftData {
  created_at: string;
  date: string;
  id: number;
  reason: string;
  staff_id: number;
  time_end: string;
  time_start: string;
  updated_at: string;
}

interface ChamCong {
  date: string;
  reason: string;
  staff_id: number;
  time_end: string;
  time_start: string;
}

type ParamList = {
  AttendanceDetail: {
    caLamViec: ShiftData;
    type: 'in' | 'out';
    id_nhanvien: number;
    chamCong?: ChamCong;
  };
};

const AttendanceDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamList, 'AttendanceDetail'>>();
  const { caLamViec, type, id_nhanvien, chamCong } = route.params;
  const [dataCheckIn, setDataCheckIn] = useState<ChamCong | null>(chamCong || null);
  const [data, setData] = useState<ShiftData | null>(null);

  useEffect(() => {
    if (caLamViec) {
      setData(caLamViec);
    }
  }, [caLamViec]);

  if (!data) {
    return (
      <View style={tw`flex-1 items-center justify-center bg-gray-50`}>
        <Text style={tw`text-lg text-gray-600`}>Không nhận được dữ liệu</Text>
      </View>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate().toString().padStart(2, '0'),
      month: (date.getMonth() + 1).toString().padStart(2, '0')
    };
  };

  const { day, month } = formatDate(data.date);

  const getTodayShift = () => {
    const today = new Date().toISOString().split('T')[0];
    return data.date === today ? data : null;
  };

  const handleReject = () => {
    navigation.goBack();
  };

  const handleConfirm = (type: 'in' | 'out') => {
    const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    if (type === 'in') {
      const newCheckIn: ChamCong = {
        reason: "",
        staff_id: id_nhanvien,
        time_end: "",
        time_start: currentTime,
        date: data.date,
      };
      setDataCheckIn(newCheckIn);
      CheckIn(newCheckIn);
    } else {
      if (dataCheckIn) {
        const updatedCheckIn: ChamCong = {
          ...dataCheckIn,
          time_end: currentTime,
        };
        setDataCheckIn(updatedCheckIn);
        CheckOut(updatedCheckIn.id, updatedCheckIn);
      } else {
        Alert.alert("Error", "No check-in data available");
      }
    }
  };

  const todayShift = getTodayShift();

  return (
    <View style={tw`flex-1 bg-gray-50 p-5`}>
      <View style={tw`bg-white rounded-2xl p-5 shadow-lg`}>
        <View style={tw`items-center mb-6`}>
          <Text style={tw`text-5xl font-bold text-blue-600`}>{day}</Text>
          <Text style={tw`text-lg text-gray-600 mt-1`}>Tháng {month}</Text>
        </View>

        <View style={tw`items-center mb-6`}>
          {todayShift ? (
            <View style={tw`items-center`}>
              <Text style={tw`text-base text-gray-600 mb-2`}>Thời gian làm việc</Text>
              <Text style={tw`text-2xl font-bold text-gray-800`}>
                {todayShift.time_start} - {todayShift.time_end}
              </Text>
            </View>
          ) : (
            <Text style={tw`text-xl text-red-500 font-medium`}>Không có ca</Text>
          )}
        </View>

        <View style={tw`h-px bg-gray-200 my-5`} />

        <View style={tw`bg-gray-50 rounded-xl p-4`}>
          <View style={tw`flex-row justify-between items-center py-3`}>
            <Text style={tw`text-gray-600 flex-1`}>Tổng số giờ làm việc trong tuần</Text>
            <Text style={tw`text-base font-semibold text-blue-600`}>0h</Text>
          </View>
          <View style={tw`flex-row justify-between items-center py-3`}>
            <Text style={tw`text-gray-600 flex-1`}>Tổng số giờ tăng ca trong tuần này</Text>
            <Text style={tw`text-base font-semibold text-blue-600`}>0h</Text>
          </View>
          <View style={tw`flex-row justify-between items-center py-3`}>
            <Text style={tw`text-gray-600 flex-1`}>Tổng số giờ tăng ca trong tháng này</Text>
            <Text style={tw`text-base font-semibold text-blue-600`}>0h</Text>
          </View>
        </View>
      </View>
      
      <View style={tw`flex-row justify-between mt-8`}>
        <TouchableOpacity 
          style={tw`flex-1 mr-2 py-4 bg-white border border-red-400 rounded-xl items-center shadow-sm`}
          onPress={handleReject}
        >
          <Text style={tw`text-base font-semibold text-red-500`}>Từ chối</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={tw`flex-1 ml-2 py-4 bg-blue-600 rounded-xl items-center shadow-sm`}
          onPress={() => handleConfirm(type)}
        >
          <Text style={tw`text-base font-semibold text-white`}>Xác nhận</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AttendanceDetailScreen;
