import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import tw from 'tailwind-react-native-classnames';
import { useNavigation } from '@react-navigation/native';
import cataloryService from '../../services/catalory.service';


type Category = {
  id: number;
  c_name: string; 
  c_image: string;
  created_at: string;
  updated_at: string;
}


const CategoryScreen = () => {
    const navigation = useNavigation();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await cataloryService.getAll();
            if (response) {
                setCategories(Array.isArray(response) ? response : []);
            }
        } catch (error) {
            console.error('Lỗi khi tải danh mục:', error);
            Alert.alert('Lỗi', 'Không thể tải danh mục sản phẩm');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-gray-50`}>
            <View style={tw`bg-blue-600 px-4 py-3 flex-row justify-between items-center shadow-sm`}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={tw`text-xl font-bold text-white`}>Danh mục sản phẩm</Text>
                <View style={tw`w-6`} />
            </View>

            {loading ? (
                <View style={tw`flex-1 justify-center items-center`}>
                    <ActivityIndicator size="large" color="#2563EB" />
                    <Text style={tw`mt-4 text-gray-600`}>Đang tải danh mục...</Text>
                </View>
            ) : (
                <ScrollView style={tw`flex-1 px-4`}>
                    <View style={tw`flex-row flex-wrap justify-between mt-4`}>
                        {categories.map((category) => (
                            <TouchableOpacity 
                                key={category.id}
                                style={[tw`bg-white rounded-xl mb-4 shadow-sm overflow-hidden`, { width: '48%' }]}
                                onPress={() => navigation.navigate('Products', { categoryId: category.id } as never)}
                            >
                                <Image 
                                    source={{ uri: category.c_image }}
                                    style={tw`w-full h-32`}
                                    resizeMode="cover"
                                />
                                <View style={tw`p-3`}>
                                    <Text style={tw`font-semibold text-gray-800 text-center`}>
                                        {category.c_name}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            )}
        </SafeAreaView>
    );
};

export default CategoryScreen;