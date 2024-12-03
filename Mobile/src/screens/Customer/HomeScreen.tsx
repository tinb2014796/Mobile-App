import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import tw from 'tailwind-react-native-classnames';
import productService from '../../services/product.service';
import { NavigationProp, useNavigation, useFocusEffect } from '@react-navigation/native';
import { API_CONFIG } from '../../services/config';

type Product = any;

type RootStackParamList = {
    Profile: undefined;
    History: undefined;
    Promotions: undefined;
    Orders: undefined;
    Products: { categoryId: number };
    Category: undefined;
    VoucherScreen: undefined;
    Cart: undefined;
    DetailProduct: { id: number };
};

const HomeScreen = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [products, setProducts] = useState<Product[]>([]);
    const [searchText, setSearchText] = useState('');
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [saleProducts, setSaleProducts] = useState<Product[]>([]);

    const fetchProducts = async () => {
        try {
            const response = await productService.getAll();
            const data = response.products;
            setProducts(data);
            setSaleProducts(data.filter((product: Product) => product.sale_off && product.sale_off.length > 0));
        } catch (error) {
            console.error('Lỗi khi tải sản phẩm:', error);
        }
    };

    useEffect(() => {
        if (searchText) {
            const filtered = products.filter((product: Product) => {
                return product.p_name.toLowerCase().includes(searchText.toLowerCase()) ||
                       product.category.c_name.toLowerCase().includes(searchText.toLowerCase());
            });
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts(saleProducts);
        }
    }, [searchText, products, saleProducts]);
    
    useFocusEffect(
        React.useCallback(() => {
            fetchProducts();
        }, [])
    );

    const calculateDiscountedPrice = (originalPrice: string, discount: number) => {
        const price = parseFloat(originalPrice);
        const discountAmount = price * (discount / 100);
        return (price - discountAmount).toFixed(0);
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-white`}>
            <View style={[tw`px-5 pt-8 pb-6`, {backgroundColor: 'rgb(0,255,255)'}]}>
                <View style={tw`flex-row items-center mb-4`}>
                    <View style={tw`flex-1 bg-white rounded-lg flex-row items-center px-4 py-2 mr-3`}>
                        <Icon name="search-outline" size={20} color="#666" />
                        <TextInput
                            style={tw`flex-1 ml-2 text-gray-700`}
                            placeholder="Tìm kiếm sản phẩm..."
                            placeholderTextColor="#666"
                            value={searchText}
                            onChangeText={setSearchText}
                        />
                    </View>
                    <TouchableOpacity 
                        style={[tw`p-3 rounded-full`, {backgroundColor: 'rgba(255,255,255,0.2)', borderWidth: 2, borderColor: '#fff'}]}
                        onPress={() => navigation.navigate('Profile')}
                    >
                        <Icon name="person-outline" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={tw`flex-row justify-around py-4 bg-white`}>
                <TouchableOpacity 
                    style={tw`items-center`}
                    onPress={() => navigation.navigate('History')}
                >
                    <View style={tw`bg-blue-100 p-3 rounded-full mb-1`}>
                        <Icon name="document-text-outline" size={24} color="#3B82F6" />
                    </View>
                    <Text style={tw`text-gray-600`}>Đơn hàng</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={tw`items-center`}
                    onPress={() => navigation.navigate('Category')}
                >
                    <View style={tw`bg-green-100 p-3 rounded-full mb-1`}>
                        <Icon name="cube-outline" size={24} color="#10B981" />
                    </View>
                    <Text style={tw`text-gray-600`}>Danh mục</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={tw`items-center`}
                    onPress={() => navigation.navigate('VoucherScreen')}
                >
                    <View style={tw`bg-yellow-100 p-3 rounded-full mb-1`}>
                        <Icon name="ticket-outline" size={24} color="#F59E0B" />
                    </View>
                    <Text style={tw`text-gray-600`}>Voucher</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={tw`items-center`}
                    onPress={() => navigation.navigate('Cart')}
                >
                    <View style={tw`bg-red-100 p-3 rounded-full mb-1`}>
                        <Icon name="cart-outline" size={24} color="#EF4444" />
                    </View>
                    <Text style={tw`text-gray-600`}>Giỏ hàng</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={tw`flex-1 p-4`}>
                <Text style={tw`text-xl font-bold mb-4`}>
                    {searchText ? 'Kết quả tìm kiếm' : 'Sản phẩm đang giảm giá'}
                </Text>
                {filteredProducts.length === 0 ? (
                    <Text style={tw`text-gray-500 text-center mt-4`}>Không tìm thấy sản phẩm nào</Text>
                ) : (
                    filteredProducts.map((product) => (
                        <TouchableOpacity 
                            key={product.id} 
                            style={tw`bg-gray-100 p-4 rounded-lg mb-4`}
                            onPress={() => navigation.navigate('DetailProduct', { id: product.id })}
                        >
                            {product.images && product.images.length > 0 && (
                                <Image 
                                    source={{uri: `${API_CONFIG.BASE_URL}${product.images[0].ip_image}`}}
                                    style={[tw`w-full h-48 rounded-lg mb-3`, {resizeMode: 'cover'}]}
                                />
                            )}
                            <Text style={tw`text-lg font-bold`}>{product.p_name}</Text>
                            <View style={tw`flex-row justify-between mt-2`}>
                                <View>
                                    <Text style={tw`text-gray-500 line-through`}>
                                        Giá gốc: {product.p_selling} VNĐ
                                    </Text>
                                    {product.sale_off && product.sale_off.length > 0 && (
                                        <>
                                            <Text style={tw`text-red-500 font-bold`}>
                                                Giá sale: {calculateDiscountedPrice(product.p_selling, product.sale_off[0].s_percent)} VNĐ
                                            </Text>
                                            <Text style={tw`text-red-500`}>
                                                Giảm: {product.sale_off[0].s_percent}%
                                            </Text>
                                        </>
                                    )}
                                </View>
                                <Text style={tw`text-gray-500`}>
                                    Số lượng: {product.p_quantity}
                                </Text>
                            </View>
                            <Text style={tw`text-green-600 mt-1`}>
                                Danh mục: {product.category.c_name}
                            </Text>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default HomeScreen;