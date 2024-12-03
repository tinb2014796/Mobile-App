import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import tw from 'tailwind-react-native-classnames';
import { useNavigation } from '@react-navigation/native';
import promotionService from '../../services/promotion.service';
import { handleResponse } from '../../function';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { customerLoginSuccess } from '../../redux/reducers/customerReducers';

interface VoucherItem {
  discount: string;
  max_value: string;
  points: number;
  isOwned: boolean;
  minSpend: string;
  description: string;
}

const RedeemPointsScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const customer = useSelector((state: RootState) => state.customer.customer);

    const vouchers: VoucherItem[] = [
        {
        description: 'Giảm 50000đ cho đơn hàng từ 200000đ',
        discount: '50000',
        max_value: '50000',
        points: 25,
        isOwned: false,
        minSpend: '200000',
        },

        {
        description: 'Giảm 100000đ cho đơn hàng từ 1500000đ',
        discount: '100000',
        max_value: '100000',
        points: 40,
        isOwned: false,
        minSpend: '1500000',
        },

        {
        description: 'Giảm 200000đ cho đơn hàng từ 1800000đ',
        discount: '200000',
        max_value: '200000',
        points: 50,
        isOwned: false,
        minSpend: '1800000',
        },
    ];

    const handleRedeemPoints = async (points: number, voucher: VoucherItem) => {
        if (!customer) {
            Alert.alert('Lỗi', 'Vui lòng đăng nhập để đổi điểm');
            return;
        }

        if (customer.cus_points < points) {
            Alert.alert('Không đủ điểm', 'Bạn không có đủ điểm để đổi voucher này');
            return;
        }

        try {
            const updatedCustomer = {
                ...customer,
                cus_points: customer.cus_points - points
            };

            const redeemPointData = {
                cus_id: customer.id, 
                name: `Voucher giảm ${parseInt(voucher.discount).toLocaleString()}đ`,
                cus_points: points,
                description: voucher.description,
                value_max: voucher.max_value,
                value_min: voucher.minSpend,
            };
            const response = await promotionService.createRedeemPoint(redeemPointData);
            console.log(response);
            if (response.success) {
                // Cập nhật thông tin khách hàng
                dispatch(customerLoginSuccess(updatedCustomer));

                // Hiển thị thông tin voucher từ response
                const voucher = response.data;
                Alert.alert(
                    'Thành công',
                    `Đổi voucher thành công!\n\n` +
                    `Mã voucher: ${voucher.s_code}\n` +
                    `Tên voucher: ${voucher.s_name}\n` + 
                    `Giá trị: ${parseInt(voucher.s_value_max).toLocaleString()}đ\n` +
                    `Đơn tối thiểu: ${parseInt(voucher.s_value_min).toLocaleString()}đ\n` +
                    `Hạn sử dụng: ${new Date(voucher.s_end).toLocaleDateString('vi-VN')}`,
                    [{ text: 'OK' }]
                );
            } else {
                Alert.alert('Lỗi', response.message);
            }
        } catch (error: any) {
            console.log(error);
        }
    };

    return (
        <View style={tw`flex-1 bg-white`}>
        <View style={[tw`flex-row items-center p-4`, {backgroundColor: 'rgb(0,255,255)'}]}>
            <TouchableOpacity 
                onPress={() => navigation.goBack()}
                style={tw`mr-3`}
            >
                <Icon name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <Icon name="card-giftcard" size={24} color="#000" />
            <Text style={[tw`text-xl ml-2`, {color: '#000'}]}>Kho Voucher</Text>
        </View>

        <View style={tw`p-4 border-b border-gray-200`}>
            <Text style={[tw`text-base`, {color: '#000'}]}>
            Điểm tích lũy hiện tại: <Text style={tw`text-red-500 font-bold`}>{customer?.cus_points || 0} điểm</Text>
            </Text>
        </View>

        <ScrollView style={tw`p-4`}>
            {vouchers.map((voucher, index) => (
            <View key={index} style={[tw`flex-row border rounded-lg mb-4 overflow-hidden`, {borderColor: 'rgb(0,255,255)'}]}>
                <View style={[tw`p-4 w-1/3 justify-center items-center`, {backgroundColor: 'rgb(0,255,255)'}]}>
                    <Text style={[tw`font-bold text-base`, {color: '#000'}]}>VOUCHER</Text>
                    <Text style={[tw`font-bold text-sm mt-1`, {color: '#000'}]}>NGHỆ SHOP</Text>
                    <Text style={[tw`text-sm mt-2`, {color: '#000'}]}>{voucher.points} điểm</Text>
                </View>

                <View style={tw`flex-1 p-4 bg-white`}>
                    <Text style={[tw`text-lg font-bold`, {color: '#000'}]}>
                        Giảm {parseInt(voucher.discount).toLocaleString()}đ
                    </Text>
                    <Text style={tw`text-lg font-bold`}>Giảm tối đa {parseInt(voucher.max_value).toLocaleString()}đ</Text>
                    <Text style={tw`text-gray-600 mt-1`}>
                        Đơn Tối Thiểu {parseInt(voucher.minSpend).toLocaleString()}đ
                    </Text>
                    <View style={tw`flex-row items-center justify-between mt-2`}>
                        <Text style={tw`text-gray-500 text-sm`}>Có hiệu lực từ ngày đổi</Text>
                        <TouchableOpacity 
                            style={[tw`px-4 py-1 rounded-full`, customer?.cus_points && customer.cus_points >= voucher.points ? {backgroundColor: 'rgb(0,255,255)'} : {backgroundColor: '#9CA3AF'}]}
                            onPress={() => handleRedeemPoints(voucher.points,voucher)}
                            disabled={!customer?.cus_points || customer.cus_points < voucher.points}
                        >
                            <Text style={[tw`font-medium`, {color: '#000'}]}>Đổi</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            ))}
        </ScrollView>
        </View>
    );
};

export default RedeemPointsScreen;
