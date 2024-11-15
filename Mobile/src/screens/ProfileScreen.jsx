import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ navigation }) => {
    const [user, setUser] = useState({
        name: 'Nguyễn Văn A',
        email: 'nguyenvana@example.com'
    });

    return (
        <SafeAreaView style={tw`flex-1 bg-gray-50`}>
            <View style={tw`bg-blue-500 px-5 pt-12 pb-8`}>
                <View style={tw`flex-row items-center justify-between`}>
                    <TouchableOpacity 
                        onPress={() => navigation.goBack()}
                        style={tw`p-2`}
                    >
                        <Icon name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={tw`text-xl font-bold text-white`}>Hồ sơ</Text>
                    <View style={tw`w-8`} />
                </View>
            </View>

            <ScrollView style={tw`flex-1 -mt-4`}>
                <View style={tw`bg-white rounded-t-3xl px-5 pt-6`}>
                    <View style={tw`items-center mb-6`}>
                        <View style={tw`w-24 h-24 bg-gray-200 rounded-full justify-center items-center mb-3`}>
                            <Icon name="person" size={48} color="#666" />
                        </View>
                        <Text style={tw`text-xl font-bold text-gray-800`}>{user.name}</Text>
                        <Text style={tw`text-gray-500 mt-1`}>{user.email}</Text>
                    </View>

                    {[
                        {icon: 'person-outline', title: 'Chỉnh sửa hồ sơ'},
                        {icon: 'key-outline', title: 'Đổi mật khẩu'},
                        {icon: 'notifications-outline', title: 'Thông báo'},
                        {icon: 'shield-outline', title: 'Quyền riêng tư'},
                        {icon: 'settings-outline', title: 'Cài đặt'},
                        {icon: 'help-circle-outline', title: 'Trợ giúp'},
                    ].map((item, index) => (
                        <TouchableOpacity 
                            key={index}
                            style={tw`flex-row items-center py-4 border-b border-gray-100`}
                            onPress={() => console.log(item.title)}
                        >
                            <Icon name={item.icon} size={24} color="#666" />
                            <Text style={tw`flex-1 text-gray-800 text-lg ml-4`}>{item.title}</Text>
                            <Icon name="chevron-forward" size={20} color="#666" />
                        </TouchableOpacity>
                    ))}

                    <TouchableOpacity 
                        style={tw`mt-6 mb-8 bg-red-500 py-3 px-6 rounded-xl`}
                        onPress={() => console.log('Đăng xuất')}
                    >
                        <Text style={tw`text-white text-center font-bold text-lg`}>Đăng xuất</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ProfileScreen;