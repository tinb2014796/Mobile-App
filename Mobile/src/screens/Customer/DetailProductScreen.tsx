import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import productService from '../../services/product.service';

type Product = {
    id: number;
    p_name: string;
    p_selling: string; 
    p_description: string;
    p_quantity: number;
    p_purchase: string;
    c_id: number;
    b_id: number;
    images: {
        id: number;
        ip_image: string;
    }[];
    category: {
        id: number;
        c_name: string;
        c_image: string;
    };
    sale_off: {
        id: number;
        s_name: string;
        s_percent: number;
        s_start: string;
        s_end: string;
    }[];
};

export default function DetailProductScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const [product, setProduct] = useState<Product | null>(null);
    const productId = (route.params as {id: number}).id;

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await productService.getDetail(productId);
                setProduct(data);
            } catch (error) {
                console.error('Lỗi khi tải thông tin sản phẩm:', error);
            }
        };
        fetchProduct();
    }, [productId]);

    const calculateDiscountedPrice = (originalPrice: string, discount: number) => {
        const price = parseFloat(originalPrice);
        const discountAmount = price * (discount / 100);
        return (price - discountAmount).toFixed(0);
    };

    if (!product) {
        return (
            <View style={tw`flex-1 justify-center items-center`}>
                <Text>Đang tải...</Text>
            </View>
        );
    }

    return (
        <View style={tw`flex-1`}>
            {/* Header với nút trở về */}
            <View style={tw`bg-blue-600 px-4 py-3 flex-row items-center shadow-sm`}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={tw`text-xl font-bold text-white ml-4`}>Chi tiết sản phẩm</Text>
            </View>

            <ScrollView style={tw`flex-1`}>
                <View style={tw`p-4`}>
                    {product.images && product.images.length > 0 && (
                        <Image 
                            source={{uri: product.images[0].ip_image}}
                            style={[tw`w-full h-64 rounded-lg mb-4`, {resizeMode: 'cover'}]}
                        />
                    )}

                    <Text style={tw`text-2xl font-bold mb-2`}>{product.p_name}</Text>
                    
                    <View style={tw`bg-gray-100 p-4 rounded-lg mb-4`}>
                        <Text style={tw`text-gray-500 line-through text-lg`}>
                            Giá gốc: {product.p_selling} VNĐ
                        </Text>
                        {product.sale_off && product.sale_off.length > 0 && (
                            <>
                                <Text style={tw`text-red-500 font-bold text-xl`}>
                                    Giá sale: {calculateDiscountedPrice(product.p_selling, product.sale_off[0].s_percent)} VNĐ
                                </Text>
                                <Text style={tw`text-red-500`}>
                                    Giảm: {product.sale_off[0].s_percent}%
                                </Text>
                            </>
                        )}
                    </View>

                    <View style={tw`bg-gray-100 p-4 rounded-lg mb-4`}>
                        <Text style={tw`text-lg font-bold mb-2`}>Thông tin sản phẩm</Text>
                        <Text style={tw`text-gray-700 mb-2`}>Mô tả: {product.p_description}</Text>
                        <Text style={tw`text-gray-700 mb-2`}>Số lượng trong kho: {product.p_quantity}</Text>
                        <Text style={tw`text-gray-700`}>Danh mục: {product.category.c_name}</Text>
                    </View>

                    {product.sale_off && product.sale_off.length > 0 && (
                        <View style={tw`bg-gray-100 p-4 rounded-lg`}>
                            <Text style={tw`text-lg font-bold mb-2`}>Thông tin khuyến mãi</Text>
                            <Text style={tw`text-gray-700 mb-1`}>Tên: {product.sale_off[0].s_name}</Text>
                            <Text style={tw`text-gray-700 mb-1`}>Bắt đầu: {product.sale_off[0].s_start}</Text>
                            <Text style={tw`text-gray-700`}>Kết thúc: {product.sale_off[0].s_end}</Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}