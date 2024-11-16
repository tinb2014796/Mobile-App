import React, { useState, useEffect } from 'react';
import { View, Text, Alert, ScrollView, TouchableOpacity } from 'react-native';
import promotionService from '../../services/promotion.service';
import { handleResponse } from '../../function';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import tw from 'tailwind-react-native-classnames';
import { useNavigation } from '@react-navigation/native';

type Product = {
    id: number;
    name: string;
};

type Promotion = {
    id: number;
    code: string;
    discount_percentage: string;
    quantity: string;
    start_date: string;
    end_date: string;
    max_value: string;
    min_value: string;
    name: string;
    catalory: string;
};

type Customer = {
    id: number;
    name: string;
    diem: number;
};

const VoucherScreen = () => {
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [customer, setCustomer] = useState<Customer | null>(null);
    const navigation = useNavigation();

    useEffect(() => {
        const loadCustomer = async () => {
            const customerData = await AsyncStorage.getItem('customer');
            if (customerData) {
                setCustomer(JSON.parse(customerData));
            }
        };
        loadCustomer();
        fetchPromotions();
    }, []);

    const fetchPromotions = async () => {
        try {
            const customerData = await AsyncStorage.getItem('customer');
            if (!customerData) {
                Alert.alert('Lỗi', 'Vui lòng đăng nhập để xem lịch sử đơn hàng');
                return;
            }
            const customer = JSON.parse(customerData);
            const response = await promotionService.getPromotionByCustomerId(customer.id);
            const data = handleResponse(response);
            if (data.success) {
                setPromotions(data.data);
            }
        } catch (error: any) {
            console.log(error);
        }
    };

    const formatDate = (date: string) => {
        if (!date) return 'Không có ngày';
        try {
            const d = new Date(date);
            return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
        } catch (error) {
            return 'Ngày không hợp lệ';
        }
    };

    return (
        <View style={tw`flex-1 bg-gray-100`}>
            {/* Header */}
            <View style={tw`bg-blue-500 p-4 flex-row items-center`}>
                <TouchableOpacity 
                    onPress={() => navigation.goBack()}
                    style={tw`mr-4`}
                >
                    <Icon name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={tw`text-white text-xl font-bold`}>
                    Voucher của tôi
                </Text>
            </View>

            <ScrollView style={tw`flex-1`}>
                <View style={tw`px-4 py-6`}>
                    {promotions.map((promotion) => (
                        <View 
                            key={promotion.id} 
                            style={[
                                tw`bg-white rounded-2xl mb-4 shadow-lg overflow-hidden`,
                                { elevation: 3 }
                            ]}
                        >
                            <View style={tw`bg-blue-500 p-4`}>
                                <View style={tw`flex-row justify-between items-center`}>
                                    <View style={tw`flex-1`}>
                                        <Text style={tw`text-white font-bold text-xl mb-1`}>
                                            VOUCHER XTRA
                                        </Text>
                                        <Text style={tw`text-white text-lg font-semibold`}>
                                            Giảm {promotion.discount_percentage}%
                                        </Text>
                                        <Text style={tw`text-white text-lg font-semibold`}>
                                            Mã: {promotion.code}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            
                            <View style={tw`p-4 bg-white`}>
                                <View style={tw`flex-row items-center mb-2`}>
                                    <Icon name="local-offer" size={20} color="#4B5563" />
                                    <Text style={tw`text-gray-600 ml-2`}>
                                        Giảm tối đa {parseInt(promotion.max_value).toLocaleString()}đ
                                    </Text>
                                </View>
                                
                                <View style={tw`flex-row items-center mb-2`}>
                                    <Icon name="shopping-cart" size={20} color="#4B5563" />
                                    <Text style={tw`text-gray-600 ml-2`}>
                                        Đơn tối thiểu {parseInt(promotion.min_value).toLocaleString()}đ
                                    </Text>
                                </View>
                                
                                <View style={tw`flex-row items-center`}>
                                    <Icon name="event" size={20} color="#4B5563" />
                                    <Text style={tw`text-gray-600 ml-2`}>
                                        Hết hạn: {formatDate(promotion.end_date)}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    ))}

                    {promotions.length === 0 && (
                        <View style={tw`bg-white rounded-2xl p-8 items-center justify-center shadow-lg`}>
                            <Icon name="card-giftcard" size={100} color="#9CA3AF" />
                            <Text style={tw`text-2xl text-gray-700 font-bold mt-6 mb-3 text-center`}>
                                Bạn chưa có voucher nào
                            </Text>
                            <Text style={tw`text-gray-500 text-center text-base px-4 leading-6`}>
                                Hãy tích điểm để đổi những voucher hấp dẫn nhé!
                            </Text>
                            <TouchableOpacity 
                                style={tw`mt-6 bg-blue-500 py-3 px-6 rounded-full`}
                                onPress={() => navigation.navigate('RedeemPoints' as never)}
                            >
                                <Text style={tw`text-white font-semibold text-base`}>
                                    Đổi điểm ngay
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

export default VoucherScreen;
