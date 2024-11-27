import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import PayService from '../../services/Pay.service';
import { TextInput } from 'react-native';

interface Product {
  id: number;
  product_name: string;
  selling_price: number;
  quantity: number;
  sale_off?: {
    s_percent: number;
  }[];
}

interface Province {
  ProvinceID: number;
  ProvinceName: string;
}

interface District {
  DistrictID: number;
  DistrictName: string;
}

interface Ward {
  WardCode: string;
  WardName: string;
}

interface CustomerState {
  customer: {
    cus_name: string;
    cus_sdt: string;
    cus_address: string;
    province_id: string;
    district_id: string;
    ward_code: string;
    id: number;
  };
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

interface OrderResponse {
  message: string;
  orders: {
    id: number;
    or_date: string;
    or_total: string;
    or_status: string;
    or_ship: string;
    or_note: string;
    customer: {
      cus_name: string;
      cus_sdt: string;
      cus_address: string;
    };
    payment: {
      pa_type: string;
    };
  };
}

const PayScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { products } = route.params as { products: Product[] };
    const [customerProvince, setCustomerProvince] = useState('');
    const [customerDistrict, setCustomerDistrict] = useState('');
    const [customerWard, setCustomerWard] = useState('');
    const [shippingCost, setShippingCost] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [note, setNote] = useState('');
    const [cusAddressId, setCusAddressId] = useState(0);
    const [appliedVoucher, setAppliedVoucher] = useState<{s_code: string} | null>(null);
    const [discount, setDiscount] = useState(0);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [orderResponse, setOrderResponse] = useState<OrderResponse | null>(null);
    
    const shopAddress = useMemo(() => ({
        district_id: 3695,
        ward_code: '90737',
        province_id: 202
    }), []);

    const customerData = useSelector((state: RootState) => state.customer as CustomerState);
    const { customer } = customerData;

    const calculateTotal = useCallback(() => {
        return products.reduce((total, product) => {
            return total + (product.selling_price * product.quantity);
        }, 0);
    }, [products]);

