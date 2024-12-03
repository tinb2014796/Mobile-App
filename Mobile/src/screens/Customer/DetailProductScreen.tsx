import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import productService from '../../services/product.service';
import { API_CONFIG } from '../../services/config';

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
    rating: {
        id: number;
        ra_score: string;
        ra_comment: string;
        customer: {
            id: number;
            cus_name: string;
            cus_familyname: string;
        };
    }[];
    average_rating: number;
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

    const renderStars = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Icon 
                    key={i}
                    name={i <= rating ? "star" : "star-outline"}
                    size={20}
                    color="#FFD700"
                    style={tw`mr-1`}
                />
            );
        }
        return stars;
    };

    const renderDescription = (description: string) => {
        const lines = description.split('\\r\\n\\r\\n');
        return lines.map((line, index) => (
            <Text key={index} style={tw`text-gray-700 mb-2 leading-6`}>
                {line.replace('\\r\\n', ': ')}
            </Text>
        ));
    };

    if (!product) {
        return (
            <View style={tw`flex-1 justify-center items-center bg-gray-50`}>
                <Text style={tw`text-lg text-gray-600`}>Đang tải...</Text>
            </View>
        );
    }

    return (
        <View style={tw`flex-1 bg-white`}>
            {/* Header với nút trở về */}
            <View style={[tw`px-4 py-4 flex-row items-center shadow-lg`, {backgroundColor: 'rgb(0, 255, 255)'}]}>
                <TouchableOpacity 
                    onPress={() => navigation.goBack()}
                    style={tw`p-2 rounded-full `}
                >
                    <Icon name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={[tw`text-xl font-bold ml-4`, {color: '#000'}]}>Chi tiết sản phẩm</Text>
            </View>

            <ScrollView style={tw`flex-1`} showsVerticalScrollIndicator={false}>
                <View style={tw`p-4`}>
                    {product.images && product.images.length > 0 && (
                        <View style={tw`shadow-lg rounded-2xl overflow-hidden mb-6`}>
                            <Image 
                                source={{uri: `${API_CONFIG.BASE_URL}${product.images[0].ip_image}`}}
                                style={[tw`w-full h-72`, {resizeMode: 'cover'}]}
                            />
                        </View>
                    )}

                    <Text style={tw`text-3xl font-bold mb-4 text-gray-800`}>{product.p_name}</Text>
                    
                    <View style={tw`bg-blue-50 p-5 rounded-xl mb-6 shadow-sm`}>
                        {product.sale_off && product.sale_off.length > 0 ? (
                            <>
                                <Text style={tw`text-gray-500 line-through text-lg mb-2`}>
                                    Giá gốc: {product.p_selling.replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VNĐ
                                </Text>
                                <Text style={tw`text-red-600 font-bold text-2xl mb-2`}>
                                    Giá sale: {calculateDiscountedPrice(product.p_selling, product.sale_off[0].s_percent).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VNĐ
                                </Text>
                                <View style={tw`bg-red-500 self-start px-3 py-1 rounded-full`}>
                                    <Text style={tw`text-white font-bold`}>
                                        Giảm {product.sale_off[0].s_percent}%
                                    </Text>
                                </View>
                            </>
                        ) : (
                            <Text style={tw`text-gray-800 text-2xl mb-2`}>
                                Giá: {product.p_selling.replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VNĐ
                            </Text>
                        )}
                    </View>

                    <View style={tw`bg-gray-50 p-5 rounded-xl mb-6 shadow-sm`}>
                        <Text style={tw`text-xl font-bold mb-4 text-gray-800`}>Thông tin sản phẩm</Text>
                        {renderDescription(product.p_description)}
                        <Text style={tw`text-gray-700 mb-3`}>Số lượng trong kho: {product.p_quantity}</Text>
                        <View style={tw`flex-row items-center`}>
                            <Icon name="folder-outline" size={20} color="#4B5563" />
                            <Text style={tw`text-blue-700 ml-2`}>Danh mục: {product.category.c_name}</Text>
                        </View>
                    </View>

                    {product.sale_off && product.sale_off.length > 0 && (
                        <View style={tw`bg-red-50 p-5 rounded-xl mb-6 shadow-sm`}>
                            <Text style={tw`text-xl font-bold mb-4 text-red-800`}>Thông tin khuyến mãi</Text>
                            <Text style={tw`text-red-700 mb-2`}>Tên: {product.sale_off[0].s_name}</Text>
                            <Text style={tw`text-red-700 mb-2`}>Bắt đầu: {new Date(product.sale_off[0].s_start).toLocaleDateString('vi-VN')}</Text>
                            <Text style={tw`text-red-700`}>Kết thúc: {new Date(product.sale_off[0].s_end).toLocaleDateString('vi-VN')}</Text>
                        </View>
                    )}

                    <View style={tw`bg-yellow-50 p-5 rounded-xl mb-4 shadow-sm`}>
                        <Text style={tw`text-xl font-bold mb-4 text-gray-800`}>Đánh giá sản phẩm</Text>
                        <View style={tw`flex-row items-center mb-6 bg-yellow-100 p-3 rounded-lg`}>
                            <Text style={tw`text-yellow-700 text-lg font-bold mr-3`}>
                                {product.average_rating}/5
                            </Text>
                            <View style={tw`flex-row`}>
                                {renderStars(product.average_rating)}
                            </View>
                        </View>

                        {product.rating && product.rating.map(rating => (
                            <View key={rating.id} style={tw`mb-5 border-b border-yellow-200 pb-5`}>
                                <View style={tw`flex-row items-center justify-between mb-3`}>
                                    <Text style={tw`font-bold text-gray-800 text-lg`}>
                                        {rating.customer.cus_familyname} {rating.customer.cus_name}
                                    </Text>
                                    <View style={tw`flex-row items-center`}>
                                        {renderStars(parseFloat(rating.ra_score))}
                                    </View>
                                </View>
                                <Text style={tw`text-gray-600 leading-6`}>{rating.ra_comment}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}