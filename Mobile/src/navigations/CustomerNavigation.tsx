import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/Customer/HomeScreen';
import ProfileScreen from '../screens/Customer/ProfileScreen';
import PromotionScreen from '../screens/Customer/PromotionScreen';
import HistoryScreen from '../screens/Customer/HistoryScreen';
import RedeemPointsScreen from '../screens/Customer/RedeemPointsScreen';

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
        </Stack.Navigator>
    );
};

export default CustomerNavigator;