    const handleOrder = async () => {
        const orderData = {
            paymentMethod,
            customer_id: customer.id,
            products: products.map(product => {
                const saleOffPercent = product.sale_off?.[0]?.s_percent || 0;
                const discountAmount = (product.selling_price * saleOffPercent/100) * product.quantity;
                return {
                    ...product,
                    discount: discountAmount
                }
            }),
            note,
            shippingFee: shippingCost,
            voucher_code: appliedVoucher?.s_code,
            discount
        };
        try {
            const response = await new PayService().create(orderData);
            Alert.alert(
                'Đặt hàng thành công!',
                `Mã đơn hàng: #${response.orders.id}\n` +
                `Ngày đặt: ${new Date(response.orders.or_date).toLocaleDateString('vi-VN')}\n` +
                `Tổng tiền: ₫${parseInt(response.orders.or_total).toLocaleString('vi-VN')}\n` +
                `Phí vận chuyển: ₫${parseInt(response.orders.or_ship).toLocaleString('vi-VN')}\n` +
                `Phương thức thanh toán: ${response.orders.payment.pa_type}\n` +
                `Địa chỉ: ${response.orders.customer.cus_address}\n` +
                `Người nhận: ${response.orders.customer.cus_name}\n` +
                `SĐT: ${response.orders.customer.cus_sdt}`,
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.navigate('Home')
                    }
                ]
            );

        } catch (error) {
            console.error('Error creating order:', error);
            Alert.alert('Thông báo', 'Đặt hàng thất bại. Vui lòng thử lại!');
        }
    };

    useEffect(() => {
        const getCustomerAddress = async () => {
            try {
                // Lấy tên tỉnh/thành phố
                const provinceResponse = await axios.get('https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province', {
                    headers: {
                        'token': 'c6967a25-9a90-11ef-8e53-0a00184fe694'
                    }
                });
                const province = provinceResponse.data.data.find((p: Province) => p.ProvinceID === parseInt(customer.province_id));
                setCustomerProvince(province?.ProvinceName || '');

                // Lấy tên quận/huyện
                const districtResponse = await axios.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${customer.province_id}`, {
                    headers: {
                        'token': 'c6967a25-9a90-11ef-8e53-0a00184fe694'
                    }
                });
                const district = districtResponse.data.data.find((d: District) => d.DistrictID === parseInt(customer.district_id));
                setCustomerDistrict(district?.DistrictName || '');

                // Lấy tên phường/xã
                const wardResponse = await axios.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${customer.district_id}`, {
                    headers: {
                        'token': 'c6967a25-9a90-11ef-8e53-0a00184fe694'
                    }
                });
                const ward = wardResponse.data.data.find((w: Ward) => w.WardCode === customer.ward_code);
                setCustomerWard(ward?.WardName || '');

                // Tính phí vận chuyển
                if (customer.district_id && customer.ward_code && shopAddress.district_id) {
                    const shippingResponse = await axios.post(
                        'https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee',
                        {
                            service_type_id: 2,
                            insurance_value: calculateTotal(),
                            coupon: null,
                            from_district_id: shopAddress.district_id,
                            to_district_id: parseInt(customer.district_id),
                            to_ward_code: customer.ward_code,
                            height: 15,
                            length: 15,
                            weight: 200,
                            width: 15,
                            from_ward_code: shopAddress.ward_code
                        },
                        {
                            headers: {
                                'token': 'c6967a25-9a90-11ef-8e53-0a00184fe694',
                                'shop_id': '195215',
                                'Content-Type': 'application/json'
                            }
                        }
                    );
                    setShippingCost(shippingResponse.data.data.total);
                }

            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error('Lỗi khi lấy thông tin địa chỉ:', error.response?.data || error.message);
                } else {
                    console.error('Lỗi khi lấy thông tin địa chỉ:', error);
                }
            }
        };

        if (customer.province_id && customer.district_id && customer.ward_code) {
            getCustomerAddress();
        }
    }, [customer, calculateTotal, shopAddress]);

    const [totalAmount] = useState(calculateTotal());

    const formatCurrency = (amount: number) => {
        return amount?.toLocaleString('vi-VN') || '0';
    };

    if (orderSuccess && orderResponse) {
        return (
            <View style={tw`flex-1 bg-white p-4 justify-center items-center`}>
                <Icon name="check-circle" size={80} color="#4CAF50" />
                <Text style={tw`text-2xl font-bold mt-4 mb-8`}>Đặt hàng thành công!</Text>
                
                <View style={tw`w-full bg-gray-100 p-4 rounded-lg`}>
                    <Text style={tw`text-lg font-bold mb-4`}>Thông tin đơn hàng:</Text>
                    <Text>Mã đơn hàng: #{orderResponse.orders.id}</Text>
                    <Text>Ngày đặt: {new Date(orderResponse.orders.or_date).toLocaleDateString('vi-VN')}</Text>
                    <Text>Tổng tiền: ₫{formatCurrency(parseInt(orderResponse.orders.or_total))}</Text>
                    <Text>Phí vận chuyển: ₫{formatCurrency(parseInt(orderResponse.orders.or_ship))}</Text>
                    <Text>Phương thức thanh toán: {orderResponse.orders.payment.pa_type}</Text>
                </View>
                
                <TouchableOpacity 
                    style={tw`mt-8 bg-blue-500 px-8 py-3 rounded`}
                    onPress={() => navigation.navigate('Home')}
                >
                    <Text style={tw`text-white font-bold`}>Về trang chủ</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView style={tw`flex-1 bg-gray-100`}>
            {/* Nút trở về */}
            <TouchableOpacity 
                style={tw`absolute left-4 top-4 z-10`}
                onPress={() => navigation.goBack()}
            >
                <Icon name="arrow-back" size={28} color="#000" />
            </TouchableOpacity>

            {/* Phần địa chỉ */}
            <View style={tw`bg-white p-4 mb-2 mt-14`}>
                <View style={tw`flex-row items-center`}>
                    <Text style={tw`text-lg flex-1`}>{customer.cus_name}</Text>
                    <Text style={tw`text-gray-500`}>{customer.cus_sdt}</Text>
                </View>
                <Text style={tw`text-gray-600`}>
                    {customer.cus_address}, {customerWard}, {customerDistrict}, {customerProvince}
                </Text>
            </View>

            {/* Phần sản phẩm */}
            <View style={tw`bg-white p-4 mb-2`}>
                <View style={tw`flex-row items-center mb-4`}>
                    <Text style={tw`text-red-500 px-2 py-1 bg-red-100 rounded`}>Yêu thích</Text>
                    <Text style={tw`ml-2`}>Nghe Shop</Text>
                </View>
                
                {/* Chi tiết sản phẩm */}
                {products.map((product) => (
                    <View key={product.id} style={tw`flex-row mb-4`}>
                        <View style={tw`ml-3 flex-1`}>
                            <Text numberOfLines={2}>{product.product_name}</Text>
                            <View style={tw`flex-row justify-between mt-2`}>
                                <Text style={tw`text-red-500`}>₫{formatCurrency(product.selling_price)}</Text>
                                <Text>x{product.quantity}</Text>
                            </View>
                        </View>
                    </View>
                ))}
            </View>

            {/* Phần vận chuyển */}
            <View style={tw`bg-white p-4 mb-2`}>
                <View style={tw`flex-row justify-between items-center`}>
                    <Text>Phương thức vận chuyển</Text>
                </View>
                
                <View style={tw`mt-2 p-3 bg-blue-50 rounded flex-row justify-between items-center`}>
                    <View style={tw`flex-row items-center`}>
                        <Icon name="local-shipping" size={20} color="#3B82F6" />
                        <Text style={tw`text-blue-500 ml-2`}>GHN Express</Text>
                    </View>
                    <Text style={tw`text-blue-500 font-medium`}>₫{formatCurrency(shippingCost)}</Text>
                </View>
            </View>

            {/* Phần ghi chú */}
            <View style={tw`bg-white p-4 mb-2`}>
                <Text style={tw`mb-2`}>Ghi chú</Text>
                <TextInput
                    style={tw`border border-gray-300 rounded p-2`}
                    placeholder="Nhập ghi chú cho đơn hàng..."
                    multiline
                    numberOfLines={3}
                    value={note}
                    onChangeText={setNote}
                />
            </View>

            {/* Footer */}
            <View style={tw`bg-white p-4 mb-2`}>
                <Text style={tw`text-lg mb-2`}>Chi tiết thanh toán</Text>
                
                <View style={tw`flex-row justify-between mb-2`}>
                    <Text style={tw`text-gray-600`}>Tổng tiền hàng</Text>
                    <Text>₫{formatCurrency(totalAmount)}</Text>
                </View>
                
                <View style={tw`flex-row justify-between mb-2`}>
                    <Text style={tw`text-gray-600`}>Tổng tiền phí vận chuyển</Text>
                    <Text>₫{formatCurrency(shippingCost)}</Text>
                </View>

                <View style={tw`flex-row justify-between pt-2 border-t border-gray-200`}>
                    <Text style={tw`font-bold`}>Tổng thanh toán</Text>
                    <Text style={tw`font-bold`}>₫{formatCurrency(totalAmount + shippingCost)}</Text>
                </View>
            </View>

            <View style={tw`bg-white p-4 flex-row justify-between items-center`}>
                <View>
                    <Text style={tw`text-gray-600`}>Tổng thanh toán</Text>
                    <Text style={tw`text-red-500 text-xl`}>₫{formatCurrency(totalAmount + shippingCost)}</Text>
                </View>
                <TouchableOpacity style={tw`bg-red-500 px-8 py-3 rounded`} 
                onPress={handleOrder}>
                    <Text style={tw`text-white font-bold`}>Đặt hàng</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default PayScreen;
