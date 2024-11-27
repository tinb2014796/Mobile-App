// screens/AuthScreen.js
import React, { useState, useEffect } from 'react';
import authService from '../../services/auth.service';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, Modal } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import { useNavigation } from '@react-navigation/native';
import { handleResponse } from '../../function';
import { useDispatch } from 'react-redux';
import { customerLoginSuccess } from '../../redux/reducers/customerReducers';
import tw from 'tailwind-react-native-classnames';
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const AuthScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [isRegister, setIsRegister] = useState(false);
  const dispatch = useDispatch();

  // Thêm state mới
  const [sex, setSex] = useState('');
  const [birthday, setBirthday] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [address, setAddress] = useState('');
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  
  // Thêm state cho modal
  const [showSexModal, setShowSexModal] = useState(false);
  const [showProvinceModal, setShowProvinceModal] = useState(false);
  const [showDistrictModal, setShowDistrictModal] = useState(false);
  const [showWardModal, setShowWardModal] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    // Fetch provinces khi component mount
    fetchProvinces();

    return () => unsubscribe();
  }, []);

  const fetchProvinces = async () => {
    try {
      const response = await fetch('https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province', {
        method: 'GET',
        headers: {
          'Token': 'c6967a25-9a90-11ef-8e53-0a00184fe694',
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data && data.data) {
        setProvinces(data.data);
      }
    } catch (err) {
      console.error('Error fetching provinces:', err);
    }
  };

  const fetchDistricts = async (provinceId) => {
    try {
      const response = await fetch(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${provinceId}`, {
        method: 'GET',
        headers: {
          'Token': 'c6967a25-9a90-11ef-8e53-0a00184fe694',
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data && data.data) {
        setDistricts(data.data);
      }
    } catch (err) {
      console.error('Error fetching districts:', err);
    }
  };

  const fetchWards = async (districtId) => {
    try {
      const response = await fetch(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${districtId}`, {
        method: 'GET',
        headers: {
          'Token': 'c6967a25-9a90-11ef-8e53-0a00184fe694',
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data && data.data) {
        setWards(data.data);
      }
    } catch (err) {
      console.error('Error fetching wards:', err);
    }
  };

  const handleLogin = async () => {
    if (!isConnected) {
      setError('Không có kết nối internet. Vui lòng kiểm tra mạng và thử lại.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      if (!email || !password) {
        setError('Vui lòng nhập đầy đủ email và mật khẩu');
        setLoading(false);
        return;
      }

      const data = {
        email: email,
        password: password
      };

      try {
        const response = await authService.login(data);
        const responseData = handleResponse(response.data);
        
        if (responseData.customer) {
          dispatch(customerLoginSuccess(responseData.customer));
          navigation.navigate('Home');
        } else {
          setError('Email hoặc mật khẩu không đúng');
        }
      } catch (err) {
        console.log(err);
        if (err.response && err.response.data) {
          const error = handleResponse(err.response.data);
          setError(error.message || 'Đã xảy ra lỗi');
        } else {
          setError('Đã xảy ra lỗi khi xử lý yêu cầu');
        }
      }
    } catch (err) {
      setError('Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!isConnected) {
      setError('Không có kết nối internet. Vui lòng kiểm tra mạng và thử lại.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      if (!email || !password || !name || !familyName || !phone || !confirmPassword || !sex || !birthday || !address || !selectedProvince || !selectedDistrict || !selectedWard) {
        setError('Vui lòng nhập đầy đủ thông tin');
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError('Mật khẩu xác nhận không khớp');
        setLoading(false);
        return;
      }

      const data = {
        email: email,
        password: password,
        name: name,
        familyname: familyName,
        phone: phone,
        sex: sex,
        birthday: birthday.toISOString().split('T')[0],
        address: address,
        province_id: selectedProvince,
        district_id: selectedDistrict,
        ward_code: selectedWard
      };

      try {
        const response = await authService.register(data);
        const responseData = handleResponse(response.data);
        
        if (responseData.customer) {
          dispatch(customerLoginSuccess(responseData.customer));
          navigation.navigate('Home');
        } else {
          setError('Đăng ký thất bại. Vui lòng thử lại.');
        }
      } catch (err) {
        if (err.response && err.response.data) {
          const error = handleResponse(err.response.data);
          setError(error.message || 'Đã xảy ra lỗi');
        } else {
          setError('Đã xảy ra lỗi khi xử lý yêu cầu');
        }
      }
    } catch (err) {
      setError('Đăng ký thất bại. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={tw`flex-1 bg-blue-500`}>
      <View style={tw`flex-1 justify-center items-center p-5`}>
        {!isConnected && (
          <View style={tw`flex-row items-center bg-red-500 bg-opacity-90 p-2.5 rounded-lg mb-5`}>
            <Icon name="wifi" size={20} color="white" />
            <Text style={tw`text-white ml-2.5 text-sm`}>Không có kết nối internet</Text>
          </View>
        )}
        
        <View style={tw`items-center mb-10`}>
          <Text style={tw`text-4xl font-bold text-white`}>{isRegister ? 'Đăng ký' : 'Đăng nhập'}</Text>
          <Text style={tw`text-lg text-white mt-2.5`}>
            {isRegister ? 'Tạo tài khoản mới' : 'Chào mừng bạn trở lại'}
          </Text>
        </View>

        <View style={tw`w-full max-w-md bg-white bg-opacity-95 p-6 rounded-2xl shadow-lg`}>
          {isRegister && (
            <>
              <View style={tw`flex-row items-center mb-4 bg-gray-100 rounded-lg px-4`}>
                <Icon name="user" size={20} color="#3B82F6" />
                <TextInput
                  placeholder="Họ"
                  style={tw`flex-1 h-12 text-gray-800 text-base ml-2.5`}
                  value={familyName}
                  onChangeText={setFamilyName}
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={tw`flex-row items-center mb-4 bg-gray-100 rounded-lg px-4`}>
                <Icon name="user" size={20} color="#3B82F6" />
                <TextInput
                  placeholder="Tên"
                  style={tw`flex-1 h-12 text-gray-800 text-base ml-2.5`}
                  value={name}
                  onChangeText={setName}
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={tw`flex-row items-center mb-4 bg-gray-100 rounded-lg px-4`}>
                <Icon name="phone" size={20} color="#3B82F6" />
                <TextInput
                  placeholder="Số điện thoại"
                  style={tw`flex-1 h-12 text-gray-800 text-base ml-2.5`}
                  value={phone}
                  onChangeText={setPhone}
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                />
              </View>

              <TouchableOpacity 
                style={tw`mb-4 bg-gray-100 rounded-lg px-4 py-3`}
                onPress={() => setShowSexModal(true)}
              >
                <Text style={tw`text-gray-800`}>
                  {sex ? (sex === 'male' ? 'Nam' : 'Nữ') : 'Chọn giới tính'}
                </Text>
              </TouchableOpacity>

              <Modal
                visible={showSexModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowSexModal(false)}
              >
                <TouchableOpacity 
                  style={tw`flex-1 bg-black bg-opacity-50`}
                  activeOpacity={1}
                  onPress={() => setShowSexModal(false)}
                >
                  <View style={tw`flex-1 justify-end`}>
                    <View style={tw`bg-white rounded-t-lg`}>
                      <TouchableOpacity 
                        style={tw`p-4 border-b border-gray-200`}
                        onPress={() => {
                          setSex('male');
                          setShowSexModal(false);
                        }}
                      >
                        <Text style={tw`text-center text-lg`}>Nam</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={tw`p-4 border-b border-gray-200`}
                        onPress={() => {
                          setSex('female');
                          setShowSexModal(false);
                        }}
                      >
                        <Text style={tw`text-center text-lg`}>Nữ</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={tw`p-4`}
                        onPress={() => setShowSexModal(false)}
                      >
                        <Text style={tw`text-center text-lg text-red-500`}>Hủy</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              </Modal>

              <TouchableOpacity 
                style={tw`mb-4 bg-gray-100 rounded-lg px-4 py-3`}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={tw`text-gray-800`}>
                  {birthday ? birthday.toLocaleDateString() : 'Chọn ngày sinh'}
                </Text>
              </TouchableOpacity>

              <DateTimePickerModal
                isVisible={showDatePicker}
                mode="date"
                onConfirm={(date) => {
                  setBirthday(date);
                  setShowDatePicker(false);
                }}
                onCancel={() => setShowDatePicker(false)}
              />

              <View style={tw`flex-row items-center mb-4 bg-gray-100 rounded-lg px-4`}>
                <Icon name="map-marker" size={20} color="#3B82F6" />
                <TextInput
                  placeholder="Địa chỉ"
                  style={tw`flex-1 h-12 text-gray-800 text-base ml-2.5`}
                  value={address}
                  onChangeText={setAddress}
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <TouchableOpacity 
                style={tw`mb-4 bg-gray-100 rounded-lg px-4 py-3`}
                onPress={() => setShowProvinceModal(true)}
              >
                <Text style={tw`text-gray-800`}>
                  {selectedProvince ? provinces.find(p => p.ProvinceID === selectedProvince)?.ProvinceName : 'Chọn tỉnh/thành'}
                </Text>
              </TouchableOpacity>

              <Modal
                visible={showProvinceModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowProvinceModal(false)}
              >
                <TouchableOpacity 
                  style={tw`flex-1 bg-black bg-opacity-50`}
                  activeOpacity={1}
                  onPress={() => setShowProvinceModal(false)}
                >
                  <View style={tw`flex-1 justify-end`}>
                    <View style={tw`bg-white rounded-t-lg max-h-96`}>
                      <ScrollView>
                        {provinces.map((province) => (
                          <TouchableOpacity 
                            key={province.ProvinceID}
                            style={tw`p-4 border-b border-gray-200`}
                            onPress={() => {
                              setSelectedProvince(province.ProvinceID);
                              fetchDistricts(province.ProvinceID);
                              setShowProvinceModal(false);
                            }}
                          >
                            <Text style={tw`text-center text-lg`}>{province.ProvinceName}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                      <TouchableOpacity 
                        style={tw`p-4`}
                        onPress={() => setShowProvinceModal(false)}
                      >
                        <Text style={tw`text-center text-lg text-red-500`}>Hủy</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              </Modal>

              <TouchableOpacity 
                style={tw`mb-4 bg-gray-100 rounded-lg px-4 py-3`}
                onPress={() => setShowDistrictModal(true)}
              >
                <Text style={tw`text-gray-800`}>
                  {selectedDistrict ? districts.find(d => d.DistrictID === selectedDistrict)?.DistrictName : 'Chọn quận/huyện'}
                </Text>
              </TouchableOpacity>

              <Modal
                visible={showDistrictModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowDistrictModal(false)}
              >
                <TouchableOpacity 
                  style={tw`flex-1 bg-black bg-opacity-50`}
                  activeOpacity={1}
                  onPress={() => setShowDistrictModal(false)}
                >
                  <View style={tw`flex-1 justify-end`}>
                    <View style={tw`bg-white rounded-t-lg max-h-96`}>
                      <ScrollView>
                        {districts.map((district) => (
                          <TouchableOpacity 
                            key={district.DistrictID}
                            style={tw`p-4 border-b border-gray-200`}
                            onPress={() => {
                              setSelectedDistrict(district.DistrictID);
                              fetchWards(district.DistrictID);
                              setShowDistrictModal(false);
                            }}
                          >
                            <Text style={tw`text-center text-lg`}>{district.DistrictName}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                      <TouchableOpacity 
                        style={tw`p-4`}
                        onPress={() => setShowDistrictModal(false)}
                      >
                        <Text style={tw`text-center text-lg text-red-500`}>Hủy</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              </Modal>

              <TouchableOpacity 
                style={tw`mb-4 bg-gray-100 rounded-lg px-4 py-3`}
                onPress={() => setShowWardModal(true)}
              >
                <Text style={tw`text-gray-800`}>
                  {selectedWard ? wards.find(w => w.WardCode === selectedWard)?.WardName : 'Chọn phường/xã'}
                </Text>
              </TouchableOpacity>

              <Modal
                visible={showWardModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowWardModal(false)}
              >
                <TouchableOpacity 
                  style={tw`flex-1 bg-black bg-opacity-50`}
                  activeOpacity={1}
                  onPress={() => setShowWardModal(false)}
                >
                  <View style={tw`flex-1 justify-end`}>
                    <View style={tw`bg-white rounded-t-lg max-h-96`}>
                      <ScrollView>
                        {wards.map((ward) => (
                          <TouchableOpacity 
                            key={ward.WardCode}
                            style={tw`p-4 border-b border-gray-200`}
                            onPress={() => {
                              setSelectedWard(ward.WardCode);
                              setShowWardModal(false);
                            }}
                          >
                            <Text style={tw`text-center text-lg`}>{ward.WardName}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                      <TouchableOpacity 
                        style={tw`p-4`}
                        onPress={() => setShowWardModal(false)}
                      >
                        <Text style={tw`text-center text-lg text-red-500`}>Hủy</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              </Modal>
            </>
          )}

          <View style={tw`flex-row items-center mb-4 bg-gray-100 rounded-lg px-4`}>
            <Icon name="envelope" size={20} color="#3B82F6" />
            <TextInput
              placeholder="Email"
              style={tw`flex-1 h-12 text-gray-800 text-base ml-2.5`}
              value={email}
              onChangeText={setEmail}
              placeholderTextColor="#9CA3AF"
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={tw`flex-row items-center mb-4 bg-gray-100 rounded-lg px-4`}>
            <Icon name="lock" size={20} color="#3B82F6" />
            <TextInput
              placeholder="Mật khẩu"
              style={tw`flex-1 h-12 text-gray-800 text-base ml-2.5`}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              placeholderTextColor="#9CA3AF"
              autoCapitalize="none"
            />
          </View>

          {isRegister && (
            <View style={tw`flex-row items-center mb-4 bg-gray-100 rounded-lg px-4`}>
              <Icon name="lock" size={20} color="#3B82F6" />
              <TextInput
                placeholder="Xác nhận mật khẩu"
                style={tw`flex-1 h-12 text-gray-800 text-base ml-2.5`}
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
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
            onPress={isRegister ? handleRegister : handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Icon name={isRegister ? "user-plus" : "sign-in"} size={20} color="white" style={tw`mr-2.5`} />
                <Text style={tw`text-white text-base font-semibold`}>
                  {isRegister ? 'ĐĂNG KÝ' : 'ĐĂNG NHẬP'}
                </Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={tw`mt-4 items-center`}
            onPress={() => {
              setIsRegister(!isRegister);
              setError(null);
              setEmail('');
              setPassword('');
              setName('');
              setFamilyName('');
              setPhone('');
              setConfirmPassword('');
              setSex('');
              setBirthday(new Date());
              setAddress('');
              setSelectedProvince('');
              setSelectedDistrict('');
              setSelectedWard('');
            }}
          >
            <Text style={tw`text-blue-500`}>
              {isRegister ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Đăng ký'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default AuthScreen;
