// screens/AuthScreen.js
import React, { useState, useEffect } from 'react';
import authService from '../../services/auth.service';
import { View, Text, TextInput, Button, Alert, TouchableOpacity, ActivityIndicator, ImageBackground } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import { useNavigation } from '@react-navigation/native';
import { handleResponse } from '../../function';
import { useDispatch } from 'react-redux';
import { authLogin } from '../../redux/reducers/authReducers';
import { customerLoginSuccess } from '../../redux/reducers/customerReducers';
import { handleToken } from '../../function';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tw from 'tailwind-react-native-classnames';
import Icon from 'react-native-vector-icons/FontAwesome';

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
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
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

        if (isRegister) {
          if (!name || !username || !password) {
            Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
            setLoading(false);
            return;
          }

          const registerData = {
            name: name,
            phone: username,
            password: password
          };

          try {
            const response = await authService.registerCustomer(registerData);
            const responseData = handleResponse(response.data);
            if (responseData.success) {
              console.log(responseData);
              Alert.alert('Thành công', responseData.message);
              setIsRegister(false);
              setName('');
              setPassword('');
              setUsername('');
            } else {
              setError(responseData.message);
              setLoading(false);
            }
          } catch (err) {
            if (err.response && err.response.data) {
              const error = handleResponse(err.response.data);
              setError(error.message);
              setLoading(false);
            } else {
              setError('Đăng ký thất bại. Vui lòng thử lại.');
              setLoading(false);
            }
          }
        } else {
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
              dispatch(customerLoginSuccess(responseData.customer));
              navigation.navigate('Home');
            } else {
              setError('Phản hồi đăng nhập không hợp lệ');
            }
          } catch (err) {
            if (err.response && err.response.data) {
              const error = handleResponse(err.response.data);
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
            navigation.navigate('TabNavigator');
          } else {
            setError(dataResponse.message || 'Phản hồi đăng nhập không hợp lệ');
          }
        } catch (err) {
          if (err.response && err.response.data) {
            const error = handleResponse(err.response.data);
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
      setError('Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={tw`flex-1 bg-blue-500`}>
      <View style={tw`flex-1 justify-center items-center p-5`}>
        {!isConnected && (
          <View style={tw`flex-row items-center bg-red-500 bg-opacity-90 p-2.5 rounded-lg mb-5`}>
            <Icon name="wifi" size={20} color="white" />
            <Text style={tw`text-white ml-2.5 text-sm`}>Không có kết nối internet</Text>
          </View>
        )}
        
        <View style={tw`items-center mb-10`}>
          <Text style={tw`text-4xl font-bold text-white`}></Text>
          <Text style={tw`text-lg text-white mt-2.5`}>Chào mừng bạn trở lại</Text>
        </View>

        <View style={tw`w-full max-w-md bg-white bg-opacity-95 p-6 rounded-2xl shadow-lg`}>
          <View style={tw`flex-row mb-6 bg-gray-100 rounded-lg p-1`}>
            <TouchableOpacity 
              style={tw`flex-1 flex-row justify-center items-center py-3 rounded-lg ${isCustomer ? 'bg-blue-500' : ''}`}
              onPress={() => {
                setIsCustomer(true);
                setShowPasswordCreate(false);
                setIsRegister(false);
                setError(null);
              }}
            >
              <Icon name="user" size={16} color={isCustomer ? 'white' : '#3B82F6'} />
              <Text style={tw`${isCustomer ? 'text-white' : 'text-blue-500'} font-semibold ml-2`}>Khách hàng</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={tw`flex-1 flex-row justify-center items-center py-3 rounded-lg ${!isCustomer ? 'bg-blue-500' : ''}`}
              onPress={() => {
                setIsCustomer(false);
                setShowPasswordCreate(false);
                setIsRegister(false);
                setError(null);
              }}
            >
              <Icon name="briefcase" size={16} color={!isCustomer ? 'white' : '#3B82F6'} />
              <Text style={tw`${!isCustomer ? 'text-white' : 'text-blue-500'} font-semibold ml-2`}>Nhân viên</Text>
            </TouchableOpacity>
          </View>

          {isCustomer && isRegister && (
            <View style={tw`flex-row items-center mb-4 bg-gray-100 rounded-lg px-4`}>
              <Icon name="user" size={20} color="#3B82F6" />
              <TextInput
                placeholder="Họ tên"
                style={tw`flex-1 h-12 text-gray-800 text-base ml-2.5`}
                value={name}
                onChangeText={setName}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          )}

          <View style={tw`flex-row items-center mb-4 bg-gray-100 rounded-lg px-4`}>
            <Icon name={isCustomer ? "phone" : "envelope"} size={20} color="#3B82F6" />
            <TextInput
              placeholder={isCustomer ? "Số điện thoại" : "Email"}
              style={tw`flex-1 h-12 text-gray-800 text-base ml-2.5`}
              value={username}
              onChangeText={setUsername}
              placeholderTextColor="#9CA3AF"
              autoCapitalize="none"
              keyboardType={isCustomer ? "phone-pad" : "email-address"}
            />
          </View>

          {(!isCustomer || showPasswordCreate || isRegister) && (
            <View style={tw`flex-row items-center mb-4 bg-gray-100 rounded-lg px-4`}>
              <Icon name="lock" size={20} color="#3B82F6" />
              <TextInput
                placeholder={showPasswordCreate ? "Tạo mật khẩu" : "Mật khẩu"}
                style={tw`flex-1 h-12 text-gray-800 text-base ml-2.5`}
                secureTextEntry
                value={showPasswordCreate ? newPassword : password}
                onChangeText={showPasswordCreate ? setNewPassword : setPassword}
                placeholderTextColor="#9CA3AF"
                autoCapitalize="none"
              />
            </View>
          )}

          {error && (
            <View style={tw`flex-row items-center bg-red-100 p-2.5 rounded-lg mb-4`}>
              <Icon name="exclamation-circle" size={16} color="red" />
              <Text style={tw`text-red-500 ml-2 text-sm`}>{error}</Text>
            </View>
          )}

          <TouchableOpacity 
            style={tw`flex-row bg-blue-500 py-4 rounded-lg items-center justify-center mt-5 ${loading ? 'opacity-70' : ''}`}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Icon name={isRegister ? "user-plus" : "sign-in"} size={20} color="white" style={tw`mr-2.5`} />
                <Text style={tw`text-white text-base font-semibold`}>
                  {isRegister ? 'ĐĂNG KÝ' : (showPasswordCreate ? 'TẠO MẬT KHẨU' : 'ĐĂNG NHẬP')}
                </Text>
              </>
            )}
          </TouchableOpacity>

          {isCustomer && (
            <TouchableOpacity 
              style={tw`mt-5 items-center`}
              onPress={() => {
                setIsRegister(!isRegister);
                setError(null);
                setPassword('');
                setName('');
              }}
            >
              <Text style={tw`text-blue-500 text-sm font-medium`}>
                {isRegister ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Đăng ký ngay'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default AuthScreen;
