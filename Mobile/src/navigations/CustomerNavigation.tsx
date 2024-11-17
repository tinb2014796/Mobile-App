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

type Customer = {
    name: string;
    diem: number;
};

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
            <Stack.Screen name="Products" component={ProductsScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
};

export default CustomerNavigator;