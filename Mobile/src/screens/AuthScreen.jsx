// screens/AuthScreen.js
import React, { useState, useEffect } from 'react';
import authService from '../services/auth.service';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import { useNavigation } from '@react-navigation/native';
import { handleResponse } from '../function';
import { useDispatch } from 'react-redux';
import { authLogin } from '../redux/reducers/authReducers';
import { handleToken } from '../function';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [errors, setErrors] = useState({});
  const [isCustomer, setIsCustomer] = useState(true);
  const [showPasswordCreate, setShowPasswordCreate] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    if (!isConnected) {
      setError('Không có kết nối internet. Vui lòng kiểm tra mạng và thử lại.');
      return;
    }

    setError(null);
    setErrors({});
    setLoading(true);

    try {
      if (isCustomer) {
        if (!username) {
          Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại');
          setLoading(false);
          return;
        }

        const data = {
          phone: username,
          password: showPasswordCreate ? newPassword : password
        };
        try {
          const response = await authService.loginCustomer(data);
          const responseData = handleResponse(response.data);
         
          if (!responseData || !responseData.customer) {
            throw new Error('Invalid response');
          }

          if (responseData.customer) {
            await AsyncStorage.setItem('customer', JSON.stringify(responseData.customer));
            navigation.navigate('Home');
          } else {
            setError('Phản hồi đăng nhập không hợp lệ');
          }
        } catch (err) {
          if (err.response && err.response.data) {
            const error = err.response.data;
            if (error.status === 403) {
              if (error.requires_password) {
                setShowPasswordCreate(true);
                setError(error.message);
              } else {
                setError(error.message || 'Truy cập bị từ chối');
              }
            } else {
              setError(error.message || 'Đã xảy ra lỗi');
            }
          } else {
            setError('Đã xảy ra lỗi khi xử lý yêu cầu');
          }
        }

      } else {
        if (!username || !password) {
          Alert.alert('Lỗi', 'Vui lòng nhập cả tên đăng nhập và mật khẩu');
          setLoading(false);
          return;
        }

        const data = {
          email: username,
          password: password,
        };

        try {
          const response = await authService.login(data);
          const responseData = handleResponse(response.data);
          console.log('responseData:', responseData);
          if (!responseData || !responseData.user) {
            throw new Error('Invalid response');
          }
          const dataResponse = responseData;
          
          if (dataResponse.user && dataResponse.token) {
            const token = dataResponse.token;
            
            dispatch(authLogin({
              access_token: token,
              user: dataResponse.user
            }));

            await AsyncStorage.setItem('access_token', token);

            navigation.navigate('Home');

          } else {
            setError(dataResponse.message || 'Phản hồi đăng nhập không hợp lệ');
          }
        } catch (err) {
          if (err.response && err.response.data) {
            const error = err.response.data;
            console.log('lỗi:', error);
            if (error.status === 403) {
              setError(error.message || 'Truy cập bị từ chối');
            } else {
              setError(error.message || 'Đã xảy ra lỗi');
            }
          } else {
            setError('Đã xảy ra lỗi khi xử lý yêu cầu');
          }
        }
      }

    } catch (err) {
      console.error('Lỗi đăng nhập:', err);
      setError('Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {!isConnected && (
        <Text style={styles.networkError}>Không có kết nối internet</Text>
      )}
      <View style={styles.authContainer}>
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, isCustomer && styles.activeTab]}
            onPress={() => {
              setIsCustomer(true);
              setShowPasswordCreate(false);
            }}
          >
            <Text style={[styles.tabText, isCustomer && styles.activeTabText]}>Khách hàng</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, !isCustomer && styles.activeTab]}
            onPress={() => {
              setIsCustomer(false);
              setShowPasswordCreate(false);
            }}
          >
            <Text style={[styles.tabText, !isCustomer && styles.activeTabText]}>Nhân viên</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          placeholder={isCustomer ? "Số điện thoại" : "Email"}
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholderTextColor="#ccc"
          autoCapitalize="none"
          keyboardType={isCustomer ? "phone-pad" : "email-address"}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email[0]}</Text>}
        
        {(!isCustomer || showPasswordCreate) && (
          <>
            <TextInput
              placeholder={showPasswordCreate ? "Tạo mật khẩu" : "Mật khẩu"}
              style={styles.input}
              secureTextEntry
              value={showPasswordCreate ? newPassword : password}
              onChangeText={showPasswordCreate ? setNewPassword : setPassword}
              placeholderTextColor="#ccc"
              autoCapitalize="none"
            />
            {errors.password && <Text style={styles.errorText}>{errors.password[0]}</Text>}
          </>
        )}
        
        {error && <Text style={styles.errorText}>{error}</Text>}
        <TouchableOpacity 
          style={[styles.loginButton, loading && styles.disabledButton]} 
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.loginButtonText}>
              {showPasswordCreate ? 'TẠO MẬT KHẨU' : 'ĐĂNG NHẬP'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0c1d1',
  },
  header: {
    marginBottom: 50,
  },
  headerText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'red',
  },
  authContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginVertical: 10,
    borderRadius: 5,
    color: '#000',
  },
  loginButton: {
    backgroundColor: '#a020f0',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  networkError: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    padding: 10,
    borderRadius: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#a020f0',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#a020f0',
  },
  tabText: {
    color: '#a020f0',
    fontWeight: '600',
  },
  activeTabText: {
    color: 'white',
  }
});

export default AuthScreen;
