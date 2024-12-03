import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import tw from 'tailwind-react-native-classnames';
import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { addToCart } from '../../redux/reducers/cartReducers';
import productService from '../../services/product.service';
import { API_CONFIG } from '../../services/config';

type Category = {
  id: number;
  c_name: string;
  c_image: string;
  created_at: string;
  updated_at: string;
}

type Product = {
  id: number;
  b_id: number;
  c_id: number;
  p_name: string;
  p_description: string;
  p_purchase: string;
  p_selling: string;
  p_quantity: number;
  category: Category;
  images: {
    id: number;
    ip_image: string;
  }[];
  sale_off: any[];
  created_at: string | null;
  updated_at: string;
};

type RootStackParamList = {
  Products: { categoryId: number };
};

const ProductsScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute();
  const categoryId = (route.params as any)?.categoryId;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState('');
  const cart = useSelector((state: RootState) => state.cart);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const fetchProducts = async () => {
    try {
      const response = await productService.getAll();
      setFilteredProducts(response);
      setLoading(false);
    } catch (error) {
      console.error('Lỗi khi tải sản phẩm:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const filterProducts = async () => {
      try {
        if (categoryId) {
          const filtered = await productService.getByCategory(categoryId);
          setFilteredProducts(filtered);
          if (filtered.length > 0) {
            setCategoryName(filtered[0].category.c_name);
          }
        } else {
          await fetchProducts();
        }
      } catch (error) {
        console.error('Lỗi khi lọc sản phẩm:', error);
      } finally {
        setLoading(false);
      }
    };
    filterProducts();
  }, [categoryId]);

  const handleAddToCart = (product: Product) => {
    if (product.p_quantity === 0) {
      Alert.alert('Thông báo', 'Sản phẩm đã hết hàng');
      return;
    }
    console.log(product.sale_off);
    
    const cartItem = {
      id: product.id,
      product_name: product.p_name,
      image: product.images[0]?.ip_image,
      selling_price: parseFloat(product.p_selling),
      quantity: 1,
      discount: product.sale_off && product.sale_off.length > 0 ? parseFloat(product.sale_off[0].s_percent) : 0,
      maxQuantity: product.p_quantity
    };
    dispatch(addToCart(cartItem));
    Alert.alert('Thông báo', 'Sản phẩm đã được thêm vào giỏ hàng');
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      {/* Header */}
      <View style={[tw`px-4 py-3 flex-row justify-between items-center shadow-sm`, {backgroundColor: 'rgb(0,255,255)'}]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={[tw`text-xl font-bold`, {color: '#000'}]}>{categoryName || 'Tất cả sản phẩm'}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Cart' as never)}>
          <View>
            <Icon name="cart-outline" size={24} color="#000" />
            {cart.items.length > 0 && (
              <View style={tw`absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center`}>
                <Text style={tw`text-white text-xs font-bold`}>{cart.items.length}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      {/* Loading Indicator */}
      {loading ? (
        <View style={tw`flex-1 justify-center items-center`}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={tw`mt-4 text-gray-600`}>Đang tải sản phẩm...</Text>
        </View>
      ) : (
        /* Product Grid */
        <ScrollView style={tw`flex-1 px-2`}>
          <View style={tw`flex-row flex-wrap justify-between mt-4`}>
            {filteredProducts.length > 0 ? filteredProducts.map((product) => (
              <TouchableOpacity 
                key={product.id} 
                style={[tw`bg-white rounded-xl mb-4 shadow-sm overflow-hidden`, { width: '48%' }]}
                onPress={() => navigation.navigate('DetailProduct' as never, { id: product.id } as never)}
              >
                <Image 
                  source={{ uri: `${API_CONFIG.BASE_URL}${product.images[0]?.ip_image}` }} 
                  style={tw`w-full h-48`}
                  resizeMode="cover"
                />
                <View style={tw`p-3`}>
                  <Text style={tw`font-semibold text-gray-800 text-base mb-2 h-12`} numberOfLines={2}>
                    {product.p_name}
                  </Text>
                  <Text style={tw`text-blue-600 font-bold text-lg mb-4`}>
                    {parseFloat(product.p_selling).toLocaleString()}đ
                  </Text>
                  <TouchableOpacity
                    style={[
                      tw`py-2.5 rounded-lg items-center`,
                      product.p_quantity === 0 ? {backgroundColor: 'gray'} : {backgroundColor: 'rgb(0,255,255)'}
                    ]}
                    onPress={() => handleAddToCart(product)}
                    disabled={product.p_quantity === 0}
                  >
                    <Text style={[tw`font-semibold`, {color: '#000'}]}>
                      {product.p_quantity === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )) : (
              <View style={tw`flex-1 justify-center items-center`}>
                <Text style={tw`text-gray-600`}>Không tìm thấy sản phẩm</Text>
              </View>
            )}
          </View>
          
          {/* Nút trở về */}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default ProductsScreen;
