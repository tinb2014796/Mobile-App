import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import employeeService from '../services/employee.service';
import { handleResponse } from '../function/index';
import { useSelector } from 'react-redux';
import { selectAuth } from '../redux/reducers/authReducers';


const AttendanceScreen = ({ navigation }) => {
  const [lichLamViec, setLichLamViec] = useState([]);
  const [todayShift, setTodayShift] = useState(null);
  const username = useSelector(selectAuth).user;
  const [chamCong, setChamCong] = useState(null);

  useEffect(() => {
    const fetchLichLamViec = async () => {
      const response = await employeeService.lichLamViec(username.id);
      const data = handleResponse(response);
      setLichLamViec(data);
      
      // Find today's shift
      const today = new Date().toISOString().split('T')[0];
      const todayShift = data.find(shift => shift.date === today);
      setTodayShift(todayShift);
    };

    fetchLichLamViec();
    //get info attendance in day
    const today = new Date().toISOString().split('T')[0];
      const fetchChamCong = async () => {
        const req = await employeeService.fetchChamCong(username.id, today);
        const data = handleResponse(req);
        if(data){
          setChamCong(data);
        }
      };
    fetchChamCong();

  }, []);

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  const navigateToAttendanceDetail = (type) => {
    if (!todayShift) {
      // Handle case when there's no shift today
      alert('No shift scheduled for today');
      return;
    }
    navigation.navigate('AttendanceDetail', { 
      caLamViec: todayShift,
      type: type,
      id_nhanvien: username.id,
      chamCong: chamCong
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.userName}>{username.name}</Text>
        <Text style={styles.companyName}>Cửa hàng 1</Text>
        <Button title="Lịch sử chấm công" onPress={() => {}} color="#FFFFFF" />
      </View>
      <View style={styles.dateContainer}>
        <Text style={styles.date}>{todayShift ? formatDate(todayShift.date) : 'Không có ca làm việc hôm nay'}</Text>
      </View>
      <View style={styles.timeContainer}>
        <View style={styles.timeBlock}>
          <Text style={styles.timeLabel}>Vào làm</Text>
          <Text style={styles.time}>{chamCong ? chamCong.time_start : '-- : --'}</Text>
          <Button title="Vào làm" onPress={() => navigateToAttendanceDetail('in', todayShift)} />
        </View>
        <View style={styles.timeBlock}>
          <Text style={styles.timeLabel}>Ra về</Text>
          <Text style={styles.time}>{chamCong ? chamCong.time_end : '-- : --'}</Text>
          <Button title="Ra về" onPress={() => navigateToAttendanceDetail('out', todayShift)} />
        </View>
      </View>
      <View style={styles.weekContainer}>
        <Text style={styles.week}>Tuần này ({lichLamViec.length > 0 ? `${lichLamViec[0].date} - ${lichLamViec[lichLamViec.length - 1].date}` : ''})</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F0F0F0',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#007BFF',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  companyName: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  dateContainer: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  date: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#555',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    alignItems: 'center',
  },
  timeBlock: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginHorizontal: 5,
  },
  timeLabel: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  time: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  weekContainer: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  week: {
    fontSize: 16,
    color: '#555',
    fontWeight: 'bold',
  },
});

export default AttendanceScreen;
