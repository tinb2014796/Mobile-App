import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import tw from 'tailwind-react-native-classnames';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomerService from '../../services/customer.service';
import { handleResponse } from '../../function';

const ChangePasswordScreen = () => {
    const navigation = useNavigation();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Lỗi', 'Mật khẩu mới không khớp');
            return;
        }

        try {
            const customerData = await AsyncStorage.getItem('customer');
            if (!customerData) {
                Alert.alert('Lỗi', 'Vui lòng đăng nhập lại');
                return;
            }

            const customer = JSON.parse(customerData);
            const passwordData = {
                customer_id: customer.id,
                old_password: currentPassword,
                new_password: newPassword
            };

            const response = await CustomerService.changePassword(passwordData);
            const data = handleResponse(response);
            
            if (data.error) {
                Alert.alert('Lỗi', data.error);
                return;
            }

            Alert.alert('Thành công', data.message, [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error: any) {
            const data = handleResponse(error.response.data);
            console.log(data);
            Alert.alert('Lỗi', data || 'Có lỗi xảy ra');
        }
    };

    return (
        <View style={tw`flex-1 bg-white`}>
            <View style={tw`flex-row items-center p-4 bg-blue-500`}>
                <TouchableOpacity 
                    onPress={() => navigation.goBack()}
                    style={tw`mr-3`}
                >
                    <Icon name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={tw`text-white text-xl`}>Đổi mật khẩu</Text>
            </View>

            <View style={tw`p-6`}>
                <View style={tw`mb-6`}>
                    <Text style={tw`text-gray-600 mb-2`}>Mật khẩu hiện tại</Text>
                    <View style={tw`flex-row items-center border rounded-lg p-3`}>
                        <TextInput
                            style={tw`flex-1`}
                            secureTextEntry={!showCurrentPassword}
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                            placeholder="Nhập mật khẩu hiện tại"
                        />
                        <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
                            <Icon name={showCurrentPassword ? "visibility" : "visibility-off"} size={24} color="#666" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={tw`mb-6`}>
                    <Text style={tw`text-gray-600 mb-2`}>Mật khẩu mới</Text>
                    <View style={tw`flex-row items-center border rounded-lg p-3`}>
                        <TextInput
                            style={tw`flex-1`}
                            secureTextEntry={!showNewPassword}
                            value={newPassword}
                            onChangeText={setNewPassword}
                            placeholder="Nhập mật khẩu mới"
                        />
                        <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                            <Icon name={showNewPassword ? "visibility" : "visibility-off"} size={24} color="#666" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={tw`mb-8`}>
                    <Text style={tw`text-gray-600 mb-2`}>Xác nhận mật khẩu mới</Text>
                    <View style={tw`flex-row items-center border rounded-lg p-3`}>
                        <TextInput
                            style={tw`flex-1`}
                            secureTextEntry={!showConfirmPassword}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            placeholder="Xác nhận mật khẩu mới"
                        />
                        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                            <Icon name={showConfirmPassword ? "visibility" : "visibility-off"} size={24} color="#666" />
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity
                    style={tw`bg-blue-500 p-4 rounded-lg`}
                    onPress={handleChangePassword}
                >
                    <Text style={tw`text-white text-center font-bold text-lg`}>Đổi mật khẩu</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ChangePasswordScreen;
