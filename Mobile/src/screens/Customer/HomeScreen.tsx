import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Dimensions, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import tw from 'tailwind-react-native-classnames';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

type Customer = {
    name: string;
    diem: number;
};

const HomeScreen = () => {
    const navigation = useNavigation();
    const [showRedeemModal, setShowRedeemModal] = useState(false);
    const [customer, setCustomer] = useState<Customer | null>(null);

    useEffect(() => {
        const loadCustomer = async () => {
            const customerData = await AsyncStorage.getItem('customer');
            if (customerData) {
                setCustomer(JSON.parse(customerData));
            }
        };
        loadCustomer();
    }, []);

    
    return (
        <SafeAreaView style={tw`flex-1 bg-white`}>
            <View style={tw`bg-blue-500 px-5 pt-8 pb-6`}>
                <View style={tw`flex-row justify-between items-center`}>
                    <View>
                        <Text style={tw`text-lg text-white`}>Xin chào!</Text>
                        <Text style={tw`text-2xl font-bold text-white mt-1`}>{customer?.name || 'Quý khách'}</Text>
                    </View>
                    <TouchableOpacity 
                        style={tw`p-3 bg-white/20 rounded-full`}
                        onPress={() => navigation.navigate('Profile' as never)}
                    >
                        <Icon name="person-outline" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
                <View style={tw`mt-4 flex-row items-center`}>
                    <Icon name="star" size={24} color="#FFD700" />
                    <Text style={tw`text-white text-lg font-bold ml-2`}>{customer?.diem || 0} điểm</Text>
                    <TouchableOpacity 
                        style={tw`ml-4 bg-white/30 px-4 py-2 rounded-full`}
                        onPress={() => setShowRedeemModal(true)}
                    >
                        <Text style={tw`text-white font-medium`}>Đổi điểm</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={tw`flex-1 -mt-4`}>
                <View style={tw`bg-white rounded-t-3xl px-5 pt-6`}>
                    <Text style={tw`text-xl font-bold mb-4 text-gray-800`}>Dịch vụ của chúng tôi</Text>
                    <View style={tw`flex-row flex-wrap justify-between`}>
                        {[
                            {name: 'Lịch sử', icon: 'time', iconColor: '#9333EA', bgColor: 'bg-purple-100'},
                            {name: 'Khuyến mãi', icon: 'gift', iconColor: '#F97316', bgColor: 'bg-orange-100'}
                        ].map((service, index) => (
                            <TouchableOpacity 
                                key={index} 
                                style={[
                                    tw`rounded-2xl p-4 mb-4 border border-gray-100`, 
                                    { width: (width - 60) / 2 }
                                ]}
                            >
                                <View style={tw`${service.bgColor} w-14 h-14 rounded-full justify-center items-center mb-3`}>
                                    <Icon 
                                        name={service.icon}
                                        size={28} 
                                        color={service.iconColor}
                                    />
                                </View>
                                <Text style={tw`text-base font-medium text-gray-800`}>{service.name}</Text>
                                <Text style={tw`text-sm text-gray-500 mt-1`}>Xem chi tiết</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={tw`px-5 mt-2 pb-6`}>
                    <View style={tw`flex-row justify-between items-center mb-4`}>
                        <Text style={tw`text-xl font-bold text-gray-800`}>Ưu đãi đặc biệt</Text>
                        <TouchableOpacity>
                            <Text style={tw`text-blue-500`}>Xem tất cả</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView 
                        horizontal 
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={tw`pr-5`}
                    >
                        {[1, 2, 3, 4].map((item) => (
                            <TouchableOpacity 
                                key={item} 
                                style={[
                                    tw`mr-4 bg-white rounded-2xl overflow-hidden shadow-sm`, 
                                    { width: width * 0.75 }
                                ]}
                            >
                                <View style={tw`h-40 bg-gray-100`} />
                                <View style={tw`p-4`}>
                                    <View style={tw`flex-row items-center mb-2`}>
                                        <View style={tw`bg-red-100 px-3 py-1 rounded-full`}>
                                            <Text style={tw`text-red-600 font-medium`}>Giảm {item}0%</Text>
                                        </View>
                                    </View>
                                    <Text style={tw`text-base font-bold text-gray-800 mb-1`}>
                                        Ưu đãi đặc biệt {item}
                                    </Text>
                                    <Text style={tw`text-sm text-gray-500`}>
                                        Áp dụng cho khách hàng mới
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </ScrollView>

            <Modal
                animationType="slide"
                transparent={true}
                visible={showRedeemModal}
                onRequestClose={() => setShowRedeemModal(false)}
            >
                <View style={tw`flex-1 bg-black/50 justify-end`}>
                    <View style={tw`bg-white rounded-t-3xl p-5`}>
                        <View style={tw`flex-row justify-between items-center mb-4`}>
                            <Text style={tw`text-xl font-bold text-gray-800`}>Đổi điểm</Text>
                            <TouchableOpacity onPress={() => setShowRedeemModal(false)}>
                                <Icon name="close" size={24} color="#000" />
                            </TouchableOpacity>
                        </View>
                        <Text style={tw`text-base text-gray-600 mb-4`}>
                            Điểm hiện có: {customer?.diem || 0} điểm
                        </Text>
                        {/* Thêm nội dung đổi điểm ở đây */}
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default HomeScreen;