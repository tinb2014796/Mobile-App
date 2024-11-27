import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/Customer/HomeScreen';
import ProfileScreen from '../screens/Customer/ProfileScreen';
import PromotionScreen from '../screens/Customer/PromotionScreen';
import HistoryScreen from '../screens/Customer/HistoryScreen';
import RedeemPointsScreen from '../screens/Customer/RedeemPointsScreen';
import ChangePasswordScreen from '../screens/Customer/ChangePasswordScreen';
import VoucherScreen from '../screens/Customer/VoucherScreen';
import ProductsScreen from '../screens/Customer/ProductsScreen';
import CartScreen from '../screens/Customer/CartScreen';
import OrderScreen from '../screens/Customer/OrderScreen';
import CategoryScreen from '../screens/Customer/CategoryScreen';
import DetailProductScreen from '../screens/Customer/DetailProductScreen';
import PayScreen from '../screens/Customer/PayScreen';

type Customer = {
    name: string;
    diem: number;
};

type Product = any;

type RootStackParamList = {
    Home: undefined;
    Profile: undefined;
    Promotions: undefined;
    History: undefined;
    RedeemPoints: { customer: Customer | null };
    Cart: undefined;
    Products: undefined;
    ChangePassword: undefined;
    VoucherScreen: undefined;
    Orders: undefined;
    Category: undefined;
    DetailProduct: { id: number };
    Pay: { products: Product[] };
};

const Stack = createStackNavigator<RootStackParamList>();

const CustomerNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Promotions" component={PromotionScreen} options={{ headerShown: false }} />
            <Stack.Screen name="History" component={HistoryScreen} options={{ headerShown: false }} />
            <Stack.Screen name="RedeemPoints" component={RedeemPointsScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ headerShown: false }} />
            <Stack.Screen name="VoucherScreen" component={VoucherScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Cart" component={CartScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Products" component={ProductsScreen} options={{ headerShown: false }} initialParams={{ categoryId: 0 }} />
            <Stack.Screen name="Orders" component={OrderScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Category" component={CategoryScreen} options={{ headerShown: false }} />
            <Stack.Screen name="DetailProduct" component={DetailProductScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Pay" component={PayScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
};

export default CustomerNavigator;