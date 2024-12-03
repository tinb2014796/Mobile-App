import React, { useState, useEffect } from 'react';
import { View, Text, Alert, ScrollView, TouchableOpacity } from 'react-native';
import promotionService from '../../services/promotion.service';
import { handleResponse } from '../../function';
import Icon from 'react-native-vector-icons/MaterialIcons';
import tw from 'tailwind-react-native-classnames';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

type Promotion = {
    id: number;
    s_code: string;
    s_percent: number;
    s_quantity: string;
    s_start: string;
    s_end: string;
    s_value_max: string;
    s_value_min: string;
    s_name: string;
    s_catalory: string;
    s_description: string | null;
    s_type: string;
    cus_id: number;
    p_id: number | null;
    updated_at: string;
};

const VoucherScreen = () => {
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const navigation = useNavigation();
    const customer = useSelector((state: RootState) => state.customer.customer);

    useEffect(() => {
        if (customer) {
            fetchPromotions();
        }
    }, [customer]);

    const fetchPromotions = async () => {
        try {
            if (!customer) {
                Alert.alert('Lỗi', 'Vui lòng đăng nhập để xem lịch sử đơn hàng');
                return;
            }
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
            <View style={[tw`p-4 flex-row items-center`, {backgroundColor: '#00CED1'}]}>
                <TouchableOpacity 
                    onPress={() => navigation.goBack()}
                    style={tw`mr-4`}
                >
                    <Icon name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={[tw`text-xl font-bold`, {color: 'black'}]}>
                    Kho voucher của tôi
                </Text>
            </View>

            <ScrollView style={tw`flex-1`}>
                <View style={tw`px-4 py-6`}>
                    {promotions.map((promotion) => (
                        <View 
                            key={promotion.id} 
                            style={[
                                tw`bg-white rounded-lg mb-4 shadow-md`,
                                { elevation: 2 }
                            ]}
                        >
                            <View style={[tw`p-4 rounded-t-lg`, {backgroundColor: '#00CED1'}]}>
                                <View style={tw`flex-row justify-between items-center`}>
                                    <View style={tw`flex-1`}>
                                        <Text style={[tw`font-bold text-lg mb-1`, {color: 'white'}]}>
                                            {promotion.s_name}
                                        </Text>
                                        <Text style={[tw`text-base`, {color: 'white'}]}>
                                            Mã: {promotion.s_code}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            
                            <View style={tw`p-4`}>
                                <View style={tw`flex-row items-center mb-3`}>
                                    <Icon name="local-offer" size={20} color="#00CED1" />
                                    <Text style={[tw`ml-2`, {color: '#4A5568', fontSize: 15}]}>
                                        Giảm tối đa {parseInt(promotion.s_value_max).toLocaleString()}đ
                                    </Text>
                                </View>
                                
                                <View style={tw`flex-row items-center mb-3`}>
                                    <Icon name="shopping-cart" size={20} color="#00CED1" />
                                    <Text style={[tw`ml-2`, {color: '#4A5568', fontSize: 15}]}>
                                        Đơn tối thiểu {parseInt(promotion.s_value_min).toLocaleString()}đ
                                    </Text>
                                </View>
                                
                                <View style={tw`flex-row items-center`}>
                                    <Icon name="event" size={20} color="#00CED1" />
                                    <Text style={[tw`ml-2`, {color: '#4A5568', fontSize: 15}]}>
                                        HSD: {formatDate(promotion.s_end)}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    ))}

                    {promotions.length === 0 && (
                        <View style={tw`bg-white rounded-lg p-8 items-center justify-center shadow-md mt-4`}>
                            <Icon name="card-giftcard" size={80} color="#00CED1" />
                            <Text style={tw`text-xl text-gray-800 font-bold mt-6 mb-2 text-center`}>
                                Chưa có voucher nào
                            </Text>
                            <Text style={tw`text-gray-600 text-center text-base px-4`}>
                                Hãy đổi điểm để nhận những ưu đãi hấp dẫn!
                            </Text>
                            <TouchableOpacity 
                                style={[tw`mt-6 py-3 px-8 rounded-full`, {backgroundColor: '#00CED1'}]}
                                onPress={() => navigation.navigate('RedeemPoints' as never)}
                            >
                                <Text style={tw`font-semibold text-white text-base`}>
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
