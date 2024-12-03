import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import orderService from '../../services/order.service';
import { handleResponse } from '../../function';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';


type Order = {
    id: number;
    or_date: string;
    or_total: number;
    or_status: {[key: string]: string};
    or_ship: number;
    or_note: string;
    cus_id: number;
    pa_id: number;
    voucher_code: string | null;
    or_discount: number;
    items: OrderItem[];
};

type OrderItem = {
    product_name: string;
    quantity: number;
    price: number;
    discount: number;
    or_discount: number;
};

const HistoryScreen = () => {
    const navigation = useNavigation();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const customer = useSelector((state: RootState) => state.customer.customer);

    const fetchOrders = useCallback(async () => {
        try {
            if (!customer) {
                Alert.alert('Lỗi', 'Vui lòng đăng nhập để xem lịch sử đơn hàng');
                return;
            }
            
            const formattedDate = selectedDate.toISOString().split('T')[0];
            const response = await orderService.getOrdersByCustomerId(customer.id, formattedDate);
            const data = handleResponse(response.data);
            
            let filteredOrders = data;
            if (selectedStatus !== 'all') {
                filteredOrders = data.filter(order => {
                    const latestStatus = getLatestStatus(order.or_status);
                    return latestStatus === selectedStatus;
                });
            }
            
            setOrders(filteredOrders);
            setLoading(false);
        } catch (error: any) {
            setLoading(false);
        }
    }, [customer, selectedDate, selectedStatus]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    };

    const formatPrice = (price: number) => {
        if (price === null || price === undefined) return '0đ';
        return price.toLocaleString('vi-VN') + 'đ';
    };

    const getLatestStatus = (status: {[key: string]: string}) => {
        const keys = Object.keys(status);
        const latestKey = keys[keys.length - 1];
        return status[latestKey];
    };

    const getStatusColor = (status: {[key: string]: string}) => {
        const latestStatus = getLatestStatus(status);
        switch(latestStatus) {
            case 'Đã hủy':
                return 'bg-red-500';
            case 'Đang chờ xử lý':
                return 'bg-yellow-500';
            case 'Đã xác nhận':
                return 'bg-blue-500';
            case 'Đã giao cho đơn vị vận chuyển':
            case 'Đang giao':
                return 'bg-purple-500';
            case 'Đã giao':
                return 'bg-green-500';
            default:
                return 'bg-gray-500';
        }
    };

    const handleConfirm = (date: Date) => {
        setShowDatePicker(false);
        setSelectedDate(date);
    };

    const handleCancel = () => {
        setShowDatePicker(false);
    };

    const statusOptions = [
        { value: 'all', label: 'Tất cả' },
        { value: 'Đang chờ xử lý', label: 'Đang chờ xử lý' },
        { value: 'Đã xác nhận', label: 'Đã xác nhận' },
        { value: 'Đã giao cho đơn vị vận chuyển', label: 'Đã giao cho ĐVVC' },
        { value: 'Đang giao', label: 'Đang giao' },
        { value: 'Đã giao', label: 'Đã giao' },
        { value: 'Đã hủy', label: 'Đã hủy' }
    ];

    return (
        <View style={tw`flex-1 bg-gray-100`}>
            <View style={[tw`p-4 flex-row items-center shadow-lg`, {backgroundColor: 'rgb(0,255,255)'}]}>
                <TouchableOpacity 
                    onPress={() => navigation.goBack()}
                    style={tw`mr-4`}
                >
                    <Icon name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={tw`text-black text-xl font-bold`}>
                    Lịch sử đơn hàng
                </Text>
            </View>

            <View style={tw`bg-white p-4 flex-row justify-between items-center border-b border-gray-200 shadow-sm`}>
                <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={tw`bg-white py-3 mx-1 mb-1`}
                contentContainerStyle={tw`px-1`}
            >
                {statusOptions.map((option) => (
                    <TouchableOpacity
                        key={option.value}
                        onPress={() => setSelectedStatus(option.value)}
                        style={[
                            tw`mx-1 px-4 py-2 h-10 `,
                            selectedStatus === option.value 
                                ? tw`bg-blue-500 border-blue-500` 
                                : tw`bg-gray-50 border-gray-200`
                        ]}
                    >
                        <Text 
                            style={[
                                tw`font-medium`,
                                selectedStatus === option.value 
                                    ? tw`text-white` 
                                    : tw`text-gray-700`
                            ]}
                        >
                            {option.label}
                        </Text>
                    </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>


            <ScrollView style={tw`flex-1`}>
                {loading ? (
                    <View style={tw`flex-1 justify-center items-center p-4`}>
                        <Text style={tw`text-gray-600`}>Đang tải...</Text>
                    </View>
                ) : orders && orders.length === 0 ? (
                    <View style={tw`flex-1 justify-center items-center p-8`}>
                        <Icon name="receipt-long" size={80} color="#9CA3AF" />
                        <Text style={tw`text-xl text-gray-600 mt-4 text-center font-medium`}>
                            Bạn chưa có đơn hàng nào
                        </Text>
                    </View>
                ) : (
                    <View style={tw`p-4`}>
                        {orders && orders.map((order) => (
                            <View key={order.id} style={tw`bg-white rounded-xl shadow-md mb-4 overflow-hidden border border-gray-100`}>
                                <View style={tw`${getStatusColor(order.or_status)} p-4`}>
                                    <View style={tw`flex-row justify-between items-center`}>
                                        <Text style={tw`text-white font-bold text-lg`}>
                                            Đơn hàng #{order.id}
                                        </Text>
                                        <View style={tw`bg-white bg-opacity-20 rounded-full px-3 py-1`}>
                                            <Text style={tw`text-white font-medium`}>
                                                {getLatestStatus(order.or_status)}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={tw`flex-row justify-between mt-2`}>
                                        <Text style={tw`text-white opacity-90`}>
                                            <Icon name="event" size={16} /> {formatDate(order.or_date)}
                                        </Text>
                                        <Text style={tw`text-white opacity-90`}>
                                            <Icon name="local-shipping" size={16} /> Phí ship: {formatPrice(order.or_ship)}
                                        </Text>
                                    </View>
                                </View>
                                
                                <View style={tw`p-4`}>
                                    {order.items.map((item, index) => (
                                        <View key={index} style={tw`flex-row justify-between items-center py-2 ${index !== 0 ? 'border-t border-gray-100' : ''}`}>
                                            <View style={tw`flex-1`}>
                                                <Text style={tw`text-gray-800 font-medium`}>
                                                    {item.product_name}
                                                </Text>
                                                <Text style={tw`text-gray-500 text-sm`}>
                                                    SL: {item.quantity} x {formatPrice(item.price)}
                                                </Text>
                                            </View>
                                            {item.discount > 0 && (
                                                <View style={tw`mr-4`}>
                                                    <Text style={tw`text-red-500 font-medium`}>
                                                        -{formatPrice(item.discount)}
                                                    </Text>
                                                </View>
                                            )}
                                            <Text style={tw`text-gray-700 font-medium`}>
                                                {formatPrice(item.price * item.quantity - item.discount )}
                                            </Text>
                                        </View>
                                    ))}
                                    
                                    <View style={tw`mt-3 pt-3 border-t border-gray-200`}>
                                        {order.voucher_code && (
                                            <View style={tw`flex-row justify-between items-center mb-2 bg-green-50 p-2 rounded-lg`}>
                                                <View style={tw`flex-row items-center`}>
                                                    <Icon name="local-offer" size={20} color="#059669" />
                                                    <Text style={tw`text-gray-800 ml-2`}>Mã giảm giá:</Text>
                                                </View>
                                                <Text style={tw`text-green-600 font-medium`}>{order.voucher_code}</Text>
                                            </View>
                                        )}
                                        {order.or_discount > 0 && (
                                            <View style={tw`flex-row justify-between items-center mb-2 bg-red-50 p-2 rounded-lg`}>
                                                <View style={tw`flex-row items-center`}>
                                                    <Icon name="discount" size={20} color="#DC2626" />
                                                    <Text style={tw`text-gray-800 ml-2`}>Giảm giá:</Text>
                                                </View>
                                                <Text style={tw`text-red-600 font-medium`}>{order.or_discount}%</Text>
                                            </View>
                                        )}
                                        {order.or_note && (
                                            <View style={tw`flex-row justify-between items-center mb-2 bg-yellow-50 p-2 rounded-lg`}>
                                                <View style={tw`flex-row items-center`}>
                                                    <Icon name="note" size={20} color="#D97706" />
                                                    <Text style={tw`text-gray-800 ml-2`}>Ghi chú:</Text>
                                                </View>
                                                <Text style={tw`text-yellow-600 font-medium`}>{order.or_note}</Text>
                                            </View>
                                        )}
                                        <View style={tw`flex-row justify-between items-center bg-blue-50 p-3 rounded-lg`}>
                                            <Text style={tw`text-gray-800 font-bold`}>Tổng cộng:</Text>
                                            <Text style={tw`text-blue-600 font-bold text-lg`}>
                                                {formatPrice(order.or_total - (order.or_total * order.or_discount / 100))}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

export default HistoryScreen;