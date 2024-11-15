import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { authLogout } from '../redux/reducers/authReducers';
import authService from '../services/auth.service';
import { useSelector } from 'react-redux';
import { selectAuth } from '../redux/reducers/authReducers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import employeeService from '../services/employee.service';
import { handleResponse } from '../function/index';
import Icon from 'react-native-vector-icons/Ionicons';
import tw from 'tailwind-react-native-classnames';

interface LichLamViec {
  id: number;
  date: string;
  time_start: string;
  time_end: string;
}

const HomeScreen: React.FC = () => {
  const username = useSelector(selectAuth).user;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState('');
  const [lichLamViec, setLichLamViec] = useState<LichLamViec[]>([]);
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const fetchLichLamViec = async () => {
      const response = await employeeService.lichLamViec(username.id);
      const data = handleResponse(response);
      setLichLamViec(data);
    };
    fetchLichLamViec();

    // Cập nhật thời gian hiện tại mỗi phút
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    authService.logout();
    dispatch(authLogout());
    AsyncStorage.removeItem('access_token');
  };

  const handleDayPress = (date: string, time_start: string, time_end: string) => {
    setSelectedDate(date);
    Alert.alert(
      'Chi tiết ca làm việc',
      `Ca làm việc: ${time_start} - ${time_end}\n` +
      'Công việc:\n' +
      '- Kiểm tra và cập nhật hệ thống\n' +
      '- Phục vụ khách hàng\n' +
      '- Báo cáo kết quả cuối ca'
    );
  };

  const handleLeaveRequest = (date: string) => {
    Alert.alert(`Yêu cầu xin nghỉ phép cho ngày: ${date}`);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'week' ? 'month' : 'week');
  };

  const formatDateTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return {
      time: `${hours}:${minutes}`,
      date: `${day}/${month}/${year}`
    };
  };

  const currentDateTime = formatDateTime(currentDate);

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      <View style={tw`bg-blue-500 px-5 pt-12 pb-8`}>
        <View style={tw`flex-row items-center justify-between`}>
          <View>
            <Text style={tw`text-2xl font-bold text-white`}>Lịch làm việc</Text>
            <Text style={tw`text-white mt-1`}>
              {currentDateTime.time} - {currentDateTime.date}
            </Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={tw`p-2`}>
            <Icon name="log-out-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={tw`flex-1 -mt-4`}>
        <View style={tw`bg-white rounded-t-3xl px-5 pt-6`}>
          <View style={tw`flex-row justify-between items-center mb-6`}>
            <Text style={tw`text-xl font-bold text-gray-800`}>
              {viewMode === 'week' ? 'Tuần này' : 'Tháng này'}
            </Text>
            <TouchableOpacity 
              onPress={toggleViewMode}
              style={tw`bg-blue-100 px-4 py-2 rounded-full`}
            >
              <Text style={tw`text-blue-500 font-medium`}>
                Xem theo {viewMode === 'week' ? 'tháng' : 'tuần'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={tw`mb-6`}>
            {lichLamViec
              .slice(0, viewMode === 'week' ? 7 : undefined)
              .map((item) => (
              <View 
                key={item.date} 
                style={tw`bg-white rounded-xl shadow-sm mb-4 border border-gray-100`}
              >
                <View style={tw`p-4 border-b border-gray-100`}>
                  <Text style={tw`text-lg font-bold text-gray-800`}>{item.date}</Text>
                  <View style={tw`flex-row items-center mt-2`}>
                    <Icon name="time-outline" size={20} color="#666" />
                    <Text style={tw`text-gray-600 ml-2`}>
                      {item.time_start} - {item.time_end}
                    </Text>
                  </View>
                </View>
                
                <View style={tw`flex-row p-3`}>
                  <TouchableOpacity 
                    onPress={() => handleDayPress(item.date, item.time_start, item.time_end)}
                    style={tw`flex-1 bg-blue-500 rounded-lg py-2 mr-2`}
                  >
                    <Text style={tw`text-white text-center font-medium`}>Chi tiết</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    onPress={() => handleLeaveRequest(item.date)}
                    style={tw`flex-1 bg-red-500 rounded-lg py-2 ml-2`}
                  >
                    <Text style={tw`text-white text-center font-medium`}>Xin nghỉ phép</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
